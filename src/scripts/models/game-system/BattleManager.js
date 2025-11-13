function BattleManager(){

}
BattleManager.prototype.processActions = async function(){
    const turnDelay = window.turnCombatTime;
    startBattleButton.disabled = true;

    for (const character of window.combatOrder) {
            refreshAllUI();

            if (character.currentHP <= 0) {
                continue;
            }
            if (character instanceof PCharacter) {
                await BATTLE_MANAGER.processAllyActions(character);
            
            }else if (character instanceof Enemy){
                await ENEMY_AI.processEnemyAI(character);
        }
        await wait(turnDelay);
    }
    
        const alivePlayers = window.team.filter(char => char.currentHP > 0);
    if (alivePlayers.length === 0) {
        console.log("GAME OVER");
        //tela de Game Over
        return;
    }

    const aliveEnemies = window.enemyTeam.filter(enemy => enemy.currentHP > 0);
    if (aliveEnemies.length === 0) {
        checkPhaseEnd(); 
    } else {
        endRound();
    }
}

BattleManager.prototype.processAllyActions = function(character){

    return new Promise((resolve) => {
    const actions = window.playerActions;
    const charActions = actions[character.id];

    if (!charActions || charActions.type === 'rest') {
        const hpBefore = character.currentHP;
        const manaBefore = character.currentMana;
        
        character.rest();

        const hpGained = character.currentHP - hpBefore;
        const manaGained = character.currentMana - manaBefore;

        const card = playerArea.querySelector(`.player-card[data-id="${character.id}"]`);
        if (card) {
            if (hpGained > 0) {
                showCombatText(card, `+${hpGained}`, 'heal');
            }
            if (manaGained > 0) {
                setTimeout(() => {
                    showCombatText(card, `+${manaGained}`, 'mana');
                }, 500);
            }
        }
        resolve();
        return;
    }else if(charActions.type === 'melee'){

        const targetId = Number.parseInt(charActions.targetId);
        const target = window.combatOrder.find(enemy => enemy.id == targetId);
        if (!target){
            resolve();
            return;
        } 

        const attackerCard = playerArea.querySelector(`.player-card[data-id="${character.id}"]`);
        const targetCard = enemyArea.querySelector(`.enemy-card[data-id="${target.id}"]`);
        
        playAnimation(attackerCard, 'is-attacking-melee', 500);

        setTimeout(() => {
            const attackResult = character.meleeAttack(target);
            
            animate(attackResult, targetCard);
            if (attackResult.didKill) {
                character.gainExperience(target.xpGiven);

                playDeathAnimation(targetCard, () => {
                removeEnemyFromSquad(target);
            });
        }
            resolve();
        }, 250);
        return;
    }
    else if(charActions.type === 'skill'){
        const targetId = Number.parseInt(charActions.targetId);
        const target = window.combatOrder.find(c => c.id == targetId);
        if (!target){
            resolve();
            return;
        } 
        const skillId = charActions.skillId;
        const skillToUse = character.skills.find(s => s.id == skillId);

        const attackerCard = playerArea.querySelector(`.player-card[data-id="${character.id}"]`);
        const targetCard = enemyArea.querySelector(`.enemy-card[data-id="${target.id}"]`);

        playAnimation(attackerCard, 'is-casting', 500); 
        
        if (skillToUse.effectToApply) {
            const effect = skillToUse.effectToApply;
            const targetCard = playerArea.querySelector(`.player-card[data-id="${target.id}"]`) ||
            enemyArea.querySelector(`.enemy-card[data-id="${target.id}"]`);

            skillToUse.useSkill(character, target);
                
            showCombatText(targetCard, effect.name, effect.effectType);

        }else if (skillToUse) {
            enemyArea.querySelector(`.enemy-card[data-id="${target.id}"]`);

            const skillResult = skillToUse.useSkill(character, target);

            if (skillResult) {
                if (skillResult.type === 'damage') {
                    // dano
                    showCombatText(targetCard, skillResult.amount, 'damage');
                    playAnimation(targetCard, 'is-taking-damage', 300);
                } 
                else if (skillResult.type === 'heal') {
                    // cura
                    showCombatText(targetCard, skillResult.amount, 'heal');
                }
                else if (skillResult.type === 'effect') {
                    // aplicou efeito
                    showCombatText(targetCard, skillResult.effect.name, skillResult.effect.effectType);
                    resolve();
                }
            }
            refreshAllUI();
        } else{
            console.error(`[BATTLE-MANAGER] Erro: Personagem não tem habilidade com SkillId: ${skillId}`);
        }
        resolve();
    }
    });
}

BattleManager.prototype.processAllEffects= function(){
    const allCombatants = [...window.team, ...window.enemyTeam];

    allCombatants.forEach(character => {
        const combatantCard = playerArea.querySelector(`.player-card[data-id="${character.id}"]`) || enemyArea.querySelector(`.enemy-card[data-id="${character.id}"]`);

        for (let i = character.effects.length - 1; i >= 0; i--) {
            const effect = character.effects[i];
            const hpBefore = character.currentHP;
            
            effect.onTick(character);
            
            effect.duration--;

            const hpAfter = character.currentHP;
            const hpChange = hpAfter - hpBefore;

            if (combatantCard) {
                if (hpChange > 0) { // ganhou vida 
                    showCombatText(combatantCard, `+${hpChange}`, 'heal');
                } else if (hpChange < 0) { // perdeu vida
                    showCombatText(combatantCard, hpChange, 'damage');
                }
            }
            
            if (effect.duration <= 0) {
                
                if (typeof effect.onRemove === 'function') {
                    effect.onRemove(character);
                }
                
                character.effects.splice(i, 1);
            }
        }
    });
}

const BATTLE_MANAGER = new BattleManager();