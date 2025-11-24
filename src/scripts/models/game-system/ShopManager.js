function ShopManager() {
    this.shopInventory = []; 
}


ShopManager.prototype.generateShop = function() {
    this.shopInventory = [];
    
    // Gera 3 mercenários
    for (let i = 0; i < 3; i++) {
        // criacao do mercenario
        const merc = MERCENARY_GENERATOR.generateMercenary();
        
        // Calcula o preço
        // Preço = Base (50) + (Nível * 50) + (Total de Atributos * 10)
        const totalStats = Object.values(merc.attributes).reduce((a,b)=>a+b, 0);
        merc.cost = 50 + (merc.lvl * 50) + (totalStats * 10);

        this.shopInventory.push(merc);
    }
}

ShopManager.prototype.buyMercenary = function(index) {
    const merc = this.shopInventory[index];
    
    if (!merc) return false;

    if (PLAYER_MANAGER.getGold() < merc.cost) {
        console.warn("Ouro insuficiente!");
        return false;
    }

    if (window.team.length >= MAX_TEAM_SIZE) {
        console.warn("Time cheio!");
        return false;
    }

    // Compra
    PLAYER_MANAGER.minusGold(merc.cost);
    addCharToSquad(merc); 
    
    // Remove da loja
    this.shopInventory.splice(index, 1);
    
    return true;
}

const SHOP_MANAGER = new ShopManager();