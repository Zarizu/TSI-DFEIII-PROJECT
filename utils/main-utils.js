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
    if (startBattleButton.disabled) return;

    console.log("Batalha Iniciada! Ações:", playerActions);
    
    // --- LÓGICA DO JOGO (FUTURO) ---
    //chamaria a lógica de processar as 'playerActions'
    //chamaria a IA para as ações inimigas
    //atualizaria o 'team' (HP, mana, efeitos)
    //chamaria a 'refreshAllUI()' para redesenhar tudo
    //

    // sistema de round
    roundNumber.textContent = GAME_MANAGER.passRound();
    
    // Limpa as ações para o próximo round
    window.playerActions = {};
    playerArea.querySelectorAll('.action-icon').forEach(icon => {
        icon.classList.remove('selected');
        icon.classList.remove('action-defined'); 
    });

    // Desabilita o botão novamente
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

function addEnemyToSquad(enemy) {
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