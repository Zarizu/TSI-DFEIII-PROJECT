const ENEMY_CLASS_TEMPLATES = {
    'aventureiro': {
        name: "Aventureiro",
        description: "Um inimigo equilibrado, mas sem especialidades.",
        // Pesos iguais: distribui os pontos aleatoriamente
        weights: { str: 1, con: 1, agi: 1, int: 0, wis: 1 }, 
        // Vocation: null (ou uma passiva simples)
    },
    'combatente': {
        name: "Combatente",
        description: "Focado em dano físico.",
        // Prioridade: 4 (FOR), 3 (AGI), 2 (CON)
        weights: { str: 4, con: 2, agi: 3, int: 0, wis: 1 } 
    },
    'executor': {
        name: "Executor",
        description: "Inimigo ágil e voraz.",
        weights: { str: 2, con: 1, agi: 5, int: 0, wis: 1 } 
    },
    'tanque': {
        name: "Tanque",
        description: "Uma muralha ambulante.",
        weights: { str: 0, con: 6, agi: 1, int: 0, wis: 3 } 
    },
    'feiticeiro': {
        name: "Feiticeiro",
        description: "Exala mana, mas é muito vulnerável.",
        weights: { str: 1, con: 0, agi: 2, int: 5, wis: 1 }
    },
    'sabio': {
        name: "Sábio",
        description: "Curandeiro com uma paz inabalável.",
        weights: { str: 0, con: 2, agi: 1, int: 2, wis: 4 }
    }
};