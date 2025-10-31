function updateSquad(character){
    drawCrew(character);
    drawRoster(character);
    }

    //draws
function drawRoster(character) {
    if(!team.includes(character)){
        console.warn('Tentativa de adcionar personagem inexistente');
        return;
    }
    
    // verifica se o slot existe
    const existingSlot = teamRoster.querySelector(`.team-member-portrait[data-id="${character.id}"]`);
    
    const newPortraitHTML = `
        <div class="portrait-image"></div>
        <div class="portrait-info">
            <span class="portrait-name">${character.name}</span>
            <div class="portrait-stats">
                <span class="portrait-atk">⚔️ ${character.currentStats.damage}</span>
                <span class="portrait-hp">❤️ ${character.currentStats.hp}/${character.stats.hp}</span>
                <span class="portrait-mana">🌀 ${character.currentStats.mana}/${character.stats.mana}</span>
            </div>
        </div>
    `;

    if (existingSlot) {
        // update
        existingSlot.innerHTML = newPortraitHTML;
    } else {
        // add
        const firstEmptySlot = teamRoster.querySelector('.empty-slot');
        if (firstEmptySlot) {
            firstEmptySlot.innerHTML = newPortraitHTML;
            firstEmptySlot.classList.remove('empty-slot');
            firstEmptySlot.dataset.id = character.id;
        } else {
            console.error(`Erro: Não foi possível adicionar ${character.name} ao roster.`);
        }
    }

    teamPanelTitle.textContent = `Esquadrão (${MAX_TEAM_SIZE}/6)`
}

function drawCrew(character) {
    if(!team.includes(character)){
        console.warn('Tentativa de adcionar personagem inexistente');
        
        return;
    }
    // efeitos
    let effectsHTML = '';
    if (character.effects && Array.isArray(character.effects)) {
        character.effects.forEach(effect => {
            if (effect.duration > 0) {
                effectsHTML += `<div class="effect-icon" title="${effect.name} (${effect.duration} turnos)">
                    ${effect.icon}
                </div>`;
            }
        });
    }

    // Procura se o card deste personagem já existe na tela
    const existingCard = playerArea.querySelector(`.player-card[data-id="${character.id}"]`);

    const newInnerCardHTML = `
        <div class="player-name">${character.name}</div>
        <div class="player-sprite"></div>
        <div class="player-lvl">Lvl ${character.lvl}</div>
        <div class="player-stats-area">
            <div class="player-atk">
                ATK: ${character.currentStats.damage}
            </div>
            <div class="stat-bar-container hp-bar">
                <div class="bar-text hp-text">
                    ${character.currentStats.hp} / ${character.stats.hp}
                </div>
                <div class="armor-text">
                    ${character.stats.armor}
                </div>
                <div class="hp-bar-fill" style="width: ${(character.currentStats.hp / character.stats.hp) * 100}%"></div>
            </div>
            <div class="stat-bar-container mana-bar">
                <div class="bar-text mana-text">
                    ${character.currentStats.mana} / ${character.stats.mana}
                </div>
                <div class="mana-bar-fill" style="width: ${(character.currentStats.mana / character.stats.mana) * 100}%"></div>
            </div>
            <div class="player-effects">
                ${effectsHTML}
            </div>
        </div>
    `;

    if (existingCard) {
        existingCard.innerHTML = newInnerCardHTML;
        
    } else {
        playerArea.innerHTML += `
            <div class="player-card" data-id="${character.id}">
                ${newInnerCardHTML}
            </div>
        `;
    }
}
