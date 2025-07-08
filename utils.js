// Format number with spaces for thousands
/**
 * Formats a number with spaces as thousand separators and fixed decimals.
 * @param {number} num The number to format
 * @param {number} decimals Number of decimal places
 * @returns {string} Formatted number string
 */
function formatNumber(num, decimals = 2) {
    const [integer, decimal] = num.toFixed(decimals).split('.');
    const formattedInt = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    let result = formattedInt;
    if (decimal !== undefined) {
        result += '.' + decimal;
    }
    return result.concat(' ').concat(process.env.CURRENCY || '$');
}

// Format portfolio status for display
/**
 * Formats the portfolio status for Discord message display.
 * @param {Array} portfolio Portfolio status array
 * @returns {string} Formatted message
 */
function formatPortfolioStatus(portfolio) {
    if (portfolio.length === 0) {
        return "Your portfolio is empty. Use `/c-add <symbol> <total_spent> <quantity>` to add your first purchase.";
    }
    let message = "**:bar_chart: Your Portfolio Status**\n\n";
    portfolio.forEach(coin => {
        const avgPrice = formatNumber(coin.averagePrice, 2);
        const totalQuantity = formatNumber(coin.totalQuantity, 8);
        const totalValue = formatNumber(coin.totalValue, 2);
        message += `**${coin.symbol}**\n`;
        message += `Average Price: ${avgPrice}\n`;
        message += `Total Quantity: ${totalQuantity}\n`;
        message += `Total Invested: ${totalValue}\n\n`;
    });
    return message;
}

module.exports = {
    formatNumber,
    formatPortfolioStatus,
}