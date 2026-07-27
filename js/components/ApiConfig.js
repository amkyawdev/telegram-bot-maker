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

            <!-- Server Tabs -->
            <div class="server-tabs">
                <button 
                    v-for="(server, key) in servers" 
                    :key="key"
                    class="tab-btn"
                    :class="{ active: currentServer === key }"
                    @click="currentServer = key"
                >
                    <i :class="server.iconClass" :style="{ color: server.iconColor }"></i>
                    {{ server.name }}
                </button>
            </div>

            <!-- Config Form -->
            <div class="config-card" v-if="servers[currentServer]">
                <div class="card-header">
                    <div class="server-logo-icon">
                        <i :class="servers[currentServer].iconClass" :style="{ color: servers[currentServer].iconColor }"></i>
                    </div>
                    <div class="server-info">
                        <h3>{{ servers[currentServer].name }}</h3>
                        <p>{{ servers[currentServer].apiKeyPlaceholder }}</p>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i class="bi bi-key"></i> API Key
                    </label>
                    <div class="input-wrapper">
                        <input 
                            :type="showApiKey ? 'text' : 'password'"
                            class="form-control"
                            v-model="apiKey"
                            placeholder="Enter your API key"
                        >
                        <button class="toggle-btn" @click="showApiKey = !showApiKey">
                            <i :class="showApiKey ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                        </button>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i class="bi bi-cpu"></i> Select Model
                    </label>
                    <select class="form-select" v-model="selectedModel">
                        <option value="">Choose a model...</option>
                        <option v-for="model in servers[currentServer].models" :key="model.id" :value="model.id">
                            {{ model.name }}
                        </option>
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
        const servers = AI_MODELS;
        const storage = useStorage();
        const currentServer = ref(props.serverKey || 'gemini');
        const apiKey = ref('');
        const selectedModel = ref('');
        const botToken = ref('');
        const showApiKey = ref(false);
        const showToken = ref(false);
        const testStatus = ref(null);
        const isTesting = ref(false);

        const isValid = computed(() => {
            return apiKey.value.length > 10 && selectedModel.value && botToken.value.length > 10;
        });

        const saveConfig = () => {
            const config = storage.getApiConfig() || {};
            config[currentServer.value] = {
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
            testStatus.value = null;
            isTesting.value = true;
            try {
                let testUrl = "";
                const headers = {};
                if (currentServer.value === "gemini") {
                    testUrl = "https://generativelanguage.googleapis.com/v1beta/models?key=" + apiKey.value;
                } else if (currentServer.value === "claude") {
                    testUrl = "https://api.anthropic.com/v1/messages";
                    headers["Content-Type"] = "application/json";
                    headers["x-api-key"] = apiKey.value;
                    headers["anthropic-version"] = "2023-06-01";
                } else {
                    const endpoints = { openai: "api.openai.com/v1/models", deepseek: "api.deepseek.com/v1/models", openrouter: "openrouter.ai/api/v1/models", grok: "api.x.ai/v1/models" };
                    testUrl = "https://" + endpoints[currentServer.value];
                    headers["Authorization"] = "Bearer " + apiKey.value;
                }
                const response = await fetch(testUrl, { method: currentServer.value === "claude" ? "POST" : "GET", headers });
                if (response.ok) {
                    testStatus.value = { success: true, message: servers[currentServer.value].name + " API connected!" };
                } else {
                    testStatus.value = { success: false, message: "Invalid API key or connection failed" };
                }
            } catch (error) {
                testStatus.value = { success: false, message: "Network error: " + error.message };
            }
            isTesting.value = false;
        };

        // Load existing config
        const loadConfig = () => {
            const config = storage.getApiConfig();
            if (config && config[currentServer.value]) {
                apiKey.value = config[currentServer.value].apiKey || '';
                selectedModel.value = config[currentServer.value].model || '';
                botToken.value = config[currentServer.value].botToken || '';
            }
        };

        loadConfig();

        return {
            servers,
            currentServer,
            apiKey,
            selectedModel,
            botToken,
            showApiKey,
            showToken,
            testStatus,
            isTesting,
            isValid,
            saveConfig,
            testConnection
        };
    }
};
