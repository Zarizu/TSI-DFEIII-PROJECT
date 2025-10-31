//vou usar funcao construtora por conta dos requisitos do professor
function Player(){
    this.gold = 0; 
}

Player.prototype.getGold = function(){
    return this.gold;
}

Player.prototype.addGold = function(n){
    if(typeof n === 'number' && n >0){
        this.gold += n;
    }
    return this.gold;
}

Player.prototype.minusGold = function(n){
    if(typeof n === 'number' && n >0){
        this.gold -= n;
    }
    return this.gold;
}

const playerManager = new Player();