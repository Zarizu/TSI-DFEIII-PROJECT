// (Em models/game-system/EnemyGenerator.js)

function EnemyGenerator() {
    // (O construtor fica vazio, pois usamos o protótipo)
}

EnemyGenerator.prototype.generateEnemy = function() {

    const currentPhase = GAME_MANAGER.getPhase();
    const statPool = GAME_MANAGER.getEnemyStatPool();

    // Calcula Lvl e Tier
    // Lvl: +1 a cada 2 fases
    const newLevel = 1 + Math.floor((currentPhase - 1) / 2);
    
    // Tier: +1 a cada 10 fases
    const newTier = 1 + Math.floor((currentPhase - 1) / 10);

    // Escolhe aleatoriamente uma Classe inimiga
    const classKeys = Object.keys(ENEMY_CLASS_TEMPLATES);
    const randomClassKey = classKeys[Math.floor(Math.random() * classKeys.length)];
    const classTemplate = ENEMY_CLASS_TEMPLATES[randomClassKey];

    // distribui os pontos
    const attributesArray = this._distributeStatPoints(classTemplate, statPool);
    
    // Cria um nome (deverá ser puxado dinamicamente)
    const enemyName = `${classTemplate.name} Nv.${newLevel}`; 
    
    // Cria a nova instância do Inimigo
    const newEnemy = new Enemy(
        enemyName,
        attributesArray,
        newLevel,
        newTier,
        classTemplate.description
    );
    
    // (Lógica futura de Vocação)
    // if (classTemplate.vocation) {
    //     newEnemy.passive_skills.push(classTemplate.vocation);
    // }

    return newEnemy;
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
    //a cada 5 fases aumenta 1 inimigo
    let enemiesNum = 1 + Math.floor((currentPhase - 1) / 5);
    //num máximo de inimigos
    if(enemiesNum > 6) enemiesNum = 6;
    
    return enemiesNum;

}

const ENEMY_GENERATOR = new EnemyGenerator();