const battleMessagePopup = document.getElementById('battle-message-popup');
const startBattleButton = document.getElementById('start-battle-btn');
const roundNumber = document.getElementById('round-number');
const phaseNumber = document.getElementById('phase-number');
const goldAmount = document.getElementById('gold-amount');
const teamRoster = document.getElementById('team-roster');
const skillsIcon = document.getElementById('skills-icon');
const teamPanelTitle = document.querySelector('#team-panel .panel-title');
const enemyArea = document.getElementById('enemy-area');
const playerArea = document.getElementById('player-area');
const recruitIcon = document.getElementById('recruit-icon');
const recruitPanel = document.getElementById('recruit-panel');
const enemyTooltip = document.getElementById('enemy-tooltip');
const closeButtons = document.querySelectorAll('.close-panel-btn');
const blurBackdrop = document.getElementById('blur-backdrop');
const skillPopup = document.getElementById('skill-popup');
const turnOrderList = document.getElementById('turn-order-list');
const turnOrderTooltip = document.getElementById('turn-order-tooltip');
const combatTextPopup = document.getElementById('combat-text-popup');
const levelUpModal = document.getElementById('level-up-modal');
let activeLevelUpCharacter = null;
let skillPopupTimeout = null;
const recruitContent = document.querySelector('#recruit-panel .panel-content');

window.team = [];
window.enemyTeam = [];
window.playerActions = {};

//add menu lateral esquerdo
const MAX_TEAM_SIZE = 6;
for (let i = 0; i < MAX_TEAM_SIZE; i++) {
    const slot = document.createElement('div');
    
    slot.classList.add('team-member-portrait', 'empty-slot');

    slot.setAttribute('disabled', ''); 

    teamRoster.appendChild(slot);
}
//impede bugs visuais ao apertar Tab
window.addEventListener('keydown', function(e) {
    if (e.key === 'Tab' || e.keyCode === 9) {
        e.preventDefault();
    }
});

//INTERATIVIDADE DOS MENUS

//botao de iniciar batalha
startBattleButton.addEventListener('click', executeRound);

playerArea.addEventListener('click', (event) => {

    if (document.body.classList.contains('battle-in-progress')) return;
    
    if (BATTLE_VIEW_MANAGER.isCurrentlyTargeting()) {
        
        if (BATTLE_VIEW_MANAGER.skillTargetType === 'ally') {
            
            const clickedAllyCard = event.target.closest('.player-card');
            
            if (clickedAllyCard) {
                
                const allyId = clickedAllyCard.dataset.id;
                
                
                BATTLE_VIEW_MANAGER.confirmTarget(allyId); 
            } else {
                
                BATTLE_VIEW_MANAGER.resetTargeting(true);
            }
        } else {
            
            BATTLE_VIEW_MANAGER.resetTargeting(true);
        }
        return; 
    }


    const clickedIcon = event.target.closest('.action-icon');
    if (!clickedIcon) return; 

    const card = clickedIcon.closest('.player-card');
    const characterId = card.dataset.id; 
    const actionType = clickedIcon.dataset.actionType;

    card.querySelectorAll('.action-icon').forEach(icon => {
        icon.classList.remove('selected');
        icon.classList.remove('action-defined'); 
    });
    delete window.playerActions[characterId];
    
    const charIdNum = parseInt(characterId, 10);
    const character = window.team.find(char => char.id === charIdNum);
    
    if (!character) {
        console.error(`[Main] Erro: Não foi possível encontrar o personagem com ID ${characterId}`);
        return;
    }

    if (actionType === 'skill') return;

    if (actionType === 'melee') {
        
        BATTLE_VIEW_MANAGER.startTargeting(character.id, character.name, card, 'melee', 'enemy');

    }else if (actionType === 'rest') {
        window.playerActions[characterId] = { type: 'rest' };
        
        clickedIcon.classList.add('action-defined');
        
        checkBattleReady();
    }
});

playerArea.addEventListener('mouseover', (event) => {
    const skillIcon = event.target.closest('.action-icon[data-action-type="skill"]');
    if(skillIcon){
        clearTimeout(skillPopupTimeout);

        const card = skillIcon.closest('.player-card');
        if (skillPopup.classList.contains('show') && skillPopup.dataset.cardId === card.dataset.id) {
            return;
        }

        const characterId = card.dataset.id;
        const charIdNum = parseInt(characterId, 10);
        const character = window.team.find(char => char.id === charIdNum);
        
        if (character) {
            showSkillPopup(character, card, skillIcon);
        }
    }
    if (BATTLE_VIEW_MANAGER.isCurrentlyTargeting()) return;

    const playerCard = event.target.closest('.player-card');
    if (!playerCard) return;

    const characterId = playerCard.dataset.id;

    const action = window.playerActions[characterId];

    if (action && action.targetId) {
        const targetCard = 
            enemyArea.querySelector(`.enemy-card[data-id="${action.targetId}"]`) ||
            playerArea.querySelector(`.player-card[data-id="${action.targetId}"]`);

        if (targetCard) {
            targetCard.classList.add('is-being-targeted');
        }
    }
});

