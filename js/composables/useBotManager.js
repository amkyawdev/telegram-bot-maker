const useBotManager = () => {
    const storage = useStorage();
    const apiTest = useApiTest();

    const createBot = async (botData) => {
        const { name, server, model, systemPrompt, botToken } = botData;

        if (!name || !server || !model) {
            return { success: false, error: 'Missing required fields' };
        }

        if (!botToken) {
            return { success: false, error: 'Bot token is required' };
        }

        const config = storage.getApiConfig();
        const apiKey = config[server]?.apiKey;
        if (!apiKey) {
            return { success: false, error: `${AI_MODELS[server].name} API key not configured` };
        }

        const connectionTest = await apiTest.testConnection(server, apiKey);
        if (!connectionTest.success) {
            return { success: false, error: `${AI_MODELS[server].name} connection failed: ${connectionTest.error}` };
        }

        const bot = {
            name,
            server,
            model,
            systemPrompt: systemPrompt || '',
            botToken,
            status: 'active',
            createdAt: new Date().toISOString()
        };

        const savedBot = storage.addBot(bot);
        if (savedBot) {
            return { success: true, bot: savedBot };
        }
        return { success: false, error: 'Failed to save bot' };
    };

    const editBot = (botId) => {
        const bots = storage.getBots();
        return bots.find(b => b.id === botId) || null;
    };

    const updateBot = async (botId, updates) => {
        const bots = storage.getBots();
        const existingBot = bots.find(b => b.id === botId);
        if (!existingBot) {
            return { success: false, error: 'Bot not found' };
        }

        if (updates.server || updates.model || updates.botToken) {
            const server = updates.server || existingBot.server;
            const token = updates.botToken || existingBot.botToken;
            const config = storage.getApiConfig();
            const apiKey = config[server]?.apiKey;

            if (!apiKey) {
                return { success: false, error: `${AI_MODELS[server].name} API key not configured` };
            }

            if (token !== existingBot.botToken) {
                const telegramTest = await testTelegramToken(token);
                if (!telegramTest.success) {
                    return { success: false, error: 'Invalid Telegram bot token' };
                }
            }
        }

        const success = storage.updateBot(botId, updates);
        return success ? { success: true } : { success: false, error: 'Failed to update bot' };
    };

    const removeBot = (botId) => {
        const success = storage.deleteBot(botId);
        return success ? { success: true } : { success: false, error: 'Failed to delete bot' };
    };

    const listBots = () => {
        return storage.getBots();
    };

    const getBot = (botId) => {
        const bots = storage.getBots();
        return bots.find(b => b.id === botId) || null;
    };

    const testTelegramToken = async (token) => {
        try {
            const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);
            const data = await response.json();
            if (data.ok) {
                return { success: true, bot: data.result };
            }
            return { success: false, error: data.description || 'Invalid token' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const validateBotConfig = async (botData) => {
        const errors = [];

        if (!botData.name?.trim()) {
            errors.push('Bot name is required');
        }
        if (!botData.server) {
            errors.push('AI server is required');
        }
        if (!botData.model) {
            errors.push('AI model is required');
        }
        if (!botData.botToken?.trim()) {
            errors.push('Telegram bot token is required');
        } else {
            const telegramTest = await testTelegramToken(botData.botToken);
            if (!telegramTest.success) {
                errors.push(`Telegram token invalid: ${telegramTest.error}`);
            }
        }

        if (botData.server) {
            const config = storage.getApiConfig();
            const apiKey = config[botData.server]?.apiKey;
            if (!apiKey) {
                errors.push(`${AI_MODELS[botData.server].name} API key not configured`);
            } else {
                const apiTestResult = await apiTest.testConnection(botData.server, apiKey);
                if (!apiTestResult.success) {
                    errors.push(`${AI_MODELS[botData.server].name} API test failed`);
                }
            }
        }

        return { valid: errors.length === 0, errors };
    };

    return {
        createBot,
        editBot,
        updateBot,
        removeBot,
        listBots,
        getBot,
        testTelegramToken,
        validateBotConfig
    };
};
