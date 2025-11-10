document.addEventListener("DOMContentLoaded", function() {
    const startBtn = document.getElementById("start-btn");
    const settingsBtn = document.getElementById("settings-btn");
    const creditsBtn = document.getElementById("credits-btn");

    // Define os redirecionamentos
    startBtn.addEventListener("click", function() {
        window.location.href = "/pages/char_creation.html"; 
    });

    settingsBtn.addEventListener("click", function() {
        window.location.href = "/pages/settings.html"; 
    });

    creditsBtn.addEventListener("click", function() {
        window.location.href = "/pages/credits.html";
    });
});
