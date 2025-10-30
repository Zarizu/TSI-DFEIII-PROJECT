class Character {
    constructor(name,[atk, con, int], lvl = 1) {
        this.name = name;
        
        this.lvl = lvl;

        this.attributes = {
            "atk": atk,
            "con": con,
            "int": int
        };
        
        this.modifiers = {
            "damage": 1 + this.lvl,
            "atkSpeed" : 1 + this.lvl,
            "hp": 5 + this.lvl,
            "armor": 1 + this.lvl,
            "mana": 2 + this.lvl,
            "skill": 1 + this.lvl,
        }

        this.stats = {
            "damage" : this.modifiers['damage'] * atk,
            "atkSpeed" : this.modifiers['atkSpeed'] * atk,
            "hp" : this.modifiers['hp'] * con,
            "armor" : this.modifiers['armor'] * con,
            "mana" : this.modifiers['mana'] * int,
            //Skill é o dano ou modificador que vai ser utilizado com as habilidades 
            "skill" : this.modifiers['skill'] * int,
        }
        
    }

    ShowAttributes(){
        Object.keys(this.attributes).forEach(key => {
            console.log(`${key}:this.attributes[key]`);
        });
    }

    ShowStats(){
        Object.keys(this.stats).forEach(key => {
            console.log(`${key}:${this.stats[key]}`);
        });
    }
    showModifiers(){
        Object.keys(this.modifiers).forEach(key => {
            console.log(`${key}:${this.modifiers[key]}`);
        });
    }

    getName(){
        return this.name;
    }

    getAtributes(){
        let attributesValues = [];
        Object.keys(this.attributes).forEach(key => {
            attributesValues.push(this.attributes[key]);
        });
        return attributesValues;
    }

    getStats(){
        let statsValues = [];
        Object.keys(this.stats).forEach(key => {
            statsValues.push(this.stats[key]);
        });
        return statsValues;
    }

    setModifiers(damage = this.modifiers['damage'], atkSpeed = this.modifiers['atkSpeed'], hp = this.modifiers['hp'], armor = this.modifiers['armor'],mana = this.modifiers['mana'],skill = this.modifiers['skill']){

        this.modifiers = {
            "damage": damage,
            "atkSpeed" : atkSpeed,
            "hp": hp,
            "armor": armor,
            "mana": mana,
            "skill": skill
        }
    }

    levelUp(){
        
        this.lvl += 1;
        return this.lvl;
    }

}
