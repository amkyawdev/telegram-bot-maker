const ApiConfig = {
    emits: ['navigate'],
    props: ['serverKey'],
    template: `
        <div class="api-config-page">
            <div class="page-header">
                <button class="back-btn" @click="$emit('navigate', 'main')">
                    <i class="bi bi-arrow-left"></i>
                </button>
                <h1 class="page-title">
                    <i class="bi bi-gear"></i> API Configuration
                </h1>
            </div>

            <!-- Config Form -->
            <div class="config-card" v-if="server">
                <div class="card-header">
                    <div class="server-logo-icon">
                        <i :class="server.iconClass" :style="{ color: server.iconColor }"></i>
                    </div>
                    <div class="server-info">
                        <h3>{{ server.name }}</h3>
                        <p>{{ server.apiKeyPlaceholder }}</p>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i class="bi bi-key"></i> OpenRouter API Key
                    </label>
                    <div class="input-wrapper">
                        <input 
                            :type="showApiKey ? 'text' : 'password'"
                            class="form-control"
                            v-model="apiKey"
                            placeholder="sk-or-v1-..."
                        >
                        <button class="toggle-btn" @click="showApiKey = !showApiKey">
                            <i :class="showApiKey ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                        </button>
                    </div>
                    <small class="form-hint">
                        Get your key from <a href="https://openrouter.ai/keys" target="_blank">openrouter.ai/keys</a>
                    </small>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i class="bi bi-cpu"></i> Select Model
                    </label>
                    <select class="form-select" v-model="selectedModel">
                        <option value="">Choose a model...</option>
                        <optgroup label="⭐ FREE Models - Best">
                            <option v-for="model in freeModels" :key="model.id" :value="model.id">
                                {{ model.name }}
                            </option>
                        </optgroup>
                        <optgroup label="💰 Paid Models">
                            <option v-for="model in paidModels" :key="model.id" :value="model.id">
                                {{ model.name }}
                            </option>
                        </optgroup>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i class="bi bi-telegram"></i> Telegram Bot Token
                    </label>
                    <div class="input-wrapper">
                        <input 
                            :type="showToken ? 'text' : 'password'"
                            class="form-control"
                            v-model="botToken"
                            placeholder="Enter your Telegram bot token"
                        >
                        <button class="toggle-btn" @click="showToken = !showToken">
                            <i :class="showToken ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                        </button>
                    </div>
                    <small class="form-hint">
                        Get your token from <a href="https://t.me/BotFather" target="_blank">@BotFather</a>
                    </small>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i class="bi bi-robot"></i> Telegram Bot Username
                    </label>
                    <div class="input-wrapper">
                        <input 
                            type="text"
                            class="form-control"
                            v-model="botUsername"
                            placeholder="@YourBot"
                        >
                    </div>
                    <small class="form-hint">
                        Your bot's username (e.g., @Amkyaw_Bot)
                    </small>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i class="bi bi-link-45deg"></i> Webhook URL
                    </label>
                    <div class="input-wrapper">
                        <input 
                            type="text"
                            class="form-control"
                            v-model="webhookUrl"
                            :placeholder="'https://your-app.vercel.app/webhook/' + (botToken || 'YOUR_BOT_TOKEN')"
                        >
                        <button class="btn btn-sm btn-outline-primary toggle-btn" @click="generateWebhookUrl" title="Auto-generate Webhook URL">
                            <i class="bi bi-magic"></i>
                        </button>
                    </div>
                    <small class="form-hint">
                        Click <strong>🔮 Auto-generate</strong> or enter manually. Format: <code>{{ window.location.origin || 'https://your-app' }}/webhook/YOUR_BOT_TOKEN</code>
                    </small>
                </div>

                <div class="alert alert-info">
                    <i class="bi bi-info-circle-fill"></i>
                    <strong>How it works:</strong>
                    <ol class="mb-0 mt-2">
                        <li>Enter your Telegram Bot Token</li>
                        <li>Click <strong>🔮 Auto-generate</strong> to create the Webhook URL</li>
                        <li>Click <strong>Save & Start Bot</strong> to register</li>
                    </ol>
                </div>

                <div class="form-actions">
                    <button class="btn btn-secondary" @click="testConnection" :disabled="isTesting">
                        <i class="bi bi-plug"></i> Test Connection
                    </button>
                    <button class="btn btn-primary" @click="saveConfig" :disabled="!isValid">
                        <i class="bi bi-check-lg"></i> Save & Start Bot
                    </button>
                </div>

                <div class="test-result" v-if="testStatus">
                    <div class="result-icon" :class="testStatus.success ? 'success' : 'error'">
                        <i :class="testStatus.success ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'"></i>
                    </div>
                    <div class="result-text">
                        <strong>{{ testStatus.success ? 'Connection Successful!' : 'Connection Failed' }}</strong>
                        <p>{{ testStatus.message }}</p>
                    </div>
                </div>

                <div class="polling-status" v-if="isPolling">
                    <div class="status-indicator">
                        <span class="pulse"></span>
                        <span>🤖 Bot is running (Auto-Polling Mode)</span>
                    </div>
                    <small>Messages are being received automatically</small>
                </div>
            </div>
        </div>
    `,
    setup(props, { emit }) {
        const storage = useStorage();
        const apiTest = useApiTest();
        const server = AI_MODELS.openrouter;
        const apiKey = ref('');
        const selectedModel = ref('');
        const botToken = ref('');
        const botUsername = ref('');
        const webhookUrl = ref('');
        const showApiKey = ref(false);
        const showToken = ref(false);
        const testStatus = ref(null);
        const isTesting = ref(false);
        const isPolling = ref(false);
        const serverUrl = ref('');

        // Get server URL for API calls
        const getServerUrl = () => {
            return serverUrl.value || window.location.origin;
        };

        // Check if bot is running (polling)
        const checkPollingStatus = async () => {
            if (!botToken.value) return;
            try {
                const response = await fetch(`${getServerUrl()}/api/bots?token=${botToken.value}`);
                isPolling.value = response.ok;
            } catch (e) {
                isPolling.value = false;
            }
        };

        // Auto-generate webhook URL
        const generateWebhookUrl = () => {
            if (!botToken.value) return;
            const baseUrl = window.location.origin;
            webhookUrl.value = `${baseUrl}/webhook/${botToken.value}`;
        };

        // Separate free and paid models
        const freeModels = computed(() => {
            return server.models.filter(m => m.name.includes('FREE'));
        });

        const paidModels = computed(() => {
            return server.models.filter(m => !m.name.includes('FREE'));
        });

        const isValid = computed(() => {
            return apiKey.value.length > 10 && selectedModel.value && botToken.value.length > 10;
        });

        const saveConfig = async () => {
            const config = storage.getApiConfig() || {};
            config.openrouter = {
                apiKey: apiKey.value,
                model: selectedModel.value,
                botToken: botToken.value,
                botUsername: botUsername.value,
                webhookUrl: webhookUrl.value
            };
            storage.saveApiConfig(config);

            // Auto-generate webhook URL if empty
            if (!webhookUrl.value) {
                generateWebhookUrl();
            }

            // Try to register bot with server
            try {
                const response = await fetch(`${getServerUrl()}/api/bots/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: botUsername.value || 'My Bot',
                        server: 'openrouter',
                        model: selectedModel.value,
                        apiKey: apiKey.value,
                        botToken: botToken.value,
                        systemPrompt: '',
                        webhookUrl: webhookUrl.value
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    testStatus.value = { success: true, message: 'Bot registered successfully! Check Telegram.' };
                    setTimeout(() => {
                        emit('navigate', 'bots');
                    }, 1500);
                } else {
                    const error = await response.json();
                    testStatus.value = { success: false, message: error.error || 'Registration failed' };
                }
            } catch (e) {
                console.log('Server not available:', e);
                testStatus.value = { success: false, message: 'Server not available. Bot will work when webhook URL is configured.' };
                emit('navigate', 'prompt');
            }
        };

        const testConnection = async () => {
            if (!apiKey.value || !selectedModel.value) {
                testStatus.value = { success: false, message: "Please enter API key and select a model" };
                return;
            }
            if (apiKey.value.length < 20) {
                testStatus.value = { success: false, message: "API key too short" };
                return;
            }
            testStatus.value = null;
            isTesting.value = true;
            
            try {
                const result = await apiTest.testConnection('openrouter', apiKey.value);
                testStatus.value = result;
            } catch (error) {
                testStatus.value = { success: false, message: error.message };
            }
            
            isTesting.value = false;
        };

        // Load existing config
        const loadConfig = () => {
            const config = storage.getApiConfig();
            if (config && config.openrouter) {
                apiKey.value = config.openrouter.apiKey || '';
                selectedModel.value = config.openrouter.model || '';
                botToken.value = config.openrouter.botToken || '';
                botUsername.value = config.openrouter.botUsername || '';
                webhookUrl.value = config.openrouter.webhookUrl || '';
            }
        };

        loadConfig();

        return {
            server,
            apiKey,
            selectedModel,
            botToken,
            botUsername,
            webhookUrl,
            showApiKey,
            showToken,
            testStatus,
            isTesting,
            isPolling,
            serverUrl,
            getServerUrl,
            checkPollingStatus,
            generateWebhookUrl,
            isValid,
            freeModels,
            paidModels,
            saveConfig,
            testConnection
        };
    }
};
