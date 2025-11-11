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

        // Salva os stats máximos antigos para calcular o ganho
        const oldMaxHP = this.stats.hp;
        const oldMaxMana = this.stats.mana;
        
        // Sobe o nível e reseta a experiência (Sua lógica)
        this.lvl += 1;
        this.experience = 0; // (Ou this.experience -= this.experienceGap para manter o excesso)
        this.experienceGap = this.lvl * 100;
        
        // Recalcula os stats base (this.stats)
        this.recalculateAll();
        
        //Adiciona o HP/Mana ganho ao HP/Mana atual
        const hpGained = this.stats.hp - oldMaxHP;
        const manaGained = this.stats.mana - oldMaxMana;
        
        this.currentStats.hp += hpGained;
        this.currentStats.mana += manaGained;
        
        // Garante que o HP/Mana atual não ultrapasse o novo máximo
        if (this.currentStats.hp > this.stats.hp) {
            this.currentStats.hp = this.stats.hp;
        }
        if (this.currentStats.mana > this.stats.mana) {
            this.currentStats.mana = this.stats.mana;
        }

        console.log(`%c${this.name} subiu para o NÍVEL ${this.lvl}!`, "color: yellow; font-weight: bold;");
        return this.lvl;
    }

}