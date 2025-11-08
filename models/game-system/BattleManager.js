function BattleManager(){

}
BattleManager.prototype.processActions = function(){
    for (const character of window.combatOrder) {
        if (character instanceof PCharacter) {
            
            BATTLE_MANAGER.processAllyActions(character);

        } else if (character instanceof Enemy){
            // Processa a ação da IA do inimigo
            // ex: processEnemyAI(character);
        }
    }
}

BattleManager.prototype.processAllyActions = function(character){
    const actions = window.playerActions;
    const charActions = actions[character.id];
    
    if(!charActions) return;

    if (charActions.type === 'rest') {
        console.log(character.name + ' foi ninar');
        
        //logica de descanso
        return; 
    }
    if(charActions.type === 'melee'){

        const targetId = Number.parseInt(charActions.targetId);
        const target = window.combatOrder.find(enemy => enemy.id == targetId);
        
        if(target)character.meleeAttack(target);
        console.log(target);
        
        
    }
    
}

BATTLE_MANAGER = new BattleManager();