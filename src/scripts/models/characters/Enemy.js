class Enemy extends Character{
    constructor(name, attributes, lvl, tier, description = '') {
        super(name, attributes, lvl, tier);
        
        this.xpGiven = lvl * 100 * tier;

        this.description = description;

        this.class = 'default';
        
    }
}