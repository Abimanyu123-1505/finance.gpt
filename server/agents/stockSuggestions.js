require('dotenv').config();
const axios = require('axios');

class StockSuggestionsAgent {
    constructor() {
        this.apiKey = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
        this.baseURL = 'https://www.alphavantage.co/query';
        
        // Cache for expensive operations
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        
        // Market sectors and their typical characteristics
        this.sectors = {
            'Technology': { volatility: 'high', growth: 'high', dividend: 'low' },
            'Healthcare': { volatility: 'medium', growth: 'medium', dividend: 'medium' },
            'Finance': { volatility: 'medium', growth: 'medium', dividend: 'high' },
            'Energy': { volatility: 'high', growth: 'low', dividend: 'high' },
            'Consumer Staples': { volatility: 'low', growth: 'low', dividend: 'high' },
            'Utilities': { volatility: 'low', growth: 'low', dividend: 'high' },
            'Real Estate': { volatility: 'medium', growth: 'medium', dividend: 'high' },
            'Materials': { volatility: 'high', growth: 'medium', dividend: 'medium' },
            'Industrials': { volatility: 'medium', growth: 'medium', dividend: 'medium' },
            'Communication': { volatility: 'medium', growth: 'medium', dividend: 'low' }
        };
    }

    // Cache management
    getCached(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        return null;
    }

    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    // Generate personalized stock suggestions
    async generateSuggestions(riskLevel, investmentTerm) {
        try {
            const cacheKey = `suggestions_${riskLevel}_${investmentTerm}`;
            const cached = this.getCached(cacheKey);
            if (cached) return cached;

            // Analyze market conditions
            const marketConditions = await this.getMarketConditions();
            
            // Generate strategy based on risk and term
            const strategy = this.generateStrategy(riskLevel, investmentTerm, marketConditions);
            
            // Get sector analysis
            const sectorAnalysis = await this.getSectorAnalysis();
            
            // Generate stock picks
            const stockPicks = await this.generateStockPicks(riskLevel, investmentTerm);
            
            // Calculate risk assessment
            const riskAssessment = this.calculateRiskAssessment(riskLevel, stockPicks);

            const suggestions = {
                strategy: strategy.name,
                allocation: strategy.allocation,
                sectors: sectorAnalysis,
                picks: stockPicks,
                risk: riskAssessment,
                marketContext: marketConditions,
                lastUpdated: new Date().toISOString()
            };

            this.setCache(cacheKey, suggestions);
            return suggestions;

        } catch (error) {
            console.error('Error generating suggestions:', error);
            return this.getFallbackSuggestions(riskLevel, investmentTerm);
        }
    }

    // Generate investment strategy based on risk and time horizon
    generateStrategy(riskLevel, investmentTerm, marketConditions) {
        const strategies = {
            conservative: {
                short: {
                    name: 'Conservative Income',
                    allocation: { stocks: '40%', bonds: '50%', cash: '10%' },
                    focus: 'Capital preservation with steady income'
                },
                medium: {
                    name: 'Balanced Conservative',
                    allocation: { stocks: '50%', bonds: '40%', cash: '10%' },
                    focus: 'Moderate growth with income generation'
                },
                long: {
                    name: 'Conservative Growth',
                    allocation: { stocks: '60%', bonds: '35%', cash: '5%' },
                    focus: 'Long-term stability with modest growth'
                }
            },
            moderate: {
                short: {
                    name: 'Balanced Portfolio',
                    allocation: { stocks: '60%', bonds: '30%', cash: '10%' },
                    focus: 'Balanced approach to growth and stability'
                },
                medium: {
                    name: 'Moderate Growth',
                    allocation: { stocks: '70%', bonds: '25%', cash: '5%' },
                    focus: 'Growth-oriented with risk management'
                },
                long: {
                    name: 'Growth Portfolio',
                    allocation: { stocks: '80%', bonds: '15%', cash: '5%' },
                    focus: 'Long-term wealth building'
                }
            },
            aggressive: {
                short: {
                    name: 'Aggressive Trading',
                    allocation: { stocks: '85%', bonds: '10%', cash: '5%' },
                    focus: 'High-growth potential with volatility'
                },
                medium: {
                    name: 'Growth Focus',
                    allocation: { stocks: '90%', bonds: '5%', cash: '5%' },
                    focus: 'Maximum growth potential'
                },
                long: {
                    name: 'Maximum Growth',
                    allocation: { stocks: '95%', bonds: '0%', cash: '5%' },
                    focus: 'All-in growth strategy'
                }
            }
        };

        return strategies[riskLevel]?.[investmentTerm] || strategies.moderate.medium;
    }

