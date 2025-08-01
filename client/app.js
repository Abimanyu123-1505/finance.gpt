document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    // Navigation and UI management
    initializeNavigation();
    initializeSearch();
    initializeModals();
    
    // Data management
    initializeWatchlist();
    initializePortfolio();
    
    // Dashboard features
    initializeDashboard();
    initializeStockAnalysis();
    initializeStockSuggestions();
    initializeScreener();
    
    // Charts
    initializeCharts();
    
    // Load initial data
    loadDashboardData();
}

// Navigation Management
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');

    // Handle navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.dataset.section;
            
            // Update active nav link
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
            
            // Show target section
            contentSections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetSection).classList.add('active');
            
            // Load section specific data
            loadSectionData(targetSection);
        });
    });

    // Sidebar toggle for mobile
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }
}

// Search functionality
function initializeSearch() {
    const globalSearch = document.getElementById('global-search');
    const searchBtn = document.querySelector('.search-btn');

    function performSearch() {
        const query = globalSearch.value.trim().toUpperCase();
        if (query) {
            // Switch to analysis section and search for the symbol
            switchToSection('analysis');
            document.getElementById('ticker-input').value = query;
            analyzeTicker(query);
        }
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    if (globalSearch) {
        globalSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// Modal management
function initializeModals() {
    const addPositionModal = document.getElementById('add-position-modal');
    const addPositionBtn = document.getElementById('add-position');
    const closeBtn = document.querySelector('.close');
    const addPositionForm = document.getElementById('add-position-form');

    if (addPositionBtn) {
        addPositionBtn.addEventListener('click', () => {
            addPositionModal.style.display = 'block';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            addPositionModal.style.display = 'none';
        });
    }

    if (addPositionForm) {
        addPositionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addPosition();
            addPositionModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === addPositionModal) {
            addPositionModal.style.display = 'none';
        }
    });
}

// Dashboard functionality
function initializeDashboard() {
    const refreshBtn = document.getElementById('refresh-data');
    const moverTabs = document.querySelectorAll('.tab-btn');

    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadDashboardData);
    }

    // Market movers tabs
    moverTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Update active tab
            moverTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show target content
            document.querySelectorAll('.movers-content').forEach(content => {
                content.classList.add('hidden');
            });
            document.getElementById(targetTab).classList.remove('hidden');
        });
    });
}

// Watchlist management
function initializeWatchlist() {
    const addSymbolInput = document.getElementById('add-symbol');
    const addToWatchlistBtn = document.getElementById('add-to-watchlist');
    const watchlistContainer = document.getElementById('watchlist-container');

    if (addToWatchlistBtn) {
        addToWatchlistBtn.addEventListener('click', () => {
            const symbol = addSymbolInput.value.trim().toUpperCase();
            if (symbol) {
                addToWatchlist(symbol);
                addSymbolInput.value = '';
            }
        });
    }

    if (addSymbolInput) {
        addSymbolInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const symbol = addSymbolInput.value.trim().toUpperCase();
                if (symbol) {
                    addToWatchlist(symbol);
                    addSymbolInput.value = '';
                }
            }
        });
    }

    // Handle remove buttons
    if (watchlistContainer) {
        watchlistContainer.addEventListener('click', (e) => {
            if (e.target.closest('.remove-btn')) {
                const watchlistItem = e.target.closest('.watchlist-item');
                const symbol = watchlistItem.querySelector('.symbol').textContent;
                removeFromWatchlist(symbol);
            }
        });
    }
}

// Portfolio management
function initializePortfolio() {
    // Portfolio management will be enhanced with the form submission
    loadPortfolioData();
}

