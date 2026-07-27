/**
 * Telegram Bot Maker - Backend Server
 * Handles Telegram webhooks and OpenRouter AI API communication
 * Uses Upstash Redis for persistent bot configuration storage
 */

const http = require('http');
const url = require('url');

// Upstash Redis setup (for Vercel/serverless compatibility)
let redis = null;
let useMemoryFallback = true;

async function initRedis() {
    if (redis) return redis;
    
    const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
    const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
    
    if (UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN) {
        try {
            const { Redis } = await import('@upstash/redis');
            redis = new Redis({
                url: UPSTASH_REDIS_REST_URL,
                token: UPSTASH_REDIS_REST_TOKEN,
            });
            useMemoryFallback = false;
            console.log('✅ Upstash Redis connected');
            return redis;
        } catch (e) {
            console.log('⚠️ Redis connection failed, using memory fallback');
        }
    } else {
        console.log('ℹ️ UPSTASH_REDIS_REST_URL not set, using memory fallback');
    }
    
    useMemoryFallback = true;
    return null;
}

// In-memory fallback storage
const memoryStore = {
    configs: new Map(),
    async get(token) {
        return this.configs.get(token) || null;
    },
    async set(token, data) {
        this.configs.set(token, data);
        return true;
    },
    async del(token) {
        this.configs.delete(token);
        return true;
    },
    async keys() {
        return Array.from(this.configs.keys());
    }
};

// Unified storage interface
const storage = {
    async getBotConfig(botToken) {
        if (useMemoryFallback) {
            return memoryStore.get(botToken);
        }
        const data = await redis.get(`bot:${botToken}`);
        return data ? JSON.parse(data) : null;
    },
    
    async setBotConfig(botToken, config) {
        if (useMemoryFallback) {
            return memoryStore.set(botToken, config);
        }
        await redis.set(`bot:${botToken}`, JSON.stringify(config));
        return true;
    },
    
    async deleteBotConfig(botToken) {
        if (useMemoryFallback) {
            return memoryStore.del(botToken);
        }
        await redis.del(`bot:${botToken}`);
        return true;
    },
    
    async getAllBots() {
        if (useMemoryFallback) {
            const bots = [];
            for (const [token, config] of memoryStore.configs) {
                bots.push({ token, ...config });
            }
            return bots;
        }
        const tokens = await redis.smembers('bot_tokens');
        const bots = [];
        for (const token of tokens) {
            const config = await redis.get(`bot:${token}`);
            if (config) {
                bots.push({ token, ...JSON.parse(config) });
            }
        }
        return bots;
    },
    
    async addBotToken(token) {
        if (!useMemoryFallback) {
            await redis.sadd('bot_tokens', token);
        }
    }
};

// Detect API type based on key prefix
function getApiEndpoint(apiKey) {
    if (apiKey.startsWith('sk-or-v1-')) {
        return { endpoint: 'https://openrouter.ai/api/v1/chat/completions', provider: 'openrouter' };
    }
    return { endpoint: 'https://api.openai.com/v1/chat/completions', provider: 'openai' };
}

// AI handler
async function callAI(apiKey, model, messages) {
    const { endpoint, provider } = getApiEndpoint(apiKey);
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };
    
    if (provider === 'openrouter') {
        headers['HTTP-Referer'] = 'https://github.com/amkyawdev/telegram-bot-maker';
        headers['X-Title'] = 'Telegram Bot Maker';
    }
    
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            model,
            messages,
            temperature: 0.9,
            max_tokens: 2048
        })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || `${provider} API error`);
    return data.choices?.[0]?.message?.content || 'No response';
}

// Process user message and get AI response
async function processMessage(botToken, userId, message) {
    const config = await storage.getBotConfig(botToken);
    if (!config) {
        console.log(`Bot config not found for token: ${botToken.substring(0, 10)}...`);
        return { error: 'Bot not configured. Please register your bot at the web app.' };
    }

    const { server, model, apiKey, systemPrompt, name } = config;
    console.log(`Processing message for bot: ${name} (${server}/${model})`);

    try {
        // Replace template variables
        let prompt = systemPrompt || 'You are a helpful AI assistant.';
        prompt = prompt.replace(/\{\{user_name\}\}/g, `User ${userId}`);
        prompt = prompt.replace(/\{\{user_id\}\}/g, String(userId));
        prompt = prompt.replace(/\{\{bot_name\}\}/g, name || 'Bot');
        prompt = prompt.replace(/\{\{date\}\}/g, new Date().toLocaleDateString());

        const messages = [
            { role: 'system', content: prompt },
            { role: 'user', content: message }
        ];
        
        console.log(`Calling AI for user ${userId}...`);
        const response = await callAI(apiKey, model, messages);
        console.log(`AI response received for user ${userId}`);
        return { success: true, response };
    } catch (error) {
        console.error(`AI error for user ${userId}:`, error.message);
        return { error: error.message };
    }
}

// Send message to Telegram user
async function sendTelegramMessage(botToken, chatId, text, replyToMessageId = null) {
    const payload = {
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
    };
    
    if (replyToMessageId) {
        payload.reply_to_message_id = replyToMessageId;
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    
    return response.json();
}

// Set webhook for Telegram bot
async function setWebhook(botToken, webhookUrl) {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: webhookUrl })
    });
    return response.json();
}

// Get bot info from Telegram
async function getBotInfo(botToken) {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    return response.json();
}

// Parse Telegram update
function parseUpdate(body) {
    try {
        const update = JSON.parse(body);
        
        if (update.message && update.message.text) {
            return {
                type: 'message',
                updateId: update.update_id,
                chatId: update.message.chat.id,
                messageId: update.message.message_id,
                text: update.message.text,
                from: {
                    id: update.message.from.id,
                    firstName: update.message.from.first_name,
                    username: update.message.from.username
                }
            };
        }
        
        return null;
    } catch {
        return null;
    }
}

