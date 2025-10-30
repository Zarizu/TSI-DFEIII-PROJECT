//variavel global sem precisar usar 'var'
let firstChar;

document.addEventListener('DOMContentLoaded',()=>{
    //importação do personagem
    let firstCharData = localStorage.getItem('FirstCharData');

    if(firstCharData){
        firstChar = JSON.parse(firstCharData);
        let attributes = firstChar.attributes
        firstChar = new Character(firstChar.name,[attributes['atk'],attributes['con'],attributes['int']]);
        console.log(firstChar);
        localStorage.clear();
    }else{
        localStorage.clear();
        console.error(`Falha ao criar o primeiro personagem`);
        firstChar = new Character('teste',[3,2,1]);
        console.log(`DEBUG: Criação de personagem padrão para testes de desenvolvimento:`);
        console.log(firstChar);
        
        
        
    }
    
})
