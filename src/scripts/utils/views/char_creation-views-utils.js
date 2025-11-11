
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
    const lvl = 1; 
    const tier = 1; 
    
    const modifiers = {
        "damage": 2 * lvl,
        "critical_multiplier": 0.25 * lvl,
        "initiative" : 1 * lvl,
        "evasion": 0.75 * (lvl),
        "critical_chance": 1.25 * (lvl),
        "hp": 5 * lvl,
        "armor": 1 * lvl,
        "mana": 3 * lvl,
        "skill": 1 * lvl,
        "magic_resist": 1 * lvl,
        "mana_regen": 1 * (lvl),
        "hp_regen": 3 * (lvl)
    };

    const finalStats = {
        "damage": _calculateStatPreview(modifiers.damage, stats.str, tier,2),
        "critical_multiplier": modifiers.critical_multiplier + (stats.str * 0.5) + (tier * 0.75),
        
        "initiative": _calculateStatPreview(modifiers.initiative, stats.agi, tier),
        "evasion": _calculateStatPreview(modifiers.evasion, stats.agi, tier,1.75),
        "critical_chance": _calculateStatPreview(modifiers.critical_chance, stats.agi, tier,2),

        "hp": _calculateStatPreview(modifiers.hp, stats.con, tier,5),
        "armor": _calculateStatPreview(modifiers.armor, stats.con, tier),

        "mana": _calculateStatPreview(modifiers.mana, stats.int, tier,2),
        "skill": _calculateStatPreview(modifiers.skill, stats.int, tier,2),

        "magic_resist": _calculateStatPreview(modifiers.magic_resist, stats.wis, tier),
        "mana_regen": _calculateStatPreview(modifiers.mana_regen, stats.wis, tier),
        "hp_regen": _calculateStatPreview(modifiers.hp_regen, stats.wis, tier,2),
    };

    for (const statName in finalStats) {

        if(statName == 'evasion' || statName == 'critical_chance'){
            previewStatElements[statName].textContent = `${finalStats[statName]}%`;
        }
        else if(statName == 'critical_multiplier'){
            previewStatElements[statName].textContent = `${finalStats[statName].toFixed(2)}X`;
        }
        else if (previewStatElements[statName]) {
            previewStatElements[statName].textContent = finalStats[statName];
        }
    }
}