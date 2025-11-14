const ID_COUNTER_KEY_EFFECT = 'gameEffectIdCounter';

function getNextEffectId() {
    let nextId = localStorage.getItem(ID_COUNTER_KEY_EFFECT);

    if (nextId === null) {
        nextId = 1;
    } else {
        nextId = parseInt(nextId, 10);
    }
    
    localStorage.setItem(ID_COUNTER_KEY_EFFECT, (nextId + 1).toString());

    return nextId;
}
//funcao construtora
//classe generica
function Effect(name, icon, description,effectType, rarity = 'common'){
    
    this.id = getNextEffectId();
    this.name = name;
    this.icon = icon;
    this.description = description;

    //buff, debuff
    this.effectType = effectType;
    
    this.rarity = rarity;
    this.duration = 0;    
}

Effect.prototype.applyEffect = function(caster, target, duration) {
    
    const newInstance = Object.create(Object.getPrototypeOf(this));
    Object.assign(newInstance, this);
    newInstance.duration = duration;
    newInstance.id = getNextEffectId();
    newInstance.casterId = caster.id;
    
    if (typeof newInstance.onApply === 'function') {
        newInstance.onApply(caster, target);
    }

    const existingEffectIndex = target.effects.findIndex(e => e.name === this.name);

    if (existingEffectIndex > -1) {
        const existingEffect = target.effects[existingEffectIndex];
        
        if (newInstance.power > existingEffect.power) {
            
            if (typeof existingEffect.onRemove === 'function') {
                existingEffect.onRemove(target);
            }
            
            target.effects[existingEffectIndex] = newInstance;
            console.log(`[Efeito] ${newInstance.name} (mais forte) substituiu o antigo.`);
        
        } else {
            existingEffect.duration = duration;
            existingEffect.casterId = caster.id; // Atualiza o "dono"
            console.log(`[Efeito] ${existingEffect.name} teve a duração renovada (o novo não era mais forte).`);
        }
        return;
    }
    
    target.effects.push(newInstance);
    refreshAllUI();
}

//Métodos virtuais (placeholders para efeitos especificos)

// Chamado no momento em que o efeito é aplicado
Effect.prototype.onApply = function(caster, target) {}
// Chamado a cada turno que o efeito está ativo
Effect.prototype.onTick = function(caster,target) {}
// Chamado quando a duração chega a 0 e o efeito é removido
Effect.prototype.onRemove = function(caster,target) {}

//classes especificas de efeito (Classes-filho)

//Efeitos que causam dano por Turno
function DamageOverTimeEffect(name, icon, description, baseDamage, scalingStat, rarity = 'common') {
    //heranca
    Effect.call(this, name, icon, description,'debuff', rarity);

    this.baseDamage = baseDamage;
    this.scalingStat = scalingStat;

    this.damagePerTick = 0;
}

//heranca prototípica
DamageOverTimeEffect.prototype = Object.create(Effect.prototype);
DamageOverTimeEffect.prototype.constructor = DamageOverTimeEffect;

DamageOverTimeEffect.prototype.onApply = function(caster, target){
    const casterStatValue = caster.stats[this.scalingStat];

    //dano base + stat
    this.damagePerTick = Math.round(this.baseDamage * casterStatValue);

    this.power = this.damagePerTick;
}

// override de método
DamageOverTimeEffect.prototype.onTick = function(target) {
    console.log(`[Efeito] ${target.name} sofre ${this.damagePerTick} de dano de ${this.name}!`);
    if(target.currentHP <= this.damagePerTick){ this.currentHP = 0; return};     
    target.currentHP -= this.damagePerTick;

}

//Buff de stat
function StatBuffEffect(name, icon, description, statToBuff, amount, rarity = 'common') {
    Effect.call(this, name, icon, description,'buff',rarity);
    
    this.statToBuff = statToBuff;
    this.amount = amount;
}

StatBuffEffect.prototype = Object.create(Effect.prototype);
StatBuffEffect.prototype.constructor = StatBuffEffect;

StatBuffEffect.prototype.onApply = function(caster, target) {
    console.log(`%c[Efeito] ${target.name} ganha ${this.amount} de ${this.statToBuff}!`, "color: #4CAF50;");
    
    if (target.stats[this.statToBuff] !== undefined) {
        target.stats[this.statToBuff] += this.amount;

        if (this.statToBuff === 'hp') {
            target.currentHP += this.amount;
        } else if (this.statToBuff === 'mana') {
            target.currentMana += this.amount;
        }
    }
    this.power = this.amount;
}

StatBuffEffect.prototype.onRemove = function(caster, target) {
    console.log(`%c[Efeito] ${target.name} perde ${this.amount} de ${this.statToBuff}!`, "color: #4CAF50;");
    
    if (target.stats[this.statToBuff] !== undefined) {

        target.recalculateAll();
    }

    if (this.statToBuff === 'hp' && target.currentHP > target.stats.hp) {
            target.currentHP = target.stats.hp;
        }
        if (this.statToBuff === 'mana' && target.currentMana > target.stats.mana) {
            target.currentMana = target.stats.mana;
        }
}

// Cura com o tempo
function HealOverTimeEffect(name, icon, description, baseHeal, scalingStat, rarity = 'common') {
    Effect.call(this, name, icon, description,'buff',rarity);

    this.baseHeal = baseHeal;
    this.scalingStat = scalingStat;

    this.healPerTick = 0;
}

HealOverTimeEffect.prototype = Object.create(Effect.prototype);
HealOverTimeEffect.prototype.constructor = HealOverTimeEffect;

HealOverTimeEffect.prototype.onApply= function(caster, target){
    const casterStatValue = caster.stats[this.scalingStat];
    this.healPerTick = Math.round(casterStatValue / this.duration);
    this.power = this.healPerTick;
}
HealOverTimeEffect.prototype.onTick = function(target) {
    console.log(`%c[Efeito] ${target.name} recupera ${this.healPerTick} de HP de ${this.name}!`, "color: #4CAF50;");
    
    target.currentHP += this.healPerTick;

    if (target.currentHP > target.stats.hp) {
        target.currentHP = target.stats.hp;
    }
}