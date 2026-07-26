const BotList = {
    emits: ['navigate'],
    template: `
        <div class="bot-list-page">
            <nav class="navbar">
                <div class="navbar-brand">
                    <i class="bi bi-list-ul"></i> My Bots
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
                    <a class="nav-link active" @click="$emit('navigate', 'bots')">
                        <i class="bi bi-list-ul"></i> My Bots
                    </a>
                    <a class="nav-link" @click="$emit('navigate', 'about')">
                        <i class="bi bi-info-circle"></i> About
                    </a>
                </div>
            </nav>

            <div class="bot-list">
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <h3>Your Telegram Bots</h3>
                    <button class="btn btn-primary" @click="showCreateModal = true">
                        <i class="bi bi-plus-circle"></i> Create New Bot
                    </button>
                </div>

                <div v-if="bots.length === 0" class="text-center p-5">
                    <i class="bi bi-robot" style="font-size: 48px;"></i>
                    <p class="text-muted mt-3">No bots created yet.</p>
                    <button class="btn btn-primary" @click="$emit('navigate', 'main')">
                        <i class="bi bi-rocket"></i> Get Started
                    </button>
                </div>

                <div v-else>
                    <div v-for="bot in bots" :key="bot.id" class="bot-item">
                        <div class="bot-info">
                            <h4>{{ bot.name }}</h4>
                            <p>
                                <span v-html="getServerIcon(bot.server)"></span>
                                {{ getServerName(bot.server) }} • {{ bot.model }}
                            </p>
                        </div>
                        <div class="bot-actions">
                            <button class="btn btn-sm btn-outline" @click="editBot(bot)">
                                <i class="bi bi-pencil"></i> Edit
                            </button>
                            <button class="btn btn-sm btn-danger" @click="confirmDelete(bot)">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Create/Edit Modal -->
            <div class="modal-overlay" v-if="showCreateModal || editingBot" @click.self="closeModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">{{ editingBot ? 'Edit Bot' : 'Create New Bot' }}</h3>
                        <button class="modal-close" @click="closeModal">&times;</button>
                    </div>
                    <form @submit.prevent="saveBot">
                        <div class="form-group">
                            <label class="form-label">Bot Name</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                v-model="botForm.name"
                                placeholder="Enter bot name"
                                required
                            >
                        </div>
                        <div class="form-group">
                            <label class="form-label">AI Server</label>
                            <select class="form-select" v-model="botForm.server" required>
                                <option value="">Select a server...</option>
                                <option v-for="(server, key) in servers" :key="key" :value="key">
                                    {{ server.name }}
                                </option>
                            </select>
                        </div>
                        <div class="form-group" v-if="botForm.server">
                            <label class="form-label">AI Model</label>
                            <select class="form-select" v-model="botForm.model" required>
                                <option value="">Select a model...</option>
                                <option v-for="model in availableModels" :key="model.id" :value="model.id">
                                    {{ model.name }}
                                </option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">System Prompt</label>
                            <select class="form-select" v-model="selectedPromptTemplate" @change="applyTemplate">
                                <option value="">Select a template...</option>
                                <option v-for="(template, key) in templates" :key="key" :value="key">
                                    {{ template.name }}
                                </option>
                            </select>
                            <textarea 
                                class="form-control mt-2" 
                                v-model="botForm.systemPrompt"
                                placeholder="Enter custom system prompt..."
                                rows="4"
                            ></textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Telegram Bot Token</label>
                            <input 
                                type="password" 
                                class="form-control" 
                                v-model="botForm.botToken"
                                placeholder="Enter Telegram bot token"
                                required
                            >
                        </div>
                        <div class="d-flex gap-2 justify-content-end">
                            <button type="button" class="btn btn-outline" @click="closeModal">Cancel</button>
                            <button type="submit" class="btn btn-primary">
                                <i class="bi bi-save"></i> {{ editingBot ? 'Update' : 'Create' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Delete Confirmation Modal -->
            <div class="modal-overlay" v-if="botToDelete" @click.self="botToDelete = null">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">Delete Bot</h3>
                        <button class="modal-close" @click="botToDelete = null">&times;</button>
                    </div>
                    <p>Are you sure you want to delete "{{ botToDelete.name }}"?</p>
                    <div class="d-flex gap-2 justify-content-end">
                        <button class="btn btn-outline" @click="botToDelete = null">Cancel</button>
                        <button class="btn btn-danger" @click="deleteBot">
                            <i class="bi bi-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,
    setup(props, { emit }) {
        const storage = useStorage();
        const botManager = useBotManager();

        const servers = AI_MODELS;
        const templates = SYSTEM_PROMPT_TEMPLATES;
        const bots = ref([]);
        const showCreateModal = ref(false);
        const editingBot = ref(null);
        const botToDelete = ref(null);
        const selectedPromptTemplate = ref('');

        const botForm = ref({
            name: '',
            server: '',
            model: '',
            systemPrompt: '',
            botToken: ''
        });

        const availableModels = computed(() => {
            if (!botForm.value.server) return [];
            return servers[botForm.value.server]?.models || [];
        });

        const loadBots = () => {
            bots.value = botManager.listBots();
        };

        const getServerIcon = (key) => {
            const icons = {
                gemini: '<svg width="16" height="16" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="#4285F4" stroke-width="3"/></svg>',
                claude: '<svg width="16" height="16" viewBox="0 0 48 48" fill="none"><rect x="8" y="8" width="32" height="32" rx="4" stroke="#CC785C" stroke-width="3"/></svg>',
                openai: '<svg width="16" height="16" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="#10A37F" stroke-width="3"/></svg>',
                deepseek: '<svg width="16" height="16" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="#0066FF" stroke-width="3"/></svg>',
                openrouter: '<svg width="16" height="16" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="#7C3AED" stroke-width="3"/></svg>',
                grok: '<svg width="16" height="16" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="#FF6B35" stroke-width="3"/></svg>'
            };
            return icons[key] || '';
        };

        const getServerName = (key) => {
            return servers[key]?.name || key;
        };

        const applyTemplate = () => {
            if (selectedPromptTemplate.value && templates[selectedPromptTemplate.value]) {
                botForm.value.systemPrompt = templates[selectedPromptTemplate.value].template;
            }
        };

        const editBot = (bot) => {
            editingBot.value = bot;
            botForm.value = { ...bot };
            if (bot.systemPrompt) {
                for (const [key, template] of Object.entries(templates)) {
                    if (template.template === bot.systemPrompt) {
                        selectedPromptTemplate.value = key;
                        break;
                    }
                }
            }
        };

        const closeModal = () => {
            showCreateModal.value = false;
            editingBot.value = null;
            resetForm();
        };

        const resetForm = () => {
            botForm.value = {
                name: '',
                server: '',
                model: '',
                systemPrompt: '',
                botToken: ''
            };
            selectedPromptTemplate.value = '';
        };

        const saveBot = async () => {
            let result;
            if (editingBot.value) {
                result = await botManager.updateBot(editingBot.value.id, botForm.value);
            } else {
                result = await botManager.createBot(botForm.value);
            }

            if (result.success) {
                loadBots();
                closeModal();
                alert(editingBot.value ? 'Bot updated successfully!' : 'Bot created successfully!');
            } else {
                alert('Error: ' + result.error);
            }
        };

        const confirmDelete = (bot) => {
            botToDelete.value = bot;
        };

        const deleteBot = () => {
            if (botToDelete.value) {
                botManager.removeBot(botToDelete.value.id);
                loadBots();
                botToDelete.value = null;
            }
        };

        loadBots();

        return {
            servers,
            templates,
            bots,
            showCreateModal,
            editingBot,
            botToDelete,
            botForm,
            selectedPromptTemplate,
            availableModels,
            loadBots,
            getServerIcon,
            getServerName,
            applyTemplate,
            editBot,
            closeModal,
            saveBot,
            confirmDelete,
            deleteBot
        };
    }
};
