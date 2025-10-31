const ID_COUNTER_KEY = 'gameCharacterIdCounter';

function getNextCharacterId() {
    let nextId = localStorage.getItem(ID_COUNTER_KEY);

    if (nextId === null) {
        nextId = 1;
    } else {
        nextId = parseInt(nextId, 10);
    }
    
    localStorage.setItem(ID_COUNTER_KEY, (nextId + 1).toString());

    return nextId;
}
// personagem generico
class Character {
    constructor(name, attributes, lvl = 1 , tier = 1) {
        //id universal
        this.id =  getNextCharacterId();

        this.name = name;
        this.lvl = lvl;
        this.attributes = attributes;

        this.modifiers = null; 
        this.stats = null;
        this.effects = [];
        this.tier = tier;
        
        this.recalculateAll(); 

        //esses sao os stats atuais, como hp atual, atk atual etc
        this.currentStats = this.stats;
    }

    recalculateAll() {
        this.modifiers = {
            "damage": 2 + this.lvl,
            "initiative" : 1 + this.lvl,
            "hp": 5 + this.lvl,
            "armor": 1 + this.lvl,
            "mana": 2 + this.lvl,
            "skill": 1 + this.lvl,
        };

        //esses stats n devem ser modificados diretamente, apenas utilizados para gerar outros stats,
        this.stats = {
            "damage" : this.modifiers['damage'] * this.attributes.atk * this.tier,
            "initiative" : this.modifiers['initiative'] * this.attributes.atk * this.tier,
            "hp" : this.modifiers['hp'] * this.attributes.con * this.tier,
            "armor" : this.modifiers['armor'] * this.attributes.con * this.tier,
            "mana" : this.modifiers['mana'] * this.attributes.int * this.tier,
            "skill" : this.modifiers['skill'] * this.attributes.int * this.tier,
        };

        this.currentStats = this.stats;
        
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

    meleeAttack(target){
        let damage =  this.stats.damage - target.stats.armor;
        if(damage < 1)damage = 1;
        target.currentStats.hp -= damage;
        console.log(`${this.name} ataca ${target.name} `);
        
        return damage;
    }

}