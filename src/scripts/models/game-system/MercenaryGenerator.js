function MercenaryGenerator() {
}

MercenaryGenerator.prototype.generateMercenary = function() {
    
    //  Define o nível base do mercenário (escala com a fase)
    const currentPhase = GAME_MANAGER.getPhase();
    // Ex: Fase 1-2 = Nvl 1, Fase 3-4 = Nvl 2...
    const level = Math.max(1, Math.floor((currentPhase + 1) / 2)); 
    const tier = 1; // Por enquanto fixo no tier 1

    const statPool = 10 + (level * 2); 

    // 3. Escolhe uma Vocação aleatória
    const vocationKeys = Object.keys(MERCENARY_VOCATIONS);
    const key = vocationKeys[Math.floor(Math.random() * vocationKeys.length)];
    const template = MERCENARY_VOCATIONS[key];

    //  Escolhe um Nome aleatório(futuramente, será dinâmico)
    const name = MERCENARY_NAMES[Math.floor(Math.random() * MERCENARY_NAMES.length)];

    // Distribui os pontos (Mesma lógica do EnemyGenerator)
    const attributesArray = this._distributeStatPoints(template.weights, statPool);

    //  Cria a Instância
    const newMerc = new PCharacter(name, attributesArray, level, tier, template.name);

    //  Adiciona Skills Iniciais baseadas na chave da vocação
    this._assignStartingSkills(newMerc, key);

    return newMerc;
}

MercenaryGenerator.prototype._distributeStatPoints = function(weights, pool) {
    let attributes = { str: 1, con: 1, agi: 1, int: 1, wis: 1 };
    let totalWeight = 0;
    
    for (const stat in weights) totalWeight += weights[stat];

    let pointsDistributed = 0;
    for (const stat in weights) {
        let points = Math.round(pool * (weights[stat] / totalWeight));
        attributes[stat] += points;
        pointsDistributed += points;
    }
    
    // Ajuste de arredondamento (dá o resto para o stat principal)
    let pointsDiff = pool - pointsDistributed;
    const mainStat = Object.keys(weights).reduce((a, b) => weights[a] > weights[b] ? a : b);
    attributes[mainStat] += pointsDiff;

    return [attributes.str, attributes.con, attributes.agi, attributes.int, attributes.wis];
}

MercenaryGenerator.prototype._assignStartingSkills = function(merc, vocationKey) {
    if (vocationKey === 'mago') {
        merc.skills.push(SKILLS.FIREBALL);
    } 
    else if (vocationKey === 'clerigo') {
        merc.skills.push(SKILLS.HEAL);
    } 
    else if (vocationKey === 'guerreiro' || vocationKey === 'tanque') {
        // skill de 'bater com escudo' ou 'provocar', iria aqui
        // merc.skills.push(SKILLS_CATALOG.SMITE);
    }
    // Adicionar mais lógicas conforme criar mais skills
}

const MERCENARY_GENERATOR = new MercenaryGenerator();