
function EnemyGenerator() {
    // (O construtor fica vazio, pois usamos o protótipo)
}

EnemyGenerator.prototype.generateEnemy = async function() {
    
    const currentPhase = GAME_MANAGER.getPhase();
    let { level , tier } = this._calculateLevelAndTier(currentPhase);

    const statPool = 5 + Math.floor(level / 2); 

    const classKeys = Object.keys(ENEMY_CLASS_TEMPLATES);
    
    //balanceamento dos inimigos por fase
    if(currentPhase < 5){

        // Nos primeiros 5 níveis, evita classes suporte
        classKeys.splice(classKeys.indexOf('feiticeiro'), 1);
        classKeys.splice(classKeys.indexOf('sabio'), 1);

        level = currentPhase > 1 ? currentPhase -1 : currentPhase;
    }
    if(currentPhase > 10){
        
        //niveis mais altos, evita aventureiro

        classKeys.splice(classKeys.indexOf('aventureiro'), 1);
    }
    const randomClassKey = classKeys[Math.floor(Math.random() * classKeys.length)];
    const classTemplate = ENEMY_CLASS_TEMPLATES[randomClassKey];

    const attributesArray = this._distributeStatPoints(classTemplate, statPool);
    
    const enemyName = await APIConn.getName().call();
    
    //Cria um avatar dinamiacamente
    const enemyAvatar = await getUniqueAvatar();
    
    // Cria a nova instância do Inimigo
    const newEnemy = new Enemy(
        enemyName,
        attributesArray,
        enemyAvatar,
        level,
        tier,
        classTemplate.description,
        classTemplate.name,
        classTemplate.icon,   
    );

    
    console.log(newEnemy);
    
    return newEnemy;
}

EnemyGenerator.prototype._calculateLevelAndTier = function(currentPhase) {

    //          RNG DO LVL INIMIGO
    //    Define a variação aleatória (ex: -1, 0, ou +1)
    //    (Math.random() * 3) dá um número entre 0 e 2.99...
    //    Math.floor() arredonda para 0, 1, ou 2
    //    Subtrair 1 nos dá: -1, 0, or 1

    const levelVariation = Math.floor(Math.random() * 3) - 1; 

    let phasePoints = currentPhase + levelVariation;

    if (phasePoints < 1) {
        phasePoints = 1;
    }

    let tier = 1;
    let level = 1;
    
    let maxLevelForThisTier = 10; 

    // Loop de Rebirth
    while (true) {
        // Se os pontos de fase são menores ou iguais ao custo
        if (phasePoints <= maxLevelForThisTier) {
            level = phasePoints;
            break;
        } else {

            phasePoints -= maxLevelForThisTier;
            tier++;
            
            maxLevelForThisTier += 10;
            
        }
    }
    
    return { level, tier };
}
EnemyGenerator.prototype._distributeStatPoints = function(classTemplate, statPool) {
    
    let attributes = { str: 1, con: 1, agi: 1, int: 1, wis: 1 };
    let weights = classTemplate.weights; 
    let totalWeight = 0;
    
    for (const stat in weights) {
        totalWeight += weights[stat];
    }

    if (totalWeight === 0) {
        //Aleatória (Aventureiro)
        const statsKeys = ['str', 'con', 'agi', 'int', 'wis'];
        for (let i = 0; i < statPool; i++) {
            const randomStat = statsKeys[Math.floor(Math.random() * 5)];
            attributes[randomStat]++;
        }
    } else {
        // Classes Específicas
        let pointsDistributed = 0;
        for (const stat in weights) {
            let points = Math.round(statPool * (weights[stat] / totalWeight));
            attributes[stat] += points;
            pointsDistributed += points;
        }
        
        // Ajuste de Arredondamento
        let pointsDiff = statPool - pointsDistributed;
        const mainStat = Object.keys(weights).reduce((a, b) => weights[a] > weights[b] ? a : b);
        attributes[mainStat] += pointsDiff;
    }
    return [attributes.str, attributes.con, attributes.agi, attributes.int, attributes.wis];
}

EnemyGenerator.prototype.calculateNumberOfEnemies = function(){
    const currentPhase = GAME_MANAGER.getPhase();
    let enemiesNum;

    //comeca em 10, e dobra 
    if(currentPhase >= GAME_MANAGER.getEnemiesNumValidation()){
        enemiesNum = GAME_MANAGER.increaseEnemysNum();
        GAME_MANAGER.increaseEnemiesNumValidation();
    }
    else{
        enemiesNum = GAME_MANAGER.getEnemysNum();
    }

    //num máximo de inimigos

    if(enemiesNum > 6) enemiesNum = 6;
    
    return enemiesNum;

}

const ENEMY_GENERATOR = new EnemyGenerator();