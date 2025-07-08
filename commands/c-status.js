// commands/c-status.js
/**
 * Handles the /c-status command for displaying the user's portfolio.
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
const { getPortfolioStatus } = require('../portfolio');
const { formatPortfolioStatus } = require('../utils');

module.exports = async function handleCStatus(interaction) {
    try {
        const portfolio = getPortfolioStatus(interaction.user.id);
        const statusMessage = formatPortfolioStatus(portfolio);
        await interaction.reply({ content: statusMessage, ephemeral: true });
    } catch (error) {
        console.error('Error getting portfolio status:', error);
        await interaction.reply({ 
            content: ':exclamation: **Error:** Failed to retrieve portfolio status. Please try again.', 
            ephemeral: true 
        });
    }
} 