// Stock Analysis
function initializeStockAnalysis() {
    const analyzeBtn = document.getElementById('analyze-btn');
    const tickerInput = document.getElementById('ticker-input');
    const timeBtns = document.querySelectorAll('.time-btn');

    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', () => {
            const ticker = tickerInput.value.trim().toUpperCase();
            if (ticker) {
                analyzeTicker(ticker);
            }
        });
    }

    if (tickerInput) {
        tickerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const ticker = tickerInput.value.trim().toUpperCase();
                if (ticker) {
                    analyzeTicker(ticker);
                }
            }
        });
    }

    // Time period buttons
    timeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const period = btn.dataset.period;
            
            // Update active button
            timeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update chart with new period
            const ticker = tickerInput.value.trim().toUpperCase();
            if (ticker) {
                updatePriceChart(ticker, period);
            }
        });
    });

    // Initialize with default ticker
    tickerInput.value = 'AAPL';
    analyzeTicker('AAPL');
}

// Stock Suggestions
function initializeStockSuggestions() {
    const generateBtn = document.getElementById('generate-suggestions');
    const riskLevel = document.getElementById('risk-level');
    const investmentTerm = document.getElementById('investment-term');

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            generateStockSuggestions();
        });
    }

    // Load initial suggestions
    generateStockSuggestions();
}

// Stock Screener
function initializeScreener() {
    const runScreenBtn = document.getElementById('run-screen');
    const peRatio = document.getElementById('pe-ratio');
    const peValue = document.getElementById('pe-value');

    if (runScreenBtn) {
        runScreenBtn.addEventListener('click', runStockScreen);
    }

    if (peRatio && peValue) {
        peRatio.addEventListener('input', () => {
            peValue.textContent = `0-${peRatio.value}`;
        });
    }
}

// Charts initialization
function initializeCharts() {
    // Price chart will be initialized when needed
    window.priceChart = null;
    window.allocationChart = null;
}

