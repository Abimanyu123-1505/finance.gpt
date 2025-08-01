// This would normally interact with Pinecone's vector database
// Here's a mock implementation

const mockData = [
    {
        ticker: 'AAPL',
        context: 'Apple Inc. recently announced new products and services that are expected to drive growth. Analysts are generally positive about the company\'s outlook.',
        sentiment: 'positive'
    },
    {
        ticker: 'MSFT',
        context: 'Microsoft continues to see strong growth in its cloud computing division. The company recently signed several large enterprise contracts.',
        sentiment: 'positive'
    },
    {
        ticker: 'TSLA',
        context: 'Tesla faces increased competition in the EV market. Recent delivery numbers were slightly below expectations.',
        sentiment: 'neutral'
    }
];

async function queryPinecone(ticker) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(mockData.filter(item => item.ticker === ticker));
        }, 300);
    });
}

module.exports = { queryPinecone };
