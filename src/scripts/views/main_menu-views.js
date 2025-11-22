document.addEventListener("DOMContentLoaded", function() {
    const startBtn = document.getElementById("start-btn");
    const settingsBtn = document.getElementById("settings-btn");
    const creditsBtn = document.getElementById("credits-btn");

    // Define os redirecionamentos
    startBtn.addEventListener("click", function() {
        let seed = Math.random().toString(36).substring(2);
        localStorage.clear();
        localStorage.setItem('api_seed', seed);

        window.location.href = "./src/pages/char_creation.html";
    });

    settingsBtn.addEventListener("click", function() {
        //adiciona na propria pagina
        //window.location.href = "/pages/settings.html"; 
    });

    creditsBtn.addEventListener("click", function() {
        //adiciona na propria pagina
        //window.location.href = "./pages/credits.html";
    });
 
});
