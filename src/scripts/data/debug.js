//arquivo temporario de testes
window.debugTeam = [
    new PCharacter('Guerreador', [3, 2, 1, 1, 1]),
    new PCharacter('Magro', [1, 2, 1, 3, 1]),
];

function debugInit(){
    localStorage.setItem(ID_COUNTER_KEY_SKILL,1);
    localStorage.setItem(ID_COUNTER_KEY_EFFECT,1);
    localStorage.setItem(ID_COUNTER_KEY_CHARACTER,1);
    localStorage.setItem(ID_COUNTER_KEY_VOCATION_SKILL,1);

    localStorage.removeItem('FirstCharData');
    console.warn(`Falha ao carregar dados. Criando time de DEBUG com 6 membros.`);

    window.team = [
        new PCharacter('Guerreiro', [3, 3, 2, 1, 1]),
        new PCharacter('Mago',      [1, 2, 1, 4, 1]),
    ];

    window.team.forEach(character => {
        
        //hard coded
        if (character.name === 'Mago') {
            character.skills = [
                SKILLS.FIREBALL,
                //{ id: 'ice_shield', name: 'Escudo de Gelo', targetType: 'ally' }
            ];
        } else if (character.name === 'Clérigo') {
            character.skills.push(SKILLS.SMITE);
            character.skills.push(SKILLS.HEAL);
        }
    });

    //DEBUG

    PLAYER_MANAGER.addGold(100);
    roundNumber.textContent = GAME_MANAGER.getRound();
    phaseNumber.textContent = GAME_MANAGER.getPhase();
    goldAmount.textContent = PLAYER_MANAGER.getGold();
    
    refreshAllUI();
};




