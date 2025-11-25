class Enemy extends Character {
    constructor(name, avatar, attributesInput, lvl, tier, description = '') {
        super(name, avatar, attributesInput, lvl, tier);
        
        this.xpGiven = lvl * 100 * tier;

        this.description = description;

        this.class = 'default';
        
    }
}