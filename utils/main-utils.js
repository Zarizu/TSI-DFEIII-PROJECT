//logica e sistemas

function checkBattleReady() {
    const actionsSet = Object.keys(playerActions).length;
    const teamSize = team.length;
    
    // Só permite começar se o time tiver membros
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
    roundNumberSpan.textContent = GAME_MANAGER.passRound();
    
    // Limpa as ações para o próximo round
    playerActions = {};
    playerArea.querySelectorAll('.action-icon').forEach(icon => {
        icon.classList.remove('selected');
    });

    // Desabilita o botão novamente
    checkBattleReady();
}
