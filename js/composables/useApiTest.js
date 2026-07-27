const useApiTest = () => {
    const storage = useStorage();

    const testOpenRouter = async (apiKey) => {
        try {
            const response = await fetch('https://openrouter.ai/api/v1/models', {
                headers: { 
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const text = await response.text();
            
            if (!response.ok) {
                try {
                    const errorData = JSON.parse(text);
                    return { success: false, error: errorData.error?.message || `HTTP ${response.status}` };
                } catch {
                    return { success: false, error: `HTTP ${response.status}` };
                }
            }
            
            try {
                const data = JSON.parse(text);
                return { success: true, models: data.data?.length || 0 };
            } catch {
                return { success: false, error: 'Invalid response from server' };
            }
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
