const SystemPrompt = {
    emits: ['navigate'],
    template: `
        <div class="system-prompt-page">
            <div class="page-header">
                <button class="back-btn" @click="$emit('navigate', 'api')">
                    <i class="bi bi-arrow-left"></i>
                </button>
                <h1 class="page-title">
                    <i class="bi bi-chat-left-text"></i> System Prompt
                </h1>
            </div>

            <!-- Template Selection -->
            <div class="section">
                <h2 class="section-title">
                    <i class="bi bi-stars"></i> Choose Template
                </h2>
                <div class="template-grid">
                    <div 
                        v-for="(template, key) in templates" 
                        :key="key"
                        class="template-card"
                        :class="{ selected: selectedTemplate === key }"
                        @click="useTemplate(key)"
                    >
                        <div class="template-icon">
                            <i :class="template.icon"></i>
                        </div>
                        <div class="template-info">
                            <h3>{{ template.name }}</h3>
                            <p>{{ template.description }}</p>
                        </div>
                        <div class="template-check" v-if="selectedTemplate === key">
                            <i class="bi bi-check-circle-fill"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Custom Prompt Editor -->
            <div class="section">
                <div class="section-header">
                    <h2 class="section-title">
                        <i class="bi bi-pen"></i> Custom Prompt
                    </h2>
                    <button class="btn btn-sm btn-outline" @click="clearPrompt">
                        <i class="bi bi-trash"></i> Clear
                    </button>
                </div>
                <div class="editor-card">
                    <textarea 
                        class="prompt-textarea"
                        v-model="systemPrompt"
                        placeholder="Write your custom system prompt here..."
                        rows="10"
                    ></textarea>
                    <div class="editor-footer">
                        <span class="char-count">{{ systemPrompt.length }} characters</span>
                        <span class="token-estimate">~{{ Math.ceil(systemPrompt.length / 4) }} tokens</span>
                    </div>
                </div>
            </div>

            <!-- Preview -->
            <div class="section" v-if="systemPrompt">
                <h2 class="section-title">
                    <i class="bi bi-eye"></i> Preview
                </h2>
                <div class="preview-card">
                    <div class="preview-header">
                        <i class="bi bi-robot"></i> Bot Response Preview
                    </div>
                    <div class="preview-content">
                        {{ previewText }}
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="action-bar">
                <button class="btn btn-secondary" @click="$emit('navigate', 'api')">
                    <i class="bi bi-arrow-left"></i> Back
                </button>
                <button class="btn btn-primary btn-lg" @click="runBot" :disabled="!systemPrompt">
                    <i class="bi bi-play-fill"></i> Run Bot
                </button>
            </div>

            <!-- Run Animation Modal -->
            <div class="modal-overlay" v-if="showAnimation" @click.self="closeAnimation">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>
                            <i class="bi bi-gear fa-spin"></i> Running Bot...
                        </h3>
                    </div>
                    <div class="animation-steps">
                        <div 
                            v-for="(step, index) in animationSteps" 
                            :key="index"
                            class="animation-step"
                            :class="{ active: currentStep === index, completed: currentStep > index }"
                        >
                            <div class="step-indicator">
                                <i v-if="currentStep > index" class="bi bi-check-circle-fill"></i>
                                <i v-else-if="currentStep === index" class="bi bi-arrow-right-circle-fill"></i>
                                <i v-else class="bi bi-circle"></i>
                            </div>
                            <div class="step-content">
                                <div class="step-title">{{ step.title }}</div>
                                <div class="step-detail" v-if="currentStep === index">
                                    <div class="loading-dots">
                                        <span></span><span></span><span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    setup(props, { emit }) {
        const storage = useStorage();
        const templates = SYSTEM_PROMPT_TEMPLATES;
        const selectedTemplate = ref(null);
        const systemPrompt = ref('');
        const showAnimation = ref(false);
        const currentStep = ref(0);
        const animationSteps = [
            { title: 'Validating API Key' },
            { title: 'Testing Model Connection' },
            { title: 'Verifying Bot Token' },
            { title: 'Creating Bot Configuration' },
            { title: 'Success! Bot Created' }
        ];

        const useTemplate = (key) => {
            selectedTemplate.value = key;
            systemPrompt.value = templates[key].template;
        };

        const clearPrompt = () => {
            selectedTemplate.value = null;
            systemPrompt.value = '';
        };

        const previewText = computed(() => {
            if (!systemPrompt.value) return '';
            return "Hello! I'm your AI-powered Telegram bot. I can help you with various tasks using advanced artificial intelligence. How can I assist you today?";
        });

        const runBot = async () => {
            showAnimation.value = true;
            currentStep.value = 0;

            for (let i = 0; i < animationSteps.length; i++) {
                currentStep.value = i;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // Save configuration
            const config = storage.getApiConfig();
            if (config) {
                for (const key in config) {
                    config[key].systemPrompt = systemPrompt.value;
                }
                storage.saveApiConfig(config);
            }

            await new Promise(resolve => setTimeout(resolve, 500));
            showAnimation.value = false;
            emit('navigate', 'bots');
        };

        const closeAnimation = () => {
            showAnimation.value = false;
        };

        return {
            templates,
            selectedTemplate,
            systemPrompt,
            showAnimation,
            currentStep,
            animationSteps,
            previewText,
            useTemplate,
            clearPrompt,
            runBot,
            closeAnimation
        };
    }
};
