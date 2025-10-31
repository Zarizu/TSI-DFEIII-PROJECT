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

    const valueElements = {
        atk: document.getElementById('ataque-value'),
        con: document.getElementById('constituicao-value'),
        int: document.getElementById('inteligencia-value')
    };
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