playerArea.addEventListener('mouseout', (event) => {
    if (BATTLE_VIEW_MANAGER.isCurrentlyTargeting()) return;

    if (event.target.closest('.action-icon[data-action-type="skill"]')) {
        skillPopupTimeout = setTimeout(hideSkillPopup, 300);
    }

    document.querySelectorAll('.is-being-targeted').forEach(card => {
        card.classList.remove('is-being-targeted');
    });
});

//skills acao popup
skillPopup.addEventListener('mouseover', () => {
    clearTimeout(skillPopupTimeout);
});
skillPopup.addEventListener('mouseout', () => {
    skillPopupTimeout = setTimeout(hideSkillPopup, 300);
});

skillPopup.addEventListener('click', (event) => {
    const selectedSkillItem = event.target.closest('.skill-popup-item');
    
    if (selectedSkillItem && !selectedSkillItem.classList.contains('disabled')) {
        
        const skillId = parseInt(selectedSkillItem.dataset.skillId,10);
        const characterId = skillPopup.dataset.characterId;
        const card = playerArea.querySelector(`.player-card[data-id="${characterId}"]`);
        
        const charIdNum = parseInt(characterId, 10);
        const character = window.team.find(char => char.id === charIdNum);
        const skill = character.skills.find(s => s.id === skillId);
        
        if (!character || !skill || !card) {
            
            console.error("Erro ao selecionar a skill. Dados não encontrados.");
            return;
        }

        // 3. Limpa seleções antigas
        card.querySelectorAll('.action-icon').forEach(icon => {
            icon.classList.remove('selected');
            icon.classList.remove('action-defined'); 
        });
        delete window.playerActions[characterId];
        BATTLE_VIEW_MANAGER.startTargeting(character.id, character.name, card, 'skill', skill.targetType, skill);
        
        hideSkillPopup();
    }
});

// Abrir o Painel de Recrutamento
recruitIcon.addEventListener('click', () => {
    if (recruitIcon.classList.contains('locked')) {
        return;
    }
    recruitPanel.classList.add('is-open');
    document.body.classList.add('shop-is-open');
});


// Fechar Painéis
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const panelId = button.dataset.targetPanel;
        
        if (panelId === 'recruit-panel') {
            recruitPanel.classList.remove('is-open');
            document.body.classList.remove('shop-is-open');
            
        } else if(panelId === 'skills-panel') {
            skillsPanel.classList.add('hidden');
        }
    });
});

enemyArea.addEventListener('click', (event) => {
    if (!BATTLE_VIEW_MANAGER.isCurrentlyTargeting() || BATTLE_VIEW_MANAGER.skillTargetType !== 'enemy') {
        return;
    }

    const enemyCard = event.target.closest('.enemy-card');
    if (enemyCard) {
        const enemyId = enemyCard.dataset.id;
        BATTLE_VIEW_MANAGER.confirmTarget(enemyId);
    }
});

// Interatividade do Tooltip do Inimigo
enemyArea.addEventListener('mouseover', (event) => {
    // Se o mouse estiver sobre o rodapé de skills, NÃO mostre o tooltip geral
    if (event.target.closest('.enemy-skills-footer')) {
        enemyTooltip.classList.add('hidden');
        return;
    }

    const enemyCard = event.target.closest('.enemy-card');
    
    if (enemyCard) {
        const enemyId = parseInt(enemyCard.dataset.id, 10);
        const enemy = window.enemyTeam.find(e => e.id === enemyId);

        if (enemy) {
            document.getElementById('tooltip-name').textContent = enemy.name;
            document.getElementById('tooltip-desc').innerHTML = `
                ${enemy.description}<br>
                <hr style="border-color:#444; margin:5px 0;">
                <div style="display:grid; grid-template-columns: 1fr 1fr; font-size:0.9em;">
                    <span>FOR: ${enemy.attributes.str}</span>
                    <span>CON: ${enemy.attributes.con}</span>
                    <span>AGI: ${enemy.attributes.agi}</span>
                    <span>INT: ${enemy.attributes.int}</span>
                    <span>SAB: ${enemy.attributes.wis}</span>
                </div>
            `; 
            
            enemyTooltip.classList.remove('hidden');
            enemyTooltip.style.left = `${event.pageX + 10}px`;
            enemyTooltip.style.top = `${event.pageY + 10}px`;
        }
    }
});

