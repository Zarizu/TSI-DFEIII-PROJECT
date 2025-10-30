    // animacao de queda de emojis
    const animationContainer = document.querySelector('.background-animation');
    const numberOfIcons = 12; 

    for (let i = 0; i < numberOfIcons; i++) {
        const iconSpan = document.createElement('span');
        animationContainer.appendChild(iconSpan);
    }

    //distribuicao de atributos 
    const MAX_POINTS = 3;
    const MAX_PER_STAT = 3;
    const MIN_PER_STAT = 1;

    let totalPoints = MAX_POINTS;
    const stats = {
        atk: 1,
        con: 1,
        int: 1
    };

    const pointsValueEl = document.getElementById('points-value');
    const startButton = document.getElementById('main-start');
    const charNameInput = document.getElementById('char-name-input');

    const plusButtons = document.querySelectorAll('.stat-btn.plus');
    const minusButtons = document.querySelectorAll('.stat-btn.minus');
    
    const valueElements = {
        atk: document.getElementById('ataque-value'),
        con: document.getElementById('constituicao-value'),
        int: document.getElementById('inteligencia-value')
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

    startButton.addEventListener('click', () => {
        
        let firstChar = new PCharacter(charNameInput.value, stats);
        const firstCharFormatted = JSON.stringify(firstChar);

        localStorage.setItem('FirstCharData',firstCharFormatted);
        
        window.location.href = './pages/main.html';
    });
    updateUI();
