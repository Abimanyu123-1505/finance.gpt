const axios = require('axios');
const { queryPinecone } = require('../services/pinecone');

class NewsAgent {
    constructor() {
        this.newsApiKey = process.env.NEWS_API_KEY;
        this.cache = new Map();
    }

    async fetchNews(ticker) {
        // Check cache first
        if (this.cache.has(ticker)) {
            return this.cache.get(ticker);
        }

        try {
            // In a real implementation, you would use a news API like NewsAPI, Benzinga, etc.
            // This is a mock implementation
            const mockNews = [
                {
                    title: `${ticker} Reports Strong Q2 Earnings`,
                    summary: `${ticker} has reported earnings that beat analyst expectations, with revenue up 12% year-over-year.`,
                    date: new Date().toISOString(),
                    source: 'Financial Times'
                },
                {
                    title: `Analysts Upgrade ${ticker} to Buy Rating`,
                    summary: `Several analysts have upgraded their rating for ${ticker} citing improved fundamentals and growth prospects.`,
                    date: new Date(Date.now() - 86400000).toISOString(),
                    source: 'Bloomberg'
                },
                {
                    title: `${ticker} Announces New Product Line`,
                    summary: `${ticker} has unveiled a new product line that is expected to drive growth in the coming quarters.`,
                    date: new Date(Date.now() - 172800000).toISOString(),
                    source: 'Wall Street Journal'
                }
            ];

            // Enhance with RAG context
            const ragContext = await queryPinecone(ticker);
            const enhancedNews = mockNews.map(item => ({
                ...item,
                context: ragContext.find(c => c.ticker === ticker)?.context || ''
            }));

            // Cache the results
            this.cache.set(ticker, enhancedNews);
            return enhancedNews;
        } catch (error) {
            console.error('Error fetching news:', error);
            throw error;
        }
    }
}

module.exports = { NewsAgent };
