const useStorage = () => {
    const STORAGE_KEYS = {
        API_CONFIG: 'tbm_api_config',
        BOTS: 'tbm_bots',
        SYSTEM_PROMPTS: 'tbm_system_prompts',
        APP_SETTINGS: 'tbm_settings'
    };

    const get = (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading from localStorage: ${key}`, error);
            return null;
        }
    };

    const set = (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error writing to localStorage: ${key}`, error);
            return false;
        }
    };

    const remove = (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing from localStorage: ${key}`, error);
            return false;
        }
    };

    const clear = () => {
        try {
            Object.values(STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            console.error('Error clearing localStorage', error);
            return false;
        }
    };

    // API Configuration
    const getApiConfig = () => {
        return get(STORAGE_KEYS.API_CONFIG) || {
            gemini: { apiKey: '', model: '' },
            claude: { apiKey: '', model: '' },
            openai: { apiKey: '', model: '' },
            deepseek: { apiKey: '', model: '' },
            openrouter: { apiKey: '', model: '' },
            grok: { apiKey: '', model: '' }
        };
    };

    const saveApiConfig = (config) => {
        return set(STORAGE_KEYS.API_CONFIG, config);
    };

    // Bot Token
    const getBotToken = () => {
        const config = getApiConfig();
        return config.botToken || '';
    };

    const saveBotToken = (token) => {
        const config = getApiConfig();
        config.botToken = token;
        return saveApiConfig(config);
    };

    // Bots List
    const getBots = () => {
        return get(STORAGE_KEYS.BOTS) || [];
    };

    const saveBots = (bots) => {
        return set(STORAGE_KEYS.BOTS, bots);
    };

    const addBot = (bot) => {
        const bots = getBots();
        const newBot = {
            ...bot,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        };
        bots.push(newBot);
        return saveBots(bots) ? newBot : null;
    };

    const updateBot = (id, updates) => {
        const bots = getBots();
        const index = bots.findIndex(b => b.id === id);
        if (index !== -1) {
            bots[index] = { ...bots[index], ...updates, updatedAt: new Date().toISOString() };
            return saveBots(bots);
        }
        return false;
    };

    const deleteBot = (id) => {
        const bots = getBots();
        const filtered = bots.filter(b => b.id !== id);
        return saveBots(filtered);
    };

    // System Prompts
    const getSystemPrompts = () => {
        return get(STORAGE_KEYS.SYSTEM_PROMPTS) || {};
    };

    const saveSystemPrompts = (prompts) => {
        return set(STORAGE_KEYS.SYSTEM_PROMPTS, prompts);
    };

    const addSystemPrompt = (name, prompt) => {
        const prompts = getSystemPrompts();
        prompts[name] = prompt;
        return saveSystemPrompts(prompts);
    };

    const deleteSystemPrompt = (name) => {
        const prompts = getSystemPrompts();
        delete prompts[name];
        return saveSystemPrompts(prompts);
    };

    return {
        STORAGE_KEYS,
        get,
        set,
        remove,
        clear,
        getApiConfig,
        saveApiConfig,
        getBotToken,
        saveBotToken,
        getBots,
        saveBots,
        addBot,
        updateBot,
        deleteBot,
        getSystemPrompts,
        saveSystemPrompts,
        addSystemPrompt,
        deleteSystemPrompt
    };
};
