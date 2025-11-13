//var globais
window.team = [];
window.enemyTeam = [];
window.playerActions = {};

//importação do personagem
let firstCharData = localStorage.getItem('FirstCharData');
if(firstCharData != null){
firstCharData = JSON.parse(firstCharData);
    //debug
    localStorage.setItem(ID_COUNTER_KEY_CHARACTER,1);
    let attributes = firstCharData.attributes
    
    const attributesArray = [
        attributes.str,
        attributes.con,
        attributes.agi,
        attributes.int,
        attributes.wis
    ];
    
    const firstChar = new PCharacter(firstCharData.name, attributesArray);
    
    addCharToSquad(firstChar);
    console.log(firstChar);
    
    
} else {
//caso o acesso seja feito sem a criação de um personagem(MODO DEBUG para testes de desenvolvimento)
debugInit();
}

spawnNewEnemies(); 
refreshAllUI();
checkBattleReady();
executeRound();