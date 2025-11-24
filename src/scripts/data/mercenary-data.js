const MERCENARY_NAMES = [
    "Alaric", "Borg", "Caelum", "Darius", "Elara", 
    "Fae", "Grom", "Hela", "Ivor", "Jinx", "Kael", "Lyra"
];

const MERCENARY_VOCATIONS = {
    'guerreiro': {
        name: 'Lutador',
        weights: { str: 5, con: 3, agi: 2, int: 0, wis: 0 }
    },
    'mago': {
        name: 'Especialista',
        weights: { str: 0, con: 1, agi: 1, int: 6, wis: 2 }
    },
    'arqueiro': {
        name: 'Assassino',
        weights: { str: 2, con: 1, agi: 6, int: 0, wis: 1 }
    },
    'clerigo': {
        name: 'Sábio',
        weights: { str: 0, con: 2, agi: 1, int: 2, wis: 5 }
    },
    'tanque': {
        name: 'Tanque',
        weights: { str: 2, con: 6, agi: 1, int: 0, wis: 1 }
    }
};