// Data loading functions
async function loadDashboardData() {
    try {
        // Load market overview data
        await Promise.all([
            loadMarketOverview(),
            loadMarketMovers(),
            loadAIInsights(),
            updateWatchlistPrices()
        ]);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

async function loadMarketOverview() {
    // Simulate loading market overview data
    return new Promise(resolve => {
        setTimeout(() => {
            // This would normally fetch real market data
            updateMarketStatus();
            resolve();
        }, 500);
    });
}

async function loadMarketMovers() {
    try {
        // This would fetch real market movers data
        const gainersData = [
            { symbol: 'NVDA', price: '$875.20', change: '+5.2%', positive: true },
            { symbol: 'AMD', price: '$142.50', change: '+3.8%', positive: true },
            { symbol: 'TSLA', price: '$248.90', change: '+2.1%', positive: true }
        ];

        const losersData = [
            { symbol: 'NFLX', price: '$445.30', change: '-2.8%', positive: false },
            { symbol: 'PYPL', price: '$58.75', change: '-1.9%', positive: false },
            { symbol: 'ZOOM', price: '$67.45', change: '-1.5%', positive: false }
        ];

        updateMoversDisplay(gainersData, losersData);
    } catch (error) {
        console.error('Error loading market movers:', error);
    }
}

async function loadAIInsights() {
    try {
        // This would fetch AI-generated insights
        const insights = [
            {
                type: 'Bullish Signal',
                confidence: '85%',
                text: 'Technology sector showing strong momentum with AI stocks leading gains'
            },
            {
                type: 'Risk Alert',
                confidence: '70%',
                text: 'High correlation detected in growth stocks - consider diversification'
            }
        ];

        updateAIInsights(insights);
    } catch (error) {
        console.error('Error loading AI insights:', error);
    }
}

async function analyzeTicker(ticker) {
    if (!ticker) return;

    try {
        // Show loading states
        showLoadingStates();

        // Fetch all data in parallel
        const [newsData, analysisData, strategyData, priceData, fundamentalsData] = await Promise.all([
            fetchNews(ticker),
            fetchAnalysis(ticker),
            fetchStrategy(ticker),
            fetchPriceData(ticker, '1M'),
            fetchFundamentals(ticker)
        ]);

        // Update UI with fetched data
        displayNews(newsData);
        displayAnalysis(analysisData);
        displayStrategy(strategyData);
        displayFundamentals(fundamentalsData);
        renderPriceChart(priceData, ticker);

    } catch (error) {
        console.error('Error analyzing ticker:', error);
        showErrorMessage('Failed to fetch data. Please try again.');
    }
}

async function generateStockSuggestions() {
    const riskLevel = document.getElementById('risk-level').value;
    const investmentTerm = document.getElementById('investment-term').value;

    try {
        // Show loading state
        document.getElementById('strategy-container').innerHTML = '<div class="loading">Generating personalized strategies...</div>';
        document.getElementById('picks-container').innerHTML = '<div class="loading">Analyzing stocks...</div>';

        // Fetch suggestions based on filters
        const suggestions = await fetchStockSuggestions(riskLevel, investmentTerm);
        
        displayStockSuggestions(suggestions);
        displaySectorAnalysis(suggestions.sectors);
        displayStockPicks(suggestions.picks);
        displayRiskAnalysis(suggestions.risk);

    } catch (error) {
        console.error('Error generating stock suggestions:', error);
        showErrorMessage('Failed to generate suggestions. Please try again.');
    }
}

async function runStockScreen() {
    const marketCap = document.getElementById('market-cap-filter').value;
    const sector = document.getElementById('sector-filter').value;
    const peRatio = document.getElementById('pe-ratio').value;

    try {
        const filters = { marketCap, sector, peRatio };
        const results = await fetchScreenerResults(filters);
        
        displayScreenerResults(results);
    } catch (error) {
        console.error('Error running stock screen:', error);
        showErrorMessage('Failed to run screen. Please try again.');
    }
}

// API functions
async function fetchNews(ticker) {
    try {
        const response = await fetch(`/api/news?ticker=${ticker}`);
        if (!response.ok) throw new Error('Failed to fetch news');
        return await response.json();
    } catch (error) {
        console.error('News fetch error:', error);
        return generateMockNews(ticker);
    }
}

async function fetchAnalysis(ticker) {
    try {
        const response = await fetch(`/api/analyze?ticker=${ticker}`);
        if (!response.ok) throw new Error('Failed to fetch analysis');
        return await response.json();
    } catch (error) {
        console.error('Analysis fetch error:', error);
        return generateMockAnalysis(ticker);
    }
}

async function fetchStrategy(ticker) {
    try {
        const response = await fetch(`/api/strategy?ticker=${ticker}`);
        if (!response.ok) throw new Error('Failed to fetch strategy');
        return await response.json();
    } catch (error) {
        console.error('Strategy fetch error:', error);
        return generateMockStrategy(ticker);
    }
}

async function fetchPriceData(ticker, period = '1M') {
    try {
        const response = await fetch(`/api/prices?ticker=${ticker}&period=${period}`);
        if (!response.ok) throw new Error('Failed to fetch price data');
        return await response.json();
    } catch (error) {
        console.error('Price fetch error:', error);
        return generateMockPriceData(ticker);
    }
}

async function fetchFundamentals(ticker) {
    try {
        const response = await fetch(`/api/fundamentals?ticker=${ticker}`);
        if (!response.ok) throw new Error('Failed to fetch fundamentals');
        return await response.json();
    } catch (error) {
        console.error('Fundamentals fetch error:', error);
        return generateMockFundamentals(ticker);
    }
}

async function fetchStockSuggestions(riskLevel, investmentTerm) {
    try {
        const response = await fetch(`/api/suggestions?risk=${riskLevel}&term=${investmentTerm}`);
        if (!response.ok) throw new Error('Failed to fetch suggestions');
        return await response.json();
    } catch (error) {
        console.error('Suggestions fetch error:', error);
        return generateMockSuggestions();
    }
}

async function fetchScreenerResults(filters) {
    try {
        const params = new URLSearchParams(filters);
        const response = await fetch(`/api/screener?${params}`);
        if (!response.ok) throw new Error('Failed to fetch screener results');
        return await response.json();
    } catch (error) {
        console.error('Screener fetch error:', error);
        return generateMockScreenerResults();
    }
}

// Display functions
function displayNews(newsItems) {
    const container = document.getElementById('news-container');
    
    if (!newsItems || newsItems.length === 0) {
        container.innerHTML = '<p class="loading">No recent news found for this ticker.</p>';
        return;
    }

    container.innerHTML = newsItems.map(item => `
        <div class="news-item">
            <h4>${item.title}</h4>
            <p>${item.summary}</p>
            <div class="news-meta">
                <span>${new Date(item.date).toLocaleDateString()}</span>
                <span>•</span>
                <span>${item.source}</span>
            </div>
        </div>
    `).join('');
}

function displayAnalysis(analysisData) {
    const container = document.getElementById('analysis-container');
    
    if (!analysisData) {
        container.innerHTML = '<p class="loading">Analysis data unavailable.</p>';
        return;
    }

    container.innerHTML = `
        <div class="analysis-item">
            <h4>Technical Analysis</h4>
            <p><strong>Trend:</strong> ${analysisData.trend || 'Neutral'}</p>
            <p><strong>RSI:</strong> ${analysisData.rsi || 'N/A'}</p>
            <p><strong>Support:</strong> $${analysisData.support || 'N/A'}</p>
            <p><strong>Resistance:</strong> $${analysisData.resistance || 'N/A'}</p>
        </div>
        <div class="analysis-item">
            <h4>Key Insights</h4>
            <p>${analysisData.summary || 'Analysis in progress...'}</p>
        </div>
    `;
}

function displayStrategy(strategyData) {
    const container = document.getElementById('strategy-container');
    
    if (!strategyData) {
        container.innerHTML = '<p class="loading">Strategy data unavailable.</p>';
        return;
    }

    container.innerHTML = `
        <div class="strategy-item">
            <h4>Recommended Action: ${strategyData.action || 'Hold'}</h4>
            <p><strong>Confidence:</strong> ${strategyData.confidence || '75%'}</p>
            <p><strong>Target Price:</strong> $${strategyData.targetPrice || 'N/A'}</p>
            <p><strong>Stop Loss:</strong> $${strategyData.stopLoss || 'N/A'}</p>
            <p>${strategyData.reasoning || 'Strategy analysis in progress...'}</p>
        </div>
    `;
}

function displayFundamentals(fundamentalsData) {
    const container = document.getElementById('fundamentals-container');
    
    if (!fundamentalsData) {
        return;
    }

    const metrics = [
        { label: 'P/E Ratio', value: fundamentalsData.peRatio || '--' },
        { label: 'Market Cap', value: fundamentalsData.marketCap || '--' },
        { label: '52W High', value: fundamentalsData.fiftyTwoWeekHigh || '--' },
        { label: '52W Low', value: fundamentalsData.fiftyTwoWeekLow || '--' },
        { label: 'EPS', value: fundamentalsData.eps || '--' },
        { label: 'Dividend Yield', value: fundamentalsData.dividendYield || '--' }
    ];

    container.innerHTML = metrics.map(metric => `
        <div class="metric-row">
            <span class="metric-label">${metric.label}</span>
            <span class="metric-value">${metric.value}</span>
        </div>
    `).join('');
}

function displayStockSuggestions(suggestions) {
    if (!suggestions) return;

    const container = document.getElementById('strategy-container');
    
    container.innerHTML = `
        <div class="suggestion-item">
            <h4>Portfolio Recommendation</h4>
            <p><strong>Strategy:</strong> ${suggestions.strategy || 'Balanced Growth'}</p>
            <p><strong>Allocation:</strong></p>
            <ul>
                <li>Stocks: ${suggestions.allocation?.stocks || '70%'}</li>
                <li>Bonds: ${suggestions.allocation?.bonds || '20%'}</li>
                <li>Cash: ${suggestions.allocation?.cash || '10%'}</li>
            </ul>
        </div>
    `;
}

function displaySectorAnalysis(sectors) {
    if (!sectors) return;

    const container = document.getElementById('sector-container');
    
    container.innerHTML = sectors.map(sector => `
        <div class="sector-item">
            <div class="sector-header">
                <span class="sector-name">${sector.name}</span>
                <span class="sector-rating ${sector.rating.toLowerCase()}">${sector.rating}</span>
            </div>
            <p>${sector.analysis}</p>
        </div>
    `).join('');
}

function displayStockPicks(picks) {
    if (!picks) return;

    const container = document.getElementById('picks-container');
    
    container.innerHTML = picks.map(pick => `
        <div class="stock-pick">
            <div class="pick-header">
                <span class="symbol">${pick.symbol}</span>
                <span class="rating ${pick.rating.replace(' ', '').toLowerCase()}">${pick.rating}</span>
                <span class="confidence">${pick.confidence}%</span>
            </div>
            <div class="pick-details">
                <p>Target: $${pick.target} (+${pick.upside}%)</p>
                <p>${pick.reasoning}</p>
            </div>
        </div>
    `).join('');
}

function displayRiskAnalysis(riskData) {
    if (!riskData) return;

    const container = document.getElementById('risk-container');
    
    container.innerHTML = `
        <div class="risk-metric">
            <span class="risk-label">Overall Risk Score</span>
            <div class="risk-bar">
                <div class="risk-fill" style="width: ${riskData.score * 10}%;"></div>
            </div>
            <span class="risk-value">${riskData.score}/10</span>
        </div>
        <div class="risk-recommendations">
            <h4>Risk Mitigation Suggestions:</h4>
            <ul>
                ${riskData.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
    `;
}

function displayScreenerResults(results) {
    const container = document.getElementById('screener-results');
    
    if (!results || results.length === 0) {
        container.innerHTML = '<p class="loading">No stocks match your criteria.</p>';
        return;
    }

    const tableHTML = `
        <div class="results-table">
            <div class="table-header">
                <span>Symbol</span>
                <span>Name</span>
                <span>Price</span>
                <span>Change</span>
                <span>Volume</span>
                <span>Market Cap</span>
                <span>P/E</span>
            </div>
            ${results.map(stock => `
                <div class="table-row">
                    <span class="symbol">${stock.symbol}</span>
                    <span>${stock.name}</span>
                    <span>$${stock.price}</span>
                    <span class="${stock.change.startsWith('+') ? 'positive' : 'negative'}">${stock.change}</span>
                    <span>${stock.volume}</span>
                    <span>${stock.marketCap}</span>
                    <span>${stock.pe}</span>
                </div>
            `).join('')}
        </div>
    `;

    container.innerHTML = tableHTML;
}

// Chart functions
function renderPriceChart(priceData, ticker) {
    const ctx = document.getElementById('price-chart');
    if (!ctx) return;

    // Destroy existing chart
    if (window.priceChart) {
        window.priceChart.destroy();
    }

    const chartData = {
        labels: priceData.dates || generateDates(30),
        datasets: [{
            label: `${ticker} Price`,
            data: priceData.prices || generateMockPrices(30),
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
        }]
    };

    window.priceChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: '#e5e7eb'
                    }
                },
                x: {
                    grid: {
                        color: '#e5e7eb'
                    }
                }
            }
        }
    });
}

