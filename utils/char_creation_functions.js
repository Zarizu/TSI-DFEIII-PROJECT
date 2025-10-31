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
