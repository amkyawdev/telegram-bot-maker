# Telegram Bot Maker - AI Powered

Create intelligent Telegram bots powered by OpenRouter AI with an easy-to-use web interface.

![Telegram Bot Maker](https://img.shields.io/badge/Version-2.0.0-blue)
![Vue.js](https://img.shields.io/badge/Vue.js-3.x-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Features

- **OpenRouter AI**: Access 20+ AI models through a single API
  - Claude 3.5 Sonnet (FREE)
  - Gemini 2.0 Flash (FREE)
  - GPT-4o Mini (FREE)
  - Many more free and paid models

- **Easy Configuration**: Simple API key management
- **Custom System Prompts**: Built-in templates and custom prompt editor
- **Bot Management**: Create, edit, and delete multiple bots
- **Connection Testing**: Verify API keys and connections
- **Dark Theme**: Modern gray & black UI design
- **Local Storage**: Data persisted locally in your browser

## 🚀 Quick Start

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Telegram Bot Token (from [@BotFather](https://t.me/BotFather))
- OpenRouter API Key

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Configure your OpenRouter API key in the "API Config" section
4. Create your first AI-powered bot!

### OpenRouter Setup

1. Visit [OpenRouter](https://openrouter.ai/keys)
2. Create a free account
3. Generate an API key
4. Copy the key to the OpenRouter API Key field

Many popular models are available for FREE on OpenRouter!

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
│   │   ├── MainPage.js     # Home page
│   │   ├── ApiConfig.js    # OpenRouter API configuration page
│   │   ├── SystemPrompt.js # Prompt templates & editor
│   │   ├── BotList.js      # Bot management page
│   │   └── About.js        # About & documentation page
│   ├── composables/
│   │   ├── useStorage.js   # LocalStorage operations
│   │   ├── useApiTest.js   # OpenRouter API connection testing
│   │   └── useBotManager.js # Bot CRUD operations
│   └── data/
│       └── models.js        # OpenRouter models configuration
├── assets/
│   └── icons/              # SVG icons
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
- **API Integration**: OpenRouter REST API

## 📝 Usage Tips

### API Key Security
- Never share your API keys publicly
- Keys are stored locally in your browser
- Consider using environment variables for production deployments

### Free Models on OpenRouter
- Claude 3.5 Sonnet (Best overall)
- Gemini 2.0 Flash (Fast & capable)
- GPT-4o Mini (OpenAI's best small model)
- Many more available

### Cost Management
- Start with FREE models to test
- Monitor usage at openrouter.ai
- Set budget limits on OpenRouter

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
