const useApiTest = () => {
    const storage = useStorage();

    const testOpenRouter = async (apiKey) => {
        try {
            const response = await fetch('https://openrouter.ai/api/v1/models', {
                headers: { 'Authorization': `Bearer ${apiKey}` }
            });
            if (response.ok) {
                const data = await response.json();
                return { success: true, models: data.data?.length || 0 };
            }
            return { success: false, error: `HTTP ${response.status}` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const testConnection = async (server, apiKey) => {
        if (server === 'openrouter') {
            return testOpenRouter(apiKey);
        }
        return { success: false, error: 'Unknown server' };
    };

    const testAllConnections = async () => {
        const config = storage.getApiConfig();
        const results = {};
        if (config.openrouter?.apiKey) {
            results.openrouter = await testConnection('openrouter', config.openrouter.apiKey);
        } else {
            results.openrouter = { success: false, error: 'Not configured' };
        }
        return results;
    };

    return {
        testConnection,
        testAllConnections,
        testOpenRouter
    };
};
