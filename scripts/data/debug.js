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
        new PCharacter('Mago',      [1, 2, 1, 4, 2]),
        new PCharacter('Ladino',    [2, 2, 4, 1, 1]),
        new PCharacter('Clérigo',   [1, 2, 1, 3, 3]),
        new PCharacter('Tanque',    [2, 4, 1, 1, 2]),
        new PCharacter('Arqueiro',  [1, 2, 4, 2, 1])
    ];

    window.team.forEach(character => {
    EFFECTS.POISON.applyEffect(character,3);
        
        //hard coded
        if (character.name === 'Mago') {
            character.skills = [
                SKILLS.FIREBALL,
                //{ id: 'ice_shield', name: 'Escudo de Gelo', targetType: 'ally' }
            ];
        } else if (character.name === 'Clérigo') {
            character.skills = [
                SKILLS.HEAL,
                SKILLS.SMITE,
            ];
        }
    });

    window.enemyTeam = [
        new Enemy('Goblin', [2, 1, 2, 0, 0], 1, 1, "Fraco contra fogo. Rápido."),
        new Enemy('Lobo', [3, 1, 3, 0, 0], 1, 1,"Ataca em bando. Alto dano."),
        new Enemy('Berga Boy', [3, 3, 1, 1, 3], 1, 1, 'Ama bergamotas.'),
        new Enemy('Xamã',[1,1,1,5,3],1,1,"Suporte")

    ];

    window.enemyTeam.forEach(enemy => {
        EFFECTS.ATTACK_BUFF.applyEffect(enemy,2);
    });

    window.enemyTeam[3].skills.push(SKILLS.HEAL);


    //DEBUG

    PLAYER_MANAGER.addGold(100);
    roundNumber.textContent = GAME_MANAGER.getRound();
    phaseNumber.textContent = GAME_MANAGER.getPhase();
    goldAmount.textContent = PLAYER_MANAGER.getGold();
    
    refreshAllUI();
    executeRound();
};




