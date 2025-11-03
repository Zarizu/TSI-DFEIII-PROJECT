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


//add menu lateral esquerdo
const MAX_TEAM_SIZE = 6;
for (let i = 0; i < MAX_TEAM_SIZE; i++) {
    const slot = document.createElement('div');
    
    slot.classList.add('team-member-portrait', 'empty-slot');

    slot.setAttribute('disabled', ''); 

    teamRoster.appendChild(slot);
}

//INTERATIVIDADE DOS MENUS

//botao de iniciar batalha
startBattleButton.addEventListener('click', executeRound);

playerArea.addEventListener('click', (event) => {
    
    if (BATTLE_MANAGER.isCurrentlyTargeting()) {
        
        if (BATTLE_MANAGER.skillTargetType === 'ally') {
            
            const clickedAllyCard = event.target.closest('.player-card');
            
            if (clickedAllyCard) {
                
                const allyId = clickedAllyCard.dataset.id;
                console.log(`[Main] Alvo aliado ${allyId} confirmado.`);
                
                
                BATTLE_MANAGER.confirmTarget(allyId); 
            } else {
                
                console.log("[Main] Mira cancelada (clique na área do time)");
                BATTLE_MANAGER.resetTargeting(true);
            }
        } else {
            
            console.log("[Main] Mira cancelada (clique na área do time)");
            BATTLE_MANAGER.resetTargeting(true);
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

    if (actionType === 'melee') {
        
        BATTLE_MANAGER.startTargeting(character.id, character.name, card, 'melee', 'enemy');

    } else if (actionType === 'skill') {
        // Inicia a mira (vamos simular cura em aliado)
        console.log(`Abrir modal de skills para ${character.name}`);
        BATTLE_MANAGER.startTargeting(character.id, character.name, card, 'skill', 'ally');

    } else if (actionType === 'rest') {
        console.log(`[Main] Personagem ${character.name} escolheu Descansar`);
        window.playerActions[characterId] = { type: 'rest' };
        
        clickedIcon.classList.add('action-defined');
        
        checkBattleReady();
    }
});

playerArea.addEventListener('mouseover', (event) => {
    if (BATTLE_MANAGER.isCurrentlyTargeting()) return;

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
    if (BATTLE_MANAGER.isCurrentlyTargeting()) return;

    document.querySelectorAll('.is-being-targeted').forEach(card => {
        card.classList.remove('is-being-targeted');
    });
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
    if (!BATTLE_MANAGER.isCurrentlyTargeting() || BATTLE_MANAGER.skillTargetType !== 'enemy') {
        return;
    }

    const enemyCard = event.target.closest('.enemy-card');
    if (enemyCard) {
        const enemyId = enemyCard.dataset.id;
        BATTLE_MANAGER.confirmTarget(enemyId);
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
            document.getElementById('tooltip-hp').textContent = `${enemy.currentStats.hp}/${enemy.stats.hp}`;
            document.getElementById('tooltip-atk').textContent = enemy.currentStats.damage;
            
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
    if (!BATTLE_MANAGER.isCurrentlyTargeting()) return;
    
    if (!event.target.closest('.enemy-card') && !event.target.closest('.player-card')) {
        console.log("[DEBUG] Mira cancelada (clique no fundo)");
        BATTLE_MANAGER.resetTargeting(true); 
    }
});

document.getElementById('battlefield').addEventListener('click', cancelTargetingHandler);
document.getElementById('blur-backdrop').addEventListener('click', cancelTargetingHandler);

function cancelTargetingHandler(event) {
    if (!BATTLE_MANAGER.isCurrentlyTargeting()) return;
    
    // Se o clique foi no fundo (NÃO em um inimigo ou card de jogador), cancele.
    if (!event.target.closest('.enemy-card') && !event.target.closest('.player-card')) {
        console.log("[Main] Mira cancelada (clique no fundo)");
        BATTLE_MANAGER.resetTargeting(true); 
    }
}