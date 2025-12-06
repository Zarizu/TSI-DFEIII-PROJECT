// essa classe é especifica de personagens jogaveis, não é um personagem genérico.
class PCharacter extends Character {
    constructor(name, attributesInput, avatarObj, lvl, tier,vocation) {
        super(name, attributesInput, avatarObj, lvl, tier); 

        //kit inicial
        this.vocation = vocation;

        this.experience = 0;

        this.weapon = {};
        this.equipment = {};

        this.experienceGap = this.lvl * 100;

        //chance do inimigo escolher atacar ele
        this.enemyPriority = 1;
        if(this.vocation === 'tanque') this.enemyPriority = 10;

        this.unspentAttributePoints = 0;

        this.levelCap = 10;
        
        this.experienceGap = this.lvl * 100;
        
        this.canRebirth = false;

        //flag dos upgrades
        this.lastSpecialUpgradeLevel = 0;
    }

    gainExperience(amount) {
        if (this.lvl >= this.levelCap) return; // Nível máximo

        this.experience += amount;

        // Verifica se upou
        while (this.experience >= this.experienceGap) {
            // Deduz o XP usado para upar
            this.experience -= this.experienceGap; 
            
            this.levelUp();
            
            // Se o levelUp atingiu o levelCap, para de ganhar XP
            if (this.lvl >= this.levelCap) {
                this.experience = 0;
                break;
            }
        }
    }

    levelUp() {
        if (this.lvl >= this.levelCap) {return false};

        const oldMaxHP = this.stats.hp;
        const oldMaxMana = this.stats.mana;
        
        this.lvl += 1;
        this.experienceGap = this.lvl * 100;
        
        this.recalculateAll();
        
        const hpGained = this.stats.hp - oldMaxHP;
        const manaGained = this.stats.mana - oldMaxMana;
        
        this.currentHP += hpGained;
        this.currentMana += manaGained;
        
        if (this.currentHP > this.stats.hp) this.currentHP = this.stats.hp;
        if (this.currentMana > this.stats.mana) this.currentMana = this.stats.mana;

        if (this.lvl % 2 === 0) { // A cada 2 níveis (2, 4, 6, 8, 10...)
            this.unspentAttributePoints++;
        }

        //Checa se atingiu o nível máximo
        if (this.lvl === this.levelCap) {
            this.canRebirth = true;
        }

        return this.lvl;
    }

    rebirth() {
        if (!this.canRebirth) {
            return false;
        }

        this.tier++;
        this.lvl = 1;

        console.log(`[PCHARACTER]REBIRTH! ${this.name} agora é Tier ${this.tier}!`, "color: #ffd700; font-size: 1.4em;");

        this.levelCap += 10;
        
        this.canRebirth = false;
        this.experience = 0;
        this.experienceGap = this.lvl * 100;
        
        this.lastSpecialUpgradeLevel = 0;

        this.recalculateAll();
        
        //Cura total (recompensa pelo Rebirth)
        this.currentHP = this.stats.hp;
        this.currentMana = this.stats.mana;
        
        return true;
    }

    spendAttributePoint(statName) {
        if (this.unspentAttributePoints <= 0) {
            return false;
        }
        
        if (this.attributes[statName] === undefined) {
            return false;
        }

        this.unspentAttributePoints--;
        
        this.attributes[statName]++;
        
        const oldHP = this.currentHP;
        const oldMana = this.currentMana;

        this.recalculateAll();

        this.currentHP = oldHP;
        this.currentMana = oldMana;
        
        return true;
    }

    hasPendingSpecialUpgrade() {
        // O próximo marco é sempre o último pego + 5.
        // Ex: Se pegou o 0 (início), o próximo é 5. Se pegou o 5, o próximo é 10.
        const nextMilestone = this.lastSpecialUpgradeLevel + 5;
        // Se o nível é múltiplo de 5 E ainda não pegamos o upgrade desse nível
        return this.lvl >= nextMilestone;
    }
}