    // Generate AI-powered stock picks
    async generateStockPicks(riskLevel, investmentTerm) {
        try {
            // This would normally use real AI/ML models and live data
            const picks = await this.getAIStockPicks(riskLevel, investmentTerm);
            return picks;
        } catch (error) {
            console.error('Error generating stock picks:', error);
            return this.getFallbackStockPicks(riskLevel);
        }
    }

    // AI stock picking algorithm (simplified)
    async getAIStockPicks(riskLevel, investmentTerm) {
        // Simulated AI analysis based on multiple factors
        const stockDatabase = [
            // Technology
            { symbol: 'AAPL', score: 85, sector: 'Technology', risk: 'medium', growth: 'high' },
            { symbol: 'MSFT', score: 92, sector: 'Technology', risk: 'medium', growth: 'high' },
            { symbol: 'GOOGL', score: 88, sector: 'Technology', risk: 'medium', growth: 'high' },
            { symbol: 'NVDA', score: 78, sector: 'Technology', risk: 'high', growth: 'very high' },
            { symbol: 'TSLA', score: 72, sector: 'Technology', risk: 'very high', growth: 'very high' },
            
            // Healthcare
            { symbol: 'JNJ', score: 89, sector: 'Healthcare', risk: 'low', growth: 'medium' },
            { symbol: 'PFE', score: 82, sector: 'Healthcare', risk: 'low', growth: 'medium' },
            { symbol: 'UNH', score: 91, sector: 'Healthcare', risk: 'medium', growth: 'high' },
            
            // Finance
            { symbol: 'JPM', score: 86, sector: 'Finance', risk: 'medium', growth: 'medium' },
            { symbol: 'BAC', score: 79, sector: 'Finance', risk: 'medium', growth: 'medium' },
            { symbol: 'BRK.B', score: 94, sector: 'Finance', risk: 'low', growth: 'medium' },
            
            // Consumer
            { symbol: 'PG', score: 87, sector: 'Consumer Staples', risk: 'low', growth: 'low' },
            { symbol: 'KO', score: 83, sector: 'Consumer Staples', risk: 'low', growth: 'low' },
            { symbol: 'AMZN', score: 81, sector: 'Consumer Discretionary', risk: 'medium', growth: 'high' }
        ];

        // Filter based on risk tolerance
        const riskMapping = {
            conservative: ['low'],
            moderate: ['low', 'medium'],
            aggressive: ['low', 'medium', 'high', 'very high']
        };

        const suitableStocks = stockDatabase.filter(stock => 
            riskMapping[riskLevel].includes(stock.risk)
        );

        // Sort by AI score and select top picks
        const topPicks = suitableStocks
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map(stock => ({
                symbol: stock.symbol,
                rating: stock.score >= 90 ? 'Strong Buy' : 
                       stock.score >= 80 ? 'Buy' : 'Hold',
                confidence: stock.score,
                target: this.calculateTargetPrice(stock),
                upside: this.calculateUpside(stock),
                reasoning: this.generateReasoning(stock, riskLevel, investmentTerm)
            }));

        return topPicks;
    }

    // Calculate target price (simplified)
    calculateTargetPrice(stock) {
        const basePrice = Math.random() * 200 + 100; // Mock current price
        const growthMultiplier = stock.growth === 'very high' ? 1.15 :
                               stock.growth === 'high' ? 1.10 :
                               stock.growth === 'medium' ? 1.05 : 1.02;
        
        return (basePrice * growthMultiplier).toFixed(2);
    }

