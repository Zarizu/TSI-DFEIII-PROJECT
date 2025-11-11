function BattleViewManager(popupElement) {
    
    this.isTargeting = false;
    this.targetingCharacterId = null;
    this.targetingActionType = null;
    this.targetingCardElement = null;

    this.popup = popupElement;
    this.skillTargetType = null;

    this.backdrop = document.getElementById('blur-backdrop');

    this.targetingSkill = null;
}

BattleViewManager.prototype.startTargeting = function(characterId, characterName, cardElement, actionType, skillTargetType, skillObject = null) {
    if (this.isTargeting) {
        this.resetTargeting(true);
    }

    this.isTargeting = true;
    this.targetingCharacterId = characterId;
    this.targetingActionType = actionType;
    this.targetingCardElement = cardElement;
    this.skillTargetType = skillTargetType;
    this.targetingSkill = skillObject;

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

BattleViewManager.prototype.confirmTarget = function(enemyId) {
    if (!this.isTargeting) return;

    window.playerActions[this.targetingCharacterId] = {
        type: this.targetingActionType,
        targetId: enemyId
    };
    
    const actionIcon = this.targetingCardElement.querySelector(`.action-icon[data-action-type="${this.targetingActionType}"]`);
    if (actionIcon) {
        actionIcon.classList.remove('selected');
        actionIcon.classList.add('action-defined'); 
    }

    if (this.targetingActionType === 'skill' && this.targetingSkill) {
        window.playerActions[this.targetingCharacterId].skillId = this.targetingSkill.id;
        window.playerActions[this.targetingCharacterId].skillName = this.targetingSkill.name;
        window.playerActions[this.targetingCharacterId].skillTargetType = this.skillTargetType;
    }

    this.resetTargeting(false);

    checkBattleReady();
}

BattleViewManager.prototype.resetTargeting = function(clearSelectedIcon = true) {
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
    this.targetingSkill = null;
    
    document.body.classList.remove('targeting-enemy');
    document.body.classList.remove('targeting-ally');
    
    if (this.backdrop) {
        this.backdrop.classList.remove('is-active');
    }

    if (this.popup) {
        this.popup.classList.remove('show');
    }

    checkBattleReady();
}

BattleViewManager.prototype.isCurrentlyTargeting = function() {
    return this.isTargeting;
}

const BATTLE_VIEW_MANAGER = new BattleViewManager(battleMessagePopup);