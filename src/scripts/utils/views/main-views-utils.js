
//draws (desenha os estados atuais na tela)

function refreshAllUI() {
    drawRoster();
    goldAmount.textContent = PLAYER_MANAGER.getGold();
    window.team.forEach(character => {
        updateSquad(character);
    });
    
    window.enemyTeam.forEach(enemy =>{
        updateEnemySquad(enemy);
    })
}
function refreshRoster() {
    // Limpa o roster antigo
    teamRoster.innerHTML = '';

    // Itera sobre TODOS os slots possíveis (1 até 6)
    const maxSlots = PLAYER_MANAGER.maxSlots; // (6)
    
    for (let i = 0; i < maxSlots; i++) {
        const slot = document.createElement('div');
        
        //Slot tem um Personagem ---
        if (i < window.team.length) {
            const character = window.team[i];
            slot.classList.add('team-member-portrait');
            slot.dataset.id = character.id;
            
            // Lógica do ícone de level up
            let levelUpIconHTML = '';
            
            // Só mostra o botão se tiver pontos E for o Round 1 (Preparação)
            if (character.unspentAttributePoints > 0 && GAME_MANAGER.getRound() === 1) {
                levelUpIconHTML = `<div class="level-up-icon" title="Pontos disponíveis!">+</div>`;
            }

            // Lógica da imagem (com fallback)
            const avatarStyle = character.avatar.large ? `background-image: url('${character.avatar.large}');` : '';

            // HTML Detalhado
            slot.innerHTML = `
                <div class="portrait-top">
                    <div class="portrait-image" style="${avatarStyle}"></div>
                    <div class="portrait-info">
                        <span class="portrait-name">${character.name} (Nv.${character.lvl})</span>
                        <div class="portrait-attributes-grid">
                            <span>STR: ${character.attributes.str}</span>
                            <span>CON: ${character.attributes.con}</span>
                            <span>AGI: ${character.attributes.agi}</span>
                            <span>INT: ${character.attributes.int}</span>
                            <span>WIS: ${character.attributes.wis}</span>
                        </div>
                    </div>
                </div>

                <div class="portrait-xp-container" title="Experiência">
                    <div class="portrait-xp-fill" style="width: ${(character.experience / character.experienceGap) * 100}%"></div>
                    <span class="portrait-xp-text">${character.experience} / ${character.experienceGap} XP</span>
                </div>
                
                ${levelUpIconHTML}
            `;
        }
        
        //Slot Vazio ---
        else if (i < PLAYER_MANAGER.unlockedSlots) {
            slot.classList.add('team-member-portrait', 'empty-slot');
            slot.innerHTML = `<div>Espaço Livre</div>`;
        }

        //Slot Trancado ---
        else {
            slot.classList.add('team-member-portrait', 'locked-slot');


            if (i === PLAYER_MANAGER.unlockedSlots) {
                const cost = PLAYER_MANAGER.getNextSlotCost();
                slot.dataset.action = 'buy-slot'; 
                slot.innerHTML = `
                    <div class="locked-content">
                        <div class="locked-icon">🔒</div>
                        <div>Destrancar</div>
                        <div class="locked-price">${cost} 💰</div>
                    </div>
                `;
            } else {
                // Slots futuros (apenas trancados, sem preço)
                slot.innerHTML = `<div class="locked-content"><div class="locked-icon">🔒</div></div>`;
                slot.style.opacity = "0.5";
                slot.style.cursor = "default";
            }
        }

        teamRoster.appendChild(slot);
    }

    // Atualiza o título
    teamPanelTitle.textContent = `Esquadrão (${window.team.length}/${PLAYER_MANAGER.unlockedSlots})`;
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
// Controle de Destrancar Loja
function checkShopAvailability() {
    const currentPhase = GAME_MANAGER.getPhase();
    const currentRound = GAME_MANAGER.getRound();

    // Destranca a cada 5 fases (5, 10, 15...)
    const isShopPhase = currentPhase % 5 === 0;

    if (isShopPhase && currentRound === 1) {

        // LOJA ABERTA
        recruitIcon.classList.remove('locked');
        recruitIcon.removeAttribute('data-tooltip'); // Remove o tooltip de bloqueio
        recruitIcon.title = "Abrir Loja"; // Tooltip nativo simples quando aberta
        
        drawShop();
        
    } else {

        // LOJA TRANCADA
        recruitIcon.classList.add('locked');
        recruitIcon.removeAttribute('title');

        // É a fase certa, mas o combate já começou
        if (isShopPhase && currentRound > 1) {
            recruitIcon.setAttribute('data-tooltip', `Loja fechada durante o combate.`);
        } 
        // A fase não é multiplo de 5
        else {
            const nextShopPhase = Math.ceil(currentPhase / 5) * 5;
            // Se estamos na fase 5 (mas round > 1), a próxima é 10.
            // Se estamos na fase 1, a próxima é 5.
            const targetPhase = (currentPhase % 5 === 0) ? currentPhase + 5 : nextShopPhase;
            
            recruitIcon.setAttribute('data-tooltip', `Loja abre na fase: ${targetPhase}`);
        }

        // Garante que o painel feche se for trancado
        recruitPanel.classList.remove('is-open');
        document.body.classList.remove('shop-is-open');
    }
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
        
        <div class="player-sprite">
            <img src="${character.avatar.large}" style="width:100%; height:100%; object-fit:cover; border-radius:4px;">
        </div>
        
        <div class="player-lvl">
            <span style="color: var(--gold-color); font-weight: bold;">T${character.tier}</span> 
            <span style="margin: 0 5px; color: #666;">|</span> 
            Lvl ${character.lvl}
        </div>

        <div class="player-stats-area">
            <div class="combat-stats-grid">
                <div class="c-stat" title="Ataque">
                    <span class="icon">⚔️</span> ${character.stats.damage}
                </div>
                <div class="c-stat" title="Chance Crítica">
                    <span class="icon">🎯</span> ${character.stats.critical_chance.toFixed(2)}%
                </div>
                <div class="c-stat" title="Multiplicador Crítico">
                    <span class="icon">💥</span> ${character.stats.critical_multiplier.toFixed(2)}x
                </div>
                <div class="c-stat" title="Esquiva">
                    <span class="icon">💨</span> ${character.stats.evasion.toFixed(0)}%
                </div>
            </div>

            <div class="stat-bar-container hp-bar">
                <div class="bar-text hp-text">
                    ${character.currentHP} / ${character.stats.hp}
                </div>
                <div class="armor-text">
                    🛡️${character.stats.armor}
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
    if (!window.enemyTeam.includes(enemy)) {
        console.warn('Tentativa de desenhar inimigo inexistente');
        return;
    }

    // Efeitos
    let effectsHTML = '';
    if (enemy.effects && Array.isArray(enemy.effects)) {
        enemy.effects.forEach(effect => {
            if (effect.duration > 0) {
                effectsHTML += `<div class="effect-icon" title="${effect.name}">${effect.icon}</div>`;
            }
        });
    }

    // Skills (rodapé)
    let skillsHTML = '';
    if (enemy.skills && enemy.skills.length > 0) {
        const skillList = enemy.skills.map(s => `• ${s.name}`).join('<br>');
        skillsHTML = `
            <div class="enemy-skills-footer">
                📜 ${enemy.skills.length} Habilidade(s)
                <div class="enemy-skills-tooltip">
                    <strong>Habilidades:</strong><br>${skillList}
                </div>
            </div>
        `;
    }

    // Ícone da Classe (Baseado no nome da classe ou descrição)
    let classIcon = enemy.classIcon || '👾' ;

    const existingCard = enemyArea.querySelector(`.enemy-card[data-id="${enemy.id}"]`);
    
    const avatarStyle = enemy.avatar && enemy.avatar.large ? `background-image: url('${enemy.avatar.large}');` : '';

    const newInnerCardHTML = `
        <div class="enemy-class-icon" title="Classe: ${enemy.class}">${classIcon}</div>

        <div class="player-name">${enemy.name}</div>
        
        <div class="player-sprite">
            <img src="${enemy.avatar ? enemy.avatar.large : ''}" style="width:100%; height:100%; object-fit:cover; border-radius:4px;">
        </div>
        
        <div class="player-lvl">
            <span style="color: #F1C40F; font-weight: bold;">T${enemy.tier}</span> 
            <span style="margin: 0 5px; color: #666;">|</span> 
            Lvl ${enemy.lvl}
        </div>

        <div class="player-stats-area">
            <div class="enemy-stats-grid">
                <div class="c-stat" title="Ataque"><span class="icon">⚔️</span> ${enemy.stats.damage}</div>
                <div class="c-stat" title="Crítico"><span class="icon">🎯</span> ${(enemy.stats.critical_chance).toFixed(2)}%</div>
                <div class="c-stat" title="Mult. Crítico"><span class="icon">💥</span> ${enemy.stats.critical_multiplier.toFixed(2)}x</div>
                <div class="c-stat" title="Esquiva"><span class="icon">💨</span> ${Math.round(enemy.stats.evasion)}%</div>
            </div>

            <div class="stat-bar-container hp-bar">
                <div class="bar-text hp-text">${enemy.currentHP} / ${enemy.stats.hp}</div>
                <div class="armor-text">🛡️${enemy.stats.armor}</div>
                <div class="hp-bar-fill" style="width: ${(enemy.currentHP / enemy.stats.hp) * 100}%"></div>
            </div>

            <div class="stat-bar-container mana-bar">
                <div class="bar-text mana-text">${enemy.currentMana} / ${enemy.stats.mana}</div>
                <div class="mana-bar-fill" style="width: ${(enemy.currentMana / enemy.stats.mana) * 100}%"></div>
            </div>
            
            <div class="player-effects">${effectsHTML}</div>
            
            ${skillsHTML}
        </div>
    `;

    if (existingCard) {
        existingCard.innerHTML = newInnerCardHTML;
    } else {
        enemyArea.innerHTML += `<div class="enemy-card" data-id="${enemy.id}">${newInnerCardHTML}</div>`;
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

        item.style.backgroundImage = `url(${combatant.avatar.large})`;
        item.style.backgroundSize = 'cover';
        item.style.backgroundPosition = 'center';
        item.style.backgroundRepeat = 'no-repeat';
        
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

function drawShop() {
    const recruitContent = document.querySelector('#recruit-panel .panel-content');
    recruitContent.innerHTML = ''; 

    if (SHOP_MANAGER.shopInventory.length === 0) {
        recruitContent.innerHTML = '<div style="padding:10px; text-align:center; color:#777;">Loja Esgotada!<br>Volte na próxima fase.</div>';
        return;
    }

    SHOP_MANAGER.shopInventory.forEach((merc, index) => {
        const item = document.createElement('div');
        item.classList.add('mercenary-for-hire');
        
        // Trata a imagem (Avatar)
        const avatarUrl = merc.avatar.large || ''; // Garante que não seja undefined
        const avatarStyle = avatarUrl ? `background-image: url('${avatarUrl}');` : '';

        // Prepara as Skills para o Tooltip
        const skillCount = merc.skills.length;
        let skillNames = "Nenhuma";
        if (skillCount > 0) {
            // Cria uma lista: "Bola de Fogo, Cura Leve"
            skillNames = merc.skills.map(s => `• ${s.name}`).join('<br>');
        }

        // Monta o HTML
        item.innerHTML = `
            <div class="merc-header">
                <div class="merc-avatar" style="${avatarStyle}"></div>
                <div class="merc-header-info">
                    <span class="merc-name">${merc.name}</span>
                    <span class="merc-subtext">
                        <span class="merc-tier">T${merc.tier}</span> | ${merc.vocation || merc.vocationName} | Nv.${merc.lvl}
                    </span>
                </div>
            </div>

            <div class="merc-stats-grid">
                <div class="merc-stat-item" data-stat="str">FOR: <span>${merc.attributes.str}</span></div>
                <div class="merc-stat-item" data-stat="con">CON: <span>${merc.attributes.con}</span></div>
                <div class="merc-stat-item" data-stat="agi">AGI: <span>${merc.attributes.agi}</span></div>
                <div class="merc-stat-item" data-stat="int">INT: <span>${merc.attributes.int}</span></div>
                <div class="merc-stat-item" data-stat="wis">SAB: <span>${merc.attributes.wis}</span></div>
            </div>

            <div class="merc-footer">
                
                <div class="merc-hp" style="font-size: 0.9em; color: var(--hp-color); font-weight: bold;">
                    ❤️ ${merc.stats.hp} HP
                </div>

                <div class="merc-skills-container">
                    📜 ${skillCount} Skill(s)
                    <div class="merc-skills-tooltip">
                        <strong>Habilidades:</strong><br>
                        ${skillNames}
                    </div>
                </div>

                <div class="merc-price-action">
                    <span class="merc-cost">${merc.cost} 💰</span>
                    <button class="recruit-btn" data-index="${index}">Contratar</button>
                </div>
            </div>
        `;

        recruitContent.appendChild(item);
    });
}