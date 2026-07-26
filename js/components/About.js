const About = {
    template: `
        <div class="about-page">
            <nav class="navbar">
                <div class="navbar-brand">
                    <i class="bi bi-robot"></i> Telegram Bot Maker
                </div>
                <div class="nav-links">
                    <a class="nav-link" @click="$emit('navigate', 'main')">
                        <i class="bi bi-grid"></i> Home
                    </a>
                    <a class="nav-link" @click="$emit('navigate', 'api')">
                        <i class="bi bi-key"></i> API Config
                    </a>
                    <a class="nav-link" @click="$emit('navigate', 'prompt')">
                        <i class="bi bi-chat-left-text"></i> Prompts
                    </a>
                    <a class="nav-link" @click="$emit('navigate', 'bots')">
                        <i class="bi bi-list-ul"></i> My Bots
                    </a>
                    <a class="nav-link active" @click="$emit('navigate', 'about')">
                        <i class="bi bi-info-circle"></i> About
                    </a>
                </div>
            </nav>

            <div class="about-container">
                <div class="about-header">
                    <svg class="about-logo" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="45" stroke="#3a3a3a" stroke-width="4"/>
                        <path d="M50 5 A45 45 0 0 1 95 50" stroke="#e0e0e0" stroke-width="4" stroke-linecap="round"/>
                        <circle cx="50" cy="50" r="30" fill="#2d2d2d"/>
                        <circle cx="50" cy="50" r="15" fill="#4a4a4a"/>
                        <circle cx="35" cy="40" r="3" fill="#e0e0e0"/>
                        <circle cx="65" cy="40" r="3" fill="#e0e0e0"/>
                        <path d="M35 60 Q50 75 65 60" stroke="#e0e0e0" stroke-width="3" stroke-linecap="round" fill="none"/>
                    </svg>
                    <h1 class="about-title">Telegram Bot Maker</h1>
                    <p class="about-version">Version 1.0.0 • AI-Powered</p>
                </div>

                <div class="about-section">
                    <h3>About</h3>
                    <p>
                        Telegram Bot Maker is a powerful, user-friendly tool that enables you to create 
                        intelligent Telegram bots powered by cutting-edge AI services. With support for 
                        multiple AI providers, you can build conversational bots for various purposes 
                        including customer support, content generation, education, and more.
                    </p>
                </div>

                <div class="about-section">
                    <h3>Supported AI Servers</h3>
                    <ul class="feature-list">
                        <li>
                            <svg width="20" height="20" viewBox="0 0 48 48"><circle cx="24" cy="24" r="18" stroke="#4285F4" stroke-width="3"/></svg>
                            <strong>Google Gemini</strong> - Google's latest AI models
                        </li>
                        <li>
                            <svg width="20" height="20" viewBox="0 0 48 48"><rect x="8" y="8" width="32" height="32" rx="4" stroke="#CC785C" stroke-width="3"/></svg>
                            <strong>Anthropic Claude</strong> - Advanced AI assistant
                        </li>
                        <li>
                            <svg width="20" height="20" viewBox="0 0 48 48"><circle cx="24" cy="24" r="18" stroke="#10A37F" stroke-width="3"/></svg>
                            <strong>OpenAI</strong> - GPT-4 and GPT-3.5 models
                        </li>
                        <li>
                            <svg width="20" height="20" viewBox="0 0 48 48"><circle cx="24" cy="24" r="18" stroke="#0066FF" stroke-width="3"/></svg>
                            <strong>DeepSeek</strong> - Open-source AI models
                        </li>
                        <li>
                            <svg width="20" height="20" viewBox="0 0 48 48"><circle cx="24" cy="24" r="18" stroke="#7C3AED" stroke-width="3"/></svg>
                            <strong>OpenRouter</strong> - Unified access to multiple AIs
                        </li>
                        <li>
                            <svg width="20" height="20" viewBox="0 0 48 48"><circle cx="24" cy="24" r="18" stroke="#FF6B35" stroke-width="3"/></svg>
                            <strong>xAI Grok</strong> - Real-time knowledge AI
                        </li>
                    </ul>
                </div>

                <div class="about-section">
                    <h3>Features</h3>
                    <ul class="feature-list">
                        <li><i class="bi bi-check-circle"></i> Support for 6 major AI providers</li>
                        <li><i class="bi bi-check-circle"></i> Easy API key configuration</li>
                        <li><i class="bi bi-check-circle"></i> Customizable system prompts</li>
                        <li><i class="bi bi-check-circle"></i> Pre-built prompt templates</li>
                        <li><i class="bi bi-check-circle"></i> Multiple bot management</li>
                        <li><i class="bi bi-check-circle"></i> Connection testing</li>
                        <li><i class="bi bi-check-circle"></i> Dark theme interface</li>
                        <li><i class="bi bi-check-circle"></i> Local storage persistence</li>
                    </ul>
                </div>

                <div class="about-section">
                    <h3>Getting Started</h3>
                    <p>
                        To create your first AI-powered Telegram bot:
                    </p>
                    <ol style="color: var(--text-secondary); line-height: 1.8; padding-left: 20px;">
                        <li>Go to <strong>@BotFather</strong> on Telegram and create a new bot</li>
                        <li>Copy the bot token provided by BotFather</li>
                        <li>Configure your preferred AI service API key</li>
                        <li>Create a new bot and select your AI server and model</li>
                        <li>Customize the system prompt or use a template</li>
                        <li>Start chatting with your AI-powered bot!</li>
                    </ol>
                </div>

                <div class="about-section">
                    <h3>Technology Stack</h3>
                    <ul class="feature-list">
                        <li><i class="bi bi-code"></i> Vue.js 3 - Progressive JavaScript framework</li>
                        <li><i class="bi bi-code"></i> LocalStorage - Client-side data persistence</li>
                        <li><i class="bi bi-code"></i> Telegram Bot API - Bot communication</li>
                        <li><i class="bi bi-code"></i> REST APIs - AI service integration</li>
                    </ul>
                </div>

                <div class="about-section text-center">
                    <p class="text-muted">
                        Made with ❤️ for the Telegram community<br>
                        <small>© 2024 Telegram Bot Maker. All rights reserved.</small>
                    </p>
                </div>
            </div>
        </div>
    `,
    setup() {
        return {};
    }
};
