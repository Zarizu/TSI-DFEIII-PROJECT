function EnemyAI(){

}

EnemyAI.prototype.processEnemyAI = function(enemy){

    if(enemy.currentHP <= 0) return;

    const didHeal = this.verifyIntegrity(enemy);

    if (didHeal){refreshAllUI(); return};

    const target = ENEMY_AI.findWeakness(enemy, window.team);

    if (target) {
        this.execute(enemy, target);
    } else {
        console.log(`[IA] ${enemy.name} não tem alvos para atacar.`);
    }
    return;
}

EnemyAI.prototype.verifyIntegrity = function(enemy){
    const lightHeal = enemy.skills.find((skill) => skill.name == 'Cura Leve');

    if (!lightHeal || !lightHeal.canUse(enemy)) {
        return false;
    }

    if(enemy.currentHP < (enemy.stats.hp * 0.25)){
        console.log(`[IA] ${enemy.name} decide se curar!`);
        lightHeal.useSkill(enemy,enemy);
        
        return true;
    }

        const injuriedTeammate = window.enemyTeam.find((e) => e.currentHP < (e.stats.hp * 0.50));

        if(injuriedTeammate){
        lightHeal.useSkill(enemy,injuriedTeammate);
        console.log(`[IA] ${enemy.name} decide curar ${injuriedTeammate.name}!`);
        return true;
    }

    return false;

} 

//ataque inimigo inteligente
EnemyAI.prototype.findWeakness = function(enemy, targetList) {
    
    const aliveTargets = targetList.filter(target => target.currentHP > 0);
    
    if (aliveTargets.length === 0) {
        return null; 
    }

    let targetPool = aliveTargets;

    if(targetPool.length == 1){
        return targetPool[0];
    }

    //calculo de média ponderada e aleatoridade para ataque da IA
    let totalScore = 0;
    const weightedTargets = targetPool.map(target => {

        //se o inimigo conseguir matar um do time aliado com um ataque só, tem altas chances de escolher ele
        if(target.currentHP < enemy.stats.damage ){ return {
            target: target,
            score: 200
        };}

        //padrao
        const baseScore = 1;

        // Bônus do ferido
        const hpPercent = target.currentHP / target.stats.hp;

        // (0.0 = HP cheio, 1.0 = HP vazio) e multiplica por 10 para dar peso
        const woundedBonus = (1 - hpPercent) * 10; 

        // Multiplicador de Prioridade de habilidades
        const priorityMultiplier = target.enemyPriority;
        
        // Fórmula Final: (Base + Bônus de Ferido) * Prioridade
        const finalScore = (baseScore + woundedBonus) * priorityMultiplier;
        
        totalScore += finalScore;

        return {
            target: target,
            score: finalScore
        };
    });

    const randomChoice = Math.random() * totalScore;

    let scoreCounter = 0;
    for (const weightedTarget of weightedTargets) {
        scoreCounter += weightedTarget.score;
        
        // Se o "dado" for menor que o placar acumulado, esse é o vencedor
        if (randomChoice <= scoreCounter) {
            console.log(`[IA] ${enemy.name} escolheu ${weightedTarget.target.name} (Placar: ${weightedTarget.score.toFixed(2)})`);
            return weightedTarget.target;
        }
    }
    
    return targetPool[0];
};

EnemyAI.prototype.execute = function(enemy, target){
    const attackerCard = enemyArea.querySelector(`.enemy-card[data-id="${enemy.id}"]`);
    const targetCard = playerArea.querySelector(`.player-card[data-id="${target.id}"]`);

    playAnimation(attackerCard, 'is-attacking-melee', 500);

    setTimeout(() => {
        const attackResult = enemy.meleeAttack(target);

        animate(attackResult,targetCard);
    }, 250);

    return;
}

ENEMY_AI = new EnemyAI(); 