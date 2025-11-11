const ID_COUNTER_KEY_VOCATION_SKILL = 'gameVocationIdCounter';

function getNextVocationId() {
    let nextId = localStorage.getItem(ID_COUNTER_KEY_VOCATION_SKILL);

    if (nextId === null) {
        nextId = 1;
    } else {
        nextId = parseInt(nextId, 10);
    }
    
    localStorage.setItem(ID_COUNTER_KEY_VOCATION_SKILL, (nextId + 1).toString());

    return nextId;
}

function VocationSkill(name, icon, description, targetType, rarity ='common', atrribute){
    this.id = getNextVocationId();
    this.name = name;
    this.icon = icon;
    this.description = description;
    this.targetType = targetType;
    this.manaCost = manaCost;
    this.rarity = rarity;
    this.atribute = atrribute;
}

VocationSkill.prototype.addVocation = function(){

}
