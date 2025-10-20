class Character {
    constructor(name, skin, stats) {
        name = this.name;
        skin = this.skin;
        stats = this.stats;
    }

    showStats() {
        Object.keys(this.stats).forEach(key => {
            console.log(`${key}: ${this.stats[key]}`);
        });
    }
}

const startButton = document.getElementById('main-start');
const statsList = document.querySelectorAll('.char-stats');
const charName = document.querySelectorAll('.char-name');
const charSkin = document.querySelectorAll('.char-skin').src;

const statsObject = {};

statsList.forEach(stat => {
    const title = stat.querySelector('.title').textContent.trim();
    const value = stat.querySelector('.value').textContent.trim();
    
    statsObject[title] = value;
});

startButton.addEventListener('click', () => {
    const char1 = new Character("Penis", 12345, statsObject);
    char1.showStats();
})

