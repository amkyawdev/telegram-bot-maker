const Loader = {
    template: `
        <div class="loader-container">
            <svg class="loader-logo" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" stroke="#3a3a3a" stroke-width="4"/>
                <path d="M50 5 A45 45 0 0 1 95 50" stroke="#e0e0e0" stroke-width="4" stroke-linecap="round"/>
                <circle cx="50" cy="50" r="30" fill="#2d2d2d"/>
                <circle cx="50" cy="50" r="15" fill="#4a4a4a"/>
                <circle cx="35" cy="40" r="3" fill="#e0e0e0"/>
                <circle cx="65" cy="40" r="3" fill="#e0e0e0"/>
                <path d="M35 60 Q50 75 65 60" stroke="#e0e0e0" stroke-width="3" stroke-linecap="round" fill="none"/>
            </svg>
            <div class="loader-spinner"></div>
            <p class="loader-text">Loading Telegram Bot Maker...</p>
        </div>
    `
};
