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
    }
    endRound();
}

BattleManager.prototype.processAllyActions = function(character){
    const actions = window.playerActions;
    const charActions = actions[character.id];

    if (!charActions || charActions.type === 'rest') {        
        character.rest();
    }
    else if(charActions.type === 'melee'){

        const targetId = Number.parseInt(charActions.targetId);
        const target = window.combatOrder.find(enemy => enemy.id == targetId);

        if(target)character.meleeAttack(target);

    }else if(charActions.type === 'skill'){
        //logica skill
    }
    
}

BattleManager.prototype.processAllEffects= function(){
    const allCombatants = [...window.team, ...window.enemyTeam];

    allCombatants.forEach(character => {
        for (let i = character.effects.length - 1; i >= 0; i--) {
            const effect = character.effects[i];
            
            effect.onTick(character);
            
            effect.duration--;
            
            if (effect.duration <= 0) {
                
                if (typeof effect.onRemove === 'function') {
                    effect.onRemove(character);
                }
                
                character.effects.splice(i, 1);
            }
        }
    });
}

BATTLE_MANAGER = new BattleManager();