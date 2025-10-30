// personagem generico
class Character {
    constructor(name, attributes, lvl , tier = 1) {
        this.name = name;
        this.lvl = lvl;
        this.attributes = attributes;

        this.modifiers = null; 
        this.stats = null;
        this.tier = tier;
        
        this.recalculateAll(); 
    }
    recalculateAll() {
        this.modifiers = {
            "damage": 2 + this.lvl,
            "atkSpeed" : 1 + this.lvl,
            "hp": 5 + this.lvl,
            "armor": 1 + this.lvl,
            "mana": 2 + this.lvl,
            "skill": 1 + this.lvl,
        };

        this.stats = {
            "damage" : this.modifiers['damage'] * this.attributes.atk * this.tier,
            "atkSpeed" : this.modifiers['atkSpeed'] * this.attributes.atk * this.tier,
            "hp" : this.modifiers['hp'] * this.attributes.con * this.tier,
            "armor" : this.modifiers['armor'] * this.attributes.con * this.tier,
            "mana" : this.modifiers['mana'] * this.attributes.int * this.tier,
            "skill" : this.modifiers['skill'] * this.attributes.int * this.tier,
        };
        
    }

    ShowAttributes() {
        console.log(`--- Atributos de ${this.name} ---`);
        Object.keys(this.attributes).forEach(key => {
            console.log(`${key}: ${this.attributes[key]}`); 
        });
    }

    ShowStats() {
        console.log(`--- Stats de ${this.name} ---`);
        Object.keys(this.stats).forEach(key => {
            console.log(`${key}: ${this.stats[key]}`); 
        });
    }

    getName() {
        return this.name;
    }

    getAttributes() {
        return this.attributes; 
    }

    getStats() {
        return this.stats; 
    }

}