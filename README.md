# Finance GPT Agent

An AI-powered Financial Research & Strategy Platform that provides real-time market analysis, news aggregation, and trading strategy recommendations.

## Features

- 📰 **Financial News Aggregation**: Real-time news with sentiment analysis
- 📊 **Market Analysis**: Technical indicators and market insights
- 🎯 **Strategy Recommendations**: AI-powered trading strategies
- 📈 **Price Charts**: Interactive price visualization
- 🤖 **Strategy Simulation**: Backtesting and performance analysis
- 🔍 **RAG Integration**: Context-aware analysis using vector search

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd finance-gpt-agent
```

2. Install dependencies:
```bash
npm install
```

3. Start the application:
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Development

For development with auto-reload:
```bash
npm run dev
```

### Deployment

Use the deployment script for production:
```bash
npm run deploy
```

## API Endpoints

- `GET /api/news?ticker=AAPL` - Get financial news for a ticker
- `GET /api/analyze?ticker=AAPL` - Get market analysis
- `GET /api/strategy?ticker=AAPL` - Get trading strategy recommendations
- `GET /api/prices?ticker=AAPL` - Get price data
- `POST /api/simulate` - Run strategy simulation

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=production
NEWS_API_KEY=your_news_api_key
ALPACA_API_KEY=your_alpaca_api_key
ALPACA_API_SECRET=your_alpaca_secret
ALPACA_BASE_URL=https://paper-api.alpaca.markets
```

## Architecture

- **Frontend**: Vanilla JavaScript with Chart.js for visualizations
- **Backend**: Node.js with Express.js
- **Agents**: Modular AI agents for different tasks
- **Services**: External API integrations (Alpaca, Pinecone)

## Project Structure

```
├── client/                 # Frontend files
│   ├── index.html         # Main HTML file
│   ├── style.css          # Styles
│   └── app.js             # Frontend JavaScript
├── server/                # Backend files
│   ├── server.js          # Express server
│   ├── agents/            # AI agents
│   │   ├── newsAgent.js   # News aggregation
│   │   ├── summarizer.js  # Market analysis
│   │   └── strategy.js    # Strategy generation
│   └── services/          # External services
│       ├── alpaca.js      # Market data
│       └── pinecone.js    # Vector search
├── package.json           # Dependencies and scripts
├── deploy.sh             # Deployment script
└── README.md             # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.