function updatePriceChart(ticker, period) {
    fetchPriceData(ticker, period).then(priceData => {
        renderPriceChart(priceData, ticker);
    });
}

// Watchlist functions
function addToWatchlist(symbol) {
    const watchlistContainer = document.getElementById('watchlist-container');
    
    // Check if already exists
    const existingItems = watchlistContainer.querySelectorAll('.symbol');
    for (let item of existingItems) {
        if (item.textContent === symbol) {
            showErrorMessage(`${symbol} is already in your watchlist.`);
            return;
        }
    }

    // Add new watchlist item
    const watchlistItem = document.createElement('div');
    watchlistItem.className = 'watchlist-item';
    watchlistItem.innerHTML = `
        <span class="symbol">${symbol}</span>
        <span class="price">Loading...</span>
        <span class="change neutral">--</span>
        <button class="remove-btn"><i class="fas fa-times"></i></button>
    `;

    watchlistContainer.appendChild(watchlistItem);

    // Fetch current price
    fetchCurrentPrice(symbol).then(priceData => {
        updateWatchlistItem(symbol, priceData);
    });
}

function removeFromWatchlist(symbol) {
    const watchlistContainer = document.getElementById('watchlist-container');
    const items = watchlistContainer.querySelectorAll('.watchlist-item');
    
    items.forEach(item => {
        const itemSymbol = item.querySelector('.symbol').textContent;
        if (itemSymbol === symbol) {
            item.remove();
        }
    });
}

