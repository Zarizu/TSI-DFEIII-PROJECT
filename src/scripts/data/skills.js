const SKILLS = {
    
    FIREBALL: new DamageSkill(
        'Bola de Fogo',   
        '🔥',             
        'Causa 10 de dano mágico.', 
        5,                
        'enemy',          
        10                
    ),
    
    SMITE: new DamageSkill(
        'Golpe Divino',
        '✨',
        'Causa 8 de dano mágico.',
        4,
        'enemy',
        8
    ),


    POISON_DART: new ApplyEffectSkill(
        'Dardo Venenoso',
        '🎯',
        'Aplica Veneno por 3 turnos.',
        3,
        'enemy',
        EFFECTS.POISON, 
        3                       
    ),

    HEAL: new ApplyEffectSkill(
        'Cura Leve',
        '❤️',
        'Aplica Regeneração por 3 turnos.',
        4,
        'ally',
        EFFECTS.REGENERATION,
        3
    ),
    
    ICE_SHIELD: new ApplyEffectSkill(
        'Escudada',
        '🛡️',
        'Aplica Escudo em si mesmo por 1 turno.',
        2,
        'ally',
        EFFECTS.SHIELD,
        1
    )
};