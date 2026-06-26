import Pool from '../../Dice/Pool.js';

class Initiative extends Pool
{
    constructor(data)
    {
        super(data)
    }

    roll()
    {
        return this.reroll();
    }
}