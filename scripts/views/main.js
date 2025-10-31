const inimgo = new Enemy('Xuxo',{atk: 2,con: 3,int:1});
// Painel Esquerdo
const teamRoster = document.getElementById('team-roster');
const skillsIcon = document.getElementById('skills-icon');
const teamPanelTitle = document.querySelector('#team-panel .panel-title');
// Área de Batalha
const enemyArea = document.getElementById('enemy-area');
const playerArea = document.getElementById('player-area');
// Ícones Globais
const recruitIcon = document.getElementById('recruit-icon');
// Painéis Ocultos
const recruitPanel = document.getElementById('recruit-panel');
const skillsPanel = document.getElementById('skills-panel');
const enemyTooltip = document.getElementById('enemy-tooltip');
// Botões de Fechar
const closeButtons = document.querySelectorAll('.close-panel-btn');
let team = [];
let enemy_team = [];
//importação do personagem
let firstCharData = localStorage.getItem('FirstCharData');
if(firstCharData){
    localStorage.setItem(ID_COUNTER_KEY,1);

    firstCharData = JSON.parse(firstCharData);
    let attributes = firstCharData.attributes
    
    const firstChar = new PCharacter(firstCharData.name, attributes);
    firstChar.effects = []; 
    localStorage.removeItem('FirstCharData');
    team.push(firstChar);
    console.log(firstChar);
    
    updateSquad(firstChar);
    
} else {

localStorage.setItem(ID_COUNTER_KEY,1);
localStorage.removeItem('FirstCharData');
console.warn(`Falha ao carregar dados. Criando time de DEBUG com 6 membros.`);

team = [
        new PCharacter('Guerreiro', {"atk": 3, "con": 2, "int": 1}),
        new PCharacter('Mago', {"atk": 1, "con": 2, "int": 3}),
        new PCharacter('Ladino', {"atk": 3, "con": 2, "int": 1}),
        new PCharacter('Clérigo', {"atk": 1, "con": 2, "int": 3}),
        new PCharacter('Tanque', {"atk": 2, "con": 3, "int": 1}),
        new PCharacter('Arqueiro', {"atk": 3, "con": 2, "int": 1})
    ];
console.log(`DEBUG: Criação de time padrão para testes de desenvolvimento:`);
team.forEach(character => {
    character.effects = [
            // 1. Efeito de Buff (ativo)
            { name: 'Buff de Ataque', icon: '⚔️', duration: 3 },
            // 2. Efeito de Debuff (ativo)
            { name: 'Envenenado', icon: '☠️', duration: 2 },
            // 3. Efeito "inativo" (não vai aparecer)
            { name: 'Escudo', icon: '🛡️', duration: 0 } 
        ];
    
    console.log(character);
    updateSquad(character);
});
}
//INTERATIVIDADE DOS MENUS
// Abrir o Painel de Recrutamento
recruitIcon.addEventListener('click', () => {
    recruitPanel.classList.add('is-open');
    document.body.classList.add('shop-is-open');
});
// Abrir o Painel de Habilidades
skillsIcon.addEventListener('click', () => {
    skillsPanel.classList.remove('hidden');
});
// Fechar Painéis (Recrutar ou Habilidades)
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Pega o ID do painel que este botão deve fechar
        // (Nós definimos isso no HTML com 'data-target-panel')
        const panelId = button.dataset.targetPanel;
        
        if (panelId === 'recruit-panel') {
            recruitPanel.classList.remove('is-open');
            document.body.classList.remove('shop-is-open');
            
        } else if(panelId === 'skills-panel') {
            skillsPanel.classList.add('hidden');
        }
    });
});
// Interatividade do Tooltip do Inimigo

enemyArea.addEventListener('mouseover', (event) => {
    // Encontra o '.enemy-card' mais próximo que o mouse tocou
    const enemyCard = event.target.closest('.enemy-card');
    
    if (enemyCard) {
        // --- LÓGICA FUTURA ---
        // ID do inimigo (enemyCard.dataset.enemyId)
        // e buscaria os dados dele para preencher o tooltip.
        
        // Dados de exemplo:
        document.getElementById('tooltip-name').textContent = "Goblin";
        document.getElementById('tooltip-desc').textContent = "Fraco contra fogo. Rápido.";
        document.getElementById('tooltip-hp').textContent = "10/10";
        document.getElementById('tooltip-atk').textContent = "3";
        // Posiciona e mostra o tooltip
        enemyTooltip.classList.remove('hidden');
        // Posiciona o tooltip 10px abaixo e à direita do mouse
        enemyTooltip.style.left = `${event.pageX + 10}px`;
        enemyTooltip.style.top = `${event.pageY + 10}px`;
    }
});
// Esconde o tooltip quando o mouse sai da área do inimigo
enemyArea.addEventListener('mouseout', (event) => {
    if (event.target.closest('.enemy-card')) {
        enemyTooltip.classList.add('hidden');
    }
});

