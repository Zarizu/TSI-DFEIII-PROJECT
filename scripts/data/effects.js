
const EFFECTS = []; 
function createEffect(name, icon, description){EFFECTS.push(new Effect(name, icon, description))};
function getEffect(name){return EFFECTS.find(effect => effect.name === name)};

createEffect('Envenenado','☠️','Descricao veneno');
createEffect('Escudo','🛡️', 'descricao escudo');
createEffect('Buff de Ataque','⚔️','descricao buff de ataque');