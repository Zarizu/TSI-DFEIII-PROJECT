class Enemy extends Character{
    constructor(name, attributes, lvl,tier) {
        super(name, attributes, lvl, tier);
        
        this.xpGiven = lvl * 100 * tier;
    }
}