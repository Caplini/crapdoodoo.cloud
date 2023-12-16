// Global variables
let backpackCount = 0;
let coins = 0;
let posX = 392.5; // Default X position, will be overwritten if saved value exists
let posY = 584;   // Default Y position, will be overwritten if saved value exists
let backpackCapacity = 100; // Initialize backpack capacity
let backpackUpgradeCost = 100;
let multiplierUpgradeCost = 50;
let coinMultiplier = 1;

// Function to save the game state to local storage
const saveGameState = () => {
    localStorage.setItem('backpackCount', backpackCount.toString());
    localStorage.setItem('coins', coins.toString());
    localStorage.setItem('posX', posX.toString());
    localStorage.setItem('posY', posY.toString());
    localStorage.setItem('backpackCapacity', backpackCapacity.toString());
    localStorage.setItem('backpackUpgradeCost', backpackUpgradeCost.toString());
    localStorage.setItem('multiplierUpgradeCost', multiplierUpgradeCost.toString());
    localStorage.setItem('coinMultiplier', coinMultiplier.toString());
};

// Function to load the game state from local storage
const loadGameState = () => {
    backpackCount = parseInt(localStorage.getItem('backpackCount') || '0', 10);
    coins = parseInt(localStorage.getItem('coins') || '0', 10);
    posX = parseFloat(localStorage.getItem('posX') || '392.5');
    posY = parseFloat(localStorage.getItem('posY') || '584');
    backpackCapacity = parseInt(localStorage.getItem('backpackCapacity') || '100', 10);
    backpackUpgradeCost = parseInt(localStorage.getItem('backpackUpgradeCost') || '100', 10);
    multiplierUpgradeCost = parseInt(localStorage.getItem('multiplierUpgradeCost') || '50', 10);
    coinMultiplier = parseFloat(localStorage.getItem('coinMultiplier') || '1');
};

// Helper function to check overlap
const checkOverlap = (elem1, elem2) => {
    const rect1 = elem1.getBoundingClientRect();
    const rect2 = elem2.getBoundingClientRect();
    return rect1.left < rect2.right && rect1.right > rect2.left &&
           rect1.top < rect2.bottom && rect1.bottom > rect2.top;
};

// Main game logic
document.addEventListener('DOMContentLoaded', () => {
    loadGameState(); // Load game data

    // Get references to UI elements
    const gameArea = document.getElementById('gameArea');
    const player = document.getElementById('player');
    const pointArea = document.getElementById('pointArea');
    const sellArea = document.getElementById('sellArea');
    const backpackDisplay = document.getElementById('backpackCount');
    const coinDisplay = document.getElementById('coinCount');
    const velocity = 2; // Movement speed
    const keys = { w: false, a: false, s: false, d: false }; // Key tracking

    // Update displays with loaded values
    backpackDisplay.textContent = `Backpack: ${backpackCount}/${backpackCapacity}`;
    coinDisplay.textContent = coins;

    // Function to update the backpack display
    const updateBackpackDisplay = () => {
        backpackDisplay.textContent = `Backpack: ${backpackCount}/${backpackCapacity}`;
    };

    // Function to update the shop display
    const updateShopDisplay = () => {
        document.getElementById('backpackUpgradeCost').textContent = `Cost: ${backpackUpgradeCost}`;
        document.getElementById('multiplierUpgradeCost').textContent = `Cost: ${multiplierUpgradeCost}`;
        coinDisplay.textContent = coins;
    };

    // Function to handle collecting coins or points in the game area
    const collectCoins = () => {
        if (checkOverlap(player, pointArea) && backpackCount < backpackCapacity) {
            let collectedCoins = Math.ceil(1 * coinMultiplier);
            backpackCount += collectedCoins;
            updateBackpackDisplay();
            saveGameState();
        }
    };

    // Function to update coins when selling items from the backpack
    const sellItems = () => {
        if (checkOverlap(player, sellArea)) {
            coins += backpackCount; // Add backpack count to coins without multiplier
            backpackCount = 0;
            updateBackpackDisplay();
            coinDisplay.textContent = coins;
            saveGameState();
        }
    };

    // Function to handle backpack upgrade
    const upgradeBackpack = () => {
        if (coins >= backpackUpgradeCost) {
            coins -= backpackUpgradeCost;
            backpackCapacity *= 1.5;
            backpackUpgradeCost *= 1.6;
            updateBackpackDisplay();
            updateShopDisplay();
            saveGameState();
        }
    };

    // Function to handle coin multiplier upgrade
    const upgradeMultiplier = () => {
        if (coins >= multiplierUpgradeCost) {
            coins -= multiplierUpgradeCost;
            coinMultiplier *= 0.2;
            multiplierUpgradeCost *= 1.3;
            updateShopDisplay();
            saveGameState();
        }
    };

    // Update the shop display
    updateShopDisplay();

    // Initialize shop
    document.getElementById('upgradeBackpack').addEventListener('click', upgradeBackpack);
    document.getElementById('upgradeMultiplier').addEventListener('click', upgradeMultiplier);

    // Movement logic
    const movePlayer = () => {
        if (keys.w) posY = Math.max(posY - velocity, 0);
        if (keys.s) posY = Math.min(posY + velocity, gameArea.offsetHeight - player.offsetHeight);
        if (keys.a) posX = Math.max(posX - velocity, 0);
        if (keys.d) posX = Math.min(posX + velocity, gameArea.offsetWidth - player.offsetWidth);

        player.style.left = `${posX}px`;
        player.style.top = `${posY}px`;
        requestAnimationFrame(movePlayer);
    };

    // Keyboard event listeners
    document.addEventListener('keydown', (e) => {
        if (['w', 'a', 's', 'd'].includes(e.key)) keys[e.key] = true;
    });
    document.addEventListener('keyup', (e) => {
        if (['w', 'a', 's', 'd'].includes(e.key)) keys[e.key] = false;
    });

    // Start player movement
    requestAnimationFrame(movePlayer);

    // Set intervals for game updates
    setInterval(collectCoins, 100); // Check for coin collection every 0.1 seconds
    setInterval(sellItems, 100); // Check for selling every 0.1 seconds
});
