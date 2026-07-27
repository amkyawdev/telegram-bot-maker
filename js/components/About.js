const About = {
    emits: ['navigate'],
    template: `
        <div class="about-page">
            <div class="page-header">
                <button class="back-btn" @click="$emit('navigate', 'main')">
                    <i class="bi bi-arrow-left"></i>
                </button>
                <h1 class="page-title">
                    <i class="bi bi-info-circle"></i> About
                </h1>
            </div>

            <!-- Hero Card -->
            <div class="about-hero">
                <div class="hero-icon">
                    <i class="bi bi-robot"></i>
                </div>
                <h2>Telegram Bot Maker</h2>
                <p class="version">Version 2.0.0</p>
                <p class="tagline">Create intelligent Telegram bots powered by OpenRouter AI</p>
            </div>

            <!-- Features -->
            <div class="section">
                <h2 class="section-title">
                    <i class="bi bi-star-fill"></i> Features
                </h2>
                <div class="feature-grid">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="bi bi-globe"></i>
                        </div>
                        <h3>20+ AI Models</h3>
                        <p>Access Claude, Gemini, GPT-4 and more through OpenRouter</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="bi bi-shield-check"></i>
                        </div>
                        <h3>Secure Storage</h3>
                        <p>All API keys stored locally in your browser</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="bi bi-palette"></i>
                        </div>
                        <h3>Custom Prompts</h3>
                        <p>Pre-built templates for market, training, and chat bots</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="bi bi-lightning"></i>
                        </div>
                        <h3>Easy Setup</h3>
                        <p>No coding required - create bots in minutes</p>
                    </div>
                </div>
            </div>

            <!-- OpenRouter Info -->
            <div class="section">
                <h2 class="section-title">
                    <i class="bi bi-globe" style="color: #a855f7;"></i> OpenRouter
                </h2>
                <div class="provider-list">
                    <div class="provider-item">
                        <div class="provider-icon-wrapper">
                            <i class="bi bi-globe" style="color: #a855f7;"></i>
                        </div>
                        <div class="provider-info">
                            <h4>OpenRouter</h4>
                            <span>{{ servers.openrouter.models.length }} models available</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Free Models -->
            <div class="section">
                <h2 class="section-title">
                    <i class="bi bi-gift"></i> FREE Models
                </h2>
                <div class="free-models">
                    <div class="free-model-badge">Claude 3.5 Sonnet</div>
                    <div class="free-model-badge">Gemini 2.0 Flash</div>
                    <div class="free-model-badge">GPT-4o Mini</div>
                    <div class="free-model-badge">Llama 3.1 8B</div>
                </div>
            </div>

            <!-- Tech Stack -->
            <div class="section">
                <h2 class="section-title">
                    <i class="bi bi-stack"></i> Tech Stack
                </h2>
                <div class="tech-badges">
                    <span class="tech-badge">
                        <i class="bi bi-filetype-vue"></i> Vue.js 3
                    </span>
                    <span class="tech-badge">
                        <i class="bi bi-bootstrap"></i> Bootstrap 5
                    </span>
                    <span class="tech-badge">
                        <i class="bi bi-filetype-js"></i> JavaScript
                    </span>
                    <span class="tech-badge">
                        <i class="bi bi-database"></i> LocalStorage
                    </span>
                </div>
            </div>

            <!-- Credits -->
            <div class="section">
                <h2 class="section-title">
                    <i class="bi bi-heart-fill"></i> Credits
                </h2>
                <div class="credits-card">
                    <p>Made with ❤️ by <strong>Aung Myo Kyaw</strong></p>
                    <div class="social-links">
                        <a href="https://github.com/amkyawdev" target="_blank" class="social-link">
                            <i class="bi bi-github"></i>
                        </a>
                        <a href="https://t.me/amkyawdev" target="_blank" class="social-link">
                            <i class="bi bi-telegram"></i>
                        </a>
                        <a href="mailto:amkyaw.dev@gmail.com" class="social-link">
                            <i class="bi bi-envelope"></i>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="footer">
                <p>© 2025 Telegram Bot Maker. All rights reserved.</p>
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
