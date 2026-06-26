class Character
{
    constructor({initiative, permanentEssence, permanentWillpower, extraEssence, penalties, virtues})
    {
        this.initiative = initiative;
        this.permanentEssence = permanentEssence;
        this.permanentWillpower = permanentWillpower;
        this.extraEssence = extraEssence;
        this.penalties = penalties;
        this.virtues = virtues;
    }

    calculateEssencePools()
    {
        this.essencePools = {
            personal: this.permanentEssence * 3 + this.permanentWillpower + this.extraEssence.permanent,
            peripheral:this.permanentEssence * 7 + this.permanentWillpower + this.extraEssence.peripheral
        };
    }

    getInitiativePool({successes})
    {
        //{dice, internalPenalties, externalPenalties, successes, difficulty, target}
        return {
            dice:this.initiative,
            internalPenalties:function(){return this.penalties.internal},
            externalPenalties:function(){return this.penalties.external},
            successes:successes
        };
    }
}