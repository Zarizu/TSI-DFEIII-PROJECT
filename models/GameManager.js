//vou usar funcao construtora por conta dos requisitos do professor
function GameManager(){
    this.phase = 1;
    this.round = 1;
    
}

GameManager.prototype.getPhase = function(){
    return this.phase;
}

GameManager.prototype.passPhase = function(){
    this.phase +=1;
    return this.phase;
}

GameManager.prototype.getRound = function(){
    return this.round;
}

GameManager.prototype.passRound = function(){
    this.round +=1;
    return this.round;
}

const GAME_MANAGER = new GameManager();