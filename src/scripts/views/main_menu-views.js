document.addEventListener("DOMContentLoaded", function() {
    const startBtn = document.getElementById("start-btn");
    const settingsBtn = document.getElementById("settings-btn");
    const creditsBtn = document.getElementById("credits-btn");

    // Define os redirecionamentos
    startBtn.addEventListener("click", function() {
        window.location.href = "./src/pages/char_creation.html";
        let seed = Math.random().toString(36).substring(2);
        const api_conn = new ConnectionAPI(seed);
        localStorage.clear();
        localStorage.setItem('connection_api', JSON.stringify(api_conn));
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
