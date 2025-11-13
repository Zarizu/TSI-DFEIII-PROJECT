const ID_COUNTER_KEY_SKILL = 'gameSkillIdCounter';

function getNextSkillId() {
    let nextId = localStorage.getItem(ID_COUNTER_KEY_SKILL);

    if (nextId === null) {
        nextId = 1;
    } else {
        nextId = parseInt(nextId, 10);
    }
    
    localStorage.setItem(ID_COUNTER_KEY_SKILL, (nextId + 1).toString());

    return nextId;
}
function Skill(name, icon, description, targetType, manaCost, rarity ='common'){
        
    this.id = getNextSkillId();
    this.name = name;
    this.icon = icon;
    this.description = description;
    this.targetType = targetType;
    this.manaCost = manaCost;
    this.rarity = rarity;

}

Skill.prototype.canUse = function(caster){
    if(caster.currentMana < this.manaCost){
        return false;
    }
    return true;
}

Skill.prototype.useSkill = function(caster, target){
    if(!this.canUse(caster)){
        return;
    }

    caster.currentMana -= this.manaCost;
    
    return this.execute(caster, target);
}

Skill.prototype.execute = function(caster,target){console.error(`A Skill ${this.name} não tem um método 'execute' implementado!`);}

function DamageSkill(name, icon, description, manaCost, targetType, basePower, rarity) {
    Skill.call(this, name, icon, description, targetType, manaCost, rarity);
    
    this.basePower = basePower;
}

DamageSkill.prototype = Object.create(Skill.prototype);
DamageSkill.prototype.constructor = DamageSkill;

DamageSkill.prototype.execute = function(caster, target) {
    let damage = this.basePower + caster.stats.skill;
    
    let finalDamage = damage - target.stats.magic_resist;
    if (finalDamage < 1) finalDamage = 1;

    if(target.currentHP >= finalDamage)target.currentHP -= finalDamage
        else{
            target.currentHP = 0;
        }
    
    return { type: 'damage', amount: finalDamage };
}

function ApplyEffectSkill(name, icon, description, manaCost, targetType, effectToApply, duration, rarity) {
    Skill.call(this, name, icon, description, targetType, manaCost, rarity);
    
    this.effectToApply = effectToApply;
    this.duration = duration;
}

ApplyEffectSkill.prototype = Object.create(Skill.prototype);
ApplyEffectSkill.prototype.constructor = ApplyEffectSkill;

ApplyEffectSkill.prototype.execute = function(caster, target) {
    console.log(`%c[SKILL] ${caster.name} usa ${this.name} em ${target.name}!`, "color: #3498db;");
    
    this.effectToApply.applyEffect(caster, target, this.duration);

    return { type: 'effect', effect: this.effectToApply };
}