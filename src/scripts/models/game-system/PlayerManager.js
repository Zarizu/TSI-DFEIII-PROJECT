//vou usar funcao construtora por conta dos requisitos do professor
function PlayerManager(){
    this.gold = 0;
    this.luck = 1.0;

    this.inventory = []; 

    this.unlockedSlots = 1; 
    this.maxSlots = 6;
}

PlayerManager.prototype.getGold = function(){
    return this.gold;
}

PlayerManager.prototype.addGold = function(n){
    if(typeof n === 'number' && n >0){
        Math.round(n);
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

PlayerManager.prototype.getNextSlotCost = function() {
    if (this.unlockedSlots >= this.maxSlots) return 0;
    
    return (this.unlockedSlots ** 2) * 100; 
}

PlayerManager.prototype.buySlot = function() {
    if (this.unlockedSlots >= this.maxSlots) return false;

    const cost = this.getNextSlotCost();
    
    if (this.gold >= cost) {
        this.minusGold(cost);
        this.unlockedSlots++;
        return true;
    }
    return false;
}

const PLAYER_MANAGER = new PlayerManager();