// Esconde o tooltip quando o mouse sai da área do inimigo
enemyArea.addEventListener('mouseout', (event) => {
    if (event.target.closest('.enemy-card') || event.target.closest('.enemy-skills-footer')) {
        enemyTooltip.classList.add('hidden');
    }
});

// Atualiza a posição do tooltip enquanto o mouse se mexe
enemyArea.addEventListener('mousemove', (event) => {
    if (!enemyTooltip.classList.contains('hidden')) {
        enemyTooltip.style.left = `${event.pageX + 10}px`;
        enemyTooltip.style.top = `${event.pageY + 10}px`;
    }
});


document.getElementById('battlefield').addEventListener('click', (event) => {
    if (!BATTLE_VIEW_MANAGER.isCurrentlyTargeting()) return;
    
    if (!event.target.closest('.enemy-card') && !event.target.closest('.player-card')) {
        BATTLE_VIEW_MANAGER.resetTargeting(true); 
    }
});

document.getElementById('battlefield').addEventListener('click', cancelTargetingHandler);
document.getElementById('blur-backdrop').addEventListener('click', cancelTargetingHandler);

function cancelTargetingHandler(event) {
    if (!BATTLE_VIEW_MANAGER.isCurrentlyTargeting()) return;
    
    if (!event.target.closest('.enemy-card') && !event.target.closest('.player-card')) {
        BATTLE_VIEW_MANAGER.resetTargeting(true); 
    }
}

turnOrderList.addEventListener('mouseover', (event) => {
    const turnItem = event.target.closest('.turn-order-item');
    if (turnItem) {
        const charId = parseInt(turnItem.dataset.id, 10);
        
        // 2. Encontra o combatente no array 'combatOrder'
        const combatant = window.combatOrder.find(c => c.id === charId);

        if (combatant) {
            const tooltipHTML = `
                <span class="tooltip-turn-name">${combatant.name}</span>
                <span class="tooltip-turn-stat">Iniciativa: ${combatant.stats.initiative}</span>
            `;
            
            turnOrderTooltip.innerHTML = tooltipHTML;
            turnOrderTooltip.classList.remove('hidden');
            turnOrderTooltip.style.left = `${event.pageX + 10}px`;
            turnOrderTooltip.style.top = `${event.pageY + 10}px`;
        }
    }
});

turnOrderList.addEventListener('mouseout', (event) => {
    // Esconde o tooltip quando o mouse sai do ícone
    if (event.target.closest('.turn-order-item')) {
        turnOrderTooltip.classList.add('hidden');
    }
});

turnOrderList.addEventListener('mousemove', (event) => {
    // Move o tooltip junto com o mouse
    if (!turnOrderTooltip.classList.contains('hidden')) {
        turnOrderTooltip.style.left = `${event.pageX + 10}px`;
        turnOrderTooltip.style.top = `${event.pageY + 10}px`;
    }
});

