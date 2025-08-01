document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const tickerInput = document.getElementById('ticker-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const newsContainer = document.getElementById('news-container');
    const analysisContainer = document.getElementById('analysis-container');
    const strategyContainer = document.getElementById('strategy-container');
    const priceChartCtx = document.getElementById('price-chart').getContext('2d');
    const strategySelect = document.getElementById('strategy-select');
    const runSimulationBtn = document.getElementById('run-simulation');
    const simulationResults = document.getElementById('simulation-results');
    
    let priceChart = null;
    
    // Initialize with a default ticker
    tickerInput.value = 'AAPL';
    
    // Event Listeners
    analyzeBtn.addEventListener('click', analyzeTicker);
    runSimulationBtn.addEventListener('click', runSimulation);
    
    // Initialize the dashboard
    analyzeTicker();
    
    async function analyzeTicker() {
        const ticker = tickerInput.value.trim().toUpperCase();
        if (!ticker) return;
        
        try {
            // Show loading states
            newsContainer.innerHTML = '<p>Loading news...</p>';
            analysisContainer.innerHTML = '<p>Analyzing market...</p>';
            strategyContainer.innerHTML = '<p>Generating strategies...</p>';
            
            // Fetch all data in parallel
            const [newsData, analysisData, strategyData, priceData] = await Promise.all([
                fetchNews(ticker),
                fetchAnalysis(ticker),
                fetchStrategy(ticker),
                fetchPriceData(ticker)
            ]);
            
            // Update UI with fetched data
            displayNews(newsData);
            displayAnalysis(analysisData);
            displayStrategy(strategyData);
            renderPriceChart(priceData);
            
        } catch (error) {
            console.error('Error analyzing ticker:', error);
            alert('Failed to fetch data. Please try again.');
        }
    }
    
    async function fetchNews(ticker) {
        const response = await fetch(`/api/news?ticker=${ticker}`);
        if (!response.ok) throw new Error('Failed to fetch news');
        return await response.json();
    }
    
    async function fetchAnalysis(ticker) {
        const response = await fetch(`/api/analyze?ticker=${ticker}`);
        if (!response.ok) throw new Error('Failed to fetch analysis');
        return await response.json();
    }
    
    async function fetchStrategy(ticker) {
        const response = await fetch(`/api/strategy?ticker=${ticker}`);
        if (!response.ok) throw new Error('Failed to fetch strategy');
        return await response.json();
    }
    
    async function fetchPriceData(ticker) {
        const response = await fetch(`/api/prices?ticker=${ticker}`);
        if (!response.ok) throw new Error('Failed to fetch price data');
        return await response.json();
    }
    
    function displayNews(newsItems) {
        newsContainer.innerHTML = '';
        
        if (newsItems.length === 0) {
            newsContainer.innerHTML = '<p>No recent news found for this ticker.</p>';
            return;
        }
        
        newsItems.forEach(item => {
            const newsElement = document.createElement('div');
            newsElement.className = 'news-item';
            newsElement.innerHTML = `
                <h4>${item.title}</h4>
                <p>${item.summary}</p>
                <div class="news-meta">
                    <span>${new Date(item.date).toLocaleDateString()}</span>
                    <span> | </span>
                    <span>${item.source}</span>
                </div>
            `;
            newsContainer.appendChild(newsElement);
        });
    }
    
    function displayAnalysis(analysis) {
        analysisContainer.innerHTML = `
            <h4>Market Summary</h4>
            <p>${analysis.summary}</p>
            
            <h4>Key Metrics</h4>
            <div class="metrics">
                <div class="metric">
                    <span class="label">Current Price:</span>
                    <span>$${analysis.current_price.toFixed(2)}</span>
                </div>
                <div class="metric">
                    <span class="label">Day Change:</span>
                    <span class="${analysis.day_change >= 0 ? 'positive' : 'negative'}">
                        ${analysis.day_change >= 0 ? '+' : ''}${analysis.day_change.toFixed(2)}%
                    </span>
                </div>
                <div class="metric">
                    <span class="label">RSI (14-day):</span>
                    <span>${analysis.rsi.toFixed(1)}</span>
                </div>
                <div class="metric">
                    <span class="label">Volume:</span>
                    <span>${(analysis.volume / 1000000).toFixed(1)}M</span>
                </div>
            </div>
        `;
    }
    
    function displayStrategy(strategy) {
        strategyContainer.innerHTML = `
            <h4>Recommended Action</h4>
            <p class="recommendation ${strategy.recommendation.toLowerCase()}">
                ${strategy.recommendation}
            </p>
            <p>${strategy.reason}</p>
            
            <h4>Technical Indicators</h4>
            <ul>
                ${strategy.indicators.map(ind => `<li>${ind}</li>`).join('')}
            </ul>
        `;
    }
    
    function renderPriceChart(priceData) {
        // Destroy previous chart if it exists
        if (priceChart) {
            priceChart.destroy();
        }
        
        const labels = priceData.map(item => new Date(item.date).toLocaleDateString());
        const prices = priceData.map(item => item.close);
        
        priceChart = new Chart(priceChartCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Price',
                    data: prices,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Price ($)'
                        }
                    }
                }
            }
        });
    }
    
    async function runSimulation() {
        const ticker = tickerInput.value.trim().toUpperCase();
        const strategy = strategySelect.value;
        
        if (!ticker) {
            alert('Please enter a ticker symbol');
            return;
        }
        
        try {
            simulationResults.innerHTML = '<p>Running simulation...</p>';
            
            const response = await fetch('/api/simulate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ticker,
                    strategy
                })
            });
            
            if (!response.ok) throw new Error('Simulation failed');
            
            const results = await response.json();
            displaySimulationResults(results);
            
        } catch (error) {
            console.error('Simulation error:', error);
            simulationResults.innerHTML = '<p class="error">Failed to run simulation. Please try again.</p>';
        }
    }
    
    function displaySimulationResults(results) {
        simulationResults.innerHTML = `
            <h3>Simulation Results for ${results.ticker}</h3>
            <p>Strategy: ${results.strategy_name}</p>
            <p>Period: ${results.start_date} to ${results.end_date}</p>
            
            <div class="metrics">
                <div class="metric">
                    <span class="label">Sharpe Ratio:</span>
                    <span>${results.sharpe_ratio.toFixed(2)}</span>
                </div>
                <div class="metric">
                    <span class="label">Max Drawdown:</span>
                    <span>${(results.max_drawdown * 100).toFixed(1)}%</span>
                </div>
                <div class="metric">
                    <span class="label">Win Rate:</span>
                    <span>${(results.win_rate * 100).toFixed(1)}%</span>
                </div>
                <div class="metric">
                    <span class="label">Total Return:</span>
                    <span class="${results.total_return >= 0 ? 'positive' : 'negative'}">
                        ${(results.total_return * 100).toFixed(1)}%
                    </span>
                </div>
            </div>
            
            <h4>Performance Chart</h4>
            <canvas id="simulation-chart"></canvas>
            
            <h4>Key Trades</h4>
            <div class="trades">
                ${results.key_trades.map(trade => `
                    <div class="trade ${trade.type}">
                        <span class="date">${trade.date}</span>
                        <span class="type">${trade.type.toUpperCase()}</span>
                        <span class="price">$${trade.price.toFixed(2)}</span>
                        <span class="return">${trade.return >= 0 ? '+' : ''}${(trade.return * 100).toFixed(1)}%</span>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Render simulation chart
        const simChartCtx = document.getElementById('simulation-chart').getContext('2d');
        new Chart(simChartCtx, {
            type: 'line',
            data: {
                labels: results.performance.map((_, i) => `Day ${i + 1}`),
                datasets: [{
                    label: 'Portfolio Value',
                    data: results.performance,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }
});

// Add some CSS classes dynamically
const style = document.createElement('style');
style.textContent = `
    .positive {
        color: var(--success-color);
    }
    .negative {
        color: var(--danger-color);
    }
    .recommendation {
        font-weight: bold;
        font-size: 1.2rem;
        padding: 0.5rem;
        border-radius: 4px;
    }
    .recommendation.buy {
        background-color: rgba(16, 185, 129, 0.2);
        color: var(--success-color);
    }
    .recommendation.sell {
        background-color: rgba(239, 68, 68, 0.2);
        color: var(--danger-color);
    }
    .recommendation.hold {
        background-color: rgba(156, 163, 175, 0.2);
        color: var(--dark-color);
    }
    .trade {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        border-radius: 4px;
    }
    .trade.buy {
        background-color: rgba(16, 185, 129, 0.1);
    }
    .trade.sell {
        background-color: rgba(239, 68, 68, 0.1);
    }
    .error {
        color: var(--danger-color);
    }
`;
document.head.appendChild(style);
