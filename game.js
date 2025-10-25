// --- 1. GAME & MODAL LOGIC ---
document.addEventListener('DOMContentLoaded', () => {

    // --- Modal Elements ---
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    const easterEggToggle = document.getElementById('easter-egg-toggle');
    const modalNo = document.getElementById('modal-no');
    const modalYes = document.getElementById('modal-yes');
    const gameClose = document.getElementById('game-close');
    const modalQuestion = document.getElementById('modal-question');
    const gameContainer = document.getElementById('game-container');

    // --- Game Elements ---
    const gameButton = document.getElementById('game-button');
    const currencyAmountDisplay = document.getElementById('game-currency-amount');
    const upgradeClickButton = document.getElementById('upgrade-click');
    const upgradeAutoButton = document.getElementById('upgrade-auto');
    
    // --- Game UI Displays ---
    const clickLevelDisplay = document.getElementById('click-level-display');
    const clickCostDisplay = document.getElementById('click-cost-display');
    const autoLevelDisplay = document.getElementById('auto-level-display');
    const autoCostDisplay = document.getElementById('auto-cost-display');
    const autoPowerDisplay = document.getElementById('auto-power-display');
    const gameButtonDisplay = document.getElementById('game-button');

    // --- Achievement Elements ---
    const achievementToast = document.getElementById('achievement-toast');
    const achievementToastTitle = document.getElementById('achievement-toast-title');
    const achievementToastDesc = document.getElementById('achievement-toast-desc');
    const toggleAchievementsButton = document.getElementById('toggle-achievements');
    const achievementsListContainer = document.getElementById('achievements-list-container');
    const achievementsList = document.getElementById('achievements-list');
    const achievementsCounter = document.getElementById('achievements-counter'); // NEW: Added this line
    let toastTimeout; // To manage the toast popup

    // --- Game State ---
    let currency = 0;
    let clickPower = 1;
    let clickLevel = 1;
    let clickPowerCost = 10;
    
    let autoClickerLevel = 0;
    let autoClickerPower = 0;
    let autoClickerCost = 25;
    let autoClickerInterval;

    // --- Achievement State ---
    let totalClicks = 0;
    let totalCurrencyEarned = 0;
    let unlockedAchievementsCount = 0; // NEW: Added this line
    const achievements = [
        { id: 'clicks1', name: 'Click Starter', description: 'Click 1 time', metric: 'totalClicks', threshold: 1, unlocked: false },
        { id: 'clicks10', name: 'Click Enthusiast', description: 'Click 10 times', metric: 'totalClicks', threshold: 10, unlocked: false },
        { id: 'clicks100', name: 'Click Addict', description: 'Click 100 times', metric: 'totalClicks', threshold: 100, unlocked: false },
        { id: 'earn100', name: 'Small Saver', description: 'Earn 100 total coins', metric: 'totalCurrencyEarned', threshold: 100, unlocked: false },
        { id: 'earn1000', name: 'Coin Collector', description: 'Earn 1,000 total coins', metric: 'totalCurrencyEarned', threshold: 1000, unlocked: false },
        { id: 'buyClick', name: 'Power Up!', description: 'Buy your first click upgrade', metric: 'clickLevel', threshold: 2, unlocked: false },
        { id: 'buyAuto', name: 'Set it and... wait', description: 'Buy your first auto clicker', metric: 'autoClickerLevel', threshold: 1, unlocked: false },
        { id: 'auto5', name: 'Passive Income', description: 'Get auto clicker to Level 5', metric: 'autoClickerLevel', threshold: 5, unlocked: false },
    ];


    // --- Modal Functions ---
    function openModal() {
        // Reset to question state
        modalQuestion.classList.remove('hidden');
        gameContainer.classList.add('hidden');
        
        modalOverlay.classList.remove('opacity-0', 'pointer-events-none');
        modalContent.classList.remove('scale-95');
    }

    function closeModal() {
        modalOverlay.classList.add('opacity-0', 'pointer-events-none');
        modalContent.classList.add('scale-95');
        // Stop the game loop when closing
        if (autoClickerInterval) {
            clearInterval(autoClickerInterval);
            autoClickerInterval = null;
        }
    }

    function showGame() {
        modalQuestion.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        
        // Start the game loop
        if (!autoClickerInterval) {
            autoClickerInterval = setInterval(runAutoClicker, 1000);
        }
        // Populate achievements list on game start
        populateAchievementsList();
        updateAchievementsListUI();
        updateAchievementsCounterUI(); // NEW: Added this line
        updateUI();
    }
    
    // --- Game Functions ---

    // This is the main game loop for passive income
    function runAutoClicker() {
        currency += autoClickerPower;
        totalCurrencyEarned += autoClickerPower;
        checkAchievements();
        updateUI();
    }

    // Main function to update all dynamic text
    function updateUI() {
        // Update currency
        currencyAmountDisplay.textContent = currency;
        
        // Update main click button text
        gameButtonDisplay.textContent = `Click Me! (+${clickPower})`;

        // Update Click Upgrade Button
        clickLevelDisplay.textContent = clickLevel;
        clickCostDisplay.textContent = clickPowerCost;
        
        // Update Auto Clicker Button
        autoLevelDisplay.textContent = autoClickerLevel;
        autoCostDisplay.textContent = autoClickerCost;
        autoPowerDisplay.textContent = autoClickerPower;

        // Disable buttons if user can't afford them
        upgradeClickButton.disabled = currency < clickPowerCost;
        upgradeAutoButton.disabled = currency < autoClickerCost;
    }

    // Main click action
    function manualClick() {
        currency += clickPower;
        totalClicks++;
        totalCurrencyEarned += clickPower;

        // Animate the currency
        currencyAmountDisplay.classList.add('animate-pulse-green');
        setTimeout(() => {
            currencyAmountDisplay.classList.remove('animate-pulse-green');
        }, 500);
        
        checkAchievements();
        updateUI();
    }

    // Buy Upgrade 1
    function buyClickPower() {
        if (currency >= clickPowerCost) {
            currency -= clickPowerCost;
            clickLevel++;
            clickPower++; // Increase power
            clickPowerCost = Math.floor(clickPowerCost * 1.2); // Increase cost
            checkAchievements();
            updateUI();
        }
    }

    // Buy Upgrade 2
    function buyAutoClicker() {
        if (currency >= autoClickerCost) {
            currency -= autoClickerCost;
            autoClickerLevel++;
            autoClickerPower++; // Increase passive power
            autoClickerCost = Math.floor(autoClickerCost * 1.3); // Increase cost
            checkAchievements();
            updateUI();
        }
    }

    // --- Achievement Functions ---

    // Creates the list of achievements in the UI
    function populateAchievementsList() {
        achievementsList.innerHTML = ''; // Clear list
        achievements.forEach(ach => {
            const achElement = document.createElement('div');
            achElement.id = 'ach-' + ach.id;
            achElement.classList.add('p-2', 'rounded', 'bg-gray-100', 'dark:bg-gray-700', 'transition-opacity');
            achElement.innerHTML = `
                <p class="font-semibold">${ach.name}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">${ach.description}</p>
            `;
            achievementsList.appendChild(achElement);
        });
    }

    // NEW: Added this entire function
    // Updates the counter text
    function updateAchievementsCounterUI() {
        if (achievementsCounter) {
            achievementsCounter.textContent = `(${unlockedAchievementsCount} / ${achievements.length})`;
        }
    }

    // Updates the visual state of the achievements list (locked/unlocked)
    function updateAchievementsListUI() {
        achievements.forEach(ach => {
            const achElement = document.getElementById('ach-' + ach.id);
            if (achElement) {
                if (ach.unlocked) {
                    achElement.classList.remove('opacity-50');
                    achElement.classList.add('opacity-100');
                } else {
                    achElement.classList.add('opacity-50');
                }
            }
        });
    }

    // Shows the popup notification
    function showAchievementToast(achievement) {
        // If a toast is already showing, clear it first
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        achievementToastTitle.textContent = achievement.name;
        achievementToastDesc.textContent = achievement.description;
        
        // Show toast
        achievementToast.classList.remove('opacity-0', 'translate-y-full');

        // Hide toast after 3 seconds
        toastTimeout = setTimeout(() => {
            achievementToast.classList.add('opacity-0', 'translate-y-full');
            toastTimeout = null;
        }, 3000);
    }

    // Checks if any new achievements have been met
    function checkAchievements() {
        achievements.forEach(ach => {
            if (ach.unlocked) return; // Skip if already unlocked

            let currentStat = 0;
            if (ach.metric === 'totalClicks') currentStat = totalClicks;
            else if (ach.metric === 'totalCurrencyEarned') currentStat = totalCurrencyEarned;
            else if (ach.metric === 'clickLevel') currentStat = clickLevel;
            else if (ach.metric === 'autoClickerLevel') currentStat = autoClickerLevel;

            if (currentStat >= ach.threshold) {
                ach.unlocked = true;
                unlockedAchievementsCount++; // NEW: Added this line
                showAchievementToast(ach);
                updateAchievementsListUI();
                updateAchievementsCounterUI(); // NEW: Added this line
            }
        });
    }

    // Toggles the achievement list visibility
    function toggleAchievementsList() {
        achievementsListContainer.classList.toggle('hidden');
    }


    // --- Event Listeners ---
    if (easterEggToggle) {
        easterEggToggle.addEventListener('click', (e) => {
            e.preventDefault(); // Stop '#' from being added to URL
            openModal();
        });
    }

    if (modalNo) {
        modalNo.addEventListener('click', closeModal);
    }
    
    if (gameClose) {
        gameClose.addEventListener('click', closeModal);
    }

    if (modalYes) {
        modalYes.addEventListener('click', showGame);
    }
    
    // Close modal if clicking on the background overlay
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // --- Game Event Listeners ---
    if (gameButton) {
        gameButton.addEventListener('click', manualClick);
    }
    
    if (upgradeClickButton) {
        upgradeClickButton.addEventListener('click', buyClickPower);
    }

    if (upgradeAutoButton) {
        upgradeAutoButton.addEventListener('click', buyAutoClicker);
    }

    // --- Achievement Listener ---
    if (toggleAchievementsButton) {
        toggleAchievementsButton.addEventListener('click', toggleAchievementsList);
    }


}); // End of DOMContentLoaded


