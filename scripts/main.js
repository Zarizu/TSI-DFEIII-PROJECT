//var globais
let team = [];
let enemyTeam = [];
let playerActions = {};

//importação do personagem
let firstCharData = localStorage.getItem('FirstCharData');
if(firstCharData != null){
    localStorage.setItem(ID_COUNTER_KEY,1);

    firstCharData = JSON.parse(firstCharData);
    let attributes = firstCharData.attributes
    
    const firstChar = new PCharacter(firstCharData.name, attributes);
    firstChar.effects = []; 
    team.push(firstChar);
    console.log(firstChar);
    
    updateSquad(firstChar);
    
} else {
//caso o acesso seja feito sem a criação de um personagem(MODO DEBUG para testes de desenvolvimento)

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
            // efeitos ativos
            { name: 'Buff de Ataque', icon: '⚔️', duration: 3 },
            { name: 'Envenenado', icon: '☠️', duration: 2 },
            // efeito inativo(nao aparece)
            { name: 'Escudo', icon: '🛡️', duration: 0 } 
        ];
    
    console.log(character);
    updateSquad(character);
});
}

//DEBUG
PLAYER_MANAGER.addGold(100);
roundNumber.textContent = GAME_MANAGER.getRound();
phaseNumber.textContent = GAME_MANAGER.getPhase();
goldAmount.textContent = PLAYER_MANAGER.getGold();

/*
fazer sistema de rodadas

*/
