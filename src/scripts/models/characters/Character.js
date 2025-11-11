const ID_COUNTER_KEY_CHARACTER = 'gameCharacterIdCounter';

function getNextCharacterId() {
    let nextId = localStorage.getItem(ID_COUNTER_KEY_CHARACTER);

    if (nextId === null) {
        nextId = 1;
    } else {
        nextId = parseInt(nextId, 10);
    }
    
    localStorage.setItem(ID_COUNTER_KEY_CHARACTER, (nextId + 1).toString());

    return nextId;
}
// personagem generico
class Character {
    constructor(name, [str, con, agi, int, wis], lvl = 1, tier = 1) {
        //id universal
        this.id = getNextCharacterId();

        this.name = name;
        this.lvl = lvl;
        this.tier = tier;

        this.attributes = {
            str: str,
            con: con,
            agi: agi,
            int: int,
            wis: wis
        };
        
        this.modifiers = null; 
        this.stats = null;
        this.effects = [];
        this.skills = [];
        
        this.recalculateAll(); 

        this.currentHP = JSON.parse(JSON.stringify(this.stats.hp));
        this.currentMana = JSON.parse(JSON.stringify(this.stats.mana));
        
        //habilidades passivas, geralmente com relacao a classe
        this.passive_skills = [];
    }

    _calculateStat(modifierName, attributeName , atrWeight = 1) {
        const modifier = this.modifiers[modifierName];
        const attribute = this.attributes[attributeName] * atrWeight;
        
        return modifier + (attribute * this.tier);
    }
    
    recalculateAll() {

        this.modifiers = {
            // Força
            "damage": 2 * this.lvl,
            "critical_multiplier": 0.25 * this.lvl,
            // Agilidade
            "initiative" : 1 * this.lvl,
            "evasion": 0.75 * this.lvl,
            "critical_chance": 1.25 * this.lvl,
            // Constituição
            "hp": 5 * this.lvl,
            "armor": 1 * this.lvl,
            // Inteligência
            "mana": 3 * this.lvl,
            "skill": 1 * this.lvl,
            // Sabedoria
            "magic_resist": 1 * this.lvl,
            "mana_regen": 1 * (this.lvl),
            "hp_regen": 3 * (this.lvl)
        };

        this.stats = {
            // FOR
            "damage": this._calculateStat("damage", "str",2),
            "critical_multiplier": (this.attributes.str  *0.5) + this.modifiers.critical_multiplier + (this.tier * 0.75),
            
            // AGI
            "initiative": this._calculateStat("initiative", "agi"),
            "evasion": this._calculateStat("evasion", "agi",2),
            "critical_chance": this._calculateStat("critical_chance", "agi",2),

            // CON
            "hp": this._calculateStat("hp", "con", 5),
            "armor": this._calculateStat("armor", "con"),

            // INT
            "mana": this._calculateStat("mana", "int",2),
            "skill": this._calculateStat("skill", "int",2),

            // SAB
            "magic_resist": this._calculateStat("magic_resist", "wis"),
            "mana_regen": this._calculateStat("mana_regen", "wis"),
            "hp_regen": this._calculateStat("hp_regen", "wis",2),
        };
    }
    getAttributes(){
        return [this.str, this.con, this.agi, this.int, this.wis]
    }
    
    showAttributes() {
        console.log(`--- Atributos de ${this.name} ---`);
        Object.keys(this.attributes).forEach(key => {
            console.log(`${key}: ${this.attributes[key]}`); 
        });
    }

    showStats() {
        console.log(`--- Stats de ${this.name} ---`);
        Object.keys(this.stats).forEach(key => {
            console.log(`${key}: ${this.stats[key]}`); 
        });
    }

    meleeAttack(target) {
        if(!target || target.currentHP <1 ) return {damage: 0, didEvade: false, isCritical: false };

        // esquiva
        // compara um número aleatório (0-100) com a chance de esquiva do alvo
        if (Math.floor(Math.random() * 101) < target.stats.evasion) {

            return{ damage: 0, didEvade: true, isCritical: false };
        }

        let damage = this.stats.damage;
        let isCritical = false;

        // critico
        if (Math.floor(Math.random() * 101) < this.stats.critical_chance) {
            isCritical = true;
            
            damage = Math.round(this.stats.damage * this.stats.critical_multiplier); 
        }

        // reducao de dano pela armadura
        let finalDamage = damage - target.stats.armor;
        if (finalDamage < 1) finalDamage = 1;

        if(target.currentHP >=finalDamage)target.currentHP -= finalDamage
        else{
            target.currentHP = 0;
        }

        return{ damage: finalDamage, didEvade: false, isCritical: isCritical };
    }
    rest(){
        //rec. de hp
        if(this.stats.hp_regen < (this.stats.hp - this.currentHP)) this.currentHP += this.stats.hp_regen; else this.currentHP = this.stats.hp;
        //rec de mana
        if(this.stats.mana_regen < (this.stats.mana - this.currentMana)) this.currentMana += this.stats.mana_regen; else this.currentMana = this.stats.mana;
        
    }
}
