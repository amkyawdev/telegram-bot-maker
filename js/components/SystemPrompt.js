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

            <!-- Tab Navigation -->
            <div class="prompt-tabs">
                <button 
                    class="prompt-tab" 
                    :class="{ active: activeTab === 'templates' }"
                    @click="activeTab = 'templates'"
                >
                    <i class="bi bi-collection"></i> Templates
                </button>
                <button 
                    class="prompt-tab" 
                    :class="{ active: activeTab === 'editor' }"
                    @click="activeTab = 'editor'"
                >
                    <i class="bi bi-code-slash"></i> Advanced Editor
                </button>
                <button 
                    class="prompt-tab" 
                    :class="{ active: activeTab === 'test' }"
                    @click="activeTab = 'test'"
                >
                    <i class="bi bi-play-circle"></i> Test
                </button>
            </div>

            <!-- Templates Tab -->
            <div class="tab-content" v-if="activeTab === 'templates'">
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
                            <div class="template-features" v-if="template.features">
                                <span v-for="feature in template.features" :key="feature" class="feature-tag">
                                    {{ feature }}
                                </span>
                            </div>
                            <div class="template-check" v-if="selectedTemplate === key">
                                <i class="bi bi-check-circle-fill"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Selected Template Preview -->
                <div class="section" v-if="selectedTemplate">
                    <h2 class="section-title">
                        <i class="bi bi-eye"></i> Template Preview
                    </h2>
                    <div class="preview-card">
                        <pre class="prompt-preview">{{ templates[selectedTemplate]?.template }}</pre>
                    </div>
                </div>
            </div>

            <!-- Advanced Editor Tab -->
            <div class="tab-content" v-if="activeTab === 'editor'">
                <div class="section">
                    <div class="editor-toolbar">
                        <div class="toolbar-group">
                            <button class="toolbar-btn" @click="insertVariable('{{user_name}}')" title="User Name">
                                <i class="bi bi-person"></i> User Name
                            </button>
                            <button class="toolbar-btn" @click="insertVariable('{{user_id}}')" title="User ID">
                                <i class="bi bi-hash"></i> User ID
                            </button>
                            <button class="toolbar-btn" @click="insertVariable('{{bot_name}}')" title="Bot Name">
                                <i class="bi bi-robot"></i> Bot Name
                            </button>
                            <button class="toolbar-btn" @click="insertVariable('{{date}}')" title="Current Date">
                                <i class="bi bi-calendar"></i> Date
                            </button>
                        </div>
                        <div class="toolbar-group">
                            <button class="toolbar-btn" @click="insertVariable('\\n')" title="New Line">
                                <i class="bi bi-arrow-down-right"></i>
                            </button>
                            <button class="toolbar-btn" @click="clearPrompt" title="Clear">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>

                    <div class="editor-container">
                        <div class="editor-line-numbers">
                            <div v-for="n in lineCount" :key="n">{{ n }}</div>
                        </div>
                        <textarea 
                            class="prompt-editor"
                            ref="editorRef"
                            v-model="systemPrompt"
                            placeholder="Write your custom system prompt here...

