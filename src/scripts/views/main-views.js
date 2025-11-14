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
const skillsPanel = document.getElementById('skills-panel');
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
    recruitPanel.classList.add('is-open');
    document.body.classList.add('shop-is-open');
});
// Abrir o Painel de Habilidades
skillsIcon.addEventListener('click', () => {
    skillsPanel.classList.remove('hidden');
});
// Fechar Painéis (Recrutar ou Habilidades)
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
    const enemyCard = event.target.closest('.enemy-card');
    
    if (enemyCard) {
        // 1. Pega o ID do card do inimigo
        const enemyId = parseInt(enemyCard.dataset.id, 10);
        
        // 2. Encontra o objeto 'enemy' no array 'enemyTeam'
        const enemy = enemyTeam.find(e => e.id === enemyId);

        // 3. Se encontrou o inimigo, preenche o tooltip com seus dados
        if (enemy) {
            document.getElementById('tooltip-name').textContent = enemy.name;
            document.getElementById('tooltip-desc').textContent = enemy.description; 
            document.getElementById('tooltip-hp').textContent = `${enemy.currentHP}/${enemy.stats.hp}`;
            document.getElementById('tooltip-atk').textContent = enemy.stats.damage;
            
            // Posiciona e mostra o tooltip
            enemyTooltip.classList.remove('hidden');
            enemyTooltip.style.left = `${event.pageX + 10}px`;
            enemyTooltip.style.top = `${event.pageY + 10}px`;
        }
    }
});

// Esconde o tooltip quando o mouse sai da área do inimigo
enemyArea.addEventListener('mouseout', (event) => {
    if (event.target.closest('.enemy-card')) {
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
    const levelUpButton = event.target.closest('.level-up-icon');
    
    if (levelUpButton) {
        const parentCard = levelUpButton.closest('.team-member-portrait');
        const charId = parseInt(parentCard.dataset.id, 10);
        const character = window.team.find(c => c.id === charId);
        
        if (character) {
            openLevelUpModal(character);
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