    // Calculate upside potential
    calculateUpside(stock) {
        const baseUpside = stock.growth === 'very high' ? 15 :
                          stock.growth === 'high' ? 10 :
                          stock.growth === 'medium' ? 5 : 2;
        
        return (baseUpside + (Math.random() * 5 - 2.5)).toFixed(1);
    }

    // Generate reasoning for stock pick
    generateReasoning(stock, riskLevel, investmentTerm) {
        const reasons = {
            'AAPL': 'Strong ecosystem, loyal customer base, services growth',
            'MSFT': 'Cloud dominance, AI leadership, enterprise strength',
            'GOOGL': 'Search monopoly, AI investments, diverse revenue streams',
            'NVDA': 'AI chip leader, data center growth, gaming strength',
            'TSLA': 'EV market leader, energy storage, autonomous driving',
            'JNJ': 'Diversified healthcare, strong pipeline, dividend aristocrat',
            'PFE': 'Pharmaceutical innovation, COVID learnings, global reach',
            'UNH': 'Healthcare ecosystem, market leadership, growth prospects',
            'JPM': 'Leading bank, diverse services, strong balance sheet',
            'BAC': 'Interest rate beneficiary, cost efficiency, market position',
            'BRK.B': 'Berkshire quality, diversified holdings, Buffett leadership',
            'PG': 'Consumer staples leader, brand portfolio, dividend growth',
            'KO': 'Global brand, dividend consistency, emerging market exposure',
            'AMZN': 'E-commerce dominance, AWS growth, innovation culture'
        };

        return reasons[stock.symbol] || 'Strong fundamentals and growth prospects';
    }

    // Get sector analysis
    async getSectorAnalysis() {
        try {
            const cacheKey = 'sector_analysis';
            const cached = this.getCached(cacheKey);
            if (cached) return cached;

            // Simulate sector analysis
            const sectorData = [
                {
                    name: 'Technology',
                    rating: 'Bullish',
                    analysis: 'AI revolution driving growth. Cloud computing and digital transformation continue to accelerate. Strong earnings growth expected.'
                },
                {
                    name: 'Healthcare',
                    rating: 'Neutral',
                    analysis: 'Mixed signals with biotech innovation offset by pricing pressures. Aging demographics provide long-term tailwinds.'
                },
                {
                    name: 'Finance',
                    rating: 'Bullish',
                    analysis: 'Rising interest rates benefit banks. Strong loan demand and improving credit quality support sector outlook.'
                },
                {
                    name: 'Energy',
                    rating: 'Neutral',
                    analysis: 'Commodity price volatility and transition to renewables create uncertainty. Value opportunities exist in established players.'
                },
                {
                    name: 'Consumer Staples',
                    rating: 'Bearish',
                    analysis: 'Margin pressure from inflation and changing consumer preferences. Defensive characteristics remain attractive in uncertainty.'
                }
            ];

            this.setCache(cacheKey, sectorData);
            return sectorData;

        } catch (error) {
            console.error('Error getting sector analysis:', error);
            return this.getFallbackSectorAnalysis();
        }
    }

    // Get market conditions and sentiment
    async getMarketConditions() {
        try {
            // This would integrate with real market data APIs
            return {
                sentiment: 'Cautiously Optimistic',
                volatility: 'Medium',
                trend: 'Upward',
                fearGreedIndex: 52,
                vix: 18.5,
                economicIndicators: {
                    inflation: 3.2,
                    unemployment: 3.8,
                    gdpGrowth: 2.1,
                    interestRate: 5.25
                }
            };
        } catch (error) {
            console.error('Error getting market conditions:', error);
            return { sentiment: 'Neutral', volatility: 'Medium', trend: 'Sideways' };
        }
    }

    // Stock fundamentals analysis
    async getFundamentals(ticker) {
        try {
            const cacheKey = `fundamentals_${ticker}`;
            const cached = this.getCached(cacheKey);
            if (cached) return cached;

            // Always return mock data for demo purposes
            const fundamentals = this.getMockFundamentals(ticker);
            
            this.setCache(cacheKey, fundamentals);
            return fundamentals;

        } catch (error) {
            console.error('Error fetching fundamentals:', error);
            return this.getMockFundamentals(ticker);
        }
    }

