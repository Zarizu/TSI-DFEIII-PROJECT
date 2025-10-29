export class Character {
    constructor(name, stats) {
        name = this.name;
        stats = this.stats;
    }

    getAttributes() {
        Object.keys(this.stats).forEach(key => {
            console.log(`${key}: ${this.stats[key]}`);
        });
    }
}




