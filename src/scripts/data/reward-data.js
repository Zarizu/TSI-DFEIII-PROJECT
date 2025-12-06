// ==========================================
// TABELA DE RARIDADE (Configuração)
// ==========================================
const MAX_ROLL = 10000000; // 10 Milhões

const RARITY_TIERS = [
    // Ordem: Do mais difícil para o mais fácil
    { id: 'unique',    name: 'Único',      color: '#ff0000', threshold: 9995000, multiplier: 0 },  // 0.05%
    { id: 'legendary', name: 'Lendário',   color: '#ffd700', threshold: 9900000, multiplier: 10 }, // 0.95%
    { id: 'epic',      name: 'Épico',      color: '#9b59b6', threshold: 9500000, multiplier: 5 },  // 4%
    { id: 'super_rare',name: 'Super Raro', color: '#3498db', threshold: 8500000, multiplier: 2.5 },// 10%
    { id: 'rare',      name: 'Raro',       color: '#2ecc71', threshold: 6000000, multiplier: 1.5 },// 25%
    { id: 'common',    name: 'Comum',      color: '#95a5a6', threshold: 0,       multiplier: 1 }   // 60% (O resto)
];

// ==========================================
// POOL DE RECOMPENSAS PADRÃO (Escalam com Raridade)
// ==========================================
const STANDARD_REWARDS = [
    {
        id: 'gold',
        weight: 50, // Chance relativa de cair (50/100)
        generate: (rarity, phase) => {
            // Fórmula: (Base + (Fase * 10)) * Multiplicador da Raridade
            const baseAmount = 50 + (phase * 10);
            const amount = Math.round(baseAmount * rarity.multiplier);
            return {
                icon: '💰',
                title: `${rarity.name}: Ouro`,
                desc: `Receba <b>${amount}</b> de ouro.`,
                effect: () => {
                    PLAYER_MANAGER.addGold(amount);
                    goldAmount.textContent = PLAYER_MANAGER.getGold();
                }
            };
        }
    },
    {
        id: 'xp',
        weight: 40,
        generate: (rarity, phase) => {
            // Seleciona um alvo aleatório (segurança se time vazio)
            if (window.team.length === 0) return null; 
            const target = window.team[Math.floor(Math.random() * window.team.length)];
            
            const baseXP = 100 + (phase * 20);
            const amount = Math.round(baseXP * rarity.multiplier);
            
            return {
                icon: '✨',
                title: `${rarity.name}: Treino`,
                desc: `<b>${target.name}</b> ganha <b>${amount}</b> XP.`,
                effect: () => {
                    target.gainExperience(amount);
                    refreshAllUI();
                }
            };
        }
    },
    {
        id: 'heal',
        weight: 10,
        generate: (rarity, phase) => {
            const percent = Math.round(10 + (rarity.multiplier - 1) * (100 - 10) / (10 - 1));
            
            return {
                icon: '💖',
                title: `${rarity.name}: Descanso`,
                desc: `Recupera <b>${percent}%</b> da vida e mana do time.`,
                effect: () => {
                    window.team.forEach(char => {
                        const hpHeal = Math.round(char.stats.hp * (percent / 100));
                        const manaHeal = Math.round(char.stats.mana * (percent / 100));
                        char.currentHP = Math.min(char.stats.hp, char.currentHP + hpHeal);
                        char.currentMana = Math.min(char.stats.mana, char.currentMana + manaHeal);
                    });
                    refreshAllUI();
                }
            };
        }
    }
    // PARA ADICIONAR MAIS: Copie um bloco {}, mude o ID, peso e a função generate.
];

// ==========================================
// POOL DE RECOMPENSAS ÚNICAS
// ==========================================
const UNIQUE_REWARDS = [
    {
        generate: () => ({
            icon: '👑',
            title: 'ÚNICO: Benção Real',
            desc: 'Todos os heróis ganham +2 em TODOS os atributos permanentemente.',
            effect: () => {
                window.team.forEach(char => {
                    char.attributes.str+=2; char.attributes.con+=2; char.attributes.agi+=2;
                    char.attributes.int+=2; char.attributes.wis+=2;
                    char.recalculateAll();
                });
                refreshAllUI();
            }
        })
    },
    {
        generate: () => ({
            icon: '🪙',
            title: 'ÚNICO: Herança Perdida',
            desc: 'Multiplique seu ouro atual por 5.',
            effect: () => {
                PLAYER_MANAGER.addGold(PLAYER_MANAGER.getGold() * 5);
                goldAmount.textContent = PLAYER_MANAGER.getGold();
            }
        })
    }
    // Adicione mais recompensas "fortes" aqui
];