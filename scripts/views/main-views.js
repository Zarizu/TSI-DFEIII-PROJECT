const inimgo = new Enemy('Xuxo',{atk: 2,con: 3,int:1});

//num de rodadas
const roundNumber = document.getElementById('round-number');
//moedas atuais
const goldAmount = document.getElementById('gold-amount');
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

//add menu lateral esquerdo
const MAX_TEAM_SIZE = 6;
for (let i = 0; i < MAX_TEAM_SIZE; i++) {
    const slot = document.createElement('div');
    
    slot.classList.add('team-member-portrait', 'empty-slot');

    slot.setAttribute('disabled', ''); 

    teamRoster.appendChild(slot);
}




