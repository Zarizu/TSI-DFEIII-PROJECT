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
    window.combatOrder = calculateCombatOrder();
    drawTurnOrder();
    
    if (startBattleButton.disabled) return;
    document.body.classList.add('battle-in-progress');
    window.turnCombatTime = 4000 / window.combatOrder.length;
    BATTLE_MANAGER.processActions();
}

function checkPhaseEnd() {
    phaseNumber.textContent = GAME_MANAGER.passPhase();
    
    refreshAllUI(); 

    roundNumber.textContent = `${GAME_MANAGER.resetRound()} : Preparação`;


    setTimeout(() => {
        const phase = GAME_MANAGER.getPhase();
            REWARD_MANAGER.showRewards();
            endRoundCleanup(); 
            if (phase % 5 === 0) {
            SHOP_MANAGER.generateShop().then(() => {
                drawShop();
            });
        }

        }, 500);

    setTimeout(() => {
        
        document.body.classList.remove('battle-in-progress');
        
        }, 1000);
}

//funcoes auxiliares
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function calculateCombatOrder() {
    const allCombatants = [...window.team, ...window.enemyTeam];

    allCombatants.sort((a, b) => {
        return b.stats.initiative - a.stats.initiative;
    });

    return allCombatants;
    
}

function endRound(passRound = true) {

    BATTLE_MANAGER.processAllEffects();

    refreshAllUI(); 

    if(passRound){roundNumber.textContent = GAME_MANAGER.passRound()};
    

    endRoundCleanup();
    checkShopAvailability();
    drawRoster();
    document.body.classList.remove('battle-in-progress');
}

function endRoundCleanup() {
    
    window.playerActions = {};
    
    playerArea.querySelectorAll('.action-icon').forEach(icon => {
        icon.classList.remove('selected');
        icon.classList.remove('action-defined'); 
        icon.style.pointerEvents = 'auto'; 
    });
    
    document.querySelectorAll('.is-being-targeted').forEach(card => {
        card.classList.remove('is-being-targeted');
    });
    
    checkBattleReady();
}

//squad
function addCharToSquad(character) {
    if(character instanceof PCharacter === false)return;
    if(window.team.includes(character)){
        console.warn(`Já existe no time! Não há necessidade de adicionar ${character.name}.`);
        return;
    }
    if (window.team.length >= 6) {
        console.warn(`Time cheio! Não foi possível adicionar ${character.name}.`);
        return;
    }
    window.team.push(character);
    
    // Chama as funções de desenho
    updateSquad(character);
}

function removeCharfromSquad(character) {
    if(character instanceof PCharacter === false)return;
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

function addEnemyFromSquad(enemy) {
    if(enemy instanceof Enemy === false) return;
    if(window.enemyTeam.includes(enemy)){
        console.warn(`Já existe no time! Não há necessidade de adicionar ${enemy.name}.`);
        return;
    }
    if (window.enemyTeam.length >= 8) {
        console.warn(`Time cheio! Não foi possível adicionar ${enemy.name}.`);
        return;
    }
    window.enemyTeam.push(enemy);
    
    updateEnemySquad(enemy);
}

function removeEnemyFromSquad(enemy) {
    if(enemy instanceof Enemy === false) return;
    if (!window.enemyTeam.includes(enemy)) {
        console.warn(`Não existe no time! Não há como remover ${enemy.name}.`);
        return;
    }

    window.enemyTeam = window.enemyTeam.filter(member => member.id !== enemy.id);

    const enemyCard = enemyArea.querySelector(`.enemy-card[data-id="${enemy.id}"]`);
    if (enemyCard) {
        enemyCard.remove();
    }
}

async function spawnNewEnemies() {
    window.enemyTeam = [];
    enemyArea.innerHTML = ''; 

    const enemyCount = ENEMY_GENERATOR.calculateNumberOfEnemies(); 

    console.log(`Fase ${GAME_MANAGER.getPhase()}. Spawning ${enemyCount} inimigos...`);

    for (let i = 0; i < enemyCount; i++) {
        
        const newEnemy = await ENEMY_GENERATOR.generateEnemy();
        
        addEnemyFromSquad(newEnemy);
    }
}

// valida avatar unico
async function getUniqueAvatar() {
    let finalAvatarObj = null;
    let attempts = 0;
    const MAX_ATTEMPTS = 5;

    // Coleta TODAS as URLs (strings) usadas no momento para comparação
    const usedUrlSet = new Set();

    const addToSet = (list) => {
        if (!list || !Array.isArray(list)) return;
        
        list.forEach(char => {
            // Verifica se o personagem tem avatar e extrai a URL 'large' para comparação
            if (char.avatar) {
                // Se for objeto { large: '...' }
                if (char.avatar.large) usedUrlSet.add(char.avatar.large);
                // Se for string direta 'http...'
                else if (typeof char.avatar === 'string') usedUrlSet.add(char.avatar);
            }
        });
    };

    // Popula a lista de proibidos
    addToSet(window.team);
    addToSet(window.enemyTeam);
    if (typeof SHOP_MANAGER !== 'undefined' && SHOP_MANAGER.shopInventory) {
        addToSet(SHOP_MANAGER.shopInventory);
    }

    // Loop de Tentativa e Erro
    while (finalAvatarObj === null && attempts < MAX_ATTEMPTS) {
        attempts++;
        try {

            // O ConnectionAPI original retorna o objeto do usuário inteiro
            const data = await APIConn.getAvatar().call(); 
            
            // Normaliza em um único objeto (caso venha array)
            const resultObj = Array.isArray(data) ? data[0] : data;

            if (resultObj && resultObj.picture) {
                const candidateUrl = resultObj.picture.large;

                if (!usedUrlSet.has(candidateUrl)) {
                    // É único, Sucesso.
                    finalAvatarObj = resultObj.picture; 
                } else {
                    console.warn(`[Avatar] Repetido encontrado (Tentativa ${attempts}). Buscando outro...`);
                }
            }
        } catch (error) {
            console.warn(`[Avatar] Erro na API (Tentativa ${attempts}).`, error);
        }
    }

    // Fallback (Se falhar 5x ou a internet cair)
    if (!finalAvatarObj) {
        console.error("[Avatar] Falha total. Usando placeholder.");
        finalAvatarObj = {
            large: "../styles/img/avatar-placeholder.jpg",
            medium: "../styles/img/avatar-placeholder.jpg",
            thumbnail: "../styles/img/avatar-placeholder.jpg"
        };
    }

    return finalAvatarObj;
}