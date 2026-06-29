import Pool from "../Dice/Pool.js";

class Character {
    initiative;
    permanentEssence;
    permanentWillpower;
    penalties;
    virtues;
    extraEssence;

    constructor() {
        this.permanentEssence = 1;
        this.permanentWillpower = 1;
        this.penalties = {
            internal: 0,
            external: 0
        };
        this.virtues = {
            conviction: 1,
            courage: 1,
            temperance: 1,
            valor: 1,
        }
        this.extraEssence = {
            personal: 0,
            peripheral: 0
        };
        this.initiative = 1;
        this.calculateEssencePools();

    }

    toJSON(){
        return {
            permanentEssence:this.permanentEssence,
            permanentWillpower:this.permanentWillpower,
            penalties:this.penalties,
            virtues:this.virtues,
            extraEssence:this.extraEssence,
            initiative:this.initiative,
            essencePools:this.essencePools,
        }
    }

    static fromJSON(json){
        let c = new Character();
        c.permanentEssence = json.permanentEssence;
        c.permanentWillpower = json.permanentWillpower;
        c.penalties = json.penalties;
        c.virtues = json.virtues;
        c.extraEssence = json.extraEssence;
        c.initiative = json.initiative;
        c.calculateEssencePools();
        c.essencePools.personal.committed = json.essencePools.personal.committed;
        c.essencePools.peripheral.committed = json.essencePools.peripheral.committed;
        c.essencePools.personal.spent = json.essencePools.personal.spent;
        c.essencePools.peripheral.spent = json.essencePools.peripheral.spent;
        return c;
    }

    calculateEssencePools() {
        let totalPersonal = this.permanentEssence * 3 + this.permanentWillpower + this.extraEssence.personal;
        let totalPeripheral = this.permanentEssence * 7 + this.permanentWillpower + this.extraEssence.peripheral + this.virtues.conviction + this.virtues.courage + this.virtues.valor + this.virtues.temperance;
        this.essencePools = {
            personal: {total: totalPersonal, spent: 0, committed:0},
            peripheral: {total: totalPeripheral, spent: 0, committed: 0}
        };

    }

    get remainingEssence()
    {
        const remaining = {
            personal:this.essencePools.personal.total - this.essencePools.personal.spent - this.essencePools.personal.committed,
            peripheral:this.essencePools.peripheral.total - this.essencePools.peripheral.spent - this.essencePools.peripheral.committed,
        }
        remaining.total = remaining.personal + remaining.peripheral;

        return remaining;
    }

    setInitiative(initiative)
    {
        this.initiative = initiative;
    }

    setExtraEssence({pool, amount})
    {
        pool = pool?.toLowerCase();
        if(!(pool in this.extraEssence))
        {
            pool = "peripheral";
        }
        this.extraEssence[pool] = amount;
        this.calculateEssencePools();
    }

    setPermanentEssence(essence)
    {
        this.permanentEssence = essence;
        this.calculateEssencePools();
    }

    setPermanentWillpower(willpower)
    {
        this.permanentWillpower = willpower;
        this.calculateEssencePools();
    }

    setVirtue(virtue,value)
    {
        const n = Number(value);
        if(!Number.isInteger(n))
        {
            throw new Error("Virtue value must be a whole number");
        }
        if(value < 1)
        {
            throw new Error("Virtue must be greater than 0");
        }
        if(value > 5)
        {
            throw new Error("Virtue must be 5 or less");
        }

        virtue = virtue.toLowerCase();
        if(virtue in this.virtues)
        {
            this.virtues[virtue] = value;
            this.calculateEssencePools();
        }
        else
        {
            throw new Error("Invalid virtue");
        }
    }

    get virtuesSet()
    {
        return this.virtues.conviction > 0 && this.virtues.courage > 0 && this.virtues.valor > 0 && this.virtues.temperance > 0;
    }

    getInitiativePool({successes})
    {
        //{dice, internalPenalties, externalPenalties, successes, difficulty, target}
        return {
            dice:this.initiative,
            internalPenalties:this.penalties.internal,
            externalPenalties:this.penalties.external,
            successes
        };
    }

    rollInitiative({successes})
    {
        this.readyCheck();
        const pool = new Pool(this.getInitiativePool({successes}));
        return pool.roll();
    }

    readyCheck()
    {
        let isReady = this.permanentEssence > 0 && this.permanentWillpower > 0 && this.initiative > 0 && this.virtuesSet;
        if(!isReady)
        {
            throw new Error("Character not ready");
        }
    }

    validateEssencePool({pool, motes})
    {
        pool = pool?.toLowerCase();
        if(!(pool in this.essencePools))
        {
            throw new Error("Invalid pool");
        }
        const remaining = this.remainingEssence;
        const n = Number(motes);
        if(!Number.isInteger(n) || n < 0)
        {
            throw new Error("Invalid amount of motes");
        }
        if(n > remaining.total)
        {
            throw new Error("Not enough essence");
        }
    }

    spendEssence({pool, motes})
    {
        console.log(`Spending ${motes} from ${pool} pool`);
        pool = pool?pool:"personal";
        this.readyCheck();
        this.validateEssencePool({pool, motes});

        let secondaryPool = pool === "personal" ? "peripheral" : "personal";
        console.log(`Spending ${motes} from ${pool} pool`);

        let remaining = motes;
        while(remaining > 0)
        {
            console.log(this.essencePools[pool]);
            const n = Math.min(remaining, this.remainingEssence[pool]);
            console.log(`Spent ${n} from ${pool} pool`);
            this.essencePools[pool].spent += n;
            console.log(this.essencePools[pool]);
            remaining -= n;
            pool = secondaryPool;
        }
    }
}

export default Character;