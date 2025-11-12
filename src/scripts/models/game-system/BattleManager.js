function BattleManager(){

}
BattleManager.prototype.processActions = async function(){

    const turnDelay = window.turnCombatTime;
    startBattleButton.disabled = true;

    for (const character of window.combatOrder) {
            refreshAllUI();
            if (character instanceof PCharacter) {
            
            BATTLE_MANAGER.processAllyActions(character);
            
            }else if (character instanceof Enemy){
                ENEMY_AI.processEnemyAI(character);
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
        if (!target) return;

        const attackerCard = playerArea.querySelector(`.player-card[data-id="${character.id}"]`);
        const targetCard = enemyArea.querySelector(`.enemy-card[data-id="${target.id}"]`);
        
        playAnimation(attackerCard, 'is-attacking-melee', 500);

        setTimeout(() => {
            const attackResult = character.meleeAttack(target);
            
            animate(attackResult, targetCard);

        }, 250);
    }
    else if(charActions.type === 'skill'){
        const targetId = Number.parseInt(charActions.targetId);
        const target = window.combatOrder.find(c => c.id == targetId);
        if (!target) return;

        const skillId = charActions.skillId;
        const skillToUse = character.skills.find(s => s.id == skillId);

        //placeholder, animar de acordo com habilidade
        if (!target) return;

        const attackerCard = playerArea.querySelector(`.player-card[data-id="${character.id}"]`);
        const targetCard = enemyArea.querySelector(`.enemy-card[data-id="${target.id}"]`);
        
        playAnimation(attackerCard, 'is-attacking-melee', 500);

        setTimeout(() => {
            const attackResult = character.meleeAttack(target);
            
            animate(attackResult, targetCard);

        }, 250);
        //add animacao para skill
        if (skillToUse) {
            skillToUse.useSkill(character, target);
        } else {
            console.error(`[BATTLE-MANAGER] Erro: Personagem não tem habilidade com SkillId: ${skillId}`);
        }
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