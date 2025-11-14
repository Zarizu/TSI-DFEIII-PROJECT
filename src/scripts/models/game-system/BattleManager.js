function BattleManager(){

}
BattleManager.prototype.processActions = async function(){
    const turnDelay = window.turnCombatTime;
    startBattleButton.disabled = true;

    for (const character of window.combatOrder) {            
            if (character.currentHP <= 0) {
                continue;
            }
            if (character instanceof PCharacter) {
                await BATTLE_MANAGER.processAllyActions(character);
            
            }else if (character instanceof Enemy){
                await ENEMY_AI.processEnemyAI(character);
        }
        refreshAllUI();
        await wait(turnDelay);
    }
    
        const alivePlayers = window.team.filter(char => char.currentHP > 0);
    if (alivePlayers.length === 0) {
        await wait(500);
        console.log("GAME OVER");
        localStorage.setItem(ID_COUNTER_KEY_CHARACTER,1);
        localStorage.setItem(ID_COUNTER_KEY_EFFECT,1);
        localStorage.setItem(ID_COUNTER_KEY_SKILL,1);

        //tela de Game Over
        return;
    }

    //se inimigos estao derrotados, comeca outra fase
    const aliveEnemies = window.enemyTeam.filter(enemy => enemy.currentHP > 0);
    if (aliveEnemies.length === 0) {
        await wait(500);
        endRound();
        checkPhaseEnd(); 
    } else {
        endRound();
    }
}

BattleManager.prototype.processAllyActions = function(character){

    return new Promise((resolve) => {
        const actions = window.playerActions;
        const charActions = actions[character.id];
        if(!charActions)return;

        if (charActions.type === 'rest') {
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
                console.warn(`[Melee] Alvo ${targetId} não encontrado.`);
                resolve();
                return;
            } 

            const attackerCard = playerArea.querySelector(`.player-card[data-id="${character.id}"]`);
            const targetCard = enemyArea.querySelector(`.enemy-card[data-id="${target.id}"]`);
            
            playAnimation(attackerCard, 'is-attacking-melee', 500);

            setTimeout(() => {
                const attackResult = character.meleeAttack(target);

                if (attackResult.didEvade) {
                    showCombatText(targetCard, "ESQUIVA!", "miss");
                    playAnimation(targetCard, 'is-taking-damage', 300);
                } else if (attackResult.isCritical) {
                    showCombatText(targetCard, `${attackResult.damage}!!`, "crit");
                    playAnimation(targetCard, 'is-taking-damage', 300);
                } else if (attackResult.damage > 0) {
                    showCombatText(targetCard, attackResult.damage, "damage");
                    playAnimation(targetCard, 'is-taking-damage', 300);
                }
                
                if (attackResult.didKill) {
                    character.gainExperience(target.xpGiven);
                    playDeathAnimation(targetCard, () => {
                        removeEnemyFromSquad(target);
                    });
                }

                resolve();
            }, 250);
            
        }else if(charActions.type === 'skill'){
            
            const targetId = Number.parseInt(charActions.targetId);
            const target = window.combatOrder.find(c => c.id == targetId);
            if (!target){
                console.warn(`[Skill] Alvo ${targetId} não encontrado.`);
                resolve();
                return;
            } 
            
            const skillId = charActions.skillId;
            const skillToUse = character.skills.find(s => s.id == skillId);
            
            if (!skillToUse) {
                console.error(`[BATTLE-MANAGER] Erro: SkillId: ${skillId} não encontrada.`);
                resolve();
                return;
            }

            const attackerCard = playerArea.querySelector(`.player-card[data-id="${character.id}"]`);
            const targetCard = playerArea.querySelector(`.player-card[data-id="${target.id}"]`) ||
                            enemyArea.querySelector(`.enemy-card[data-id="${target.id}"]`);

            playAnimation(attackerCard, 'is-casting', 500); 
            
            setTimeout(() => {
                const skillResult = skillToUse.useSkill(character, target);

                if (skillResult) {
                    if (skillResult.type === 'damage') {
                        showCombatText(targetCard, skillResult.amount, 'damage');
                        playAnimation(targetCard, 'is-taking-damage', 300);
                        if (skillResult.didKill) {
                            character.gainExperience(target.xpGiven);
                            playDeathAnimation(targetCard, () => {
                                removeEnemyFromSquad(target);
                            });
                        }
                    } 
                    else if (skillResult.type === 'heal') {
                        showCombatText(targetCard, `+${skillResult.amount}`, 'heal');
                    }
                    else if (skillResult.type === 'effect') {
                        showCombatText(targetCard, skillResult.effect.name, skillResult.effect.effectType);
                    }
                }
                
                resolve();
            }, 500);
        }
    });
}

BattleManager.prototype.processAllEffects = function(){
    const allCombatants = [...window.team, ...window.enemyTeam];

    allCombatants.forEach(character => {
        if (character.currentHP <= 0) return;

        const combatantCard = playerArea.querySelector(`.player-card[data-id="${character.id}"]`) || 
                            enemyArea.querySelector(`.enemy-card[data-id="${character.id}"]`);

        for (let i = character.effects.length - 1; i >= 0; i--) {
            const effect = character.effects[i];
            const hpBefore = character.currentHP;
            
            effect.onTick(null,character);
            
            const hpAfter = character.currentHP;
            const hpChange = hpAfter - hpBefore;

            if (combatantCard) {
                if (hpChange > 0) { // ganhou vida 
                    showCombatText(combatantCard, `+${hpChange}`, 'heal');
                } else if (hpChange < 0) { // perdeu vida
                    showCombatText(combatantCard, hpChange, 'damage');
                }
            }
            
            if (character.currentHP <= 0 && hpBefore > 0) {
                console.log(`[Efeito] ${character.name} foi morto por ${effect.name}!`);
                
                const caster = window.team.find(c => c.id === effect.casterId);
                
                if (caster && caster instanceof PCharacter && character.xpGiven) {
                    caster.gainExperience(character.xpGiven);
                    console.log(`%c[XP] ${caster.name} ganhou ${character.xpGiven} XP por matar ${character.name}!`, "color: yellow;");
                }
                
                playDeathAnimation(combatantCard, () => {
                    if (character instanceof PCharacter) {
                        removeCharfromSquad(character);
                    } else {
                        removeEnemyFromSquad(character);
                    }
                });

                break; 
            }

            effect.duration--;
            if (effect.duration <= 0) {
                if (typeof effect.onRemove === 'function') {
                    effect.onRemove(null,character);
                }
                character.effects.splice(i, 1);
            }
        }
    });
}

const BATTLE_MANAGER = new BattleManager();