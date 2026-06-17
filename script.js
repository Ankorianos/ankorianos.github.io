let currentStep = 0;
let questions = [];

const questionEl = document.getElementById('question');
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const card = document.getElementById('card');

// 1. Načtení otázek z JSON souboru
fetch('steps.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
    })
    .catch(err => console.error("Chyba při načítání JSONu:", err));

// 2. Logika pro utíkající tlačítko "Ne"
function moveNoButton() {
    // Spočítáme náhodnou pozici v rámci viditelné obrazovky s drobnou rezervou
    const padding = 50;
    const x = Math.random() * (window.innerWidth - btnNo.offsetWidth - padding * 2) + padding;
    const y = Math.random() * (window.innerHeight - btnNo.offsetHeight - padding * 2) + padding;
    
    // Protože má tlačítko v CSS 'position: absolute', musíme ho vytrhnout z boxu a hodit na fixní pozici na screenu
    btnNo.style.position = 'fixed';
    btnNo.style.left = `${x}px`;
    btnNo.style.top = `${y}px`;
}

// Spustí se jak při najetí myší, tak při dotyku na mobilu
btnNo.addEventListener('mouseover', moveNoButton);
btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Zabrání nechtěnému kliknutí na mobilu
    moveNoButton();
});

// 3. Logika pro klikání na tlačítko "Ano"
btnYes.addEventListener('click', () => {
    if (questions.length === 0) return;

    if (currentStep < questions.length) {
        // Změníme text na další otázku z JSONu
        questionEl.innerText = questions[currentStep];
        currentStep++;
        
        // Zvětšíme lehce tlačítko "Ano", aby bylo dominantnější
        btnYes.style.transform = `scale(${1 + currentStep * 0.1})`;
    } else {
        // FINÁLE: Kačenka proklikala všech 5 fází
        questionEl.innerHTML = "Ooooh! Slavit se musí! 🎉<br>Oficiálně jsme nejšťastnější pár!";
        btnNo.style.display = 'none'; // Schováme tlačítko Ne
        btnYes.style.display = 'none'; // Schováme tlačítko Ano
        
        // Spustíme nekonečné konfety
        startConfetti();
    }
});

// Pomocná funkce pro efekt konfet
function startConfetti() {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
}