teamRoster.addEventListener('click', (event) => {
    // Verifica se clicou no botão +
    const levelUpButton = event.target.closest('.level-up-icon');
    
    if (levelUpButton) {
        console.log("1. Clique no botão detectado!");

        const parentCard = levelUpButton.closest('.team-member-portrait');
        const charId = parseInt(parentCard.dataset.id, 10);
        
        // Procura o personagem
        const character = window.team.find(c => c.id === charId);
        
        if (character) {
            console.log("2. Personagem encontrado:", character.name);
            console.log("Level:", character.lvl);
            console.log("Ultimo Upgrade Especial:", character.lastSpecialUpgradeLevel);

            // Verifica se o método existe (se não existir, o save é velho)
            if (typeof character.hasPendingSpecialUpgrade !== 'function') {
                console.error("ERRO: O personagem é antigo e não tem o método novo. Resete o save!");
                openLevelUpModal(character); // Abre o normal como fallback
                return;
            }

            if (character.hasPendingSpecialUpgrade()) {
                console.log("3. Abrindo Modal Especial...");
                openSpecialUpgradeModal(character);
            } else {
                console.log("3. Abrindo Modal Normal...");
                openLevelUpModal(character);
            }
        } else {
            console.error("Erro: Personagem não encontrado no window.team");
        }
        return;
    }
    
    const lockedSlot = event.target.closest('.locked-slot[data-action="buy-slot"]');
    
    if (lockedSlot) {
        const cost = PLAYER_MANAGER.getNextSlotCost();
        
        if (lockedSlot.dataset.confirming !== 'true') {
            
            //  Validação de Ouro
            if (PLAYER_MANAGER.getGold() < cost) {
                // Salva o conteúdo original
                const originalHTML = lockedSlot.innerHTML;
                
                // Aplica estilo de Erro
                lockedSlot.classList.add('error-state');
                lockedSlot.innerHTML = `
                    <div class="locked-content">
                        <div class="locked-icon">❌</div>
                        <div>Sem Ouro!</div>
                    </div>
                `;
                
                // Remove o erro após 1 segundo
                setTimeout(() => {
                    lockedSlot.classList.remove('error-state');
                    lockedSlot.innerHTML = originalHTML;
                }, 1000);
                return;
            }

            lockedSlot.dataset.confirming = 'true'; 
            lockedSlot.classList.add('confirm-state');
            
            // Salva o HTML original num atributo data
            lockedSlot.innerHTML = `
                <div class="locked-content">
                    <div class="locked-icon">✔️</div>
                    <div>Confirmar?</div>
                    <div class="locked-price">${cost} 💰</div>
                </div>
            `;
            
            // Reverte o estado de confirmação após 3 segundos
            setTimeout(() => {
                if (lockedSlot && lockedSlot.dataset.confirming === 'true') {
                    refreshRoster(); 
                }
            }, 3000);

            return;
        }
        // Segundo Clique (Executar Compra) ---
        if (lockedSlot.dataset.confirming === 'true') {
            const success = PLAYER_MANAGER.buySlot();
            
            if (success) {
                // Atualiza UI
                goldAmount.textContent = PLAYER_MANAGER.getGold();
                refreshAllUI(); // Redesenha tudo
            }
        }
    }
});

levelUpModal.addEventListener('click', (event) => {
    const plusButton = event.target.closest('.lvlup-plus-btn');
    
    if (plusButton) {
        const statName = plusButton.dataset.stat;
        
        const success = activeLevelUpCharacter.spendAttributePoint(statName);
        
        if (success) {
            refreshAllUI();
            
            if (activeLevelUpCharacter.unspentAttributePoints === 0) {
                closeLevelUpModal();
            } else {
                openLevelUpModal(activeLevelUpCharacter);
            }
        }
    }
    
    if (event.target.closest('.close-panel-btn')) {
        closeLevelUpModal();
    }
});

recruitPanel.addEventListener('click', (event) => {
    // Garante que, se o usuário clicar em um elemento interno, pegamos o botão correto
    const btn = event.target.closest('.recruit-btn');
    if (!btn) return;

    const index = parseInt(btn.dataset.index, 10);
    const merc = SHOP_MANAGER.shopInventory[index];
    if (!merc) {
        return;
    }

    const isConfirming = btn.classList.contains('confirm');

    if (!isConfirming) {
        let errorMsg = null;
        if (PLAYER_MANAGER.getGold() < merc.cost) errorMsg = "Sem Ouro!";
        else if (window.team.length >= MAX_TEAM_SIZE || PLAYER_MANAGER.unlockedSlots <= window.team.length) errorMsg = "Time lotado!";

        if (errorMsg) {
            // Feedback de Erro
            const originalText = 'Contratar';
            btn.textContent = errorMsg;
            btn.classList.add('error');

            setTimeout(() => {
                btn.textContent = originalText;
                btn.classList.remove('error');
            }, 1000);
            return; // Para aqui
        }

        // Se validou, muda para o estado de confirmação
        const originalText = btn.textContent;
        btn.textContent = "Confirmar?";
        btn.classList.add('confirm');

        // Adiciona um timer para reverter o estado de confirmação após 3s
        if (btn.dataset.confirmTimer) {
            clearTimeout(Number(btn.dataset.confirmTimer));
            delete btn.dataset.confirmTimer;
        }
        const timerId = setTimeout(() => {
            if (btn.classList.contains('confirm')) {
                btn.classList.remove('confirm');
                btn.textContent = originalText;
            }
            delete btn.dataset.confirmTimer;
        }, 3000);
        btn.dataset.confirmTimer = String(timerId);

        // O código TERMINA aqui. O usuário precisa clicar de novo.
    } else {
        // Limpa timer de confirmação, se houver
        if (btn.dataset.confirmTimer) {
            clearTimeout(Number(btn.dataset.confirmTimer));
            delete btn.dataset.confirmTimer;
        }

        const success = SHOP_MANAGER.buyMercenary(index);
        if (success) {
            goldAmount.textContent = PLAYER_MANAGER.getGold();
            drawShop();
        }
    }
});