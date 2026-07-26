const Loader = {
    template: `
        <div class="loader-overlay">
            <div class="loader-container">
                <div class="loader-animation">
                    <div class="loader-ring">
                        <div class="loader-ring-inner"></div>
                    </div>
                    <div class="loader-bot">
                        <div class="bot-head">
                            <div class="bot-antenna"></div>
                            <div class="bot-face">
                                <div class="bot-eyes">
                                    <div class="eye"></div>
                                    <div class="eye"></div>
                                </div>
                                <div class="bot-mouth"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <h2 class="loader-title">Bot Maker</h2>
                <p class="loader-text">Loading...</p>
                <div class="loader-progress">
                    <div class="progress-bar"></div>
                </div>
            </div>
        </div>
    `,
    mounted() {
        setTimeout(() => {
            this.$emit('complete');
        }, 2500);
    }
};
