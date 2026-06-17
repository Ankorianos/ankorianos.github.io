let currentStep = 0;
let questions = [];

// Hlavní prvky, které budeme potřebovat
const envelopeWrapper = document.getElementById('envelope-wrapper');
const mainCard = document.getElementById('main-card');
const cardContent = document.getElementById('card-content');
const finalScreen = document.getElementById('final-screen');
const questionEl = document.getElementById('question');
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no'); // Tlačítko Ne
const bgMusic = document.getElementById('bg-music');
const heartsBg = document.getElementById('hearts-bg');

// 1. Generování plovoucích srdíček na pozadí (zůstává)
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.innerText = ['❤️', '💖', '💝', '💕'][Math.floor(Math.random() * 4)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 3 + 4 + 's'; 
    heart.style.fontSize = Math.random() * 15 + 15 + 'px'; 
    heartsBg.appendChild(heart);
    setTimeout(() => { heart.remove(); }, 7000);
}
setInterval(createFloatingHeart, 400);

// 2. Načtení otázek z JSONu (zůstává)
fetch('steps.json')
    .then(res => res.json())
    .then(data => questions = data)
    .catch(err => console.error("Chyba při načítání JSON:", err));


// --- TADY JE TA KLÍČOVÁ ZMĚNA ---
// 3. Otevření obálky, start hry + hudby A OPRAVA TLAČÍTKA NE
envelopeWrapper.addEventListener('click', () => {
    envelopeWrapper.classList.add('open');
    
    // Spuštění hudby
    bgMusic.volume = 0.4;
    bgMusic.play().catch(e => console.log("Hudba se nespustila:", e));

    // --- MAGICKÝ TRIK ---
    // Vezmeme tlačítko Ne a přesuneme ho v HTML struktuře na konec body.
    // Tím ho osvobodíme od všech omezujících kontejnerů!
    document.body.appendChild(btnNo);

    // Nastavíme mu výchozí zobrazení, aby na začátku nezmizelo
    btnNo.style.position = 'fixed'; // FIXED zajistí, že se bude počítat od kraje obrazovky
    btnNo.style.zIndex = '1000'; // Zajistíme, aby bylo vždy navrchu
    btnNo.style.left = '50%'; // Vycentrujeme ho na střed
    btnNo.style.transform = 'translateX(-50%)'; // Přesné vycentrování
    btnNo.style.top = '70%'; // Umístíme ho pod kartu (přibližně)

    // Skrytí obálky a zobrazení dotazníku s jemným zpožděním
    setTimeout(() => {
        envelopeWrapper.style.display = 'none';
        mainCard.classList.remove('hidden');
    }, 1200);
});


// --- TADY JE OPRAVENÁ LOGIKA USKAKOVÁNÍ ---
// 4. Logika pro utíkající tlačítko "Ne" - Definitivní verze
function moveNoButton() {
    const padding = 60; // Bezpečná zóna od okrajů monitoru (v pixelech)
    
    // Šířka a výška okna prohlížeče
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Šířka a výška samotného tlačítka
    const btnWidth = btnNo.offsetWidth;
    const btnHeight = btnNo.offsetHeight;
    
    // Vypočítáme maximální možnou pozici pro x a y
    const maxX = windowWidth - btnWidth - padding;
    const maxY = windowHeight - btnHeight - padding;
    
    // Vypočítáme náhodnou pozici, ale zajistíme, aby nebyla menší než 'padding'
    let randomX = Math.random() * (maxX - padding) + padding;
    let randomY = Math.random() * (maxY - padding) + padding;
    
    // Aplikujeme nové souřadnice. Odstraníme transform, který by to centroval.
    btnNo.style.transform = 'none'; 
    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;
}
// Při najetí myší i při dotyku uskočí.
btnNo.addEventListener('mouseover', moveNoButton);
btnNo.addEventListener('touchstart', (e) => { e.preventDefault(); moveNoButton(); });


// 5. Klikání na tlačítko "Ano" (zůstává stejné)
btnYes.addEventListener('click', () => {
    if (questions.length === 0) return;

    if (currentStep < questions.length) {
        questionEl.innerText = questions[currentStep];
        currentStep++;
        btnYes.style.transform = `scale(${1 + currentStep * 0.12})`;
    } else {
        // FINÁLE
        cardContent.classList.add('hidden');
        
        // --- SCHOVÁME UPRCHLÉ TLAČÍTKO NE ---
        // V finále ho už nepotřebujeme.
        btnNo.style.display = 'none';
        
        setTimeout(() => {
            cardContent.style.display = 'none';
            finalScreen.classList.remove('hidden');
            startConfetti();
        }, 300);
    }
});

// Nekonečný efekt konfet (zůstává)
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