// Handle bot command
async function handleBotCommand(botToken, chatId, text, from) {
    if (text === '/start') {
        await sendTelegramMessage(
            botToken,
            chatId,
            `👋 Welcome! I'm your AI-powered bot.\n\n` +
            `Send me any message and I'll respond using AI!\n\n` +
            `Created with ❤️ by Telegram Bot Maker`
        );
        return true;
    } else if (text === '/help') {
        await sendTelegramMessage(
            botToken,
            chatId,
            `🤖 <b>Available Commands:</b>\n\n` +
            `/start - Start conversation\n` +
            `/help - Show this help\n` +
            `/reset - Reset conversation`
        );
        return true;
    } else if (text === '/reset') {
        await sendTelegramMessage(
            botToken,
            chatId,
            `🔄 Conversation reset! How can I help you?`
        );
        return true;
    }
    return false;
}

// Main request handler
async function handleRequest(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    try {
        // Initialize Redis (async, don't wait)
        initRedis().catch(() => {});

        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;
        const query = parsedUrl.query;

        // Health check endpoint
        if (pathname === '/health') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                status: 'ok', 
                storage: useMemoryFallback ? 'memory' : 'redis',
                timestamp: new Date().toISOString()
            }));
            return;
        }

        // List all registered bots
        if (pathname === '/api/bots' && req.method === 'GET') {
            const bots = await storage.getAllBots();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(bots));
            return;
        }

        // Register new bot
        if (pathname === '/api/bots/register' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
                try {
                    const data = JSON.parse(body);
                    const { name, server, model, apiKey, botToken, systemPrompt, webhookUrl } = data;
                    
                    // Validate bot token
                    const botInfo = await getBotInfo(botToken);
                    if (!botInfo.ok) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Invalid bot token' }));
                        return;
                    }

                    // Test AI API connection
                    try {
                        await callAI(apiKey, model, [
                            { role: 'system', content: 'You are a test bot.' },
                            { role: 'user', content: 'Say OK' }
                        ]);
                    } catch (apiError) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: `AI API error: ${apiError.message}` }));
                        return;
                    }

                    // Store bot configuration
                    await storage.setBotConfig(botToken, {
                        name: name || botInfo.result.first_name,
                        username: botInfo.result.username,
                        server,
                        model,
                        apiKey,
                        systemPrompt,
                        webhookUrl,
                        createdAt: new Date().toISOString()
                    });
                    
                    await storage.addBotToken(botToken);

                    // Set webhook
                    if (webhookUrl) {
                        await setWebhook(botToken, webhookUrl);
                    }

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        bot: {
                            id: botToken.substring(0, 10),
                            name: botInfo.result.first_name,
                            username: botInfo.result.username,
                            server,
                            model
                        },
                        message: 'Bot registered successfully'
                    }));
                } catch (error) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: error.message }));
                }
            });
            return;
        }

        // Delete bot
        if (pathname.match(/^\/api\/bots\/delete$/) && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
                try {
                    const { botToken } = JSON.parse(body);
                    await storage.deleteBotConfig(botToken);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } catch (error) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: error.message }));
                }
            });
            return;
        }

        // Test AI connection
        if (pathname === '/api/test' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
                try {
                    const { apiKey, model } = JSON.parse(body);
                    const response = await callAI(apiKey, model, [
                        { role: 'user', content: 'Say "OK" if you can hear me.' }
                    ]);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, response }));
                } catch (error) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: error.message }));
                }
            });
            return;
        }

        // Telegram webhook endpoint (format: /webhook/{botToken})
        const webhookMatch = pathname.match(/^\/webhook\/(.+)$/);
        if (webhookMatch && req.method === 'POST') {
            const botToken = webhookMatch[1];
            let body = '';
            
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
                try {
                    const update = parseUpdate(body);
                    if (!update) {
                        res.writeHead(200);
                        res.end('OK');
                        return;
                    }

                    // Handle commands
                    if (update.text.startsWith('/')) {
                        await handleBotCommand(botToken, update.chatId, update.text, update.from);
                    } else {
                        // Send typing indicator
                        await fetch(`https://api.telegram.org/bot${botToken}/sendChatAction`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                chat_id: update.chatId,
                                action: 'typing'
                            })
                        });
                        
                        // Process with AI
                        const result = await processMessage(botToken, update.from.id, update.text);
                        
                        if (result.error) {
                            await sendTelegramMessage(
                                botToken,
                                update.chatId,
                                `⚠️ <b>Error:</b>\n${result.error}`
                            );
                        } else {
                            await sendTelegramMessage(
                                botToken,
                                update.chatId,
                                `✨ <b>Response:</b>\n\n${result.response}`,
                                update.messageId
                            );
                        }
                    }

                    res.writeHead(200);
                    res.end('OK');
                } catch (error) {
                    console.error('Webhook error:', error);
                    res.writeHead(200);
                    res.end('OK');
                }
            });
            return;
        }

        // 404 Not Found
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    } catch (error) {
        console.error('Server error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
    }
}

// Create and start server
const PORT = process.env.PORT || 3000;

// Only start server if not in Vercel/serverless environment
if (process.env.VERCEL !== '1') {
    const server = http.createServer(handleRequest);
    server.listen(PORT, () => {
        console.log(`🤖 Telegram Bot Maker API Server running on port ${PORT}`);
        console.log(`📡 Webhook endpoint: /webhook/{botToken}`);
        console.log(`🔧 Health check: /health`);
    });
}

// Export for serverless
module.exports = { handleRequest, storage };