async function updateWatchlistPrices() {
    const watchlistItems = document.querySelectorAll('.watchlist-item');
    
    for (let item of watchlistItems) {
        const symbol = item.querySelector('.symbol').textContent;
        try {
            const priceData = await fetchCurrentPrice(symbol);
            updateWatchlistItem(symbol, priceData);
        } catch (error) {
            console.error(`Error updating price for ${symbol}:`, error);
        }
    }
}

function updateWatchlistItem(symbol, priceData) {
    const watchlistItems = document.querySelectorAll('.watchlist-item');
    
    watchlistItems.forEach(item => {
        const itemSymbol = item.querySelector('.symbol').textContent;
        if (itemSymbol === symbol) {
            const priceElement = item.querySelector('.price');
            const changeElement = item.querySelector('.change');
            
            priceElement.textContent = `$${priceData.price}`;
            changeElement.textContent = priceData.change;
            changeElement.className = `change ${priceData.change.startsWith('+') ? 'positive' : 'negative'}`;
        }
    });
}

// Portfolio functions
function addPosition() {
    const symbol = document.getElementById('position-symbol').value.trim().toUpperCase();
    const shares = parseFloat(document.getElementById('position-shares').value);
    const price = parseFloat(document.getElementById('position-price').value);

    if (!symbol || !shares || !price) {
        showErrorMessage('Please fill in all fields.');
        return;
    }

    // Add to portfolio display
    const holdingsTable = document.getElementById('holdings-table');
    const newRow = document.createElement('div');
    newRow.className = 'holding-row';
    
    const currentPrice = price * (1 + (Math.random() - 0.5) * 0.2); // Mock current price
    const value = shares * currentPrice;
    const gainLoss = value - (shares * price);
    const gainLossPercent = ((gainLoss / (shares * price)) * 100).toFixed(1);

    newRow.innerHTML = `
        <span class="symbol">${symbol}</span>
        <span>${shares}</span>
        <span>$${currentPrice.toFixed(2)}</span>
        <span>$${value.toFixed(2)}</span>
        <span class="${gainLoss >= 0 ? 'positive' : 'negative'}">
            ${gainLoss >= 0 ? '+' : ''}$${gainLoss.toFixed(2)} (${gainLossPercent}%)
        </span>
        <span><button class="btn-small">Sell</button></span>
    `;

    holdingsTable.appendChild(newRow);

    // Clear form
    document.getElementById('add-position-form').reset();
    
    // Update portfolio summary
    updatePortfolioSummary();
}

