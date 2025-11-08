//funcao construtora
//classe generica
function Effect(name, icon, description){
        
    this.name = name;
    this.icon = icon;
    this.description = description;
    
    this.duration = 0;    
}

Effect.prototype.applyEffect = function(target, duration) {
    const existingEffect = target.effects.find(e => e.name === this.name);
    
    //caso o alvo já tenha o efeito, apenas reseta a duração (quero mudar isso depois, podendo stackar efeitos)
    if (existingEffect) {
        existingEffect.duration = duration;
        return;
    }

    const newEffectInstance = new Effect(
        this.name,
        this.icon,
        this.description
    );

    newEffectInstance.duration = duration;
    
    target.effects.push(newEffectInstance);
}

//Métodos virtuais (placeholders para efeitos especificos)

// Chamado no momento em que o efeito é aplicado
Effect.prototype.onApply = function(target) {}

// Chamado a cada turno que o efeito está ativo
Effect.prototype.onTick = function(target) {}

// Chamado quando a duração chega a 0 e o efeito é removido
Effect.prototype.onRemove = function(target) {}


//classes especificas de efeito (Classes-filho)

//Efeitos que causam dano por Turno
function DamageOverTimeEffect(name, icon, description, damagePerTick) {
    //heranca
    Effect.call(this, name, icon, description);
    
    this.damagePerTick = damagePerTick;
}

//heranca prototípica
DamageOverTimeEffect.prototype = Object.create(Effect.prototype);
DamageOverTimeEffect.prototype.constructor = DamageOverTimeEffect;

// override de método
DamageOverTimeEffect.prototype.onTick = function(target) {
    console.log(`%c[Efeito] ${target.name} sofre ${this.damagePerTick} de dano de ${this.name}!`);
    target.currentHP -= this.damagePerTick;

    // No futuro, checar se target.currentHP < 0
}

//Buff de stat
function StatBuffEffect(name, icon, description, statToBuff, amount) {
    Effect.call(this, name, icon, description);
    
    this.stat = statToBuff;
    this.amount = amount;
}

StatBuffEffect.prototype = Object.create(Effect.prototype);
StatBuffEffect.prototype.constructor = StatBuffEffect;

StatBuffEffect.prototype.onApply = function(target) {
    console.log(`%c[Efeito] ${target.name} ganha ${this.amount} de ${this.stat}!`, "color: #4CAF50;");
    
    if (target.stats[this.stat] !== undefined) {
        target.stats[this.stat] += this.amount;

        //  atualizar o currentStat se for hp atual ou mana atual
    }
}

StatBuffEffect.prototype.onRemove = function(target) {
    console.log(`%c[Efeito] ${target.name} ganha ${this.amount} de ${this.stat}!`, "color: #4CAF50;");
    
    if (target.stats[this.stat] !== undefined) {
        target.stats[this.stat] -= this.amount;
    }
}