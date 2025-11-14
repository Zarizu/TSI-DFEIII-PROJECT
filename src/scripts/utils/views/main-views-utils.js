
//draws (desenha os estados atuais na tela)

function refreshAllUI() {
    drawRoster();
    window.team.forEach(character => {
        updateSquad(character);
    });
    
    window.enemyTeam.forEach(enemy =>{
        updateEnemySquad(enemy);
    })
}
function refreshRoster() {

    teamRoster.innerHTML = '';

    window.team.forEach(character => {
        let levelUpIconHTML = '';
        if (character.unspentAttributePoints > 0) {
        levelUpIconHTML = `<div class="level-up-icon" title="Pontos disponíveis!">+</div>`;
        }   
        const newPortraitHTML = `
        <div class="portrait-image"></div>
        <div class="portrait-info">
            <span class="portrait-name">${character.name}</span>
            <div class="portrait-stats">
                <span class="portrait-atk">⚔️ ${character.currentHP}</span>
                <span class="portrait-hp">❤️ ${character.currentHP}/${character.stats.hp}</span>
                <span class="portrait-mana">🌀 ${character.currentMana}/${character.stats.mana}</span>
            </div>
        </div>
        ${levelUpIconHTML} `;
        
        const slot = document.createElement('div');
        slot.classList.add('team-member-portrait'); 
        slot.dataset.id = character.id; 
        slot.innerHTML = newPortraitHTML; 
        
        teamRoster.appendChild(slot);
    });

    const emptySlotsToDraw = MAX_TEAM_SIZE - window.team.length;
    for (let i = 0; i < emptySlotsToDraw; i++) {
        const slot = document.createElement('div');
        slot.classList.add('team-member-portrait', 'empty-slot');
        slot.setAttribute('disabled', '');
        teamRoster.appendChild(slot);
    }

    teamPanelTitle.textContent = `Esquadrão (${window.team.length}/${MAX_TEAM_SIZE})`;
}
function drawRoster(character) {
    refreshRoster();
}

function openLevelUpModal(character) {
    if (!character) return;
    
    activeLevelUpCharacter = character;

    console.log(activeLevelUpCharacter);
    
    document.getElementById('lvlup-char-name').textContent = character.name;
    document.getElementById('lvlup-points-value').textContent = character.unspentAttributePoints;
    
    document.getElementById('lvlup-str-value').textContent = character.attributes.str;
    document.getElementById('lvlup-con-value').textContent = character.attributes.con;
    document.getElementById('lvlup-agi-value').textContent = character.attributes.agi;
    document.getElementById('lvlup-int-value').textContent = character.attributes.int;
    document.getElementById('lvlup-wis-value').textContent = character.attributes.wis;

    levelUpModal.classList.remove('hidden');
}

function closeLevelUpModal() {
    levelUpModal.classList.add('hidden');
    activeLevelUpCharacter = null;
}

