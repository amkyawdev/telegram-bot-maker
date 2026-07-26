const BotList = {
    emits: ['navigate'],
    template: `
        <div class="bot-list-page">
            <div class="page-header">
                <button class="back-btn" @click="$emit('navigate', 'main')">
                    <i class="bi bi-arrow-left"></i>
                </button>
                <h1 class="page-title">
                    <i class="bi bi-robot"></i> My Bots
                </h1>
                <button class="btn btn-primary btn-sm" @click="$emit('navigate', 'main')">
                    <i class="bi bi-plus"></i> New Bot
                </button>
            </div>

            <!-- Stats -->
            <div class="stats-row">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="bi bi-robot"></i>
                    </div>
                    <div class="stat-content">
                        <span class="stat-number">{{ bots.length }}</span>
                        <span class="stat-label">Total Bots</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon success">
                        <i class="bi bi-check-circle"></i>
                    </div>
                    <div class="stat-content">
                        <span class="stat-number">{{ activeBots }}</span>
                        <span class="stat-label">Active</span>
                    </div>
                </div>
            </div>

            <!-- Bot List -->
            <div class="bot-list" v-if="bots.length > 0">
                <div class="bot-card" v-for="bot in bots" :key="bot.id">
                    <div class="bot-avatar">
                        <img :src="getServerIcon(bot.server)" :alt="bot.server">
                    </div>
                    <div class="bot-info">
                        <h3 class="bot-name">{{ bot.name || 'Unnamed Bot' }}</h3>
                        <div class="bot-meta">
                            <span class="meta-item">
                                <i class="bi bi-server"></i> {{ getServerName(bot.server) }}
                            </span>
                            <span class="meta-item">
                                <i class="bi bi-cpu"></i> {{ getModelName(bot) }}
                            </span>
                        </div>
                        <div class="bot-status" :class="bot.status">
                            <span class="status-dot"></span>
                            {{ bot.status === 'active' ? 'Active' : 'Inactive' }}
                        </div>
                    </div>
                    <div class="bot-actions">
                        <button class="action-btn" @click="toggleStatus(bot)" :title="bot.status === 'active' ? 'Deactivate' : 'Activate'">
                            <i :class="bot.status === 'active' ? 'bi bi-pause-fill' : 'bi bi-play-fill'"></i>
                        </button>
                        <button class="action-btn" @click="editBot(bot)" title="Edit">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="action-btn danger" @click="deleteBot(bot)" title="Delete">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div class="empty-state" v-else>
                <div class="empty-icon">
                    <i class="bi bi-robot"></i>
                </div>
                <h3>No Bots Yet</h3>
                <p>Create your first AI-powered Telegram bot</p>
                <button class="btn btn-primary" @click="$emit('navigate', 'main')">
                    <i class="bi bi-plus-circle"></i> Create Bot
                </button>
            </div>

            <!-- Edit Modal -->
            <div class="modal-overlay" v-if="editingBot" @click.self="editingBot = null">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="bi bi-pencil"></i> Edit Bot</h3>
                        <button class="close-btn" @click="editingBot = null">
                            <i class="bi bi-x"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label class="form-label">Bot Name</label>
                            <input type="text" class="form-control" v-model="editingBot.name">
                        </div>
                        <div class="form-group">
                            <label class="form-label">API Key</label>
                            <input type="password" class="form-control" v-model="editingBot.apiKey">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Model</label>
                            <select class="form-select" v-model="editingBot.model">
                                <option v-for="model in getServerModels(editingBot.server)" :key="model.id" :value="model.id">
                                    {{ model.name }}
                                </option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Bot Token</label>
                            <input type="password" class="form-control" v-model="editingBot.botToken">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" @click="editingBot = null">Cancel</button>
                        <button class="btn btn-primary" @click="saveBot">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    setup(props, { emit }) {
        const storage = useStorage();
        const bots = ref([]);
        const editingBot = ref(null);

        const loadBots = () => {
            bots.value = storage.getBots();
        };

        const activeBots = computed(() => {
            return bots.value.filter(b => b.status === 'active').length;
        });

        const getServerIcon = (server) => {
            return AI_MODELS[server]?.icon || '';
        };

        const getServerName = (server) => {
            return AI_MODELS[server]?.name || server;
        };

        const getModelName = (bot) => {
            const models = AI_MODELS[bot.server]?.models || [];
            const model = models.find(m => m.id === bot.model);
            return model?.name || bot.model;
        };

        const getServerModels = (server) => {
            return AI_MODELS[server]?.models || [];
        };

        const toggleStatus = (bot) => {
            bot.status = bot.status === 'active' ? 'inactive' : 'active';
            storage.updateBot(bot.id, { status: bot.status });
            loadBots();
        };

        const editBot = (bot) => {
            editingBot.value = { ...bot };
        };

        const saveBot = () => {
            if (editingBot.value) {
                storage.updateBot(editingBot.value.id, {
                    name: editingBot.value.name,
                    apiKey: editingBot.value.apiKey,
                    model: editingBot.value.model,
                    botToken: editingBot.value.botToken
                });
                loadBots();
                editingBot.value = null;
            }
        };

        const deleteBot = (bot) => {
            if (confirm('Are you sure you want to delete this bot?')) {
                storage.deleteBot(bot.id);
                loadBots();
            }
        };

        loadBots();

        return {
            bots,
            activeBots,
            editingBot,
            getServerIcon,
            getServerName,
            getModelName,
            getServerModels,
            toggleStatus,
            editBot,
            saveBot,
            deleteBot
        };
    }
};
