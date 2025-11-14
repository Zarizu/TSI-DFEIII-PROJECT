// essa classe é especifica de personagens jogaveis, não é um personagem genérico.
class PCharacter extends Character {
    constructor(name, attributesInput, lvl,tier,vocation) {
        super(name, attributesInput, lvl, tier); 

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
    }

    gainExperience(amount) {
        if (this.lvl >= this.levelCap) return; // Nível máximo

        this.experience += amount;
        console.log(`[PCHARACTER]${this.name} ganhou ${amount} de EXP! (${this.experience}/${this.experienceGap})`);

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

        console.log(`%c${this.name} subiu para o NÍVEL ${this.lvl}!`, "color: #ffd700; font-weight: bold;");

        if (this.lvl % 2 === 0) { // A cada 2 níveis (2, 4, 6, 8, 10...)
            this.unspentAttributePoints++;
            console.log(`[PCHARACTER]${this.name} ganhou +1 Ponto de Atributo! (Total: ${this.unspentAttributePoints})`, "color: #4CAF50;");
        }

        //Checa se atingiu o nível máximo
        if (this.lvl === this.levelCap) {
            this.canRebirth = true;
            console.log(`[PCHARACTER]${this.name} atingiu o Nível Máximo! Pronto para o REBIRTH!`, "color: #007bff; font-size: 1.2em;");
        }

        return this.lvl;
    }

    rebirth() {
        if (!this.canRebirth) {
            console.warn(`${this.name} tentou dar Rebirth, mas não está no nível máximo!`);
            return false;
        }

        this.tier++;
        this.lvl = 1;

        console.log(`[PCHARACTER]REBIRTH! ${this.name} agora é Tier ${this.tier}!`, "color: #ffd700; font-size: 1.4em;");

        this.levelCap += 10;
        
        this.canRebirth = false;
        this.experience = 0;
        this.experienceGap = this.lvl * 100;
        
        this.recalculateAll();
        
        //Cura total (recompensa pelo Rebirth)
        this.currentHP = this.stats.hp;
        this.currentMana = this.stats.mana;
        
        return true;
    }

    spendAttributePoint(statName) {
        if (this.unspentAttributePoints <= 0) {
            console.warn(`[PCHARACTER]${this.name} não tem pontos para gastar!`);
            return false;
        }
        
        if (this.attributes[statName] === undefined) {
            console.error(`[PCHARACTER]Atributo '${statName}' não existe!`);
            return false;
        }

        this.unspentAttributePoints--;
        
        this.attributes[statName]++;
        
        const oldHP = this.currentHP;
        const oldMana = this.currentMana;

        this.recalculateAll();

        this.currentHP = oldHP;
        this.currentMana = oldMana;
        
        console.log(`[PCHARACTER]${this.name} aumentou ${statName.toUpperCase()}! (Pontos restantes: ${this.unspentAttributePoints})`, "color: #4CAF50;");
        return true;
    }

}