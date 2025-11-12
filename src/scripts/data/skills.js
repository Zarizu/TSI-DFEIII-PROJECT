const SKILLS = {
    //                          Nome          Ícone   Descrição       Custo        Alvo   Poder Raridade
    FIREBALL: new DamageSkill('Bola de Fogo', '🔥', 'Causa 10 de dano.', 5,      'enemy',  10,'common'),
    SMITE:    new DamageSkill('Golpe Divino', '✨', 'Causa 8 de dano.',  4,      'enemy',  8,'common'),
    
    //                                  Nome             Ícone   Descrição        Custo     Alvo      Molde do Efeito Duração   Raridade
    POISON_DART: new ApplyEffectSkill('Dardo Venenoso', '🎯', 'Envenena o alvo.',  3,      'enemy',  EFFECTS.POISON,       3,'common'),
    HEAL: new ApplyEffectSkill('Cura Leve', '❤️', 'Cura o alvo por 3 turnos.', 4, 'ally', EFFECTS.REGENERATION, 3,'common')
};