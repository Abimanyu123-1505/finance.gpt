const axios = require('axios');

class AlpacaService {
    constructor() {
        this.apiKey = process.env.ALPACA_API_KEY;
        this.apiSecret = process.env.ALPACA_API_SECRET;
        this.baseUrl = process.env.ALPACA_BASE_URL || 'https://paper-api.alpaca.markets';
    }

    async fetchMarketData(ticker, timeframe = '1D') {
        // In a real implementation, you would call the Alpaca API
        // This is a mock implementation
        
        // Generate mock historical data
        const basePrice = 100 + (Math.random() * 100);
        const historicalPrices = [];
        for (let i = 0; i < 200; i++) {
            historicalPrices.push(basePrice * (0.9 + (Math.random() * 0.2)));
        }
        
        return {
            ticker,
            currentPrice: historicalPrices[historicalPrices.length - 1],
            prevClose: historicalPrices[historicalPrices.length - 2],
            historicalPrices,
            volume: Math.floor(1000000 + (Math.random() * 5000000))
        };
    }
}

const alpacaService = new AlpacaService();

async function fetchMarketData(ticker, timeframe) {
    return alpacaService.fetchMarketData(ticker, timeframe);
}

module.exports = { fetchMarketData };
