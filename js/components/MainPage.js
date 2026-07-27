const MainPage = {
    emits: ['navigate'],
    template: `
        <div class="main-page">
            <!-- Hero Section -->
            <div class="hero-section">
                <div class="hero-content">
                    <div class="hero-badge">
                        <i class="bi bi-lightning-charge-fill"></i> AI Powered
                    </div>
                    <h1 class="hero-title">Telegram Bot Maker</h1>
                    <p class="hero-subtitle">Create intelligent Telegram bots powered by OpenRouter AI</p>
                    <div class="hero-stats">
                        <div class="stat-item">
                            <span class="stat-number">20+</span>
                            <span class="stat-label">Models</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">100%</span>
                            <span class="stat-label">Free Tier</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">Easy</span>
                            <span class="stat-label">Setup</span>
                        </div>
                    </div>
                </div>
                <div class="hero-illustration">
                    <div class="bot-avatar">
                        <div class="bot-face">
                            <div class="bot-eyes">
                                <div class="eye left"></div>
                                <div class="eye right"></div>
                            </div>
                            <div class="bot-mouth"></div>
                        </div>
                        <div class="bot-antenna"></div>
                    </div>
                </div>
            </div>

            <!-- OpenRouter Server Card -->
            <div class="section">
                <div class="section-header">
                    <h2 class="section-title">
                        <i class="bi bi-globe" style="color: #a855f7;"></i> OpenRouter
                    </h2>
                    <p class="section-desc">Access multiple AI models through a single API</p>
                </div>
                <div class="server-grid">
                    <div 
                        class="server-card selected connected"
                        @click="$emit('navigate', 'api')"
                    >
                        <div class="card-badge">
                            <i class="bi bi-check-circle-fill"></i>
                        </div>
                        <div class="server-icon">
                            <i class="bi bi-globe" style="color: #a855f7;"></i>
                        </div>
                        <div class="server-name">OpenRouter</div>
                        <div class="server-models">{{ servers.openrouter.models.length }} models</div>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="section">
                <div class="action-cards">
                    <div class="action-card primary" @click="$emit('navigate', 'api')">
                        <div class="action-icon">
                            <i class="bi bi-gear-fill"></i>
                        </div>
                        <div class="action-content">
                            <h3>Configure API</h3>
                            <p>Set up your OpenRouter API key</p>
                        </div>
                        <div class="action-arrow">
                            <i class="bi bi-arrow-right"></i>
                        </div>
                    </div>
                    <div class="action-card secondary" @click="$emit('navigate', 'prompt')">
                        <div class="action-icon">
                            <i class="bi bi-chat-left-text-fill"></i>
                        </div>
                        <div class="action-content">
                            <h3>System Prompt</h3>
                            <p>Customize your bot's personality</p>
                        </div>
                        <div class="action-arrow">
                            <i class="bi bi-arrow-right"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Links -->
            <div class="section">
                <div class="section-header">
                    <h2 class="section-title">
                        <i class="bi bi-lightning"></i> Quick Actions
                    </h2>
                </div>
                <div class="quick-grid">
                    <div class="quick-card" @click="$emit('navigate', 'bots')">
                        <i class="bi bi-robot"></i>
                        <span>My Bots</span>
                    </div>
                    <div class="quick-card" @click="$emit('navigate', 'api')">
                        <i class="bi bi-key"></i>
                        <span>API Keys</span>
                    </div>
                    <div class="quick-card" @click="$emit('navigate', 'prompt')">
                        <i class="bi bi-brush"></i>
                        <span>Templates</span>
                    </div>
                    <div class="quick-card" @click="$emit('navigate', 'about')">
                        <i class="bi bi-info-circle"></i>
                        <span>About</span>
                    </div>
                </div>
            </div>
        </div>
    `,
    setup(props, { emit }) {
        const servers = AI_MODELS;

        return {
            servers
        };
    }
};
