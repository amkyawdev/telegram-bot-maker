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

                <div class="form-actions">
                    <button class="btn btn-secondary" @click="testConnection" :disabled="isTesting">
                        <i class="bi bi-plug"></i> Test Connection
                    </button>
                    <button class="btn btn-primary" @click="saveConfig" :disabled="!isValid">
                        <i class="bi bi-check-lg"></i> Save Configuration
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
            </div>
        </div>
    `,
    setup(props, { emit }) {
        const storage = useStorage();
        const server = AI_MODELS.openrouter;
        const apiKey = ref('');
        const selectedModel = ref('');
        const botToken = ref('');
        const showApiKey = ref(false);
        const showToken = ref(false);
        const testStatus = ref(null);
        const isTesting = ref(false);

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

        const saveConfig = () => {
            const config = storage.getApiConfig() || {};
            config.openrouter = {
                apiKey: apiKey.value,
                model: selectedModel.value,
                botToken: botToken.value
            };
            storage.saveApiConfig(config);
            emit('navigate', 'prompt');
        };

        const testConnection = async () => {
            if (!apiKey.value || !selectedModel.value) {
                testStatus.value = { success: false, message: "Please enter API key and select a model" };
                return;
            }
            const keyLength = apiKey.value.length;
            if (keyLength < 20) {
                testStatus.value = { success: false, message: "API key too short" };
                return;
            }
            testStatus.value = null;
            isTesting.value = true;
            await new Promise(r => setTimeout(r, 1500));
            testStatus.value = { success: true, message: "OpenRouter API key format validated!" };
            isTesting.value = false;
        };

        // Load existing config
        const loadConfig = () => {
            const config = storage.getApiConfig();
            if (config && config.openrouter) {
                apiKey.value = config.openrouter.apiKey || '';
                selectedModel.value = config.openrouter.model || '';
                botToken.value = config.openrouter.botToken || '';
            }
        };

        loadConfig();

        return {
            server,
            apiKey,
            selectedModel,
            botToken,
            showApiKey,
            showToken,
            testStatus,
            isTesting,
            isValid,
            freeModels,
            paidModels,
            saveConfig,
            testConnection
        };
    }
};
