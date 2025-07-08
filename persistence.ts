// portfolio.ts
// Handles all portfolio data operations (file-based persistence)
import fs from 'fs';
import path from 'path';

const PORTFOLIO_FILE = path.join(__dirname, 'portfolio.json');

// Type definitions
interface Purchase {
    symbol: string;
    price: number;
    quantity: number;
    totalSpent: number;
    date: string;
    userId: string;
}

interface PortfolioStatus {
    symbol: string;
    totalQuantity: number;
    totalValue: number;
    averagePrice: number;
    purchases: Purchase[];
}

/**
 * Loads the portfolio data from the JSON file.
 * @returns Portfolio array
 */
function loadPortfolio(): Purchase[] {
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
 * @param portfolio Portfolio array to save
 */
function savePortfolio(portfolio: Purchase[]): void {
    try {
        fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(portfolio, null, 2));
    } catch (error) {
        console.error('Error saving portfolio:', error);
    }
}

/**
 * Adds a new cryptocurrency purchase to the portfolio.
 * @param symbol Cryptocurrency symbol
 * @param totalSpent Total amount spent in USD
 * @param quantity Number of coins received
 * @param userId Discord user ID
 * @returns The purchase object
 */
export function addPurchase(symbol: string, totalSpent: number, quantity: number, userId: string): Purchase {
    const portfolio = loadPortfolio();
    const pricePerCoin = totalSpent / quantity;
    const purchase: Purchase = {
        symbol: symbol.toUpperCase(),
        price: pricePerCoin,
        quantity: parseFloat(quantity.toString()),
        totalSpent: parseFloat(totalSpent.toString()),
        date: new Date().toISOString(),
        userId: userId
    };
    portfolio.push(purchase);
    savePortfolio(portfolio);
    return purchase;
}

/**
 * Gets the portfolio status, grouped by symbol and averaged.
 * @param userId Discord user ID (optional)
 * @returns Array of grouped portfolio status
 */
export function getPortfolioStatus(userId: string | null = null): PortfolioStatus[] {
    let portfolio = loadPortfolio();
    if (userId) {
        portfolio = portfolio.filter(purchase => purchase.userId === userId);
    }
    console.log
    const grouped: Record<string, PortfolioStatus> = {};
    portfolio.forEach(purchase => {
        const symbol = purchase.symbol;
        if (!grouped[symbol]) {
            grouped[symbol] = {
                symbol: symbol,
                totalQuantity: 0,
                totalValue: 0,
                averagePrice: 0,
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