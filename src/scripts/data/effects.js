const EFFECTS = {
    POISON: new DamageOverTimeEffect('Envenenado', '☠️', 'Causa dano por turno.', 
        5,     
        'skill'
    ),

    BURNING: new DamageOverTimeEffect('Queimando', '🔥', 'Causa dano de fogo.',
        3,       
        'skill'  
    ),
    
    SHIELD: new StatBuffEffect('Escudo', '🛡️', 'Aumenta a Armadura.',
        'armor',
        10       
    ),

    ATTACK_BUFF: new StatBuffEffect('Buff de Ataque', '⚔️', 'Aumenta o Dano.',
        'damage',
        5,        
    ),
    
    REGENERATION: new HealOverTimeEffect('Cura Leve', '💚', 'Cura HP por turno.',
        5,     
        'hp_regen'  
    )
};