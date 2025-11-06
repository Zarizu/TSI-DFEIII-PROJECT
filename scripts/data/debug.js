//arquivo temporario de testes
window.debugTeam = [
        new PCharacter('Guerreador', {"atk": 3, "con": 2, "int": 1}),
        new PCharacter('Magro', {"atk": 1, "con": 2, "int": 3}),
    ];

function debugInit(){

    localStorage.setItem(ID_COUNTER_KEY,1);
    localStorage.removeItem('FirstCharData');
    console.warn(`Falha ao carregar dados. Criando time de DEBUG com 6 membros.`);

    window.team = [
        new PCharacter('Guerreiro', {"atk": 3, "con": 2, "int": 1}),
        new PCharacter('Mago', {"atk": 1, "con": 2, "int": 3}),
        new PCharacter('Ladino', {"atk": 3, "con": 2, "int": 1}),
        new PCharacter('Clérigo', {"atk": 1, "con": 2, "int": 3}),
        new PCharacter('Tanque', {"atk": 2, "con": 3, "int": 1}),
        new PCharacter('Arqueiro', {"atk": 3, "con": 2, "int": 1})
    ];
    console.log(`DEBUG: Criação de time padrão para testes de desenvolvimento:`);

    window.team.forEach(character => {
    character.effects = [
            { name: 'Buff de Ataque', icon: '⚔️', duration: 3 },
            { name: 'Envenenado', icon: '☠️', duration: 2 },
            { name: 'Escudo', icon: '🛡️', duration: 0 } 
        ];
        if (character.name === 'Mago') {
            character.skills = [
                { id: 'fireball', name: 'Bola de Fogo', targetType: 'enemy' },
                { id: 'ice_shield', name: 'Escudo de Gelo', targetType: 'ally' }
            ];
        } else if (character.name === 'Clérigo') {
            character.skills = [
                { id: 'heal', name: 'Cura Leve', targetType: 'ally' },
                { id: 'smite', name: 'Golpe Divino', targetType: 'enemy' }
            ];
        } else {
            // Outros personagens (por enquanto)
            character.skills = [
                { id: 'placeholder', name: 'Sem Habilidades', targetType: 'none' }
            ];
        }
    updateSquad(character);
    })


    window.enemyTeam = [
        new Enemy('Goblin', {"atk": 2, "con": 1, "int": 0}, 1, 1, "Fraco contra fogo. Rápido."),
        new Enemy('Lobo', {"atk": 3, "con": 1, "int": 0}, 1, 1,"Ataca em bando. Alto dano."),
        new Enemy('Berga Boy',{"atk": 3, "con": 1, "int": 0}, 1, 1, 'Ama bergamotas.')
    ];

    window.enemyTeam.forEach(enemy => {
        enemy.effects = [
                { name: 'Buff de Ataque', icon: '⚔️', duration: 0 },
                { name: 'Envenenado', icon: '☠️', duration: 0 },
                { name: 'Escudo', icon: '🛡️', duration: 2 } 
            ];

        updateEnemySquad(enemy);
    });
};

//DEBUG

PLAYER_MANAGER.addGold(100);
roundNumber.textContent = GAME_MANAGER.getRound();
phaseNumber.textContent = GAME_MANAGER.getPhase();
goldAmount.textContent = PLAYER_MANAGER.getGold();

