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
        // GAME OVER
    if (alivePlayers.length === 0) {

        await wait(500);
        triggerGameOver();
        return;
    }

    //se inimigos estao derrotados, comeca outra fase
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
                }else{
                    showCombatText(card, `+${0}`, 'heal');
                }
                if (manaGained > 0) {
                    setTimeout(() => {
                        showCombatText(card, `+${manaGained}`, 'mana');
                    }, 500);
                }else{
                    setTimeout(() => {
                        showCombatText(card, `+${0}`, 'mana');
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
                    PLAYER_MANAGER.addGold(target.goldGiven);
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
                            PLAYER_MANAGER.addGold(target.goldGiven);
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
                }else{
                    //colocar de forma visual
                    console.log('sem mana');
                }
                
                resolve();
            }, 500);
        }
    });
}

BattleManager.prototype.processAllEffects = function() {
    // Processa efeitos do time do jogador
    this._processGroupEffects(window.team);

    // Processa efeitos do time inimigo
    this._processGroupEffects(window.enemyTeam);

    const alivePlayers = window.team.filter(char => char.currentHP > 0);
    if (alivePlayers.length === 0) {

        triggerGameOver();
        return;
    }

    const aliveEnemies = window.enemyTeam.filter(enemy => enemy.currentHP > 0);
    if (aliveEnemies.length === 0) {
        checkPhaseEnd(); 
    } else {
        endRound(true,false);
    }
};

BattleManager.prototype._processGroupEffects = function(group) {
    group.forEach(character => {
        // Se já morreu, ignora
        if (character.currentHP <= 0) return;

        // Encontra o card visual correspondente (tenta nos dois containers para garantir)
        const combatantCard = playerArea.querySelector(`.player-card[data-id="${character.id}"]`) || 
        enemyArea.querySelector(`.enemy-card[data-id="${character.id}"]`);

        // Itera sobre os efeitos de trás para frente (seguro para remoção com splice)
        for (let i = character.effects.length - 1; i >= 0; i--) {
            const effect = character.effects[i];
            const hpBefore = character.currentHP;
            
            //  Encontrar o Caster (Quem jogou o efeito)
            const caster = window.team.find(c => c.id === effect.casterId) || 
            window.enemyTeam.find(c => c.id === effect.casterId);

            // Agora passamos (caster, target)
            if (typeof effect.onTick === 'function') {
                effect.onTick(caster, character);
            }
            
            // Feedback Visual (Dano/Cura)
            const hpAfter = character.currentHP;
            const hpChange = hpAfter - hpBefore;

            if (combatantCard) {
                if (hpChange > 0) { 
                    showCombatText(combatantCard, `+${hpChange}`, 'heal');
                } else if (hpChange < 0) { 
                    showCombatText(combatantCard, hpChange, 'damage');
                }
            }
            
            //  Verificação de Morte por Efeito 
            if (character.currentHP <= 0 && hpBefore > 0) {
                console.log(`[Efeito] ${character.name} foi morto por ${effect.name}!`);
                
                // Recompensas (XP e Ouro)
                // Só dá recompensa se quem matou foi um PCharacter (Aliado)
                if (caster && caster instanceof PCharacter) {
                    if (character.xpGiven) {
                        caster.gainExperience(character.xpGiven);
                    }
                    if (character.goldGiven && typeof PLAYER_MANAGER !== 'undefined') {
                        PLAYER_MANAGER.addGold(character.goldGiven);
                    }
                }
                
                // Animação e Remoção
                playDeathAnimation(combatantCard, () => {
                    if (character instanceof PCharacter) {
                        removeCharfromSquad(character);
                    } else {
                        removeEnemyFromSquad(character);
                        // Se quiser checar fim de fase aqui também, pode chamar checkPhaseEnd()
                    }
                });

                // Se morreu, para de processar outros efeitos neste personagem
                break; 
            }

            // --- 5. Controle de Duração ---
            effect.duration--;
            if (effect.duration <= 0) {
                if (typeof effect.onRemove === 'function') {
                    // Passa o caster no onRemove também, caso precise remover buffs dependentes de status
                    effect.onRemove(caster, character);
                }
                character.effects.splice(i, 1);
            }
        }
    });
};

const BATTLE_MANAGER = new BattleManager();