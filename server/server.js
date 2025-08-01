require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { NewsAgent } = require('./agents/newsAgent');
const { SummarizerAgent } = require('./agents/summarizer');
const { StrategyAgent } = require('./agents/strategy');
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

// API Routes
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
        const { ticker } = req.query;
        const prices = await fetchMarketData(ticker, '1M'); // 1 month of data
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

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
