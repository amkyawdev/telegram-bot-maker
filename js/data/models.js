const AI_MODELS = {
    gemini: {
        name: 'Gemini',
        icon: 'gemini',
        apiKeyPlaceholder: 'Enter your Google AI API Key',
        models: [
            { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash' },
            { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
            { id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash 8B' },
            { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
            { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro' }
        ],
        apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
        testEndpoint: '/v1beta/models?key='
    },
    claude: {
        name: 'Claude',
        icon: 'claude',
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
        icon: 'openai',
        apiKeyPlaceholder: 'Enter your OpenAI API Key',
        models: [
            { id: 'gpt-4o', name: 'GPT-4o' },
            { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
            { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
            { id: 'gpt-4', name: 'GPT-4' },
            { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' }
        ],
        apiEndpoint: 'https://api.openai.com/v1/chat/completions',
        testEndpoint: '/v1/models'
    },
    deepseek: {
        name: 'DeepSeek',
        icon: 'deepseek',
        apiKeyPlaceholder: 'Enter your DeepSeek API Key',
        models: [
            { id: 'deepseek-chat', name: 'DeepSeek Chat' },
            { id: 'deepseek-coder', name: 'DeepSeek Coder' },
            { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner' }
        ],
        apiEndpoint: 'https://api.deepseek.com/v1/chat/completions',
        testEndpoint: '/v1/models'
    },
    openrouter: {
        name: 'OpenRouter',
        icon: 'openrouter',
        apiKeyPlaceholder: 'Enter your OpenRouter API Key',
        models: [
            { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet (OpenRouter)' },
            { id: 'openai/gpt-4o', name: 'GPT-4o (OpenRouter)' },
            { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5 (OpenRouter)' },
            { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat (OpenRouter)' },
            { id: 'x-ai/grok-2', name: 'Grok-2 (OpenRouter)' },
            { id: 'meta-llama/llama-3-70b-instruct', name: 'Llama 3 70B' }
        ],
        apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
        testEndpoint: '/v1/models'
    },
    grok: {
        name: 'Grok',
        icon: 'grok',
        apiKeyPlaceholder: 'Enter your xAI API Key',
        models: [
            { id: 'grok-2-1212', name: 'Grok-2' },
            { id: 'grok-2-mini-1212', name: 'Grok-2 Mini' },
            { id: 'grok-beta', name: 'Grok Beta' },
            { id: 'grok-1', name: 'Grok-1' }
        ],
        apiEndpoint: 'https://api.x.ai/v1/chat/completions',
        testEndpoint: '/v1/models'
    }
};

const SYSTEM_PROMPT_TEMPLATES = {
    market: {
        name: 'Market Bot',
        description: 'AI assistant for market analysis and trading insights',
        template: `You are a professional market analysis assistant. Your role is to:
1. Analyze market trends and patterns
2. Provide trading insights and recommendations
3. Explain financial concepts in simple terms
4. Help users make informed investment decisions

Always consider risk management and provide balanced perspectives.`
    },
    training: {
        name: 'Training Bot',
        description: 'AI assistant for learning and training purposes',
        template: `You are a knowledgeable training assistant. Your role is to:
1. Explain complex topics in an easy-to-understand way
2. Create personalized learning paths
3. Quiz users on learned material
4. Provide constructive feedback and encouragement

Be patient, encouraging, and adapt your teaching style to the user.`
    },
    chatbot: {
        name: 'Chatbot',
        description: 'General purpose conversational AI assistant',
        template: `You are a friendly and helpful conversational AI assistant. Your role is to:
1. Engage in natural, pleasant conversations
2. Answer questions helpfully and accurately
3. Remember context within the conversation
4. Be empathetic and supportive

Always be polite, respectful, and maintain a positive tone.`
    }
};