function loadPortfolioData() {
    // This would normally load from a database
    updatePortfolioSummary();
}

function updatePortfolioSummary() {
    // Calculate portfolio totals from holdings
    const holdingRows = document.querySelectorAll('.holding-row');
    let totalValue = 0;
    let totalGainLoss = 0;

    holdingRows.forEach(row => {
        const valueText = row.children[3].textContent.replace('$', '').replace(',', '');
        const gainLossText = row.children[4].textContent;
        
        totalValue += parseFloat(valueText) || 0;
        
        const gainLossMatch = gainLossText.match(/[\+\-]?\$?([0-9,]+\.?[0-9]*)/);
        if (gainLossMatch) {
            totalGainLoss += parseFloat(gainLossMatch[1].replace(',', '')) * (gainLossText.includes('-') ? -1 : 1);
        }
    });

    // Update summary cards
    const summaryCards = document.querySelectorAll('.summary-card');
    if (summaryCards.length >= 3) {
        summaryCards[0].querySelector('.value').textContent = `$${totalValue.toLocaleString()}`;
        summaryCards[2].querySelector('.value').textContent = `${totalGainLoss >= 0 ? '+' : ''}$${Math.abs(totalGainLoss).toLocaleString()}`;
    }
}

// Utility functions
function switchToSection(sectionId) {
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.section === sectionId);
    });

    // Show section
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.toggle('active', section.id === sectionId);
    });

    // Load section data
    loadSectionData(sectionId);
}

