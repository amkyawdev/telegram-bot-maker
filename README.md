# Telegram Bot Maker - AI Powered

Create intelligent Telegram bots powered by cutting-edge AI services with an easy-to-use web interface.

![Telegram Bot Maker](https://img.shields.io/badge/Version-1.0.0-blue)
![Vue.js](https://img.shields.io/badge/Vue.js-3.x-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Features

- **Multiple AI Providers**: Support for 6 major AI services
  - Google Gemini
  - Anthropic Claude
  - OpenAI (GPT-4, GPT-3.5)
  - DeepSeek
  - OpenRouter
  - xAI Grok

- **Easy Configuration**: Simple API key management for all AI providers
- **Custom System Prompts**: Built-in templates and custom prompt editor
- **Bot Management**: Create, edit, and delete multiple bots
- **Connection Testing**: Verify API keys and connections
- **Dark Theme**: Modern gray & black UI design
- **Local Storage**: Data persisted locally in your browser

## 🚀 Quick Start

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Telegram Bot Token (from [@BotFather](https://t.me/BotFather))
- API keys from your preferred AI providers

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Configure your API keys in the "API Config" section
4. Create your first AI-powered bot!

### AI Provider Setup

#### Google Gemini
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Copy the key to the Gemini API Key field

#### Anthropic Claude
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Navigate to API Keys section
3. Create a new API key
4. Copy the key to the Claude API Key field

#### OpenAI
1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new secret key
3. Copy the key to the OpenAI API Key field

#### DeepSeek
1. Visit [DeepSeek Platform](https://platform.deepseek.com/)
2. Create an account and get API key
3. Copy the key to the DeepSeek API Key field

#### OpenRouter
1. Visit [OpenRouter](https://openrouter.ai/keys)
2. Create an account and generate API key
3. Copy the key to the OpenRouter API Key field

#### xAI Grok
1. Visit [xAI](https://x.ai/)
2. Sign up for access
3. Get your API key
4. Copy the key to the Grok API Key field

### Creating a Telegram Bot

1. Open Telegram and chat with [@BotFather](https://t.me/BotFather)
2. Send `/newbot` command
3. Follow the prompts to name your bot
4. Copy the bot token provided
5. Paste the token in the Telegram Bot Token field
6. Select your AI server and model
7. Optionally customize the system prompt
8. Click "Create Bot"

## 📁 Project Structure

```
telegram-bot-maker/
├── index.html              # Main application entry
├── README.md              # Documentation
├── css/
│   └── style.css           # Application styles
├── js/
│   ├── app.js              # Vue app initialization
│   ├── components/
│   │   ├── Loader.js       # Loading screen component
│   │   ├── MainPage.js     # Home page with AI servers
│   │   ├── ApiConfig.js    # API configuration page
│   │   ├── SystemPrompt.js # Prompt templates & editor
│   │   ├── BotList.js      # Bot management page
│   │   └── About.js        # About & documentation page
│   ├── composables/
│   │   ├── useStorage.js   # LocalStorage operations
│   │   ├── useApiTest.js   # API connection testing
│   │   └── useBotManager.js # Bot CRUD operations
│   └── data/
│       └── models.js        # AI models configuration
├── assets/
│   ├── icons/              # SVG icons for AI providers
│   └── images/             # Demo images
└── vendor/                 # Third-party libraries
    ├── vue.js              # Vue.js 3
    ├── bootstrap.js         # Bootstrap JS
    ├── bootstrap.css        # Bootstrap CSS
    └── bootstrap-icons.css  # Bootstrap Icons
```

## 🎨 System Prompt Templates

### Market Bot
AI assistant for market analysis and trading insights. Provides:
- Market trend analysis
- Trading recommendations
- Financial concept explanations
- Risk management guidance

### Training Bot
AI assistant for learning and training purposes. Provides:
- Topic explanations
- Personalized learning paths
- Quizzes and feedback
- Adaptive teaching styles

### Chatbot
General purpose conversational AI assistant. Provides:
- Natural conversations
- Helpful answers
- Context awareness
- Empathetic responses

## 🔧 Technology Stack

- **Frontend**: Vue.js 3 (Composition API)
- **Styling**: Custom CSS + Bootstrap utilities
- **Icons**: Bootstrap Icons
- **Storage**: Browser LocalStorage
- **API Integration**: REST API calls to AI providers

## 📝 Usage Tips

### API Key Security
- Never share your API keys publicly
- Keys are stored locally in your browser
- Consider using environment variables for production deployments

### Rate Limits
- Each AI provider has rate limits
- Check provider documentation for details
- Consider using OpenRouter for unified access

### Cost Management
- Monitor your API usage
- Set budget alerts with providers
- Use appropriate model tiers

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/) - The Progressive JavaScript Framework
- [Bootstrap](https://getbootstrap.com/) - Frontend toolkit
- [Telegram](https://telegram.org/) - Messaging platform
- All AI providers for their excellent APIs

## 📞 Support

For issues or feature requests, please open an issue on the repository.

---

Made with ❤️ for the Telegram community
