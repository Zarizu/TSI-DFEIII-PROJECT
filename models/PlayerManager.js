//vou usar funcao construtora por conta dos requisitos do professor
function PlayerManager(){
    this.gold = 0; 
}

PlayerManager.prototype.getGold = function(){
    return this.gold;
}

PlayerManager.prototype.addGold = function(n){
    if(typeof n === 'number' && n >0){
        this.gold += n;
    }
    return this.gold;
}

PlayerManager.prototype.minusGold = function(n){
    if(typeof n === 'number' && n >0){
        this.gold -= n;
    }
    return this.gold;
}

const PLAYER_MANAGER = new PlayerManager();