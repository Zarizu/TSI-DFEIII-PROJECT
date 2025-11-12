// essa classe é especifica de personagens jogaveis, não é um personagem genérico.
class PCharacter extends Character {
    constructor(name, attributes, lvl,tier,vocation) {
        super(name, attributes, lvl, tier); 

        //kit inicial
        this.vocation = vocation;

        this.experience = 0;

        this.weapon = {};
        this.equipment = {};

        this.experienceGap = this.lvl * 100;

        //chance do inimigo escolher atacar ele
        this.enemyPriority = 1;
        if(this.vocation === 'tanque') this.enemyPriority =10;
    }

    gainExperience(amount) {
        if (this.lvl >= 10) return; // Nível máximo

        this.experience += amount;
        console.log(`${this.name} ganhou ${amount} de EXP! (${this.experience}/${this.experienceGap})`);

        // Verifica se upou
        if (this.experience >= this.experienceGap) {
            this.levelUp();
        }
    }
    levelUp() {
        if (this.lvl >= 10) {
            return false;
        }

        const oldMaxHP = this.stats.hp;
        const oldMaxMana = this.stats.mana;
        
        this.lvl += 1;
        this.experience -= this.experienceGap;
        this.experienceGap = this.lvl * 100;
        
        this.recalculateAll();
        
        const hpGained = this.stats.hp - oldMaxHP;
        const manaGained = this.stats.mana - oldMaxMana;
        
        this.currentHP += hpGained;
        this.currentMana += manaGained;
        
        // Garante que o HP/Mana atual não ultrapasse o novo máximo
        if (this.currentHP > this.stats.hp) {
            this.currentHP = this.stats.hp;
        }
        if (this.currentMana > this.stats.mana) {
            this.currentMana = this.stats.mana;
        }

        console.log(`%c${this.name} subiu para o NÍVEL ${this.lvl}!`, "color: yellow; font-weight: bold;");
        refreshAllUI();
        return this.lvl;
    }

}