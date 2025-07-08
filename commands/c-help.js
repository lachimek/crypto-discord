/**
 * Handles the /c-help command for displaying the help message.
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
module.exports = async function handleCHelp(interaction) {
    const helpMessage = `**?? Crypto Discord Bot Commands**\n\n**/c-add <symbol> <total_spent> <quantity>**\nAdd a new cryptocurrency purchase to your portfolio.\n*Example:* \`/c-add BTC 500 0.002\` (spent $500, received 0.002 BTC)\n\n**/c-status**\nDisplay your current portfolio with average buy prices.\n\n**/c-help**\nShow this help message.\n\n---\n*Note: This bot tracks your cryptocurrency purchases. For now, price updates are not implemented yet.*`;
    await interaction.reply({ content: helpMessage, ephemeral: true });
} 