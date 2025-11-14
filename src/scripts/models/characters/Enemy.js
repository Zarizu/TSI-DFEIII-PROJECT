class Enemy extends Character{
    constructor(name, attributesInput, lvl, tier, description = '') {
        super(name, attributesInput, lvl, tier);
        
        this.xpGiven = lvl * 100 * tier;

        this.description = description;

        this.class = 'default';
        
    }
}