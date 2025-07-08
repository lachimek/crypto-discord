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

    let grandTotalHoldings = 0;
    let grandTotalInvested = 0;

    sortedPortfolio.forEach((coin, idx) => {
        const currentPrice = prices.find(p => p.symbol === coin.symbol)?.currentPrice || 0;
        const totalHoldings = coin.totalQuantity * currentPrice;
        const profitLoss = (currentPrice * coin.totalQuantity) - (coin.averagePrice * coin.totalQuantity);
        const profitLossPercentage = profitLoss / (coin.averagePrice * coin.totalQuantity) * 100;

        const currentPriceFormatted = formatNumber(currentPrice, 2);
        const avgPrice = formatNumber(coin.averagePrice, 2);
        const totalQuantity = formatNumber(coin.totalQuantity, 8, true);
        const totalValue = formatNumber(coin.totalValue, 2);
        const profitLossFormatted = formatNumber(Math.abs(profitLoss), 2);
        const profitLossPercentageFormatted = formatNumber(Math.abs(profitLossPercentage), 2, true);
        const totalHoldingsFormatted = formatNumber(totalHoldings, 2);

        const profitSign = profitLoss >= 0 ? "+" : "-";
        const percentSign = profitLossPercentage >= 0 ? "+" : "-";

        if (idx > 0) message += "\n---\n\n";
        message += `**${coin.symbol}**\n`;
        message += `*Average Buy Price:* \`${avgPrice}\`\n`;
        message += `*Current Price:* \`${currentPriceFormatted}\`\n`;
        message += `*Profit/Loss:* \`${profitSign}${profitLossFormatted}\` (\`${percentSign}${profitLossPercentageFormatted}%\`)\n`;
        message += `*Total Quantity:* \`${totalQuantity}\`\n`;
        message += `*Total Invested:* \`${totalValue}\`\n`;
        message += `*Total Holdings:* \`${totalHoldingsFormatted}\`\n`;

        grandTotalHoldings += totalHoldings;
        grandTotalInvested += coin.totalValue;
    });

    message += `\n\n*Grand Total Holdings:* \`${formatNumber(grandTotalHoldings, 2)}\`\n`;
    message += `*Grand Total Invested:* \`${formatNumber(grandTotalInvested, 2)}\`\n`;
    message += `*Grand Total Profit/Loss:* \`${formatNumber(grandTotalHoldings - grandTotalInvested, 2)}\` (\`${formatNumber((grandTotalHoldings - grandTotalInvested) / grandTotalInvested * 100, 2, true)}\`%)\n`;

    return message;
}