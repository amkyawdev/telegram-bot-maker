const SystemPrompt = {
    emits: ['navigate'],
    template: `
        <div class="system-prompt-page">
            <nav class="navbar">
                <div class="navbar-brand">
                    <i class="bi bi-chat-left-text"></i> System Prompts
                </div>
                <div class="nav-links">
                    <a class="nav-link" @click="$emit('navigate', 'main')">
                        <i class="bi bi-grid"></i> Home
                    </a>
                    <a class="nav-link" @click="$emit('navigate', 'api')">
                        <i class="bi bi-key"></i> API Config
                    </a>
                    <a class="nav-link active" @click="$emit('navigate', 'prompt')">
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
                <h3 class="mb-3">System Prompt Templates</h3>
                
                <div class="template-grid">
                    <div 
                        v-for="(template, key) in templates" 
                        :key="key"
                        class="card template-card"
                        @click="selectTemplate(key)"
                    >
                        <div class="card-body">
                            <h5>{{ template.name }}</h5>
                            <p class="text-muted">{{ template.description }}</p>
                            <button class="btn btn-sm btn-outline">
                                <i class="bi bi-use"></i> Use Template
                            </button>
                        </div>
                    </div>
                </div>

                <div class="card mt-3">
                    <div class="card-header d-flex align-items-center justify-content-between">
                        <span>Custom Prompt Editor</span>
                        <button class="btn btn-sm btn-primary" @click="saveCustomPrompt">
                            <i class="bi bi-save"></i> Save
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="form-group">
                            <label class="form-label">Prompt Name</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                v-model="customPromptName"
                                placeholder="Enter a name for your prompt"
                            >
                        </div>
                        <div class="form-group">
                            <label class="form-label">System Prompt</label>
                            <textarea 
                                class="form-control" 
                                v-model="customPromptText"
                                placeholder="Enter your custom system prompt here..."
                                rows="8"
                            ></textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Variables</label>
                            <p class="text-muted small">
                                Available variables: {{ '{{user_name}}' }}, {{ '{{user_id}}' }}, {{ '{{chat_id}}' }}, {{ '{{bot_name}}' }}
                            </p>
                        </div>
                    </div>
                </div>

                <h4 class="mt-3 mb-3">Saved Prompts</h4>
                <div v-if="savedPromptsList.length === 0" class="text-muted text-center p-3">
                    No custom prompts saved yet.
                </div>
                <div v-else class="saved-prompts">
                    <div 
                        v-for="(prompt, name) in savedPromptsList" 
                        :key="name"
                        class="card mb-2"
                    >
                        <div class="card-body d-flex align-items-center justify-content-between">
                            <div>
                                <strong>{{ name }}</strong>
                                <p class="text-muted mb-0 small">{{ prompt.substring(0, 100) }}...</p>
                            </div>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-outline" @click="loadPrompt(name)">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" @click="deletePrompt(name)">
                                    <i class="bi bi-trash"></i>
                                </button>
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
        const customPromptName = ref('');
        const customPromptText = ref('');
        const savedPromptsList = ref({});

        const loadSavedPrompts = () => {
            savedPromptsList.value = storage.getSystemPrompts();
        };

        const selectTemplate = (key) => {
            const template = templates[key];
            customPromptName.value = template.name;
            customPromptText.value = template.template;
        };

        const saveCustomPrompt = () => {
            if (!customPromptName.value.trim() || !customPromptText.value.trim()) {
                alert('Please enter both a name and prompt text.');
                return;
            }
            storage.addSystemPrompt(customPromptName.value.trim(), customPromptText.value.trim());
            loadSavedPrompts();
            alert('Prompt saved successfully!');
        };

        const loadPrompt = (name) => {
            const prompts = storage.getSystemPrompts();
            if (prompts[name]) {
                customPromptName.value = name;
                customPromptText.value = prompts[name];
            }
        };

        const deletePrompt = (name) => {
            if (confirm(`Are you sure you want to delete "${name}"?`)) {
                storage.deleteSystemPrompt(name);
                loadSavedPrompts();
                if (customPromptName.value === name) {
                    customPromptName.value = '';
                    customPromptText.value = '';
                }
            }
        };

        loadSavedPrompts();

        return {
            templates,
            customPromptName,
            customPromptText,
            savedPromptsList,
            selectTemplate,
            saveCustomPrompt,
            loadPrompt,
            deletePrompt
        };
    }
};
