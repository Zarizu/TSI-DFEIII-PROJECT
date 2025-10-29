import {Character} from './models.js';

document.addEventListener('DOMContentLoaded', () => {
    
    const animationContainer = document.querySelector('.background-animation');
    const numberOfIcons = 12; 

    for (let i = 0; i < numberOfIcons; i++) {
        const iconSpan = document.createElement('span');
        animationContainer.appendChild(iconSpan);
    }

    const MAX_POINTS = 3;
    const MAX_PER_STAT = 3;
    const MIN_PER_STAT = 1;

    // atributos
    let totalPoints = MAX_POINTS;
    const stats = {
        ataque: 1,
        constituicao: 1,
        inteligencia: 1
    };

    const pointsValueEl = document.getElementById('points-value');
    const startButton = document.getElementById('main-start');
    const charNameInput = document.getElementById('char-name-input');

    const plusButtons = document.querySelectorAll('.stat-btn.plus');
    const minusButtons = document.querySelectorAll('.stat-btn.minus');
    
    const valueElements = {
        ataque: document.getElementById('ataque-value'),
        constituicao: document.getElementById('constituicao-value'),
        inteligencia: document.getElementById('inteligencia-value')
    };

    function updateUI() {
        pointsValueEl.textContent = totalPoints;

        plusButtons.forEach(button => {
            const statName = button.dataset.stat; 
            const statValue = stats[statName];
            button.disabled = (totalPoints === 0) || (statValue === MAX_PER_STAT);
        });

        minusButtons.forEach(button => {
            const statName = button.dataset.stat;
            const statValue = stats[statName];
            button.disabled = (statValue === MIN_PER_STAT);
        });

        for (const statName in stats) {
            valueElements[statName].textContent = stats[statName];
        }

        const arePointsSpent = (totalPoints === 0);
        const isNameEntered = charNameInput.value.trim() !== '';
        startButton.disabled = !arePointsSpent || !isNameEntered;  
    }

    plusButtons.forEach(button => {
        button.addEventListener('click', () => {
            const statName = button.dataset.stat;
            if (totalPoints > 0 && stats[statName] < MAX_PER_STAT) {
                stats[statName]++;
                totalPoints--;
                updateUI();
            }
        });
    });

    minusButtons.forEach(button => {
        button.addEventListener('click', () => {
            const statName = button.dataset.stat;
            if (stats[statName] > MIN_PER_STAT) {
                stats[statName]--;
                totalPoints++;
                updateUI();
            }
        });
    });

    charNameInput.addEventListener('input', updateUI);

    startButton.addEventListener('click', ()=> {
        let firstChar = new Character(charNameInput.value,stats);
        console.log(firstChar);
        
        window.location.href = 'main.js';
        
    });
    updateUI();
});