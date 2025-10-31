//vou usar funcao construtora por conta dos requisitos do professor
function GameManager(){
    this.round = 1;

}

GameManager.prototype.getRound = function(){
    return this.round;
}

GameManager.prototype.passRound = function(){
    this.round +=1;
    return this.round;
}