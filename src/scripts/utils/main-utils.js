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

function triggerGameOver() {
    // Pega a fase atual
    const currentPhase = GAME_MANAGER.getPhase();
    
    // Pega o recorde salvo (ou 0 se não existir)
    const savedRecord = parseInt(localStorage.getItem('rogue_best_phase') || '0', 10);
    
    const phaseText = document.getElementById('go-current-phase');
    const recordDisplay = document.getElementById('go-record-display');
    const modal = document.getElementById('game-over-modal');

    // Atualiza texto da fase atual
    phaseText.textContent = `Fase ${currentPhase}`;

    //Lógica de Recorde
    if (currentPhase > savedRecord) {
        //É UM NOVO RECORDE
        localStorage.setItem('rogue_best_phase', currentPhase.toString());
        
        // Mostra a comparação (Antigo vs Novo)
        recordDisplay.className = 'game-over-record new-record-anim';
        recordDisplay.innerHTML = `
            <div class="record-comparison">
                <div class="old-record-text">Recorde Anterior: Fase ${savedRecord}</div>
                <div class="new-record-text">🏆 NOVO RECORDE! 🏆</div>
            </div>
        `;
    } else {
        // NÃO BATEU O RECORDE
        recordDisplay.textContent = `Melhor Recorde: Fase ${savedRecord}`;
        recordDisplay.className = 'game-over-record'; // Estilo normal
    }

    // Destrava a interface
    document.body.classList.remove('battle-in-progress');

    // Mostra o Modal
    modal.classList.remove('hidden');
}

document.getElementById('restart-game-btn').addEventListener('click', () => {

    // Limpa os dados da run atual (exceto o recorde)
    localStorage.removeItem('FirstCharData');
    localStorage.removeItem(ID_COUNTER_KEY_CHARACTER);
    localStorage.removeItem(ID_COUNTER_KEY_EFFECT);
    localStorage.removeItem(ID_COUNTER_KEY_SKILL);
    localStorage.removeItem(ID_COUNTER_KEY_VOCATION_SKILL);
    
    window.location.href = './char_creation.html';
});

function openSpecialUpgradeModal(character) {
    const modal = document.getElementById('special-upgrade-modal');
    const container = document.getElementById('upgrade-options-container');
    container.innerHTML = ''; // Limpa opções anteriores

    //  Gera 3 Opções Aleatórias
    const options = [];
    
    for (let i = 0; i < 3; i++) {
        // 50% de chance de ser Skill, 50% de Atributo
        // (Se não tiver skills disponíveis no banco de dados, força atributo)
        const trySkill = Math.random() > 0.5;
        
        if (trySkill) {
            const skillUpgrade = generateSkillUpgrade(character);
            // Se retornou null (personagem já tem todas as skills), gera atributo
            options.push(skillUpgrade || generateAttributeUpgrade(character));
        } else {
            options.push(generateAttributeUpgrade(character));
        }
    }

    // Renderiza as Cartas
    options.forEach((opt) => {
        const card = document.createElement('div');
        card.className = `upgrade-card type-${opt.type}`;
        
        // Ícone visual baseado no tipo
        let iconHtml = opt.type === 'stat' ? '💪' : '📜';
        if (opt.key === 'int') iconHtml = '🧠';
        if (opt.key === 'agi') iconHtml = '💨';
        
        card.innerHTML = `
            <div class="upgrade-icon">${iconHtml}</div>
            <div class="upgrade-info">
                <span class="upgrade-type">${opt.type === 'stat' ? 'Atributo' : 'Nova Habilidade'}</span>
                <div class="upgrade-title">${opt.title}</div>
                <div class="upgrade-desc">${opt.description}</div>
            </div>
        `;

        // Clique na Opção
        card.addEventListener('click', () => {
            applySpecialUpgrade(character, opt);
            modal.classList.add('hidden');
            
            // Após escolher o especial, se ainda tiver pontos normais, abre o modal normal
            if (character.unspentAttributePoints > 0) {
                setTimeout(() => openLevelUpModal(character), 300);
            } else {
                refreshAllUI();
            }
        });

        container.appendChild(card);
    });

    modal.classList.remove('hidden');
}

// Gera Upgrade de Atributo (+2 ou +3)
function generateAttributeUpgrade(char) {
    const attrs = ['str', 'con', 'agi', 'int', 'wis'];
    const labels = { str: 'Força', con: 'Constituição', agi: 'Agilidade', int: 'Inteligência', wis: 'Sabedoria' };
    
    const key = attrs[Math.floor(Math.random() * attrs.length)];
    const amount = Math.floor(Math.random() * 2) + 2; // +2 ou +3

    return {
        type: 'stat',
        key: key,
        amount: amount,
        title: `+${amount} ${labels[key]}`,
        description: `Aumenta permanentemente seu atributo base.`
    };
}

// Gera Upgrade de Skill (Busca no SKILLS)

function generateSkillUpgrade(char) {

    const allSkillKeys = Object.keys(SKILLS); 
    
    const availableKeys = allSkillKeys.filter(k => {
        const skillObj = SKILLS[k];
        // Verifica se o ID da skill já existe no array char.skills
        // (Nota: certifique-se que suas skills no char tenham a propriedade .id ou .templateId para comparar)
        return !char.skills.some(s => s.name === skillObj.name); 
    });

    if (availableKeys.length === 0) return generateAttributeUpgrade(char);

    const randomKey = availableKeys[Math.floor(Math.random() * availableKeys.length)];
    const skillTemplate = SKILLS[randomKey];
    
    // Retorna o objeto formatado para o card de upgrade
    return {
        type: 'skill',           
        skillData: skillTemplate,
        title: skillTemplate.name,
        description: skillTemplate.description,
        icon: skillTemplate.icon || '📜' 
    };
}

function applySpecialUpgrade(char, opt) {
    if (opt.type === 'stat') {
        // Lógica de Atributo...
        char.attributes[opt.key] += opt.amount;
        if(opt.key === 'con') char.currentHP += (opt.amount * 5); 
        char.recalculateAll();
        console.log(`[UPGRADE] +${opt.amount} em ${opt.key}`);
    } 
    else if (opt.type === 'skill') {
        
        // O método estático resolve qual classe instanciar e gera o ID único
        const newSkillInstance = Skill.prototype.create(opt.skillData);
        
        if (newSkillInstance) {
            char.skills.push(newSkillInstance);
            console.log(`[UPGRADE] Nova habilidade: ${newSkillInstance.name} (ID: ${newSkillInstance.id})`);
        }
    }

    char.lastSpecialUpgradeLevel += 5; 
}