    // Mock fundamental data
    getMockFundamentals(ticker) {
        return {
            peRatio: (Math.random() * 30 + 10).toFixed(1),
            marketCap: `$${(Math.random() * 2000 + 100).toFixed(0)}B`,
            fiftyTwoWeekHigh: `$${(Math.random() * 200 + 150).toFixed(2)}`,
            fiftyTwoWeekLow: `$${(Math.random() * 100 + 50).toFixed(2)}`,
            eps: `$${(Math.random() * 10 + 2).toFixed(2)}`,
            dividendYield: `${(Math.random() * 5).toFixed(2)}%`,
            bookValue: `$${(Math.random() * 50 + 10).toFixed(2)}`,
            debtToEquity: `${(Math.random() * 0.8).toFixed(2)}`,
            roe: `${(Math.random() * 25 + 5).toFixed(1)}%`,
            roa: `${(Math.random() * 15 + 2).toFixed(1)}%`
        };
    }

    // Stock screener
    async screenStocks(filters) {
        try {
            const cacheKey = `screener_${JSON.stringify(filters)}`;
            const cached = this.getCached(cacheKey);
            if (cached) return cached;

            // Simulate stock screening
            const allStocks = [
                { symbol: 'AAPL', name: 'Apple Inc.', price: '192.50', change: '+1.2%', volume: '45.2M', marketCap: '$2.8T', pe: '24.5', sector: 'technology' },
                { symbol: 'MSFT', name: 'Microsoft Corp.', price: '415.80', change: '-0.5%', volume: '28.1M', marketCap: '$3.1T', pe: '28.2', sector: 'technology' },
                { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '142.30', change: '+0.8%', volume: '32.5M', marketCap: '$1.8T', pe: '22.1', sector: 'technology' },
                { symbol: 'JNJ', name: 'Johnson & Johnson', price: '168.45', change: '+0.3%', volume: '15.8M', marketCap: '$445B', pe: '16.2', sector: 'healthcare' },
                { symbol: 'JPM', name: 'JPMorgan Chase', price: '172.85', change: '+1.5%', volume: '22.3M', marketCap: '$505B', pe: '12.8', sector: 'finance' },
                { symbol: 'PG', name: 'Procter & Gamble', price: '155.20', change: '-0.2%', volume: '8.9M', marketCap: '$368B', pe: '25.1', sector: 'consumer' },
                { symbol: 'XOM', name: 'Exxon Mobil', price: '108.75', change: '+2.1%', volume: '18.5M', marketCap: '$459B', pe: '14.5', sector: 'energy' }
            ];

            // Apply filters
            let filteredStocks = allStocks;

            if (filters.sector && filters.sector !== 'all') {
                filteredStocks = filteredStocks.filter(stock => 
                    stock.sector === filters.sector
                );
            }

            if (filters.marketCap && filters.marketCap !== 'all') {
                filteredStocks = filteredStocks.filter(stock => {
                    const cap = parseFloat(stock.marketCap.replace(/[\$TB]/g, ''));
                    switch (filters.marketCap) {
                        case 'large': return cap >= 10;
                        case 'mid': return cap >= 2 && cap < 10;
                        case 'small': return cap < 2;
                        default: return true;
                    }
                });
            }

            if (filters.peRatio) {
                const maxPE = parseFloat(filters.peRatio);
                filteredStocks = filteredStocks.filter(stock => 
                    parseFloat(stock.pe) <= maxPE
                );
            }

            this.setCache(cacheKey, filteredStocks);
            return filteredStocks;

        } catch (error) {
            console.error('Error screening stocks:', error);
            return [];
        }
    }

