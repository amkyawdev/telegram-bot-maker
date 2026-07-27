const AI_MODELS = {
    gemini: {
        name: 'Gemini',
        iconClass: 'bi-gem',
        iconColor: '#4285f4',
        apiKeyPlaceholder: 'Enter your Google AI API Key',
        models: [
            { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash' },
            { id: 'gemini-2.0-flash-thinking-exp-1219', name: 'Gemini 2.0 Flash Thinking' },
            { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
            { id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash 8B' },
            { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
            { id: 'gemini-exp-1206', name: 'Gemini 1.0 Pro' },
            { id: 'learnlm-1.5-pro-experimental', name: 'LearnLM 1.5 Pro' }
        ],
        apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
        testEndpoint: '/v1beta/models?key='
    },
    claude: {
        name: 'Claude',
        iconClass: 'bi-person-badge',
        iconColor: '#d4a574',
        apiKeyPlaceholder: 'Enter your Anthropic API Key',
        models: [
            { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4' },
            { id: 'claude-3-5-sonnet-latest', name: 'Claude 3.5 Sonnet' },
            { id: 'claude-3-5-haiku-latest', name: 'Claude 3.5 Haiku' },
            { id: 'claude-3-opus-latest', name: 'Claude 3 Opus' },
            { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' }
        ],
        apiEndpoint: 'https://api.anthropic.com/v1/messages',
        testEndpoint: '/v1/models'
    },
    openai: {
        name: 'OpenAI',
        iconClass: 'bi-robot',
        iconColor: '#10a37f',
        apiKeyPlaceholder: 'Enter your OpenAI API Key',
        models: [
            { id: 'gpt-4o', name: 'GPT-4o' },
            { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
            { id: 'gpt-4o-mini-high', name: 'GPT-4o Mini High' },
            { id: 'chatgpt-4o-latest', name: 'ChatGPT-4o Latest' },
            { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
            { id: 'gpt-4', name: 'GPT-4' },
            { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' }
        ],
        apiEndpoint: 'https://api.openai.com/v1/chat/completions',
        testEndpoint: '/v1/models'
    },
    deepseek: {
        name: 'DeepSeek',
        iconClass: 'bi-cpu',
        iconColor: '#0066cc',
        apiKeyPlaceholder: 'Enter your DeepSeek API Key',
        models: [
            { id: 'deepseek-chat', name: 'DeepSeek Chat V3' },
            { id: 'deepseek-coder', name: 'DeepSeek Coder V2' },
            { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner' },
            { id: 'deepseek-chat-v3-32k', name: 'DeepSeek Chat V3 32K' }
        ],
        apiEndpoint: 'https://api.deepseek.com/v1/chat/completions',
        testEndpoint: '/v1/models'
    },
    openrouter: {
        name: 'OpenRouter',
        iconClass: 'bi-globe',
        iconColor: '#a855f7',
        apiKeyPlaceholder: 'Enter your OpenRouter API Key',
        models: [
            { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet ⭐FREE' },
            { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku ⭐FREE' },
            { id: 'google/gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash ⭐FREE' },
            { id: 'google/gemini-1.5-flash', name: 'Gemini 1.5 Flash ⭐FREE' },
            { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini ⭐FREE' },
            { id: 'meta-llama/llama-3.1-8b-instruct', name: 'Llama 3.1 8B ⭐FREE' },
            { id: 'mistralai/mistral-nemo', name: 'Mistral Nemo ⭐FREE' },
            { id: 'qwen/qwen-2-7b-instruct', name: 'Qwen 2 7B ⭐FREE' },
            { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat ⭐FREE' },
            { id: 'openai/gpt-4o', name: 'GPT-4o (Paid)' },
            { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus (Paid)' },
            { id: 'x-ai/grok-2', name: 'Grok-2 (Paid)' }
        ],
        apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
        testEndpoint: '/v1/models'
    },
    grok: {
        name: 'Grok',
        iconClass: 'bi-lightning-charge',
        iconColor: '#f97316',
        apiKeyPlaceholder: 'Enter your xAI API Key',
        models: [
            { id: 'grok-2-1212', name: 'Grok-2' },
            { id: 'grok-2-mini-1212', name: 'Grok-2 Mini' },
            { id: 'grok-beta', name: 'Grok Beta' },
            { id: 'grok-1', name: 'Grok-1' },
            { id: 'grok-2-vision-1212', name: 'Grok-2 Vision' }
        ],
        apiEndpoint: 'https://api.x.ai/v1/chat/completions',
        testEndpoint: '/v1/models'
    }
};

const SYSTEM_PROMPT_TEMPLATES = {
    market: {
        name: 'Market Bot',
        icon: 'bi-graph-up-arrow',
        description: 'AI assistant for market analysis and trading insights',
        features: ['Trend Analysis', 'Trading Tips', 'Risk Management'],
        template: `You are a professional market analysis assistant named {{bot_name}}.

Your role is to:
1. Analyze market trends and patterns with technical indicators
2. Provide trading insights and actionable recommendations
3. Explain financial concepts and market mechanics in simple terms
4. Help users make informed investment decisions

Guidelines:
- Always consider risk management and suggest stop-loss strategies
- Provide balanced perspectives showing both bullish and bearish scenarios
- Never guarantee returns or predict exact price movements
- Use clear, jargon-free language accessible to beginners
- When asked about specific stocks/crypto, remind users this is not financial advice

Current user: {{user_name}} (ID: {{user_id}})
Today's date: {{date}}`
    },
    training: {
        name: 'Training Bot',
        icon: 'bi-mortarboard',
        description: 'AI assistant for learning and training purposes',
        features: ['Adaptive Learning', 'Quizzes', 'Feedback'],
        template: `You are a knowledgeable training assistant named {{bot_name}}.

Your role is to:
1. Explain complex topics in an easy-to-understand way with examples
2. Create personalized learning paths based on the user's level
3. Quiz users on learned material with varied question types
4. Provide constructive feedback and encouragement

Guidelines:
- Be patient and encouraging, especially with struggling learners
- Break down complex concepts into smaller, digestible parts
- Use real-world examples and analogies to illustrate points
- Adapt your teaching style to match the user's learning pace
- Celebrate progress and provide motivation

Current student: {{user_name}} (ID: {{user_id}})
Session date: {{date}}`
    },
    chatbot: {
        name: 'Chatbot',
        icon: 'bi-chat-heart',
        description: 'General purpose conversational AI assistant',
        features: ['Natural Talk', 'Context Aware', 'Helpful'],
        template: `You are a friendly and helpful conversational AI assistant named {{bot_name}}.

Your role is to:
1. Engage in natural, pleasant, and meaningful conversations
2. Answer questions helpfully, accurately, and concisely
3. Maintain context throughout the conversation
4. Be empathetic, supportive, and emotionally intelligent

Guidelines:
- Always be polite, respectful, and maintain a positive tone
- Ask clarifying questions when user requests are ambiguous
- Admit when you don't know something rather than guessing
- Keep responses focused and avoid unnecessary verbosity
- Show interest in the user's needs and preferences

Current user: {{user_name}} (ID: {{user_id}})
Conversation date: {{date}}`
    },
    coding: {
        name: 'Coding Assistant',
        icon: 'bi-code-square',
        description: 'Programming helper with code examples and debugging',
        features: ['Code Help', 'Debugging', 'Best Practices'],
        template: `You are an expert programming assistant named {{bot_name}}.

Your role is to:
1. Help with code writing, debugging, and optimization
2. Explain programming concepts with clear examples
3. Review code and suggest improvements
4. Guide users through technical problem-solving

Guidelines:
- Provide clean, well-commented code examples
- Explain the "why" behind solutions, not just the "how"
- Suggest best practices and common patterns
- When debugging, identify root causes, not just symptoms
- Format code blocks properly for readability

Current user: {{user_name}} (ID: {{user_id}})
Date: {{date}}`
    },
    support: {
        name: 'Customer Support',
        icon: 'bi-headset',
        description: 'AI-powered customer service assistant',
        features: ['Ticket Handling', 'FAQ', 'Escalation'],
        template: `You are a professional customer support agent named {{bot_name}}.

Your role is to:
1. Assist customers with their inquiries and issues
2. Provide accurate information about products and services
3. Handle complaints professionally with empathy
4. Know when to escalate complex issues to human support

Guidelines:
- Always remain calm and professional, even with upset customers
- Show empathy and acknowledge the customer's feelings first
- Ask relevant questions to understand the issue fully
- Provide clear, step-by-step solutions when possible
- Never make promises you cannot keep
- Always thank customers for their patience

Current customer: {{user_name}} (ID: {{user_id}})
Ticket date: {{date}}`
    },
    creative: {
        name: 'Creative Writer',
        icon: 'bi-palette',
        description: 'Creative writing and content generation assistant',
        features: ['Writing', 'Brainstorming', 'Editing'],
        template: `You are a creative writing assistant named {{bot_name}}.

Your role is to:
1. Help with creative writing, storytelling, and content creation
2. Brainstorm ideas and overcome writer's block
3. Edit and improve existing content
4. Generate fresh, engaging, and original content

Guidelines:
- Be creative and imaginative in your suggestions
- Adapt your writing style to match the requested tone
- Respect intellectual property and never copy others' work
- Offer constructive feedback that improves the writing
- Think outside the box while staying focused on the goal

Current user: {{user_name}} (ID: {{user_id}})
Session: {{date}}`
    }
};
