const { fetchMarketData } = require('../services/alpaca');

class SummarizerAgent {
    constructor() {
        // In a real implementation, you would initialize your LLM connection here
    }

    async analyzeMarket(ticker, marketData) {
        // This would normally call an LLM API with the market data
        // Here's a mock implementation
        
        const priceChange = ((marketData.currentPrice - marketData.prevClose) / marketData.prevClose) * 100;
        const rsi = this.calculateRSI(marketData.historicalPrices);
        
        return {
            summary: `${ticker} is currently trading at $${marketData.currentPrice.toFixed(2)}. ` +
                     `The stock has ${priceChange >= 0 ? 'gained' : 'lost'} ${Math.abs(priceChange).toFixed(2)}% ` +
                     `since the previous close. The RSI indicator suggests the stock is ` +
                     `${rsi > 70 ? 'overbought' : rsi < 30 ? 'oversold' : 'in neutral territory'}.`,
            current_price: marketData.currentPrice,
            day_change: priceChange,
            rsi: rsi,
            volume: marketData.volume
        };
    }

    calculateRSI(prices, period = 14) {
        if (prices.length < period + 1) return 50; // Not enough data
        
        let gains = 0;
        let losses = 0;
        
        for (let i = 1; i <= period; i++) {
            const change = prices[i] - prices[i - 1];
            if (change > 0) gains += change;
            else losses -= change;
        }
        
        const avgGain = gains / period;
        const avgLoss = losses / period;
        
        const rs = avgGain / avgLoss;
        return 100 - (100 / (1 + rs));
    }
}

module.exports = { SummarizerAgent };
