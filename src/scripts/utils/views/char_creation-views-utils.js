
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

charNameInput.addEventListener('input', () => {

    nextStepButton.disabled = (charNameInput.value.trim() === '');
});

nextStepButton.addEventListener('click', () => {
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
});

prevStepButton.addEventListener('click', () => {
    step2.classList.add('hidden');
    step1.classList.remove('hidden');
});

startButton.addEventListener('click', () => {
    const charName = charNameInput.value;
    
    const attributesArray = [
        stats.str,
        stats.con,
        stats.agi,
        stats.int,
        stats.wis
    ];
    
    let firstChar = new PCharacter(charName, attributesArray);
    const firstCharFormatted = JSON.stringify(firstChar);

    localStorage.setItem('FirstCharData', firstCharFormatted);
    
    window.location.href = './main.html';
});

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

    updateVocation();

    const arePointsSpent = (totalPoints === 0);
    startButton.disabled = !arePointsSpent;

    updateStatsPreview();
}

function updateVocation() {
    let highestStat = 'default';
    let maxValue = 0;
    let isTied = false;

    for (const statName in stats) {
        const value = stats[statName];
        if (value > maxValue) {
            maxValue = value;
            highestStat = statName;
            isTied = false;
        } else if (value === maxValue && maxValue > MIN_PER_STAT) {
            isTied = true;
        }
    }

    if(totalPoints == 0){
    if (isTied) {
        highestStat = 'default';
    }

    const vocation = VOCATIONS[highestStat];
    vocationNameEl.textContent = vocation.name;
    vocationTooltipEl.textContent = vocation.desc;
    }else{
        vocationNameEl.textContent = '';
        vocationTooltipEl.textContent = 'Indefinido. Gaste todos prontos de atributo.';
    }
}
function updateStatsPreview() {
    
    const attributesArray = [
        stats.str,
        stats.con,
        stats.agi,
        stats.int,
        stats.wis
    ];

    const tempChar = new PCharacter("preview", attributesArray);

    const finalStats = tempChar.stats;

    for (const statName in finalStats) {

        if(statName == 'evasion' || statName == 'critical_chance'){
            if (previewStatElements[statName]) {
                previewStatElements[statName].textContent = `${finalStats[statName].toFixed(2)}%`;
            }
        }
        else if(statName == 'critical_multiplier'){
            if (previewStatElements[statName]) {
                previewStatElements[statName].textContent = `${finalStats[statName].toFixed(2)}X`;
            }
        }
        else if (previewStatElements[statName]) {
            previewStatElements[statName].textContent = finalStats[statName].toFixed(2);
        }
    }
}