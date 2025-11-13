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
    window.turnCombatTime = 4000 / window.combatOrder.length;
    BATTLE_MANAGER.processActions();
}

function checkPhaseEnd() {
    console.log("%c--- FASE CONCLUÍDA! ---", "color: #ffd700; font-size: 1.2em;");
    
    phaseNumber.textContent = GAME_MANAGER.passPhase();
    
    refreshAllUI(); 

    roundNumber.textContent = GAME_MANAGER.resetRound();
    
    spawnNewEnemies();

    endRoundCleanup();
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
    console.log("--- Fim do Round ---");

    BATTLE_MANAGER.processAllEffects();

    refreshAllUI(); 

    roundNumber.textContent = GAME_MANAGER.passRound();

    endRoundCleanup();
}

function endRoundCleanup() {
    
    window.playerActions = {};
    
    playerArea.querySelectorAll('.action-icon').forEach(icon => {
        icon.classList.remove('selected');
        icon.classList.remove('action-defined'); 
        icon.style.pointerEvents = 'auto'; 
    });
    
    document.querySelectorAll('.is-being-targeted').forEach(card => {
        card.classList.remove('is-being-targeted');
    });
    
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

function spawnNewEnemies() {
    window.enemyTeam = [];

    enemyArea.innerHTML = '';

    const currentPhase = GAME_MANAGER.getPhase(); 

    const phaseData = PHASE_ENCOUNTERS[currentPhase];

    if (!phaseData) {
        console.log("VOCÊ VENCEU! Não há mais fases.");
        return;
    }

    const spawnCount = phaseData.spawnCount;
    const poolKeys = phaseData.pool;

    console.log(`Iniciando Fase ${currentPhase}. Spawning ${spawnCount} inimigos...`);

    for (let i = 0; i < spawnCount; i++) {
        const randomKey = poolKeys[Math.floor(Math.random() * poolKeys.length)];
        
        const enemyMold = ENEMIES_MOLDS[randomKey];

        const newEnemy = new Enemy(
            enemyMold.name,
            [enemyMold.attributes.str, enemyMold.attributes.con, enemyMold.attributes.agi, enemyMold.attributes.int, enemyMold.attributes.wis],
            enemyMold.lvl,
            enemyMold.tier,
            enemyMold.description
        );
        
        newEnemy.skills = [...enemyMold.skills];
        
        addEnemyFromSquad(newEnemy);
    }
}
