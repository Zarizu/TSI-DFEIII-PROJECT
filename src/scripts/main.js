let firstCharData = localStorage.getItem('FirstCharData');
if(firstCharData != null){
    firstCharData = JSON.parse(firstCharData);

    let attributesObject = firstCharData.attributes;
    
    const firstChar = new PCharacter(
        firstCharData.name, 
        attributesObject,
        firstCharData.lvl,
        firstCharData.tier,
        firstCharData.vocation
    );
    
    firstChar.currentHP = firstCharData.currentHP;
    firstChar.currentMana = firstCharData.currentMana;

    addCharToSquad(firstChar);
    console.log("Personagem carregado:", firstChar);
    
} else {
//caso o acesso seja feito sem a criação de um personagem(MODO DEBUG para testes de desenvolvimento)
debugInit();
}

spawnNewEnemies(); 
refreshAllUI();
checkBattleReady();
SHOP_MANAGER.generateShop();
drawShop()
executeRound();