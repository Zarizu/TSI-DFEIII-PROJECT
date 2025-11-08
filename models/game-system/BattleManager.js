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
    if(){
        
    }
}

BATTLE_MANAGER = new BattleManager();