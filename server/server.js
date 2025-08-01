require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { NewsAgent } = require('./agents/newsAgent');
const { SummarizerAgent } = require('./agents/summarizer');
const { StrategyAgent } = require('./agents/strategy');
const { StockSuggestionsAgent } = require('./agents/stockSuggestions');
const { fetchMarketData } = require('./services/alpaca');
const { queryPinecone } = require('./services/pinecone');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize agents
const newsAgent = new NewsAgent();
const summarizerAgent = new SummarizerAgent();
const strategyAgent = new StrategyAgent();
const stockSuggestionsAgent = new StockSuggestionsAgent();

// Existing API Routes
app.get('/api/news', async (req, res) => {
    try {
        const { ticker } = req.query;
        const news = await newsAgent.fetchNews(ticker);
        res.json(news);
    } catch (error) {
        console.error('News error:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

app.get('/api/analyze', async (req, res) => {
    try {
        const { ticker } = req.query;
        const marketData = await fetchMarketData(ticker);
        const analysis = await summarizerAgent.analyzeMarket(ticker, marketData);
        res.json(analysis);
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze market' });
    }
});

app.get('/api/strategy', async (req, res) => {
    try {
        const { ticker } = req.query;
        const marketData = await fetchMarketData(ticker);
        const context = await queryPinecone(ticker);
        const strategy = await strategyAgent.generateStrategy(ticker, marketData, context);
        res.json(strategy);
    } catch (error) {
        console.error('Strategy error:', error);
        res.status(500).json({ error: 'Failed to generate strategy' });
    }
});

app.get('/api/prices', async (req, res) => {
    try {
        const { ticker, period = '1M' } = req.query;
        const prices = await fetchMarketData(ticker, period);
        res.json(prices);
    } catch (error) {
        console.error('Price error:', error);
        res.status(500).json({ error: 'Failed to fetch price data' });
    }
});

app.post('/api/simulate', async (req, res) => {
    try {
        const { ticker, strategy } = req.body;
        const simulationResults = await strategyAgent.runSimulation(ticker, strategy);
        res.json(simulationResults);
    } catch (error) {
        console.error('Simulation error:', error);
        res.status(500).json({ error: 'Failed to run simulation' });
    }
});

// New Enhanced API Routes

// Stock Fundamentals
app.get('/api/fundamentals', async (req, res) => {
    try {
        const { ticker } = req.query;
        const fundamentals = await stockSuggestionsAgent.getFundamentals(ticker);
        res.json(fundamentals);
    } catch (error) {
        console.error('Fundamentals error:', error);
        res.status(500).json({ error: 'Failed to fetch fundamentals' });
    }
});

// Stock Suggestions and Recommendations
app.get('/api/suggestions', async (req, res) => {
    try {
        const { risk = 'moderate', term = 'medium' } = req.query;
        const suggestions = await stockSuggestionsAgent.generateSuggestions(risk, term);
        res.json(suggestions);
    } catch (error) {
        console.error('Suggestions error:', error);
        res.status(500).json({ error: 'Failed to generate suggestions' });
    }
});

// Stock Screener
app.get('/api/screener', async (req, res) => {
    try {
        const { marketCap, sector, peRatio } = req.query;
        const filters = { marketCap, sector, peRatio };
        const results = await stockSuggestionsAgent.screenStocks(filters);
        res.json(results);
    } catch (error) {
        console.error('Screener error:', error);
        res.status(500).json({ error: 'Failed to run stock screen' });
    }
});

// Market Overview Data
app.get('/api/market-overview', async (req, res) => {
    try {
        const overview = await stockSuggestionsAgent.getMarketOverview();
        res.json(overview);
    } catch (error) {
        console.error('Market overview error:', error);
        res.status(500).json({ error: 'Failed to fetch market overview' });
    }
});

// Market Movers (Top Gainers/Losers)
app.get('/api/market-movers', async (req, res) => {
    try {
        const { type = 'gainers' } = req.query; // 'gainers' or 'losers'
        const movers = await stockSuggestionsAgent.getMarketMovers(type);
        res.json(movers);
    } catch (error) {
        console.error('Market movers error:', error);
        res.status(500).json({ error: 'Failed to fetch market movers' });
    }
});

// Current Stock Price
app.get('/api/current-price', async (req, res) => {
    try {
        const { ticker } = req.query;
        const priceData = await stockSuggestionsAgent.getCurrentPrice(ticker);
        res.json(priceData);
    } catch (error) {
        console.error('Current price error:', error);
        res.status(500).json({ error: 'Failed to fetch current price' });
    }
});

// Sector Analysis
app.get('/api/sector-analysis', async (req, res) => {
    try {
        const sectorData = await stockSuggestionsAgent.getSectorAnalysis();
        res.json(sectorData);
    } catch (error) {
        console.error('Sector analysis error:', error);
        res.status(500).json({ error: 'Failed to fetch sector analysis' });
    }
});

// AI Market Insights
app.get('/api/ai-insights', async (req, res) => {
    try {
        const insights = await stockSuggestionsAgent.getAIInsights();
        res.json(insights);
    } catch (error) {
        console.error('AI insights error:', error);
        res.status(500).json({ error: 'Failed to fetch AI insights' });
    }
});

// Portfolio Analysis
app.post('/api/portfolio-analysis', async (req, res) => {
    try {
        const { holdings } = req.body;
        const analysis = await stockSuggestionsAgent.analyzePortfolio(holdings);
        res.json(analysis);
    } catch (error) {
        console.error('Portfolio analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze portfolio' });
    }
});

// Risk Assessment
app.post('/api/risk-assessment', async (req, res) => {
    try {
        const { holdings, riskTolerance } = req.body;
        const riskData = await stockSuggestionsAgent.assessRisk(holdings, riskTolerance);
        res.json(riskData);
    } catch (error) {
        console.error('Risk assessment error:', error);
        res.status(500).json({ error: 'Failed to assess risk' });
    }
});

// Stock Comparison
app.get('/api/compare-stocks', async (req, res) => {
    try {
        const { tickers } = req.query; // comma-separated list of tickers
        const comparison = await stockSuggestionsAgent.compareStocks(tickers.split(','));
        res.json(comparison);
    } catch (error) {
        console.error('Stock comparison error:', error);
        res.status(500).json({ error: 'Failed to compare stocks' });
    }
});

// Market Sentiment
app.get('/api/market-sentiment', async (req, res) => {
    try {
        const sentiment = await stockSuggestionsAgent.getMarketSentiment();
        res.json(sentiment);
    } catch (error) {
        console.error('Market sentiment error:', error);
        res.status(500).json({ error: 'Failed to fetch market sentiment' });
    }
});

// Economic Indicators
app.get('/api/economic-indicators', async (req, res) => {
    try {
        const indicators = await stockSuggestionsAgent.getEconomicIndicators();
        res.json(indicators);
    } catch (error) {
        console.error('Economic indicators error:', error);
        res.status(500).json({ error: 'Failed to fetch economic indicators' });
    }
});

// Educational Content
app.get('/api/educational-content', async (req, res) => {
    try {
        const { category = 'all' } = req.query;
        const content = await stockSuggestionsAgent.getEducationalContent(category);
        res.json(content);
    } catch (error) {
        console.error('Educational content error:', error);
        res.status(500).json({ error: 'Failed to fetch educational content' });
    }
});

// Watchlist Management
app.post('/api/watchlist', async (req, res) => {
    try {
        const { symbols, userId = 'default' } = req.body;
        const result = await stockSuggestionsAgent.updateWatchlist(userId, symbols);
        res.json(result);
    } catch (error) {
        console.error('Watchlist error:', error);
        res.status(500).json({ error: 'Failed to update watchlist' });
    }
});

app.get('/api/watchlist', async (req, res) => {
    try {
        const { userId = 'default' } = req.query;
        const watchlist = await stockSuggestionsAgent.getWatchlist(userId);
        res.json(watchlist);
    } catch (error) {
        console.error('Watchlist fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch watchlist' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        version: '2.0.0'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 InvestSmart AI Server running on http://localhost:${PORT}`);
    console.log(`📊 Enhanced with AI-powered stock suggestions and portfolio management`);
    console.log(`🔍 New features: Stock screener, market insights, risk analysis`);
});
