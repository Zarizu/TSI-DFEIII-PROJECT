function BattleManager(popupElement) {
    this.isTargeting = false;
    this.targetingCharacterId = null;
    this.targetingActionType = null;
    this.targetingCardElement = null;

    this.popup = popupElement;
    this.skillTargetType = null;

    this.backdrop = document.getElementById('blur-backdrop');
}

BattleManager.prototype.startTargeting = function(characterId, characterName, cardElement, actionType, skillTargetType) {
    if (this.isTargeting) {
        this.resetTargeting(true);
    }

    console.log(`[BattleManager] Personagem ${characterId}:${characterName} iniciando mira com ${actionType}`);

    this.isTargeting = true;
    this.targetingCharacterId = characterId;
    this.targetingActionType = actionType;
    this.targetingCardElement = cardElement;
    this.skillTargetType = skillTargetType;

    if (skillTargetType === 'enemy') {
        document.body.classList.add('targeting-enemy');
    } else if (skillTargetType === 'ally') {
        document.body.classList.add('targeting-ally');
    }

    const actionIcon = cardElement.querySelector(`.action-icon[data-action-type="${actionType}"]`);
    if (actionIcon) {
        actionIcon.classList.add('selected');
    }

    cardElement.classList.add('is-targeting');

    if (this.backdrop) {
        this.backdrop.classList.add('is-active');
    }


    if (this.popup) {
        this.popup.querySelector('p').textContent = "Clique em um alvo válido ou fora para cancelar";
        this.popup.classList.add('show');
    }
}

BattleManager.prototype.confirmTarget = function(enemyId) {
    if (!this.isTargeting) return; // Checagem de segurança

    console.log(`[BattleManager] Personagem ${this.targetingCharacterId} mirou no inimigo ${enemyId}`);

    window.playerActions[this.targetingCharacterId] = {
        type: this.targetingActionType,
        targetId: enemyId
    };
    
    const actionIcon = this.targetingCardElement.querySelector(`.action-icon[data-action-type="${this.targetingActionType}"]`);
    if (actionIcon) {
        actionIcon.classList.remove('selected');
        actionIcon.classList.add('action-defined'); 
    }

    this.resetTargeting(false);

    checkBattleReady();
}

BattleManager.prototype.resetTargeting = function(clearSelectedIcon = true) {
    if (clearSelectedIcon && this.targetingCardElement) {
        delete window.playerActions[this.targetingCharacterId];
        
        this.targetingCardElement.querySelectorAll('.action-icon').forEach(icon => {
            icon.classList.remove('selected');
            icon.classList.remove('action-defined'); 
        });
    }

    if (this.targetingCardElement) {
        this.targetingCardElement.classList.remove('is-targeting');
    }

    this.isTargeting = false;
    this.targetingCharacterId = null;
    this.targetingActionType = null;
    this.targetingCardElement = null;
    this.skillTargetType = null;
    
    document.body.classList.remove('targeting-enemy');
    document.body.classList.remove('targeting-ally');
    
    if (this.backdrop) {
        this.backdrop.classList.remove('is-active');
    }

    if (this.popup) {
        this.popup.classList.remove('show');
    }

    // Atualiza o botão de batalha
    checkBattleReady();
}

BattleManager.prototype.isCurrentlyTargeting = function() {
    return this.isTargeting;
}

const BATTLE_MANAGER = new BattleManager(battleMessagePopup);