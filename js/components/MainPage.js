const MainPage = {
    emits: ['navigate'],
    template: `
        <div class="main-page">
            <nav class="navbar">
                <div class="navbar-brand">
                    <i class="bi bi-robot"></i> Telegram Bot Maker
                </div>
                <div class="nav-links">
                    <a class="nav-link active" @click="$emit('navigate', 'main')">
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
                    <a class="nav-link" @click="$emit('navigate', 'about')">
                        <i class="bi bi-info-circle"></i> About
                    </a>
                </div>
            </nav>

            <div class="container mt-3">
                <div class="welcome-section">
                    <h1>Welcome to Telegram Bot Maker</h1>
                    <p class="text-muted">Create AI-powered Telegram bots with ease using leading AI providers</p>
                </div>

                <h3 class="mt-3 mb-3">Select an AI Server</h3>
                <div class="server-grid">
                    <div 
                        v-for="(server, key) in servers" 
                        :key="key"
                        class="server-card"
                        :class="{ selected: selectedServer === key }"
                        @click="selectServer(key)"
                    >
                        <div class="server-icon" v-html="getServerIcon(key)"></div>
                        <div class="server-name">{{ server.name }}</div>
                        <div class="server-status" :class="{ connected: isConnected(key) }">
                            {{ isConnected(key) ? 'Configured' : 'Not configured' }}
                        </div>
                    </div>
                </div>

                <div class="action-section mt-3" v-if="selectedServer">
                    <button class="btn btn-primary" @click="openApiConfig">
                        <i class="bi bi-gear"></i> Configure {{ servers[selectedServer].name }}
                    </button>
                    <button class="btn btn-success" @click="createBot" :disabled="!isConnected(selectedServer)">
                        <i class="bi bi-plus-circle"></i> Create Bot
                    </button>
                </div>

                <div class="quick-actions mt-3">
                    <h3 class="mb-3">Quick Actions</h3>
                    <div class="d-flex gap-2 flex-wrap">
                        <button class="btn btn-outline" @click="$emit('navigate', 'api')">
                            <i class="bi bi-key"></i> Manage API Keys
                        </button>
                        <button class="btn btn-outline" @click="$emit('navigate', 'prompt')">
                            <i class="bi bi-chat-left-text"></i> System Prompts
                        </button>
                        <button class="btn btn-outline" @click="$emit('navigate', 'bots')">
                            <i class="bi bi-list-ul"></i> View All Bots
                        </button>
                        <button class="btn btn-outline" @click="testAllConnections">
                            <i class="bi bi-plug"></i> Test All Connections
                        </button>
                    </div>
                </div>
            </div>

            <!-- Run Animation Modal -->
            <div class="modal-overlay" v-if="showAnimation" @click.self="closeAnimation">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">Creating Bot...</h3>
                        <button class="modal-close" @click="closeAnimation">&times;</button>
                    </div>
                    <div class="animation-steps">
                        <div 
                            v-for="(step, index) in animationSteps" 
                            :key="index"
                            class="animation-step"
                            :class="{ active: currentStep === index, completed: currentStep > index }"
                        >
                            <div class="step-icon">
                                <i v-if="currentStep > index" class="bi bi-check"></i>
                                <i v-else-if="currentStep === index" class="bi bi-arrow-right"></i>
                                <i v-else class="bi bi-circle"></i>
                            </div>
                            <div>
                                <div class="step-text">{{ step.title }}</div>
                                <div class="step-detail" v-if="currentStep === index">{{ step.detail }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    setup(props, { emit }) {
        const storage = useStorage();
        const apiTest = useApiTest();
        const botManager = useBotManager();

        const servers = AI_MODELS;
        const selectedServer = ref(null);
        const showAnimation = ref(false);
        const currentStep = ref(0);
        const animationSteps = ref([]);

        const selectServer = (key) => {
            selectedServer.value = key;
        };

        const isConnected = (key) => {
            const config = storage.getApiConfig();
            return !!config[key]?.apiKey;
        };

        const getServerIcon = (key) => {
            const icons = {
                gemini: '<svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" stroke="#4285F4" stroke-width="3"/><path d="M24 8v32M8 24h32" stroke="#4285F4" stroke-width="2"/><circle cx="24" cy="24" r="8" fill="#4285F4"/></svg>',
                claude: '<svg viewBox="0 0 48 48" fill="none"><rect x="8" y="8" width="32" height="32" rx="4" stroke="#CC785C" stroke-width="3"/><circle cx="24" cy="24" r="8" fill="#CC785C"/><path d="M18 18l12 12M30 18L18 30" stroke="#CC785C" stroke-width="2"/></svg>',
                openai: '<svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="#10A37F" stroke-width="3"/><path d="M24 12v6l8 4" stroke="#10A37F" stroke-width="2" stroke-linecap="round"/><circle cx="24" cy="28" r="6" fill="#10A37F"/></svg>',
                deepseek: '<svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="#0066FF" stroke-width="3"/><path d="M16 24c0-4 4-8 8-8s8 4 8 8" stroke="#0066FF" stroke-width="2"/><path d="M16 24c0 4 4 8 8 8s8-4 8-8" stroke="#0066FF" stroke-width="2"/><circle cx="24" cy="24" r="3" fill="#0066FF"/></svg>',
                openrouter: '<svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="#7C3AED" stroke-width="3"/><circle cx="24" cy="24" r="8" stroke="#7C3AED" stroke-width="2"/><circle cx="24" cy="24" r="3" fill="#7C3AED"/><path d="M24 6v6M24 36v6M6 24h6M36 24h6" stroke="#7C3AED" stroke-width="2"/></svg>',
                grok: '<svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="#FF6B35" stroke-width="3"/><circle cx="18" cy="20" r="3" fill="#FF6B35"/><circle cx="30" cy="20" r="3" fill="#FF6B35"/><path d="M16 32c4-4 12-4 16 0" stroke="#FF6B35" stroke-width="2" stroke-linecap="round"/></svg>'
            };
            return icons[key] || '';
        };

        const openApiConfig = () => {
            emit('navigate', 'api');
        };

        const createBot = async () => {
            if (!selectedServer.value) return;

            animationSteps.value = [
                { title: 'Validating Configuration', detail: 'Checking API settings...' },
                { title: 'Testing Connection', detail: 'Connecting to AI server...' },
                { title: 'Creating Bot', detail: 'Initializing Telegram bot...' },
                { title: 'Finalizing', detail: 'Saving bot configuration...' }
            ];
            currentStep.value = 0;
            showAnimation.value = true;

            for (let i = 0; i < animationSteps.value.length; i++) {
                currentStep.value = i;
                await new Promise(resolve => setTimeout(resolve, 800));
            }

            showAnimation.value = false;
            emit('navigate', 'bots');
        };

        const closeAnimation = () => {
            showAnimation.value = false;
        };

        const testAllConnections = async () => {
            const results = await apiTest.testAllConnections();
            let message = 'Connection Test Results:\\n';
            for (const [server, result] of Object.entries(results)) {
                const status = result.success ? '✓' : '✗';
                message += `${status} ${servers[server].name}: ${result.success ? 'Connected' : result.error}\\n`;
            }
            alert(message);
        };

        return {
            servers,
            selectedServer,
            showAnimation,
            currentStep,
            animationSteps,
            selectServer,
            isConnected,
            getServerIcon,
            openApiConfig,
            createBot,
            closeAnimation,
            testAllConnections
        };
    }
};