function drawCrew(character) {
    if(!window.team.includes(character)){
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
    <div class="player-action-bar">
            <div class="action-icon" data-action-type="melee" title="Ataque Básico">👊</div>
            <div class="action-icon" data-action-type="skill" title="Habilidades">📜</div>
            <div class="action-icon" data-action-type="rest" title="Descansar">💤</div>
        </div>
        <div class="player-name">${character.name}</div>
        <div class="player-sprite"></div>
        <div class="player-lvl">Lvl ${character.lvl}</div>
        <div class="player-stats-area">
            <div class="player-atk">
                ATK: ${character.stats.damage}
            </div>
            <div class="stat-bar-container hp-bar">
                <div class="bar-text hp-text">
                    ${character.currentHP} / ${character.stats.hp}
                </div>
                <div class="armor-text">
                    ${character.stats.armor}
                </div>
                <div class="hp-bar-fill" style="width: ${(character.currentHP / character.stats.hp) * 100}%"></div>
            </div>
            <div class="stat-bar-container mana-bar">
                <div class="bar-text mana-text">
                    ${character.currentMana} / ${character.stats.mana}
                </div>
                <div class="mana-bar-fill" style="width: ${(character.currentMana / character.stats.mana) * 100}%"></div>
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

function updateSquad(character){
    drawCrew(character);
    drawRoster(character);
    }


//enemy draws
function drawEnemy(enemy) {
    if(!window.enemyTeam.includes(enemy)){
        
        console.warn('Tentativa de desenhar inimigo inexistente');
        return;
    }
    
    let effectsHTML = '';
    if (enemy.effects && Array.isArray(enemy.effects)) {
        enemy.effects.forEach(effect => {
            if (effect.duration > 0) {
                effectsHTML += `<div class="effect-icon" title="${effect.name} (${effect.duration} turnos)">
                    ${effect.icon}
                </div>`;
            }
        });
    }

    const existingCard = enemyArea.querySelector(`.enemy-card[data-id="${enemy.id}"]`);

    const newInnerCardHTML = `
        <div class="player-name">${enemy.name}</div>
        <div class="player-sprite"></div>
        <div class="player-lvl">Lvl ${enemy.lvl}</div>
        <div class="player-stats-area">
            <div class="player-atk">
                ATK: ${enemy.stats.damage}
            </div>
            <div class="stat-bar-container hp-bar">
                <div class="bar-text hp-text">
                    ${enemy.currentHP} / ${enemy.stats.hp}
                </div>
                <div class="armor-text">
                    ${enemy.stats.armor}
                </div>
                <div class="hp-bar-fill" style="width: ${(enemy.currentHP / enemy.stats.hp) * 100}%"></div>
            </div>
            
            <div class="player-effects">
                ${effectsHTML}
            </div>
        </div>
    `;

    if (existingCard) {
        // update
        existingCard.innerHTML = newInnerCardHTML;
    } else {
        // add
        enemyArea.innerHTML += `
            <div class="enemy-card" data-id="${enemy.id}">
                ${newInnerCardHTML}
            </div>
        `;
    }
}

function updateEnemySquad(enemy){
    drawEnemy(enemy);
}
function showSkillPopup(character, card, iconElement) {
    skillPopup.innerHTML = '';
    
    if (character.skills && character.skills.length > 0) {
        character.skills.forEach(skill => {
            const item = document.createElement('div');
            item.classList.add('skill-popup-item');
            item.textContent = skill.name;
            item.dataset.skillId = skill.id;
            
            // Trava skills sem alvo
            if (skill.targetType === 'none') {
                item.classList.add('disabled');
            }
            skillPopup.appendChild(item);
        });
    } else {
        // Caso o personagem não tenha skills
        const item = document.createElement('div');
        item.classList.add('skill-popup-item', 'disabled');
        item.textContent = '(Sem Habilidades)';
        skillPopup.appendChild(item);
    }

    skillPopup.dataset.characterId = character.id;
    skillPopup.dataset.cardId = card.dataset.id; 

    const iconRect = iconElement.getBoundingClientRect();
    skillPopup.classList.remove('hidden');
    
    const cardRect = card.getBoundingClientRect();
    const popupWidth = skillPopup.offsetWidth;
    const cardCenterX = cardRect.left + (cardRect.width / 2);
    const popupLeft = cardCenterX - (popupWidth / 2);
    
    skillPopup.style.left = `${popupLeft}px`;
    skillPopup.style.top = `${iconRect.top}px`;
    skillPopup.style.transform = `translateY(calc(-100% - 10px))`;
    skillPopup.classList.add('show');
}

function hideSkillPopup() {
    skillPopup.classList.remove('show');
    setTimeout(() => {
        skillPopup.classList.add('hidden');
    }, 100);
}
function drawTurnOrder() {
    turnOrderList.innerHTML = '';

    if (!window.combatOrder || window.combatOrder.length === 0) return;

    window.combatOrder.forEach((combatant) => {
        const item = document.createElement('div');
        item.classList.add('turn-order-item');
        
        item.dataset.id = combatant.id;

        if (combatant instanceof PCharacter) {
            item.classList.add('ally');
        } else {
            item.classList.add('enemy');
        }
        //imagem futura
        item.textContent = combatant.name.charAt(0);

        turnOrderList.appendChild(item);
    });
}

function removeActionsSelection() {
    playerArea.querySelectorAll('.action-icon').forEach(icon => {
        icon.classList.remove('selected');
        icon.classList.remove('action-defined'); 
    });

    document.querySelectorAll('.is-being-targeted').forEach(card => {
    card.classList.remove('is-being-targeted')
    });
}

function playAnimation(targetCard, animationClass, duration) {
    if (!targetCard) return;

    targetCard.classList.add(animationClass);
    
    setTimeout(() => {
        if (targetCard) {
            targetCard.classList.remove(animationClass);
        }
    }, duration);
}

function showCombatText(targetCard, text, type) {
    const combatTextMold = document.getElementById('combat-text-popup');
    
    if (!targetCard || !combatTextMold) {
        return;
    }
    
    const popup = combatTextMold.cloneNode(true);
    
    const rect = targetCard.getBoundingClientRect();
    const battlefieldRect = battlefield.getBoundingClientRect();
    const x = rect.left + (rect.width / 2) - battlefieldRect.left;
    const y = rect.top - battlefieldRect.top;

    popup.id = ''; 
    popup.textContent = text;
    popup.className = ''; 
    popup.classList.add('combat-text-popup'); 
    popup.classList.add(type); 
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;

    battlefield.appendChild(popup);
    
    requestAnimationFrame(() => {
        popup.classList.add('show');
    });
    

    setTimeout(() => {
        if (popup) {
            popup.remove();
        }
    }, 1000); 
}

function animate(attackResult, targetCard){

            if (attackResult.didEvade) {
                showCombatText(targetCard, "ESQUIVA!", "miss");
                playAnimation(targetCard, 'is-taking-damage', 500);
            } else if (attackResult.isCritical) {
                showCombatText(targetCard, `${attackResult.damage} !`, "crit");
                playAnimation(targetCard, 'is-taking-damage', 500);
            } else {
                showCombatText(targetCard, attackResult.damage, "damage");
                playAnimation(targetCard, 'is-taking-damage', 500);
            }
            refreshAllUI(); 
        }

        function playDeathAnimation(targetCard, onAnimationEnd) {
    if (!targetCard) return;

    targetCard.classList.add('is-dead');
    
    setTimeout(() => {
        targetCard.remove();
        
        if (onAnimationEnd) {
            onAnimationEnd();
        }
    }, 500);
}