//TEMPORARIO

const ENEMIES_MOLDS = {
    GOBLIN: new Enemy('Goblin', [2, 1, 2, 1, 1], 1, 1, "Fraco contra fogo. Rápido."),
    LOBO:   new Enemy('Lobo',   [3, 1, 3, 1, 1], 1, 1, "Ataca em bando. Alto dano."),
    XAMA:   new Enemy('Xamã',   [1, 1, 1, 5, 3], 2, 1, "Suporte. Cura seus aliados."),
    BERGA:  new Enemy('Berga Boy',[3, 3, 1, 1, 3], 2, 1, 'Ama bergamotas.'),
    
    // [NOVO] Inimigo de Fase 2
    ORC:    new Enemy('Orc',    [5, 3, 1, 0, 0], 3, 1, 'Grande e forte.')
};

const PHASE_ENCOUNTERS = {
    1: {
        spawnCount: 2, 
        pool: ['GOBLIN', 'LOBO']
    },
    // Fase 2
    2: {
        spawnCount: 2,
        pool: ['LOBO', 'XAMA']
    },
    // Fase 3
    3: {
        spawnCount: 3,
        pool: ['ORC', 'XAMA', 'BERGA']
    }
    // Adicione Fase 4, 5, etc. aqui
};