function loadSectionData(sectionId) {
    switch (sectionId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'suggestions':
            generateStockSuggestions();
            break;
        case 'portfolio':
            loadPortfolioData();
            break;
        default:
            break;
    }
}

function showLoadingStates() {
    const containers = ['news-container', 'analysis-container', 'strategy-container'];
    containers.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = '<div class="loading">Loading...</div>';
        }
    });
}

function showErrorMessage(message) {
    // Simple error notification - could be enhanced with a proper notification system
    alert(message);
}

function updateMarketStatus() {
    const statusIndicator = document.querySelector('.status-indicator');
    const marketHours = isMarketOpen();
    
    if (statusIndicator) {
        statusIndicator.className = `status-indicator ${marketHours ? 'live' : ''}`;
    }

    const statusText = document.querySelector('.market-status span:last-child');
    if (statusText) {
        statusText.textContent = marketHours ? 'Market Open' : 'Market Closed';
    }
}

function isMarketOpen() {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    
    // Simplified market hours check (weekdays 9:30 AM - 4:00 PM ET)
    return day >= 1 && day <= 5 && hour >= 9 && hour < 16;
}

function updateMoversDisplay(gainersData, losersData) {
    const gainersContainer = document.getElementById('gainers');
    const losersContainer = document.getElementById('losers');

    if (gainersContainer) {
        gainersContainer.innerHTML = gainersData.map(stock => `
            <div class="mover-item">
                <span class="symbol">${stock.symbol}</span>
                <span class="price">${stock.price}</span>
                <span class="change ${stock.positive ? 'positive' : 'negative'}">${stock.change}</span>
            </div>
        `).join('');
    }

    if (losersContainer) {
        losersContainer.innerHTML = losersData.map(stock => `
            <div class="mover-item">
                <span class="symbol">${stock.symbol}</span>
                <span class="price">${stock.price}</span>
                <span class="change ${stock.positive ? 'positive' : 'negative'}">${stock.change}</span>
            </div>
        `).join('');
    }
}

function updateAIInsights(insights) {
    const container = document.querySelector('.ai-insights');
    if (!container) return;

    const insightsHTML = insights.map(insight => `
        <div class="insight-item">
            <div class="insight-header">
                <span class="insight-type">${insight.type}</span>
                <span class="confidence">${insight.confidence}</span>
            </div>
            <p>${insight.text}</p>
        </div>
    `).join('');

    container.innerHTML = `<h3><i class="fas fa-robot"></i> AI Market Insights</h3>${insightsHTML}`;
}

// Mock data generators for fallback
function generateMockNews(ticker) {
    return [
        {
            title: `${ticker} Reports Strong Quarterly Earnings`,
            summary: 'The company exceeded analyst expectations with robust revenue growth and positive forward guidance.',
            date: new Date().toISOString(),
            source: 'Financial News'
        },
        {
            title: `Analysts Upgrade ${ticker} Stock Rating`,
            summary: 'Major investment firm raises price target citing strong fundamentals and market position.',
            date: new Date(Date.now() - 86400000).toISOString(),
            source: 'Market Watch'
        }
    ];
}