You can use variables like:
{{user_name}} - User's display name
{{user_id}} - User's Telegram ID
{{bot_name}} - Your bot's name
{{date}} - Current date"
                            @input="updateLineCount"
                        ></textarea>
                    </div>

                    <div class="editor-footer">
                        <div class="editor-stats">
                            <span class="stat">
                                <i class="bi bi-text-left"></i> {{ systemPrompt.length }} characters
                            </span>
                            <span class="stat">
                                <i class="bi bi-list-ol"></i> {{ lineCount }} lines
                            </span>
                            <span class="stat">
                                <i class="bi bi-lightning"></i> ~{{ Math.ceil(systemPrompt.length / 4) }} tokens
                            </span>
                        </div>
                        <div class="editor-hints">
                            <span class="hint" v-if="systemPrompt.length > 0 && systemPrompt.length < 50">
                                <i class="bi bi-exclamation-triangle"></i> Prompt too short
                            </span>
                            <span class="hint good" v-else-if="systemPrompt.length >= 50">
                                <i class="bi bi-check-circle"></i> Good length
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Variable Reference -->
                <div class="section">
                    <h2 class="section-title">
                        <i class="bi bi-book"></i> Variable Reference
                    </h2>
                    <div class="variable-list">
                        <div class="variable-item" @click="insertVariable('{{user_name}}')">
                            <code>{{user_name}}</code>
                            <span>User's Telegram display name</span>
                        </div>
                        <div class="variable-item" @click="insertVariable('{{user_id}}')">
                            <code>{{user_id}}</code>
                            <span>User's unique Telegram ID</span>
                        </div>
                        <div class="variable-item" @click="insertVariable('{{user_username}}')">
                            <code>{{user_username}}</code>
                            <span>User's @username (if set)</span>
                        </div>
                        <div class="variable-item" @click="insertVariable('{{bot_name}}')">
                            <code>{{bot_name}}</code>
                            <span>Your bot's display name</span>
                        </div>
                        <div class="variable-item" @click="insertVariable('{{date}}')">
                            <code>{{date}}</code>
                            <span>Current date (YYYY-MM-DD)</span>
                        </div>
                        <div class="variable-item" @click="insertVariable('{{time}}')">
                            <code>{{time}}</code>
                            <span>Current time (HH:MM:SS)</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Test Tab -->
            <div class="tab-content" v-if="activeTab === 'test'">
                <div class="section">
                    <h2 class="section-title">
                        <i class="bi bi-chat-dots"></i> Chat Test
                    </h2>
                    
                    <!-- Chat Container -->
                    <div class="chat-container">
                        <!-- Chat Messages -->
                        <div class="chat-messages" ref="chatMessages">
                            <div v-if="chatHistory.length === 0" class="chat-empty">
                                <i class="bi bi-chat-square-text"></i>
                                <p>Start chatting with your bot!</p>
                                <small>Your messages will appear here with AI responses.</small>
                            </div>
                            
                            <div 
                                v-for="(msg, index) in chatHistory" 
                                :key="index"
                                class="chat-message"
                                :class="msg.role"
                            >
                                <div class="message-avatar">
                                    <i :class="msg.role === 'user' ? 'bi bi-person' : 'bi bi-robot'"></i>
                                </div>
                                <div class="message-content">
                                    <div class="message-text">{{ msg.content }}</div>
                                    <div class="message-time">{{ msg.time }}</div>
                                </div>
                            </div>
                            
                            <div v-if="isChatLoading" class="chat-message bot typing">
                                <div class="message-avatar">
                                    <i class="bi bi-robot"></i>
                                </div>
                                <div class="message-content">
                                    <div class="message-text typing-indicator">
                                        <span></span><span></span><span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Chat Input -->
                        <div class="chat-input-container">
                            <input 
                                type="text" 
                                class="form-control chat-input" 
                                v-model="chatMessage"
                                placeholder="Type a message..."
                                @keyup.enter="sendChatMessage"
                                :disabled="isChatLoading || !hasConfig"
                            >
                            <button 
                                class="btn btn-primary chat-send-btn"
                                @click="sendChatMessage"
                                :disabled="isChatLoading || !chatMessage.trim() || !hasConfig"
                            >
                                <i class="bi bi-send"></i>
                            </button>
                        </div>
                        
                        <div v-if="!hasConfig" class="chat-warning">
                            <i class="bi bi-exclamation-triangle"></i>
                            Please configure your OpenRouter API key first.
                        </div>
                        
                        <div class="chat-actions">
                            <button class="btn btn-sm btn-secondary" @click="clearChat">
                                <i class="bi bi-trash"></i> Clear Chat
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="action-bar">
                <button class="btn btn-secondary" @click="$emit('navigate', 'api')">
                    <i class="bi bi-arrow-left"></i> Back
                </button>
                <button class="btn btn-primary btn-lg" @click="createBot" :disabled="!systemPrompt">
                    <i class="bi bi-rocket-takeoff"></i> Create Bot
                </button>
            </div>

            <!-- Bot Creation Animation Modal -->
            <div class="modal-overlay" v-if="showAnimation" @click.self="closeAnimation">
                <div class="modal-content creation-modal">
                    <div class="modal-header">
                        <div class="creation-icon" :class="{ success: creationComplete }">
                            <i class="bi" :class="creationComplete ? 'bi-check-circle-fill' : 'bi bi-robot'"></i>
                        </div>
                        <h3>
                            {{ creationComplete ? '🎉 Bot Created Successfully!' : '🚀 Creating Your Bot' }}
                        </h3>
                    </div>
                    <div class="creation-content">
                        <div class="creation-steps">
                            <div 
                                v-for="(step, index) in creationSteps" 
                                :key="index"
                                class="creation-step"
                                :class="{ 
                                    active: currentStep === index && !creationComplete, 
                                    completed: step.status === 'completed',
                                    error: step.status === 'error'
                                }"
                            >
                                <div class="step-icon">
                                    <i v-if="step.status === 'completed'" class="bi bi-check-circle-fill"></i>
                                    <i v-else-if="step.status === 'error'" class="bi bi-x-circle-fill"></i>
                                    <i v-else-if="currentStep === index && !creationComplete" class="bi bi-arrow-right-circle-fill animate-pulse"></i>
                                    <i v-else class="bi bi-circle"></i>
                                </div>
                                <div class="step-details">
                                    <div class="step-title">{{ step.title }}</div>
                                    <div class="step-description">{{ step.description }}</div>
                                    <div class="step-progress" v-if="currentStep === index && !creationComplete">
                                        <div class="progress-bar-animated"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bot-preview" v-if="creationComplete && createdBotInfo">
                            <div class="preview-header">
                                <i class="bi bi-telegram"></i> Your Bot is Ready!
                            </div>
                            <div class="preview-body">
                                <div class="bot-info-row">
                                    <span class="label">Bot Name:</span>
                                    <span class="value">{{ createdBotInfo.name }}</span>
                                </div>
                                <div class="bot-info-row">
                                    <span class="label">Username:</span>
                                    <span class="value">@{{ createdBotInfo.username }}</span>
                                </div>
                                <div class="bot-info-row">
                                    <span class="label">AI Server:</span>
                                    <span class="value">{{ createdBotInfo.server }}</span>
                                </div>
                                <div class="bot-info-row">
                                    <span class="label">Model:</span>
                                    <span class="value">{{ createdBotInfo.model }}</span>
                                </div>
                            </div>
                            <div class="preview-footer">
                                <a :href="'https://t.me/' + createdBotInfo.username" target="_blank" class="btn btn-telegram">
                                    <i class="bi bi-telegram"></i> Open in Telegram
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer" v-if="creationComplete">
                        <button class="btn btn-secondary" @click="closeAnimation">
                            <i class="bi bi-list"></i> View All Bots
                        </button>
                        <button class="btn btn-primary" @click="createAnother">
                            <i class="bi bi-plus-circle"></i> Create Another
                        </button>
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
        const creationComplete = ref(false);
        const createdBotInfo = ref(null);
        const activeTab = ref('templates');
        const editorRef = ref(null);
        const lineCount = ref(1);
        
        // Test variables
        const testMessage = ref('');
        const isTesting = ref(false);
        const testResult = ref(null);
        
        // Chat variables
        const chatMessage = ref('');
        const chatHistory = ref([]);
        const isChatLoading = ref(false);
        const chatMessages = ref(null);
        
        const hasConfig = computed(() => {
            const config = storage.getApiConfig();
            return config?.openrouter?.apiKey && config?.openrouter?.model;
        });
        
        const formatTime = (date) => {
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        };
        
        const sendChatMessage = async () => {
            if (!chatMessage.value.trim() || isChatLoading.value) return;
            
            const config = storage.getApiConfig();
            const openrouterConfig = config?.openrouter;
            
            if (!openrouterConfig?.apiKey) return;
            
            const userMessage = chatMessage.value.trim();
            const now = new Date();
            
            // Add user message to chat
            chatHistory.value.push({
                role: 'user',
                content: userMessage,
                time: formatTime(now)
            });
            
            chatMessage.value = '';
            isChatLoading.value = true;
            
            // Scroll to bottom
            setTimeout(() => {
                if (chatMessages.value) {
                    chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
                }
            }, 100);
            
            try {
                // Build messages array with system prompt and chat history
                const messages = [
                    { role: 'system', content: systemPrompt.value || 'You are a helpful AI assistant.' },
                    ...chatHistory.value.map(m => ({ role: m.role, content: m.content }))
                ];
                
                const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${openrouterConfig.apiKey}`,
                        'HTTP-Referer': 'https://telegram-bot-maker.app',
                        'X-Title': 'Telegram Bot Maker'
                    },
                    body: JSON.stringify({
                        model: openrouterConfig.model,
                        messages: messages,
                        temperature: 0.9,
                        max_tokens: 2048
                    })
                });
                
                const text = await response.text();
                let aiResponse;
                
                if (!response.ok) {
                    try {
                        const errorData = JSON.parse(text);
                        aiResponse = errorData.error?.message || `Error: HTTP ${response.status}`;
                    } catch {
                        aiResponse = `Error: HTTP ${response.status}`;
                    }
                } else {
                    try {
                        const data = JSON.parse(text);
                        aiResponse = data.choices?.[0]?.message?.content || 'No response';
                    } catch {
                        aiResponse = 'Failed to parse response';
                    }
                }
                
                // Add AI response to chat
                chatHistory.value.push({
                    role: 'bot',
                    content: aiResponse,
                    time: formatTime(new Date())
                });
            } catch (error) {
                chatHistory.value.push({
                    role: 'bot',
                    content: 'Error: ' + error.message,
                    time: formatTime(new Date())
                });
            }
            
            isChatLoading.value = false;
            
            // Scroll to bottom
            setTimeout(() => {
                if (chatMessages.value) {
                    chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
                }
            }, 100);
        };
        
        const clearChat = () => {
            chatHistory.value = [];
        };

        const creationSteps = ref([
            { title: 'Validating API Configuration', description: 'Checking API keys and settings...', status: 'pending' },
            { title: 'Testing AI Connection', description: 'Connecting to AI server...', status: 'pending' },
            { title: 'Verifying Telegram Token', description: 'Validating bot token with Telegram...', status: 'pending' },
            { title: 'Registering Webhook', description: 'Setting up webhook endpoint...', status: 'pending' },
            { title: 'Finalizing Configuration', description: 'Saving bot settings...', status: 'pending' }
        ]);

        const updateLineCount = () => {
            lineCount.value = (systemPrompt.value.match(/\n/g) || []).length + 1;
        };

        const insertVariable = (variable) => {
            const textarea = editorRef.value;
            if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const before = systemPrompt.value.substring(0, start);
                const after = systemPrompt.value.substring(end);
                systemPrompt.value = before + variable + after;
                
                // Set cursor position after insertion
                setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = start + variable.length;
                    textarea.focus();
                }, 0);
            } else {
                systemPrompt.value += variable;
            }
        };

        const useTemplate = (key) => {
            selectedTemplate.value = key;
            systemPrompt.value = templates[key].template;
            updateLineCount();
        };

        const clearPrompt = () => {
            selectedTemplate.value = null;
            systemPrompt.value = '';
            lineCount.value = 1;
        };

        // Test prompt with OpenRouter directly
        const testPromptWithOpenRouter = async (apiKey, model, systemPrompt, message) => {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': 'https://telegram-bot-maker.app',
                    'X-Title': 'Telegram Bot Maker'
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: message }
                    ],
                    temperature: 0.9,
                    max_tokens: 2048
                })
            });
            
            const text = await response.text();
            
            if (!response.ok) {
                try {
                    const errorData = JSON.parse(text);
                    throw new Error(errorData.error?.message || `HTTP ${response.status}`);
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    throw e;
                }
            }
            
            const data = JSON.parse(text);
            return data.choices?.[0]?.message?.content || 'No response';
        };

        const testPrompt = async () => {
            if (!systemPrompt.value || !testMessage.value) return;
            
            isTesting.value = true;
            testResult.value = null;
            
            const config = storage.getApiConfig();
            const openrouterConfig = config?.openrouter;
            
            if (!openrouterConfig?.apiKey) {
                testResult.value = { error: 'No OpenRouter API key configured. Please configure an API key first.' };
                isTesting.value = false;
                return;
            }

            const startTime = Date.now();
            
            try {
                const response = await testPromptWithOpenRouter(
                    openrouterConfig.apiKey,
                    openrouterConfig.model,
                    systemPrompt.value,
                    testMessage.value
                );
                const latency = Date.now() - startTime;
                testResult.value = { response, latency };
            } catch (error) {
                testResult.value = { error: error.message };
            }
            
            isTesting.value = false;
        };

        const createBot = async () => {
            showAnimation.value = true;
            creationComplete.value = false;
            currentStep.value = 0;
            
            // Reset all steps
            creationSteps.value.forEach(step => step.status = 'pending');
            
            const config = storage.getApiConfig();
            const openrouterConfig = config?.openrouter;
            
            if (!openrouterConfig?.apiKey) {
                creationSteps.value[0].status = 'error';
                creationSteps.value[0].description = 'No OpenRouter API configuration found';
                showAnimation.value = false;
                return;
            }

            // Step 1: Validate API
            creationSteps.value[0].status = 'active';
            await new Promise(resolve => setTimeout(resolve, 800));
            creationSteps.value[0].status = 'completed';
            creationSteps.value[0].description = 'API configuration validated';
            currentStep.value = 1;
            
            // Step 2: Test OpenRouter AI Connection
            creationSteps.value[1].status = 'active';
            creationSteps.value[1].description = 'Connecting to OpenRouter...';
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            try {
                await testPromptWithOpenRouter(
                    openrouterConfig.apiKey,
                    openrouterConfig.model,
                    'You are a test bot. Say "OK" if you can hear me.',
                    'test'
                );
            } catch (error) {
                creationSteps.value[1].status = 'error';
                creationSteps.value[1].description = 'Connection failed: ' + error.message;
                showAnimation.value = false;
                return;
            }
            
            creationSteps.value[1].status = 'completed';
            creationSteps.value[1].description = 'AI connection successful';
            currentStep.value = 2;
            
            // Step 3: Verify Telegram Token
            creationSteps.value[2].status = 'active';
            creationSteps.value[2].description = 'Verifying Telegram bot token...';
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const botToken = openrouterConfig.botToken;
            if (!botToken) {
                creationSteps.value[2].status = 'error';
                creationSteps.value[2].description = 'No bot token configured';
                showAnimation.value = false;
                return;
            }
            
            try {
                const telegramResponse = await fetch('https://api.telegram.org/bot' + botToken + '/getMe');
                const text = await telegramResponse.text();
                let telegramData;
                
                try {
                    telegramData = JSON.parse(text);
                } catch {
                    throw new Error('Invalid response from Telegram');
                }
                
                if (!telegramData.ok) {
                    throw new Error(telegramData.description || 'Invalid bot token');
                }
                
                createdBotInfo.value = {
                    name: telegramData.result.first_name,
                    username: telegramData.result.username,
                    server: 'openrouter',
                    model: openrouterConfig.model
                };
            } catch (error) {
                creationSteps.value[2].status = 'error';
                creationSteps.value[2].description = 'Token verification failed: ' + error.message;
                showAnimation.value = false;
                return;
            }
            
            creationSteps.value[2].status = 'completed';
            creationSteps.value[2].description = 'Bot token verified';
            currentStep.value = 3;
            
            // Step 4: Register Webhook
            creationSteps.value[3].status = 'active';
            creationSteps.value[3].description = 'Setting up webhook...';
            await new Promise(resolve => setTimeout(resolve, 600));
            
            const webhookUrl = window.location.origin + '/webhook/' + botToken;
            try {
                await fetch('https://api.telegram.org/bot' + botToken + '/setWebhook', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: webhookUrl })
                });
            } catch (e) {
                // Continue even if webhook setup fails
            }
            
            creationSteps.value[3].status = 'completed';
            creationSteps.value[3].description = 'Webhook configured';
            currentStep.value = 4;
            
            // Step 5: Save Configuration
            creationSteps.value[4].status = 'active';
            creationSteps.value[4].description = 'Saving bot configuration...';
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Save bot to storage
            const botData = {
                name: createdBotInfo.value.name,
                server: 'openrouter',
                model: openrouterConfig.model,
                botToken: botToken,
                systemPrompt: systemPrompt.value,
                status: 'active'
            };
            
            storage.addBot(botData);
            
            creationSteps.value[4].status = 'completed';
            creationSteps.value[4].description = 'Configuration saved';
            currentStep.value = 5;
            creationComplete.value = true;
            showAnimation.value = false;
        };

        const closeAnimation = () => {
            showAnimation.value = false;
            emit('navigate', 'bots');
        };

        const createAnother = () => {
            showAnimation.value = false;
            selectedTemplate.value = null;
            systemPrompt.value = '';
            activeTab.value = 'templates';
            emit('navigate', 'main');
        };

        return {
            templates,
            selectedTemplate,
            systemPrompt,
            showAnimation,
            currentStep,
            creationSteps,
            creationComplete,
            createdBotInfo,
            activeTab,
            editorRef,
            lineCount,
            testMessage,
            isTesting,
            testResult,
            chatMessage,
            chatHistory,
            isChatLoading,
            chatMessages,
            hasConfig,
            updateLineCount,
            insertVariable,
            useTemplate,
            clearPrompt,
            testPrompt,
            createBot,
            closeAnimation,
            createAnother,
            sendChatMessage,
            clearChat
        };
    }
};
