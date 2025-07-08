// portfolio.js
// Handles all portfolio data operations (file-based persistence)
const fs = require('fs');
const path = require('path');

const PORTFOLIO_FILE = path.join(__dirname, 'portfolio.json');

/**
 * Loads the portfolio data from the JSON file.
 * @returns {Array} Portfolio array
 */
function loadPortfolio() {
    try {
        if (fs.existsSync(PORTFOLIO_FILE)) {
            const data = fs.readFileSync(PORTFOLIO_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading portfolio:', error);
    }
    return [];
}

/**
 * Saves the portfolio data to the JSON file.
 * @param {Array} portfolio Portfolio array to save
 */
function savePortfolio(portfolio) {
    try {
        fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(portfolio, null, 2));
    } catch (error) {
        console.error('Error saving portfolio:', error);
    }
}

/**
 * Adds a new cryptocurrency purchase to the portfolio.
 * @param {string} symbol Cryptocurrency symbol
 * @param {number} totalSpent Total amount spent in USD
 * @param {number} quantity Number of coins received
 * @param {string} userId Discord user ID
 * @returns {Object} The purchase object
 */
function addPurchase(symbol, totalSpent, quantity, userId) {
    const portfolio = loadPortfolio();
    const pricePerCoin = totalSpent / quantity;
    const purchase = {
        symbol: symbol.toUpperCase(),
        price: pricePerCoin,
        quantity: parseFloat(quantity),
        totalSpent: parseFloat(totalSpent),
        date: new Date().toISOString(),
        userId: userId
    };
    portfolio.push(purchase);
    savePortfolio(portfolio);
    return purchase;
}

/**
 * Gets the portfolio status, grouped by symbol and averaged.
 * @param {string|null} userId Discord user ID (optional)
 * @returns {Array} Array of grouped portfolio status
 */
function getPortfolioStatus(userId = null) {
    let portfolio = loadPortfolio();
    if (userId) {
        portfolio = portfolio.filter(purchase => purchase.userId === userId);
    }
    const grouped = {};
    portfolio.forEach(purchase => {
        const symbol = purchase.symbol;
        if (!grouped[symbol]) {
            grouped[symbol] = {
                symbol: symbol,
                totalQuantity: 0,
                totalValue: 0,
                purchases: []
            };
        }
        grouped[symbol].totalQuantity += purchase.quantity;
        grouped[symbol].totalValue += purchase.price * purchase.quantity;
        grouped[symbol].purchases.push(purchase);
    });
    Object.values(grouped).forEach(coin => {
        coin.averagePrice = coin.totalValue / coin.totalQuantity;
    });
    return Object.values(grouped);
}

module.exports = {
    loadPortfolio,
    savePortfolio,
    addPurchase,
    getPortfolioStatus
}; 