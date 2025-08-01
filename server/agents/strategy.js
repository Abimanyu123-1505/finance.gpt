const { fetchMarketData } = require('../services/alpaca');

class StrategyAgent {
    constructor() {
        // In a real implementation, you would initialize your RL models here
    }

    async generateStrategy(ticker, marketData, context) {
        // Analyze technical indicators
        const rsi = this.calculateRSI(marketData.historicalPrices);
        const sma50 = this.calculateSMA(marketData.historicalPrices, 50);
        const sma200 = this.calculateSMA(marketData.historicalPrices, 200);
        
        // Generate recommendation
        let recommendation, reason;
        
        if (rsi < 30 && marketData.currentPrice > sma200) {
            recommendation = 'BUY';
            reason = `Oversold conditions (RSI: ${rsi.toFixed(1)}) with price above 200-day SMA suggests a buying opportunity.`;
        } else if (rsi > 70 || marketData.currentPrice < sma200) {
            recommendation = 'SELL';
            reason = `Overbought conditions (RSI: ${rsi.toFixed(1)}) or price below 200-day SMA suggests caution.`;
        } else {
            recommendation = 'HOLD';
            reason = `Neutral technical indicators suggest maintaining current position.`;
        }
        
        // Add context from RAG
        if (context && context.length > 0) {
            reason += ` News sentiment is ${context[0].sentiment}.`;
        }
        
        return {
            recommendation,
            reason,
            indicators: [
                `RSI (14): ${rsi.toFixed(1)}`,
                `50-day SMA: $${sma50.toFixed(2)}`,
                `200-day SMA: $${sma200.toFixed(2)}`,
                `Current Price: $${marketData.currentPrice.toFixed(2)}`
            ]
        };
    }

    async runSimulation(ticker, strategyType) {
        // This would normally run your RL simulation
        // Here's a mock implementation
        
        const strategies = {
            momentum: {
                name: 'Momentum Strategy',
                sharpe_ratio: 1.2,
                max_drawdown: -0.15,
                win_rate: 0.65,
                total_return: 0.32
            },
            mean_reversion: {
                name: 'Mean Reversion Strategy',
                sharpe_ratio: 0.9,
                max_drawdown: -0.22,
                win_rate: 0.58,
                total_return: 0.18
            },
            ml_strategy: {
                name: 'ML-Based Strategy',
                sharpe_ratio: 1.5,
                max_drawdown: -0.12,
                win_rate: 0.7,
                total_return: 0.45
            }
        };
        
        const strategy = strategies[strategyType] || strategies.momentum;
        
        // Generate mock performance data
        const performance = [];
        let value = 10000;
        for (let i = 0; i < 30; i++) {
            const dailyReturn = (Math.random() * 0.02) - 0.005;
            value *= (1 + dailyReturn);
            performance.push(value);
        }
        
        // Generate mock trades
        const key_trades = [];
        for (let i = 0; i < 5; i++) {
            key_trades.push({
                date: new Date(Date.now() - (i * 7 * 86400000)).toISOString().split('T')[0],
                type: Math.random() > 0.5 ? 'buy' : 'sell',
                price: marketData.currentPrice * (0.95 + Math.random() * 0.1),
                return: (Math.random() * 0.1) - 0.02
            });
        }
        
        return {
            ticker,
            strategy_name: strategy.name,
            start_date: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
            end_date: new Date().toISOString().split('T')[0],
            sharpe_ratio: strategy.sharpe_ratio,
            max_drawdown: strategy.max_drawdown,
            win_rate: strategy.win_rate,
            total_return: strategy.total_return,
            performance,
            key_trades
        };
    }

    calculateRSI(prices, period = 14) {
        if (prices.length < period + 1) return 50;
        
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

    calculateSMA(prices, period) {
        if (prices.length < period) return prices.reduce((a, b) => a + b, 0) / prices.length;
        return prices.slice(-period).reduce((a, b) => a + b, 0) / period;
    }
}

module.exports = { StrategyAgent };
