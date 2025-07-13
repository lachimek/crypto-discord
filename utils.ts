// Format number with spaces for thousands

import { Pricing } from "./pricing-api";
import { PortfolioStatus } from "./types";

/**
 * Formats a number with spaces as thousand separators and fixed decimals.
 * @param num The number to format
 * @param decimals Number of decimal places
 * @returns Formatted number string
 */
export function formatNumber(num: number, decimals: number = 2, noCurrency: boolean = false): string {
    const [integer, decimal] = num.toFixed(decimals).split('.');
    const formattedInt = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    let result = formattedInt;
    if (decimal !== undefined) {
        result += '.' + decimal;
    }
    return result.concat(noCurrency ? '' : ' ' + process.env.CURRENCY || '$');
}

export function withSign(content: string, num: number): string {
    return num >= 0 ? `+${content}` : content;
}

// Format portfolio status for display
/**
 * Formats the portfolio status for Discord message display.
 * @param portfolio Portfolio status array
 * @returns Formatted message
 */
export async function formatPortfolioStatus(portfolio: PortfolioStatus[]): Promise<string> {
    if (portfolio.length === 0) {
        return "Your portfolio is empty. Use `/c-add <symbol> <total_spent> <quantity>` to add your first purchase.";
    }
    const prices = await Pricing.GetPrices();

    let message = "**:bar_chart: Your Portfolio Status**\n";

    const sortedPortfolio = portfolio.sort((a, b) => b.totalValue - a.totalValue);

    // Format profit/loss with 24h changes
    const formatProfitLossChange = (profitLoss: number, percentage: number) => {
        const sign = profitLoss >= 0 ? "+" : "";
        const percentSign = percentage >= 0 ? "+" : "";
        return `${sign}${formatNumber(Math.abs(profitLoss), 2)} (${percentSign}${percentage.toFixed(2)}%)`;
    };

    let grandTotalHoldings = 0;
    let grandTotalInvested = 0;
    let grandTotalProfitLoss24h = 0;

    sortedPortfolio.forEach((coin, idx) => {
        const priceData = prices.find(p => p.symbol === coin.symbol);
        if (!priceData) return;
        
        const currentPrice = priceData.currentPrice;
        const totalHoldings = coin.totalQuantity * currentPrice;
        
        // Calculate profit/loss data relative to average buy price
        const profitLossData = Pricing.calculateProfitLossData(priceData, coin.averagePrice, coin.totalQuantity);

        const currentPriceFormatted = formatNumber(currentPrice, 2);
        const avgPrice = formatNumber(coin.averagePrice, 2);
        const totalQuantity = formatNumber(coin.totalQuantity, 8, true);
        const totalValue = formatNumber(coin.totalValue, 2);
        const totalHoldingsFormatted = formatNumber(totalHoldings, 2);

        const currentProfitLossFormatted = formatProfitLossChange(profitLossData.currentProfitLoss, profitLossData.currentProfitLossPercentage);
        const profitLoss24hFormatted = profitLossData.profitLoss24hPercentage !== 0 ? 
            ` (24h: ${withSign(formatNumber(profitLossData.profitLoss24hPercentage, 2, true), profitLossData.profitLoss24hPercentage)}%)` : "";

        const currentPriceChange24h = ` (24h: ${withSign(formatNumber(priceData.priceChange24h, 2, true), priceData.priceChange24h)}%)`;

        if (idx > 0) message += "\n---\n\n";
        message += `**${coin.symbol}**\n`;
        message += `*Average Buy Price:* \`${avgPrice}\`\n`;
        message += `*Current Price:* \`${currentPriceFormatted}${currentPriceChange24h}\`\n`;
        message += `*Profit/Loss:* \`${currentProfitLossFormatted}${profitLoss24hFormatted}\`\n`;
        message += `*Total Quantity:* \`${totalQuantity}\`\n`;
        message += `*Total Invested:* \`${totalValue}\`\n`;
        message += `*Total Holdings:* \`${totalHoldingsFormatted}\`\n`;

        grandTotalHoldings += totalHoldings;
        grandTotalInvested += coin.totalValue;
        grandTotalProfitLoss24h += profitLossData.profitLoss24h;
    });

    const grandTotalProfitLoss = grandTotalHoldings - grandTotalInvested;
    const grandTotalProfitLossPercentage = (grandTotalProfitLoss / grandTotalInvested) * 100;
    const grandTotalProfitLoss24hPercentage = grandTotalInvested > 0 ? (grandTotalProfitLoss24h / grandTotalInvested) * 100 : 0;
    
    const grandTotalProfitLossFormatted = formatProfitLossChange(grandTotalProfitLoss, grandTotalProfitLossPercentage);
    const grandTotalProfitLoss24hFormatted = grandTotalProfitLoss24hPercentage !== 0 ? 
        ` (24h: ${withSign(formatNumber(grandTotalProfitLoss24hPercentage, 2, true), grandTotalProfitLoss24hPercentage)}%)` : "";

    message += `\n\n*Grand Total Holdings:* \`${formatNumber(grandTotalHoldings, 2)}\`\n`;
    message += `*Grand Total Invested:* \`${formatNumber(grandTotalInvested, 2)}\`\n`;
    message += `*Grand Total Profit/Loss:* \`${grandTotalProfitLossFormatted}${grandTotalProfitLoss24hFormatted}\`\n`;

    return message;
}