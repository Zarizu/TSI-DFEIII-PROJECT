    // animacao de queda de emojis
    const animationContainer = document.querySelector('.background-animation');
    const numberOfIcons = 12; 

    for (let i = 0; i < numberOfIcons; i++) {
        const iconSpan = document.createElement('span');
        animationContainer.appendChild(iconSpan);
    }
    
    const pointsValueEl = document.getElementById('points-value');
    const startButton = document.getElementById('main-start');
    const charNameInput = document.getElementById('char-name-input');

    const plusButtons = document.querySelectorAll('.stat-btn.plus');
    const minusButtons = document.querySelectorAll('.stat-btn.minus');
    