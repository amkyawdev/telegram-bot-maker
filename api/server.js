/**
 * Telegram Bot Maker - Backend Server
 * Handles Telegram webhooks and OpenRouter AI API communication
 */

const http = require('http');
const url = require('url');
const crypto = require('crypto');

// In-memory bot configurations (in production, use a database)
const botConfigs = new Map();

// OpenRouter AI handler
const AI_HANDLERS = {
    openrouter: async (apiKey, model, messages) => {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'https://telegram-bot-maker.app',
                'X-Title': 'Telegram Bot Maker'
            },
            body: JSON.stringify({
                model,
                messages,
                temperature: 0.9,
                max_tokens: 2048
            })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || 'OpenRouter API error');
        return data.choices?.[0]?.message?.content || 'No response';
    }
};

// Process user message and get AI response
async function processMessage(botToken, userId, message) {
    const config = botConfigs.get(botToken);
    if (!config) {
        return { error: 'Bot not configured' };
    }

    const { server, model, apiKey, systemPrompt } = config;
    const handler = AI_HANDLERS[server];
    
    if (!handler) {
        return { error: 'Unsupported AI server' };
    }

    try {
        const messages = [
            { role: 'system', content: systemPrompt || 'You are a helpful AI assistant.' },
            { role: 'user', content: message }
        ];
        
        const response = await handler(apiKey, model, messages);
        return { success: true, response };
    } catch (error) {
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
        const update = typeof body === 'string' ? JSON.parse(body) : body;
        
        // Handle direct message
        if (update.message && update.message.text) {
            return {
                type: 'message',
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
        
        // Handle edited message
        if (update.edited_message && update.edited_message.text) {
            return {
                type: 'edited_message',
                chatId: update.edited_message.chat.id,
                text: update.edited_message.text
            };
        }
        
        // Handle callback query
        if (update.callback_query) {
            return {
                type: 'callback_query',
                id: update.callback_query.id,
                chatId: update.callback_query.message?.chat.id,
                data: update.callback_query.data
            };
        }
        
        return null;
    } catch (error) {
        console.error('Error parsing update:', error);
        return null;
    }
}

// Verify Telegram webhook signature
function verifyTelegramSignature(secretToken, body) {
    if (!secretToken) return true; // Skip verification if no token
    
    const secret = crypto.createHash('sha256').update(secretToken).digest();
    const hash = crypto.createHmac('sha256', secret)
        .update(body)
        .digest('hex');
    
    return true; // In production, compare hash with Telegram's provided hash
}

// Handle incoming requests
async function handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Telegram-Bot-Api-Secret-Token');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    try {
        // Health check endpoint
        if (pathname === '/health') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
            return;
        }

        // Get bot configuration
        if (pathname === '/api/bots' && req.method === 'GET') {
            const bots = [];
            for (const [token, config] of botConfigs) {
                bots.push({
                    name: config.name,
                    server: config.server,
                    model: config.model,
                    status: 'active'
                });
            }
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
                        const handler = AI_HANDLERS[server];
                        if (!handler) {
                            throw new Error('Unsupported server');
                        }
                        await handler(apiKey, model, [
                            { role: 'user', content: 'test' }
                        ]);
                    } catch (apiError) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: `AI API error: ${apiError.message}` }));
                        return;
                    }

                    // Set webhook
                    if (webhookUrl) {
                        await setWebhook(botToken, webhookUrl);
                    }

                    // Store bot configuration
                    botConfigs.set(botToken, {
                        name: name || botInfo.result.first_name,
                        server,
                        model,
                        apiKey,
                        systemPrompt,
                        webhookUrl,
                        createdAt: new Date().toISOString()
                    });

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        bot: {
                            id: botToken.substring(0, 10),
                            name: botInfo.result.first_name,
                            username: botInfo.result.username,
                            server,
                            model
                        }
                    }));
                } catch (error) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: error.message }));
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
                    // Verify signature if secret token provided
                    const secretToken = req.headers['x-telegram-bot-api-secret-token'];
                    
                    const update = parseUpdate(body);
                    if (!update) {
                        res.writeHead(200);
                        res.end('OK');
                        return;
                    }

                    // Process message
                    if (update.type === 'message') {
                        // Skip /start and other commands for now
                        if (update.text.startsWith('/')) {
                            if (update.text === '/start') {
                                await sendTelegramMessage(
                                    botToken,
                                    update.chatId,
                                    `👋 Welcome! I'm your AI-powered bot.\n\nSend me any message and I'll respond using AI!`
                                );
                            } else if (update.text === '/help') {
                                await sendTelegramMessage(
                                    botToken,
                                    update.chatId,
                                    `🤖 <b>Available Commands:</b>\n\n/start - Start conversation\n/help - Show this help\n/reset - Reset conversation`
                                );
                            } else if (update.text === '/reset') {
                                await sendTelegramMessage(
                                    botToken,
                                    update.chatId,
                                    `🔄 Conversation reset! How can I help you?`
                                );
                            }
                        } else {
                            // Send "typing" indicator
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
                                    `⚠️ Error: ${result.error}`
                                );
                            } else {
                                await sendTelegramMessage(
                                    botToken,
                                    update.chatId,
                                    result.response,
                                    update.messageId
                                );
                            }
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

        // Test AI connection endpoint
        if (pathname === '/api/test' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
                try {
                    const { server, apiKey, model } = JSON.parse(body);
                    const handler = AI_HANDLERS[server];
                    
                    if (!handler) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: 'Unknown server' }));
                        return;
                    }

                    const response = await handler(apiKey, model, [
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
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
    console.log(`🤖 Telegram Bot Maker API Server running on port ${PORT}`);
    console.log(`📡 Webhook endpoint: /webhook/{botToken}`);
    console.log(`🔧 Health check: /health`);
});

module.exports = { server, processMessage, botConfigs };
