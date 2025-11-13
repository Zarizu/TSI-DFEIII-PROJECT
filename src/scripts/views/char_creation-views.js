    // span dos emojis
const animationContainer = document.querySelector('.background-animation');
const numberOfIcons = 12; 
for (let i = 0; i < numberOfIcons; i++) {
    const iconSpan = document.createElement('span');
    animationContainer.appendChild(iconSpan);
}
const step1 = document.getElementById('step-1-name');
const step2 = document.getElementById('step-2-attributes');
const charNameInput = document.getElementById('char-name-input');
const charAvatarInput = document.getElementById('char-avatar-input');
const nextStepButton = document.getElementById('next-step-btn');
const prevStepButton = document.getElementById('prev-step-btn');
const startButton = document.getElementById('main-start');
const pointsValueEl = document.getElementById('points-value');
const vocationNameEl = document.getElementById('vocation-name');
const vocationTooltipEl = document.getElementById('vocation-tooltip');
const plusButtons = document.querySelectorAll('.stat-btn.plus');
const minusButtons = document.querySelectorAll('.stat-btn.minus');
const attributeRows = document.querySelectorAll('#char-stats-list .char-stats');
const centralBox = document.getElementById('central-box');


const previewStatElements = {
    damage: document.getElementById('prev-damage'),
    critical_multiplier: document.getElementById('prev-critical_multiplier'),
    initiative: document.getElementById('prev-initiative'),
    evasion: document.getElementById('prev-evasion'),
    critical_chance: document.getElementById('prev-critical_chance'),
    hp: document.getElementById('prev-hp'),
    armor: document.getElementById('prev-armor'),
    mana: document.getElementById('prev-mana'),
    skill: document.getElementById('prev-skill'),
    magic_resist: document.getElementById('prev-magic_resist'),
    mana_regen: document.getElementById('prev-mana_regen'),
    hp_regen: document.getElementById('prev-hp_regen'),
};

attributeRows.forEach(row => {
    
    row.addEventListener('mouseover', () => {
        const attributeName = row.dataset.vocationHover; 
        
        const statsToHighlight = statHighlightMap[attributeName];

        if (statsToHighlight) {
            statsToHighlight.forEach(statName => {
                const statElement = document.getElementById(`prev-${statName}`);
                if (statElement) {
                    statElement.parentElement.classList.add('stat-highlight');
                }
            });
        }
    });

    row.addEventListener('mouseout', () => {
        document.querySelectorAll('.preview-stat.stat-highlight').forEach(el => {
            el.classList.remove('stat-highlight');
        });
    });
});

const statHighlightMap = {
    str: ['damage', 'critical_multiplier'],
    con: ['hp', 'armor'],
    agi: ['initiative', 'evasion', 'critical_chance'],
    int: ['mana', 'skill'],
    wis: ['magic_resist', 'mana_regen','hp_regen' ]
};
const VOCATIONS = {
    default: {
        name: "Aventureiro",
        desc: "Perfeitamente equilibrado."
    },
    str: {
        name: "Porradeiro",
        desc: "A escolha mais fácil, ataca primeiro, pergunta depois."
    },
    con: {
        name: "Tanque",
        desc: "Resiste a mais danos que o habitual, um soco em você é massagem."
    },
    agi: {
        name: "Assassino",
        desc: "Tem fama por sua imprevisibilidade, Também é conhecido por ser rapidinho."
    },
    int: {
        name: "Especialista",
        desc: "Foco em habilidades e magias. Tem o QI elevado."
    },
    wis: {
        name: "Sábio",
        desc: "Resiste a magias e regenera mana e vida. Viva a vida na calmaria."
    }
};

const MAX_POINTS = 5;
const MAX_PER_STAT = 4;
const MIN_PER_STAT = 1;
let totalPoints = MAX_POINTS;

const stats = {
    str: 1,
    con: 1,
    agi: 1,
    int: 1,
    wis: 1
};

const valueElements = {
    str: document.getElementById('str-value'),
    con: document.getElementById('con-value'),
    agi: document.getElementById('agi-value'),
    int: document.getElementById('int-value'),
    wis: document.getElementById('wis-value')
};