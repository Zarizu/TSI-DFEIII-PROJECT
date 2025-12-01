class Enemy extends Character {
    constructor(name, attributesInput, avatarObj, lvl, tier, description = '', enemyClass = 'default', classIcon = '👾') {
        super(name, attributesInput, avatarObj, lvl, tier);
        
        this.description = description;
        this.class = enemyClass;
        this.classIcon = classIcon;

        this.xpGiven = lvl * 100 * tier;
        
    }
}