    // Market overview data
    async getMarketOverview() {
        try {
            const cacheKey = 'market_overview';
            const cached = this.getCached(cacheKey);
            if (cached) return cached;

            const overview = {
                fearGreedIndex: { value: 52, label: 'Neutral' },
                vix: 18.5,
                treasuryYield: 4.2,
                dollarIndex: 103.4,
                commodities: {
                    gold: 2045.50,
                    oil: 78.25,
                    copper: 8.75
                },
                indices: {
                    sp500: { value: 4567.89, change: '+0.5%' },
                    nasdaq: { value: 14256.78, change: '-0.2%' },
                    dow: { value: 34589.12, change: '+0.3%' }
                }
            };

            this.setCache(cacheKey, overview);
            return overview;

        } catch (error) {
            console.error('Error getting market overview:', error);
            return this.getFallbackOverview();
        }
    }

    // Market movers
    async getMarketMovers(type = 'gainers') {
        try {
            const cacheKey = `market_movers_${type}`;
            const cached = this.getCached(cacheKey);
            if (cached) return cached;

            const gainers = [
                { symbol: 'NVDA', price: '$875.20', change: '+5.2%', volume: '52.3M' },
                { symbol: 'AMD', price: '$142.50', change: '+3.8%', volume: '48.1M' },
                { symbol: 'TSLA', price: '$248.90', change: '+2.1%', volume: '85.7M' },
                { symbol: 'META', price: '$385.45', change: '+1.9%', volume: '25.8M' },
                { symbol: 'NFLX', price: '$485.32', change: '+1.7%', volume: '15.4M' }
            ];

            const losers = [
                { symbol: 'NFLX', price: '$445.30', change: '-2.8%', volume: '28.5M' },
                { symbol: 'PYPL', price: '$58.75', change: '-1.9%', volume: '22.3M' },
                { symbol: 'ZOOM', price: '$67.45', change: '-1.5%', volume: '18.7M' },
                { symbol: 'ROKU', price: '$52.18', change: '-1.3%', volume: '12.9M' },
                { symbol: 'SHOP', price: '$65.83', change: '-1.1%', volume: '15.2M' }
            ];

            const result = type === 'gainers' ? gainers : losers;
            this.setCache(cacheKey, result);
            return result;

        } catch (error) {
            console.error('Error getting market movers:', error);
            return [];
        }
    }

