//logica e sistemas

function checkBattleReady() {
    const actionsSet = Object.keys(window.playerActions).length;
    const teamSize = window.team.length;
    
    if (teamSize > 0 && actionsSet === teamSize) {
        startBattleButton.disabled = false;
        startBattleButton.textContent = "Começar Batalha!";
    } else {
        startBattleButton.disabled = true;
        startBattleButton.textContent = `Selecione Ações (${actionsSet}/${teamSize})`;
    }
}

function executeRound() {
    window.combatOrder = calculateCombatOrder();
    drawTurnOrder();
    
    if (startBattleButton.disabled) return;
    window.turnCombatTime = 8000 / window.combatOrder.length;
    BATTLE_MANAGER.processActions();
}

//funcoes auxiliares
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function calculateCombatOrder() {
    const allCombatants = [...window.team, ...window.enemyTeam];

    allCombatants.sort((a, b) => {
        return b.stats.initiative - a.stats.initiative;
    });

    return allCombatants;
    
}

function endRound() {
    console.log('[endRound](LOG):Fim da rodada');
    
    BATTLE_MANAGER.processAllEffects();

    refreshAllUI();

    roundNumber.textContent = GAME_MANAGER.passRound();
    window.playerActions = {};
    
    playerArea.querySelectorAll('.action-icon').forEach(icon => {
        icon.classList.remove('selected');
        icon.classList.remove('action-defined'); 
        icon.style.pointerEvents = 'auto'; 
    });

    removeActionsSelection();
    checkBattleReady();
}
//squad
function addCharToSquad(character) {
    if(window.team.includes(character)){
        console.warn(`Já existe no time! Não há necessidade de adicionar ${character.name}.`);
        return;
    }
    if (window.team.length >= 6) {
        console.warn(`Time cheio! Não foi possível adicionar ${character.name}.`);
        return;
    }
    window.team.push(character);
    
    // Chama as funções de desenho
    updateSquad(character);
}

function removeCharfromSquad(character) {
    if (!window.team.includes(character)) {
        console.warn(`Não existe no time! Não há como remover ${character.name}.`);
        return;
    }
    if (window.team.length <= 1) {
        console.warn(`Esquadrão deve ter pelo menos 1. Não foi possível remover ${character.name}.`);
        return;
    }

    window.team = window.team.filter(member => member.id !== character.id);

    const crewCard = playerArea.querySelector(`.player-card[data-id="${character.id}"]`);
    if (crewCard) {
        crewCard.remove();
    }

    drawRoster();
}
//squad inimigo

function addEnemyFromSquad(enemy) {
    if(window.enemyTeam.includes(enemy)){
        console.warn(`Já existe no time! Não há necessidade de adicionar ${enemy.name}.`);
        return;
    }
    if (window.enemyTeam.length >= 6) {
        console.warn(`Time cheio! Não foi possível adicionar ${enemy.name}.`);
        return;
    }
    window.enemyTeam.push(enemy);
    
    // Chama as funções de desenho
    updateEnemySquad(enemy);
}

function removeEnemyFromSquad(enemy) {
    if (!window.enemyTeam.includes(enemy)) {
        console.warn(`Não existe no time! Não há como remover ${enemy.name}.`);
        return;
    }

    window.enemyTeam = window.enemyTeam.filter(member => member.id !== enemy.id);

    const enemyCard = enemyArea.querySelector(`.enemy-card[data-id="${enemy.id}"]`);
    if (enemyCard) {
        enemyCard.remove();
    }
}

