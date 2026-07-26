const useApiTest = () => {
    const storage = useStorage();

    const testGemini = async (apiKey) => {
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
            );
            if (response.ok) {
                const data = await response.json();
                return { success: true, models: data.models?.length || 0 };
            }
            return { success: false, error: `HTTP ${response.status}` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const testClaude = async (apiKey) => {
        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-5-haiku-latest',
                    max_tokens: 10,
                    messages: [{ role: 'user', content: 'test' }]
                })
            });
            if (response.ok) {
                return { success: true };
            }
            const errorData = await response.json().catch(() => ({}));
            return { success: false, error: errorData.error?.type || `HTTP ${response.status}` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const testOpenAI = async (apiKey) => {
        try {
            const response = await fetch('https://api.openai.com/v1/models', {
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

    const testDeepSeek = async (apiKey) => {
        try {
            const response = await fetch('https://api.deepseek.com/v1/models', {
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

    const testGrok = async (apiKey) => {
        try {
            const response = await fetch('https://api.x.ai/v1/models', {
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
        const testers = {
            gemini: testGemini,
            claude: testClaude,
            openai: testOpenAI,
            deepseek: testDeepSeek,
            openrouter: testOpenRouter,
            grok: testGrok
        };
        const tester = testers[server];
        if (!tester) {
            return { success: false, error: 'Unknown server' };
        }
        return tester(apiKey);
    };

    const testAllConnections = async () => {
        const config = storage.getApiConfig();
        const results = {};
        for (const server of Object.keys(AI_MODELS)) {
            if (config[server]?.apiKey) {
                results[server] = await testConnection(server, config[server].apiKey);
            } else {
                results[server] = { success: false, error: 'Not configured' };
            }
        }
        return results;
    };

    return {
        testConnection,
        testAllConnections,
        testGemini,
        testClaude,
        testOpenAI,
        testDeepSeek,
        testOpenRouter,
        testGrok
    };
};
