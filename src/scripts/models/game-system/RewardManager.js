function RewardManager() {
    this.modal = document.getElementById('reward-modal');
    this.container = document.getElementById('reward-options-container');
}

RewardManager.prototype.showRewards = function() {
    this.container.innerHTML = ''; 
    const options = [];
    const generatedIds = [];

    // Gera 3 opções (sem repetir)
    for (let i = 0; i < 3; i++) {
        // Passamos a lista de excluídos para o gerador
        const reward = this.generateRandomReward(generatedIds);
        
        if (reward) {
            options.push(reward);
            
            // Adiciona o ID desta recompensa à lista de excluídos
            // (Para que a próxima iteração não a escolha)    
            if (reward.id) {
                generatedIds.push(reward.id);
            }
        }
    }

    // Desenha
    options.forEach(option => {
        if (!option) return; 

        const card = document.createElement('div');
        card.classList.add('reward-card');
        
        card.style.borderColor = option.rarityColor;
        card.style.boxShadow = `0 0 5px ${option.rarityColor}`;
        
        card.innerHTML = `
            <div class="reward-icon">${option.icon}</div>
            <div class="reward-title" style="color: ${option.rarityColor}">${option.title}</div>
            <div class="reward-desc">${option.desc}</div>
        `;
        
        card.onmouseenter = () => { card.style.boxShadow = `0 0 20px ${option.rarityColor}`; };
        card.onmouseleave = () => { card.style.boxShadow = `0 0 5px ${option.rarityColor}`; };

        card.addEventListener('click', () => {
            option.effect();
            this.closeModal();
        });

        this.container.appendChild(card);
    });

    this.modal.classList.remove('hidden');
}

RewardManager.prototype.closeModal = function() {
    this.modal.classList.add('hidden');
    spawnNewEnemies();
    checkShopAvailability();
}

// LÓGICA CENTRAL DE GERAÇÃO

RewardManager.prototype.generateRandomReward = function(excludeIds = []) {
    const playerLuck = PLAYER_MANAGER.luck || 1.0; 

    // Rola a Raridade
    let roll = Math.floor(Math.random() * MAX_ROLL * playerLuck);
    if (roll >= MAX_ROLL) roll = MAX_ROLL - 1;

    const rarity = RARITY_TIERS.find(tier => roll >= tier.threshold) || RARITY_TIERS[RARITY_TIERS.length - 1];

    console.log(`[Reward] Roll: ${roll} -> Raridade: ${rarity.name}`);

    let rewardObject = null;
    let selectedTemplate = null;

    // Seleciona o Tipo de Recompensa
    if (rarity.id === 'unique') {
        // Únicos não entram na lista de exclusão (são raros demais para se preocupar)
        selectedTemplate = UNIQUE_REWARDS[Math.floor(Math.random() * UNIQUE_REWARDS.length)];
    } else {
        // LÓGICA PADRÃO COM FILTRO
        
        // Filtra as recompensas disponíveis (remove as que estão no excludeIds)
        const availableRewards = STANDARD_REWARDS.filter(r => !excludeIds.includes(r.id));
        
        // Fallback de segurança: Se filtrou tudo (não deveria acontecer com 3 opções), reseta
        const pool = availableRewards.length > 0 ? availableRewards : STANDARD_REWARDS;

        // Recalcula o peso total baseado apenas nas disponíveis
        const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
        let randomWeight = Math.random() * totalWeight;
        
        // Sorteia
        selectedTemplate = pool.find(item => {
            randomWeight -= item.weight;
            return randomWeight <= 0;
        }) || pool[0];
    }

    // Gera o Objeto Final
    if (selectedTemplate) {
        // Se for único, chama generate() direto. Se padrão, passa (rarity, phase)
        rewardObject = selectedTemplate.generate(rarity, GAME_MANAGER.getPhase());
        
        // Adiciona propriedades de sistema ao objeto final
        rewardObject.rarityColor = rarity.color;
        
        // Importante: Passa o ID do template para o objeto final
        // para que o 'showRewards' possa adicioná-lo à lista de excluídos
        rewardObject.id = selectedTemplate.id || 'unique'; 
    }

    return rewardObject;
}

const REWARD_MANAGER = new RewardManager();