// essa classe é especifica de personagens jogaveis, não é um personagem genérico.
class PCharacter extends Character {
    constructor(name, attributes, lvl = 1,tier) {
        super(name, attributes, lvl, tier); 

        this.experience = 0;
        this.inventory = [];
    }

    levelUp() {
        this.lvl += 1;
        this.recalculateAll();
        console.log(`${this.name} subiu para o nível ${this.lvl}!`);
        return this.lvl;
    }

}