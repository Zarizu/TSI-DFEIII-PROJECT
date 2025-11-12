const EFFECTS = {
    POISON:         new DamageOverTimeEffect('Envenenado', '☠️', 'Causa 5 de dano por turno.', 5),
    BURNING:        new DamageOverTimeEffect('Queimando', '🔥', 'Causa 3 de dano de fogo.', 3,'skill'),
    
    SHIELD:         new StatBuffEffect('Escudo', '🛡️', 'Aumenta a Armadura em 10.', 'armor', 10),
    ATTACK_BUFF:    new StatBuffEffect('Buff de Ataque', '⚔️', 'Aumenta o Dano em 5.', 'damage', ),
    
    REGENERATION:   new HealOverTimeEffect('Regeneração', '💚', 'Cura 5 de HP por turno.', 5,'common')
    
};
