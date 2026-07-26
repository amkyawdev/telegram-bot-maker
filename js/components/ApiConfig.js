const ApiConfig = {
    emits: ['navigate'],
    template: `
        <div class="api-config-page">
            <nav class="navbar">
                <div class="navbar-brand">
                    <i class="bi bi-key"></i> API Configuration
                </div>
                <div class="nav-links">
                    <a class="nav-link" @click="$emit('navigate', 'main')">
                        <i class="bi bi-grid"></i> Home
                    </a>
                    <a class="nav-link active" @click="$emit('navigate', 'api')">
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
                <div class="card">
                    <div class="card-header">
                        <i class="bi bi-telegram"></i> Telegram Bot Token
                    </div>
                    <div class="card-body">
                        <div class="form-group">
                            <label class="form-label">Bot Token</label>
                            <input 
                                type="password" 
                                class="form-control" 
                                v-model="botToken"
                                placeholder="Enter your Telegram bot token (e.g., 123456789:ABCdefGHIjklMNOpqrsTUVwxyz)"
                                @blur="saveBotToken"
                            >
                            <small class="text-muted">
                                Get your token from <a href="https://t.me/BotFather" target="_blank">@BotFather</a>
                            </small>
                        </div>
                        <button class="btn btn-outline btn-sm" @click="testTelegramToken" :disabled="!botToken">
                            <i class="bi bi-plug"></i> Test Token
                        </button>
                        <span v-if="telegramStatus" class="ml-2" :class="telegramStatus.class">
                            {{ telegramStatus.text }}
                        </span>
                    </div>
                </div>

                <h3 class="mt-3 mb-3">AI Server Configurations</h3>
                
                <div v-for="(server, key) in servers" :key="key" class="card mb-3">
                    <div class="card-header d-flex align-items-center justify-content-between">
                        <span>
                            <span v-html="getServerIcon(key)" class="server-icon-small"></span>
                            {{ server.name }}
                        </span>
                        <span :class="isConfigured(key) ? 'text-success' : 'text-muted'">
                            {{ isConfigured(key) ? 'Configured' : 'Not configured' }}
                        </span>
                    </div>
                    <div class="card-body">
                        <div class="form-group">
                            <label class="form-label">API Key</label>
                            <input 
                                type="password" 
                                class="form-control" 
                                v-model="config[key].apiKey"
                                :placeholder="server.apiKeyPlaceholder"
                                @blur="saveConfig"
                            >
                        </div>
                        <div class="form-group">
                            <label class="form-label">Default Model</label>
                            <select class="form-select" v-model="config[key].model" @change="saveConfig">
                                <option value="">Select a model...</option>
                                <option v-for="model in server.models" :key="model.id" :value="model.id">
                                    {{ model.name }}
                                </option>
                            </select>
                        </div>
                        <button class="btn btn-outline btn-sm" @click="testConnection(key)" :disabled="!config[key].apiKey">
                            <i class="bi bi-plug"></i> Test Connection
                        </button>
                        <span v-if="testResults[key]" class="ml-2" :class="testResults[key].success ? 'text-success' : 'text-danger'">
                            {{ testResults[key].success ? 'Connected!' : testResults[key].error }}
                        </span>
                    </div>
                </div>

                <div class="d-flex gap-2 mt-3">
                    <button class="btn btn-primary" @click="saveAll">
                        <i class="bi bi-save"></i> Save All
                    </button>
                    <button class="btn btn-outline" @click="testAll">
                        <i class="bi bi-plug"></i> Test All Connections
                    </button>
                </div>
            </div>
        </div>
    `,
    setup(props, { emit }) {
        const storage = useStorage();
        const apiTest = useApiTest();
        const botManager = useBotManager();

        const servers = AI_MODELS;
        const config = ref({});
        const botToken = ref('');
        const telegramStatus = ref(null);
        const testResults = ref({});

        const loadConfig = () => {
            config.value = storage.getApiConfig();
            botToken.value = storage.getBotToken();
        };

        const saveConfig = () => {
            storage.saveApiConfig(config.value);
        };

        const saveBotToken = () => {
            storage.saveBotToken(botToken.value);
        };

        const isConfigured = (key) => {
            return !!config.value[key]?.apiKey;
        };

        const getServerIcon = (key) => {
            const icons = {
                gemini: '<svg width="20" height="20" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="#4285F4" stroke-width="3"/><path d="M24 12v24M12 24h24" stroke="#4285F4" stroke-width="2"/><circle cx="24" cy="24" r="6" fill="#4285F4"/></svg>',
                claude: '<svg width="20" height="20" viewBox="0 0 48 48" fill="none"><rect x="8" y="8" width="32" height="32" rx="4" stroke="#CC785C" stroke-width="3"/><circle cx="24" cy="24" r="6" fill="#CC785C"/></svg>',
                openai: '<svg width="20" height="20" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="#10A37F" stroke-width="3"/><circle cx="24" cy="26" r="6" fill="#10A37F"/></svg>',
                deepseek: '<svg width="20" height="20" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="#0066FF" stroke-width="3"/><circle cx="24" cy="24" r="4" fill="#0066FF"/></svg>',
                openrouter: '<svg width="20" height="20" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="#7C3AED" stroke-width="3"/><circle cx="24" cy="24" r="6" stroke="#7C3AED" stroke-width="2"/></svg>',
                grok: '<svg width="20" height="20" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="#FF6B35" stroke-width="3"/><circle cx="18" cy="20" r="3" fill="#FF6B35"/><circle cx="30" cy="20" r="3" fill="#FF6B35"/></svg>'
            };
            return icons[key] || '';
        };

        const testConnection = async (key) => {
            if (!config.value[key]?.apiKey) return;
            testResults.value[key] = { testing: true };
            const result = await apiTest.testConnection(key, config.value[key].apiKey);
            testResults.value[key] = result;
        };

        const testAll = async () => {
            for (const key of Object.keys(servers)) {
                if (config.value[key]?.apiKey) {
                    await testConnection(key);
                }
            }
        };

        const testTelegramToken = async () => {
            if (!botToken.value) return;
            telegramStatus.value = { text: 'Testing...', class: 'text-muted' };
            const result = await botManager.testTelegramToken(botToken.value);
            if (result.success) {
                telegramStatus.value = { 
                    text: `Connected as @${result.bot.username}`, 
                    class: 'text-success' 
                };
            } else {
                telegramStatus.value = { text: result.error, class: 'text-danger' };
            }
        };

        const saveAll = () => {
            saveConfig();
            saveBotToken();
            alert('Configuration saved successfully!');
        };

        loadConfig();

        return {
            servers,
            config,
            botToken,
            telegramStatus,
            testResults,
            saveConfig,
            saveBotToken,
            isConfigured,
            getServerIcon,
            testConnection,
            testAll,
            testTelegramToken,
            saveAll
        };
    }
};
