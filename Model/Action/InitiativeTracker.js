import Pool from "#Model/Dice/Pool.js";

class InitiativeTracker {
    /**
     * @type {Character[]}
     */
    characters;
    npcs;
    tick;
    joinBattleRolls;
    highestJoinBattleRoll;
    ticks;

    constructor() {
        this.characters = [];
        this.npcs = [];
        this.tick = 0;
        this.joinBattleRolls = {};
        this.highestJoinBattleRoll = 0;
        this.ticks = [[], [], [], [], [], [], []];
    }

    nextTick() {
        this.tick++;
        if (this.tick === 7) {
            this.tick = 1;
        }
    }

    addCharacter(character) {
        this.characters.push(character);
    }

    addNPC({name, initiative}) {
        this.npcs.push({name, initiative});
    }

    setCharacterInitiative(character, joinBattleRoll) {
        if (this.highestJoinBattleRoll < joinBattleRoll) {
            this.highestJoinBattleRoll = joinBattleRoll;
            this.joinBattleRolls[joinBattleRoll] = [character.name];
            return;
        }
        if (!this.joinBattleRolls[joinBattleRoll]) {
            this.joinBattleRolls[joinBattleRoll] = [character.name];
            return;
        }
        this.joinBattleRolls[joinBattleRoll].push(character.name);
    }

    start() {
        for (let [character, joinBattleRoll] of Object.entries(this.joinBattleRolls)) {
            let tick = this.highestJoinBattleRoll - joinBattleRoll;
            tick = Math.min(tick, 6);
            this.ticks[tick].push(character);
        }
    }

    processTick()
    {

    }
}