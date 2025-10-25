document.addEventListener('DOMContentLoaded', function() {
            
    // --- 5. Easter Egg Modal Logic ---
    const modalToggle = document.getElementById('easter-egg-toggle');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    const modalNo = document.getElementById('modal-no');
    const modalYes = document.getElementById('modal-yes');
    const modalQuestion = document.getElementById('modal-question');
    const gameContainer = document.getElementById('game-container');
    const gameClose = document.getElementById('game-close');

    const openModal = () => {
        if (modalOverlay) modalOverlay.classList.remove('opacity-0', 'pointer-events-none');
        if (modalContent) modalContent.classList.remove('scale-95');
        // Reset to question
        if (modalQuestion) modalQuestion.classList.remove('hidden');
        if (gameContainer) gameContainer.classList.add('hidden');
    };

    const closeModal = () => {
        if (modalOverlay) modalOverlay.classList.add('opacity-0', 'pointer-events-none');
        if (modalContent) modalContent.classList.add('scale-95');
    };

    if (modalToggle) modalToggle.addEventListener('click', openModal);
    if (modalNo) modalNo.addEventListener('click', closeModal);
    if (gameClose) gameClose.addEventListener('click', closeModal);

    // On "Yes", switch to game
    if (modalYes) {
        modalYes.addEventListener('click', () => {
            if (modalQuestion) modalQuestion.classList.add('hidden');
            if (gameContainer) gameContainer.classList.remove('hidden');
        });
    }

    // Close modal if clicking overlay
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }


    // --- 6. Clicker Game Logic ---
    const gameButton = document.getElementById('game-button');
    const currencyAmountEl = document.getElementById('game-currency-amount');
    let currentAmount = 0;

    if (gameButton && currencyAmountEl) {
        gameButton.addEventListener('click', () => {
            currentAmount += 1;
            currencyAmountEl.textContent = currentAmount;
            
            // Add animation
            currencyAmountEl.classList.add('animate-pulse-green');
            
            // Remove animation after it finishes
            setTimeout(() => {
                currencyAmountEl.classList.remove('animate-pulse-green');
            }, 500); // Must match animation duration
        });
    }

});
