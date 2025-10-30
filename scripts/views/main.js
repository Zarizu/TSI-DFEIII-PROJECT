//variavel global sem precisar usar 'var'
let firstChar;

document.addEventListener('DOMContentLoaded',()=>{
    //importação do personagem
    let firstCharData = localStorage.getItem('FirstCharData');

    if(firstCharData){
        firstChar = JSON.parse(firstCharData);
        let attributes = firstChar.attributes
        console.log(attributes);
        
        firstChar = new PCharacter(firstChar.name,attributes);
        console.log(firstChar);
        localStorage.clear();
    }else{
        localStorage.clear();
        console.error(`Falha ao criar o primeiro personagem`);
        firstChar = new PCharacter('teste',{"atk":3,"con":2,"int":1});
        console.log(`DEBUG: Criação de personagem padrão para testes de desenvolvimento:`);
        console.log(firstChar);
        
        
        
    }
    
})