// Atualiza a posição do tooltip enquanto o mouse se mexe
enemyArea.addEventListener('mousemove', (event) => {
    if (!enemyTooltip.classList.contains('hidden')) {
        enemyTooltip.style.left = `${event.pageX + 10}px`;
        enemyTooltip.style.top = `${event.pageY + 10}px`;
    }
});
//funcoes
function addCharToSquad(character) {
    if(team.includes(character)){
        console.warn(`Já existe no time! Não há necessidade de adicionar ${character.name}.`);
        return;
    }
    if (team.length >= 6) {
        console.warn(`Time cheio! Não foi possível adicionar ${character.name}.`);
        return;
    }
    team.push(character);
    
    // Chama as funções de desenho
    updateSquad(character);
}
function updateSquad(character){
    drawCrew(character);
    drawRoster(character);
    }

    //draws
function drawRoster(character) {
    if(!team.includes(character)){
        console.warn('Tentativa de adcionar personagem inexistente');
        return;
    }
    
    // verifica se o slot existe
    const existingSlot = teamRoster.querySelector(`.team-member-portrait[data-id="${character.id}"]`);
    
    const newPortraitHTML = `
        <div class="portrait-image"></div>
        <div class="portrait-info">
            <span class="portrait-name">${character.name}</span>
            <div class="portrait-stats">
                <span class="portrait-atk">⚔️ ${character.currentStats.damage}</span>
                <span class="portrait-hp">❤️ ${character.currentStats.hp}/${character.stats.hp}</span>
                <span class="portrait-mana">🌀 ${character.currentStats.mana}/${character.stats.mana}</span>
            </div>
        </div>
    `;

    if (existingSlot) {
        // update
        existingSlot.innerHTML = newPortraitHTML;
    } else {
        // add
        const firstEmptySlot = teamRoster.querySelector('.empty-slot');
        if (firstEmptySlot) {
            firstEmptySlot.innerHTML = newPortraitHTML;
            firstEmptySlot.classList.remove('empty-slot');
            firstEmptySlot.dataset.id = character.id;
        } else {
            console.error(`Erro: Não foi possível adicionar ${character.name} ao roster.`);
        }
    }

    teamPanelTitle.textContent = `Esquadrão (${team.length}/6)`
}

function drawCrew(character) {
    if(!team.includes(character)){
        console.warn('Tentativa de adcionar personagem inexistente');
        
        return;
    }
    // efeitos
    let effectsHTML = '';
    if (character.effects && Array.isArray(character.effects)) {
        character.effects.forEach(effect => {
            if (effect.duration > 0) {
                effectsHTML += `<div class="effect-icon" title="${effect.name} (${effect.duration} turnos)">
                    ${effect.icon}
                </div>`;
            }
        });
    }

    // Procura se o card deste personagem já existe na tela
    const existingCard = playerArea.querySelector(`.player-card[data-id="${character.id}"]`);

    const newInnerCardHTML = `
        <div class="player-name">${character.name}</div>
        <div class="player-sprite"></div>
        <div class="player-lvl">Lvl ${character.lvl}</div>
        <div class="player-stats-area">
            <div class="player-atk">
                ATK: ${character.currentStats.damage}
            </div>
            <div class="stat-bar-container hp-bar">
                <div class="bar-text hp-text">
                    ${character.currentStats.hp} / ${character.stats.hp}
                </div>
                <div class="armor-text">
                    ${character.stats.armor}
                </div>
                <div class="hp-bar-fill" style="width: ${(character.currentStats.hp / character.stats.hp) * 100}%"></div>
            </div>
            <div class="stat-bar-container mana-bar">
                <div class="bar-text mana-text">
                    ${character.currentStats.mana} / ${character.stats.mana}
                </div>
                <div class="mana-bar-fill" style="width: ${(character.currentStats.mana / character.stats.mana) * 100}%"></div>
            </div>
            <div class="player-effects">
                ${effectsHTML}
            </div>
        </div>
    `;

    if (existingCard) {
        existingCard.innerHTML = newInnerCardHTML;
        
    } else {
        playerArea.innerHTML += `
            <div class="player-card" data-id="${character.id}">
                ${newInnerCardHTML}
            </div>
        `;
    }
}




