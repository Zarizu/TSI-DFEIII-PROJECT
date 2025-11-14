//vou usar funcao construtora por conta dos requisitos do professor
function GameManager(){
    this.phase = 1;
    this.round = 1;

    this.baseEnemyStatPool = 1;
}

GameManager.prototype.getRound = function() { return this.round; }
GameManager.prototype.getPhase = function() { return this.phase; }
GameManager.prototype.passRound = function() { this.round++; return this.round; }
GameManager.prototype.resetRound = function() { this.round = 1; return this.round; }

GameManager.prototype.passPhase = function() { 
    this.phase++;
    this.round = 1;
    return this.phase; 
}

GameManager.prototype.getEnemyStatPool = function() {

    return this.baseEnemyStatPool + ((this.phase - 1) * 2);
}

const GAME_MANAGER = new GameManager();