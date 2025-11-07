//funcao construtora
function Effect(name, icon, description){
        
    this.name = name;
    this.icon = icon;
    this.description = description;
    
    this.duration = 0;    
}

Effect.prototype.applyEffect = function(target, duration) {
    
    const newEffectInstance = new Effect(
        this.name,
        this.icon,
        this.duration = duration,
        this.description
    );

    newEffectInstance.duration = duration;
    
    target.effects.push(newEffectInstance);
}