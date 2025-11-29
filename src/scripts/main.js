let firstCharData = localStorage.getItem('FirstCharData');
if(firstCharData != null){
    firstCharData = JSON.parse(firstCharData);

    let attributesObject = firstCharData.attributes;
    let avatarObj = firstCharData.avatar;
    
    const firstChar = new PCharacter(
        firstCharData.name, 
        attributesObject,
        avatarObj,
        firstCharData.lvl,
        firstCharData.tier,
        firstCharData.vocation
    );
    
    addCharToSquad(firstChar);
    console.log("Personagem carregado:", firstChar);
    
} else {
//caso o acesso seja feito sem a criação de um personagem, redireciona para a página de criação
window.location.href = "./char_creation.html";
}

spawnNewEnemies(); 
refreshAllUI();
checkBattleReady();
SHOP_MANAGER.generateShop().then(() => {
    drawShop();
    executeRound();
});
