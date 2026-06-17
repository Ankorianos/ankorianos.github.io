let currentStep = 0;
let questions = [];

const envelopeWrapper = document.getElementById('envelope-wrapper');
const mainCard = document.getElementById('main-card');
const cardContent = document.getElementById('card-content');
const finalScreen = document.getElementById('final-screen');
const questionEl = document.getElementById('question');
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const bgMusic = document.getElementById('bg-music');
const heartsBg = document.getElementById('hearts-bg');

// 1. Generování plovoucích srdíček na pozadí
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.innerText = ['❤️', '💖', '💝', '💕'][Math.floor(Math.random() * 4)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 3 + 4 + 's'; // 4-7 sekund
    heart.style.fontSize = Math.random() * 15 + 15 + 'px'; // 15-30px
    
    heartsBg.appendChild(heart);
    
    // Smazání srdíčka po dokončení animace
    setTimeout(() => {
        heart.remove();
    }, 7000);
}
setInterval(createFloatingHeart, 400);

// 2. Načtení otázek z JSONu
fetch('steps.json')
    .then(res => res.json())
    .then(data => questions = data)
    .catch(err => console.error("Chyba při načítání JSON:", err));

// 3. Otevření obálky a start hry + hudby
envelopeWrapper.addEventListener('click', () => {
    envelopeWrapper.classList.add('open');
    
    // Spuštění hudby (prohlížeče vyžadují interakci uživatele, což kliknutí splňuje)
    bgMusic.volume = 0.4;
    bgMusic.play().catch(e => console.log("Hudbu se nepodařilo spustit automaticky:", e));

    // Skrytí obálky a zobrazení dotazníku s jemným zpožděním kvůli animaci dopisu
    setTimeout(() => {
        envelopeWrapper.style.display = 'none';
        mainCard.classList.remove('hidden');
    }, 1200);
});

// 4. Logika pro utíkající tlačítko "Ne"
function moveNoButton() {
    const padding = 60;
    const x = Math.random() * (window.innerWidth - btnNo.offsetWidth - padding * 2) + padding;
    const y = Math.random() * (window.innerHeight - btnNo.offsetHeight - padding * 2) + padding;
    
    btnNo.style.position = 'fixed';
    btnNo.style.left = `${x}px`;
    btnNo.style.top = `${y}px`;
}
btnNo.addEventListener('mouseover', moveNoButton);
btnNo.addEventListener('touchstart', (e) => { e.preventDefault(); moveNoButton(); });

// 5. Klikání na tlačítko "Ano"
btnYes.addEventListener('click', () => {
    if (questions.length === 0) return;

    if (currentStep < questions.length) {
        questionEl.innerText = questions[currentStep];
        currentStep++;
        // Zvětšení tlačítka "Ano" pro humorný efekt dominace
        btnYes.style.transform = `scale(${1 + currentStep * 0.12})`;
    } else {
        // FINÁLE
        cardContent.classList.add('hidden');
        
        // Zobrazení tajné závěrečné obrazovky
        setTimeout(() => {
            cardContent.style.display = 'none';
            finalScreen.classList.remove('hidden');
            startConfetti();
        }, 300);
    }
});

// Nekonečný efekt konfet
function startConfetti() {
    const duration = 20 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 100 };

    function randomInRange(min, max) { return Math.random() * (max - min) + min; }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 40 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 300);
}