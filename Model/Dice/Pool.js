class DenisException extends Error {
    constructor(message) {
        super(message);
        this.name = 'DenisException';
    }
}

class Pool {
    constructor({dice, internalPenalties, externalPenalties, successes, difficulty, target}) {
        const parseIntOrDefault = (val, def = 0) => {
            if (val === undefined || val === null) return def;
            const n = Number(val);
            if (Number.isInteger(n) && Number.isFinite(n) && n >= 0 && n <= 100) return n;
            return def;
        };

        this.dice = parseIntOrDefault(dice, 0);
        if(this.dice >= 100)
        {
            throw new DenisException("You can't roll more than 100 dice at once");
        }
        this.internalPenalties = parseIntOrDefault(internalPenalties, 0);
        this.externalPenalties = parseIntOrDefault(externalPenalties, 0);
        this.successes = parseIntOrDefault(successes, 0);
        this.difficulty = parseIntOrDefault(difficulty, 0);
        this.results = null;
        this.diceRolled = [];

        if (target !== undefined && target !== null) {
            const t = Number(target);
            if (Number.isInteger(t) && t > 3) {
                this.target = t;
            } else {
                this.target = 7;
            }
        } else {
            this.target = 8;
        }
    }

    roll() {
        if (this.results) {
            return this.results;
        }
        let result = 0;
        for (let i = 0; i < this.dice; i++) {
            const roll = Math.floor(Math.random() * 10) + 1;
            this.diceRolled.push(roll);
            if (roll >= this.target) {
                result++;
            }
            if (roll === 10) {
                result++;
            }
        }
        this.results = result;
        return this.results;
    }
}

export default Pool;