    // Current stock price
    async getCurrentPrice(ticker) {
        try {
            // Mock real-time price data
            const basePrice = Math.random() * 200 + 50;
            const change = (Math.random() - 0.5) * 10;
            
            return {
                price: basePrice.toFixed(2),
                change: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
                volume: `${(Math.random() * 50 + 10).toFixed(1)}M`,
                lastUpdated: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error getting current price:', error);
            return { price: '0.00', change: '0.00%', volume: '0M' };
        }
    }

    // AI Market Insights
    async getAIInsights() {
        try {
            const cacheKey = 'ai_insights';
            const cached = this.getCached(cacheKey);
            if (cached) return cached;

            const insights = [
                {
                    type: 'Bullish Signal',
                    confidence: '85%',
                    text: 'Technology sector showing strong momentum with AI stocks leading gains. Institutional buying accelerating.'
                },
                {
                    type: 'Risk Alert',
                    confidence: '70%',
                    text: 'High correlation detected in growth stocks. Consider diversification into value or defensive sectors.'
                },
                {
                    type: 'Opportunity',
                    confidence: '78%',
                    text: 'Healthcare biotech showing oversold conditions. Quality names trading at attractive valuations.'
                }
            ];

            this.setCache(cacheKey, insights);
            return insights;

        } catch (error) {
            console.error('Error getting AI insights:', error);
            return [];
        }
    }

    // Risk assessment
    calculateRiskAssessment(riskLevel, stockPicks) {
        const riskScores = {
            conservative: 3.5,
            moderate: 6.5,
            aggressive: 8.5
        };

        const recommendations = {
            conservative: [
                'Consider adding more defensive stocks (utilities, consumer staples)',
                'Increase bond allocation for stability',
                'Focus on dividend-paying stocks for income'
            ],
            moderate: [
                'Maintain balanced approach across sectors',
                'Consider international diversification',
                'Monitor position sizes and rebalance quarterly'
            ],
            aggressive: [
                'High growth potential comes with volatility',
                'Consider taking profits on winners periodically',
                'Maintain emergency cash reserves'
            ]
        };

        return {
            score: riskScores[riskLevel] || 5.0,
            recommendations: recommendations[riskLevel] || recommendations.moderate
        };
    }

    // Fallback methods for when APIs fail
    getFallbackSuggestions(riskLevel, investmentTerm) {
        return {
            strategy: 'Balanced Growth',
            allocation: { stocks: '70%', bonds: '20%', cash: '10%' },
            sectors: this.getFallbackSectorAnalysis(),
            picks: this.getFallbackStockPicks(riskLevel),
            risk: this.calculateRiskAssessment(riskLevel, []),
            marketContext: { sentiment: 'Neutral', volatility: 'Medium' },
            lastUpdated: new Date().toISOString()
        };
    }

    getFallbackStockPicks(riskLevel) {
        const conservative = [
            { symbol: 'JNJ', rating: 'Buy', confidence: 85, target: '175', upside: '4.0', reasoning: 'Dividend aristocrat with healthcare stability' },
            { symbol: 'PG', rating: 'Hold', confidence: 78, target: '160', upside: '3.1', reasoning: 'Consumer staples leader with consistent growth' }
        ];

        const moderate = [
            { symbol: 'MSFT', rating: 'Strong Buy', confidence: 92, target: '450', upside: '8.3', reasoning: 'Cloud leadership and AI innovation' },
            { symbol: 'AAPL', rating: 'Buy', confidence: 87, target: '210', upside: '9.1', reasoning: 'Strong ecosystem and services growth' }
        ];

        const aggressive = [
            { symbol: 'NVDA', rating: 'Buy', confidence: 88, target: '950', upside: '8.5', reasoning: 'AI chip dominance and data center growth' },
            { symbol: 'TSLA', rating: 'Hold', confidence: 72, target: '280', upside: '12.5', reasoning: 'EV leadership and energy storage potential' }
        ];

        switch (riskLevel) {
            case 'conservative': return conservative;
            case 'aggressive': return aggressive;
            default: return moderate;
        }
    }

    getFallbackSectorAnalysis() {
        return [
            { name: 'Technology', rating: 'Bullish', analysis: 'AI and cloud computing driving growth' },
            { name: 'Healthcare', rating: 'Neutral', analysis: 'Mixed signals across subsectors' },
            { name: 'Finance', rating: 'Bullish', analysis: 'Benefiting from higher interest rates' }
        ];
    }

    getFallbackOverview() {
        return {
            fearGreedIndex: { value: 50, label: 'Neutral' },
            vix: 20.0,
            treasuryYield: 4.5,
            dollarIndex: 105.0
        };
    }

    // Additional placeholder methods for comprehensive functionality
    async analyzePortfolio(holdings) {
        // Portfolio analysis implementation
        return { 
            totalValue: 127450,
            dayChange: 890,
            totalReturn: 15670,
            diversification: 'Well Balanced',
            riskScore: 6.5 
        };
    }

    async assessRisk(holdings, riskTolerance) {
        // Risk assessment implementation
        return {
            overallRisk: 'Medium',
            concentrationRisk: 'Low',
            sectorExposure: 'Balanced',
            recommendations: ['Consider rebalancing', 'Add international exposure']
        };
    }

    async compareStocks(tickers) {
        // Stock comparison implementation
        return tickers.map(ticker => ({
            symbol: ticker,
            score: Math.random() * 100,
            recommendation: 'Buy'
        }));
    }

    async getMarketSentiment() {
        return { sentiment: 'Bullish', confidence: 75 };
    }

    async getEconomicIndicators() {
        return {
            gdp: 2.1,
            inflation: 3.2,
            unemployment: 3.8,
            interestRate: 5.25
        };
    }

    async getEducationalContent(category) {
        return [
            { title: 'Understanding P/E Ratios', content: 'Guide to valuation metrics' },
            { title: 'Portfolio Diversification', content: 'Risk management strategies' }
        ];
    }

    async updateWatchlist(userId, symbols) {
        return { success: true, message: 'Watchlist updated' };
    }

    async getWatchlist(userId) {
        return ['AAPL', 'MSFT', 'GOOGL'];
    }
}

module.exports = { StockSuggestionsAgent };