function generateMockAnalysis(ticker) {
    return {
        trend: 'Bullish',
        rsi: '65.4',
        support: '180.50',
        resistance: '195.20',
        summary: `${ticker} shows strong technical indicators with bullish momentum. Current price action suggests continued upward movement with strong support levels.`
    };
}

function generateMockStrategy(ticker) {
    return {
        action: 'Buy',
        confidence: '82%',
        targetPrice: '210.00',
        stopLoss: '175.00',
        reasoning: `Strong fundamentals combined with positive technical indicators suggest ${ticker} is well-positioned for growth. Recommend accumulating on dips.`
    };
}

function generateMockFundamentals(ticker) {
    return {
        peRatio: '24.5',
        marketCap: '$2.8T',
        fiftyTwoWeekHigh: '$198.23',
        fiftyTwoWeekLow: '$124.17',
        eps: '$6.12',
        dividendYield: '0.52%'
    };
}

function generateMockPriceData(ticker) {
    const prices = [];
    const dates = [];
    let basePrice = 180;

    for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString());
        
        basePrice += (Math.random() - 0.5) * 5;
        prices.push(Math.max(100, basePrice));
    }

    return { dates, prices };
}

function generateMockSuggestions() {
    return {
        strategy: 'Balanced Growth',
        allocation: {
            stocks: '70%',
            bonds: '20%',
            cash: '10%'
        },
        sectors: [
            { name: 'Technology', rating: 'Bullish', analysis: 'AI and cloud computing driving growth. Strong fundamentals across major players.' },
            { name: 'Healthcare', rating: 'Neutral', analysis: 'Mixed signals with biotech outperforming traditional pharma.' },
            { name: 'Energy', rating: 'Bearish', analysis: 'Transitioning market with headwinds from renewable energy adoption.' }
        ],
        picks: [
            { symbol: 'MSFT', rating: 'Strong Buy', confidence: 92, target: '450', upside: '8.3', reasoning: 'AI leadership, cloud growth, strong financials' },
            { symbol: 'NVDA', rating: 'Buy', confidence: 88, target: '950', upside: '8.5', reasoning: 'AI chip dominance, data center growth' }
        ],
        risk: {
            score: 6.5,
            recommendations: [
                'Consider adding defensive stocks (utilities, consumer staples)',
                'Diversify across international markets',
                'Add fixed-income instruments for stability'
            ]
        }
    };
}

function generateMockScreenerResults() {
    return [
        { symbol: 'AAPL', name: 'Apple Inc.', price: '192.50', change: '+1.2%', volume: '45.2M', marketCap: '$2.8T', pe: '24.5' },
        { symbol: 'MSFT', name: 'Microsoft Corp.', price: '415.80', change: '-0.5%', volume: '28.1M', marketCap: '$3.1T', pe: '28.2' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '142.30', change: '+0.8%', volume: '32.5M', marketCap: '$1.8T', pe: '22.1' }
    ];
}

async function fetchCurrentPrice(symbol) {
    // Mock price data - would normally fetch from API
    return new Promise(resolve => {
        setTimeout(() => {
            const price = (Math.random() * 200 + 50).toFixed(2);
            const change = ((Math.random() - 0.5) * 10).toFixed(2);
            resolve({
                price: price,
                change: `${change >= 0 ? '+' : ''}${change}%`
            });
        }, 500);
    });
}

function generateDates(days) {
    const dates = [];
    for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString());
    }
    return dates;
}

function generateMockPrices(count) {
    const prices = [];
    let basePrice = 180;
    
    for (let i = 0; i < count; i++) {
        basePrice += (Math.random() - 0.5) * 5;
        prices.push(Math.max(100, basePrice));
    }
    
    return prices;
}
