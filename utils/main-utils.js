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
    window.combatTime = 500 /combatOrder.length;
    BATTLE_MANAGER.processActions();

    roundNumber.textContent = GAME_MANAGER.passRound();

    window.playerActions = {};

    removeActionsSelection();
    refreshAllUI();
    checkBattleReady();
}

//squad
function addCharToSquad(character) {
    if(team.includes(character)){
        console.warn(`Já existe no time! Não há necessidade de adicionar ${character.name}.`);
        return;
    }
    if (team.length >= 6) {
        console.warn(`Time cheio! Não foi possível adicionar ${character.name}.`);
        return;
    }
    team.push(character);
    
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
    if(enemyTeam.includes(enemy)){
        console.warn(`Já existe no time! Não há necessidade de adicionar ${enemy.name}.`);
        return;
    }
    if (enemyTeam.length >= 6) {
        console.warn(`Time cheio! Não foi possível adicionar ${enemy.name}.`);
        return;
    }
    enemyTeam.push(enemy);
    
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

//funcoes auxiliares
function calculateCombatOrder() {
    const allCombatants = [...window.team, ...window.enemyTeam];

    allCombatants.sort((a, b) => {
        return b.stats.initiative - a.stats.initiative;
    });

    return allCombatants;
    
}