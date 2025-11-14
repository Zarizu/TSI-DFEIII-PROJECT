let firstCharData = localStorage.getItem('FirstCharData');
if(firstCharData != null){
    // ... (JSON.parse, etc.)
    firstCharData = JSON.parse(firstCharData);
    
    // 1. 'attributesObject' é o {str: 2, con: 2, ...}
    let attributesObject = firstCharData.attributes;
    
    // 2. [CORREÇÃO] Não precisa mais do 'attributesArray'
    //    Passe o OBJETO diretamente.
    const firstChar = new PCharacter(
        firstCharData.name, 
        attributesObject, // <-- PASSA O OBJETO
        firstCharData.lvl,
        firstCharData.tier,
        firstCharData.vocation
    );
    
    // 3. (Restaura o estado)
    firstChar.currentHP = firstCharData.currentHP;
    firstChar.currentMana = firstCharData.currentMana;
    // ... (etc.)

    addCharToSquad(firstChar);
    console.log("Personagem carregado:", firstChar);
    
} else {
//caso o acesso seja feito sem a criação de um personagem(MODO DEBUG para testes de desenvolvimento)
debugInit();
}

spawnNewEnemies(); 
refreshAllUI();
checkBattleReady();
executeRound();