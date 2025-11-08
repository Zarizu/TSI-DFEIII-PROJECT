function BattleManager(){

}
BattleManager.prototype.processActions = async function(){

    const turnDelay = window.turnCombatTime;

    startBattleButton.disabled = true;

    for (const character of window.combatOrder) {
            if (character instanceof PCharacter) {
            
            BATTLE_MANAGER.processAllyActions(character);
            
            }else if (character instanceof Enemy){
            // Processa a ação da IA do inimigo
            // ex: processEnemyAI(character);
        }

        await wait(turnDelay);
        refreshAllUI();
    }
    endRound();
}

BattleManager.prototype.processAllyActions = function(character){
    const actions = window.playerActions;
    const charActions = actions[character.id];
    
    if(!charActions) return;

    if (charActions.type === 'rest') {        
        //logica de descanso
        return; 
    }
    else if(charActions.type === 'melee'){

        const targetId = Number.parseInt(charActions.targetId);
        const target = window.combatOrder.find(enemy => enemy.id == targetId);

        if(target)character.meleeAttack(target);

    }else if(charActions.type === 'skill'){
        //logica skill
    }
    
}

BATTLE_MANAGER = new BattleManager();