// commands/c-add.js
/**
 * Handles the /c-add command for adding a new crypto purchase.
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
const { addPurchase } = require('../portfolio');
const { formatNumber } = require('../utils');

module.exports = async function handleCAdd(interaction) {
    const symbol = interaction.options.getString('symbol');
    const totalSpent = interaction.options.getNumber('total_spent');
    const quantity = interaction.options.getNumber('quantity');

    try {
        const purchase = addPurchase(symbol, totalSpent, quantity, interaction.user.id);
        const embed = {
            color: 0x00ff00,
            title: ':white_check_mark: Purchase Added Successfully',
            fields: [
                { name: 'Symbol', value: purchase.symbol, inline: true },
                { name: 'Total Spent', value: `${formatNumber(purchase.totalSpent, 2)}`, inline: true },
                { name: 'Quantity Received', value: formatNumber(purchase.quantity, 8), inline: true },
                { name: 'Price per Coin', value: `${formatNumber(purchase.price, 2)}`, inline: true },
                { name: 'Date', value: new Date(purchase.date).toLocaleDateString(), inline: true }
            ],
            timestamp: new Date()
        };
        await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
        console.error('Error adding purchase:', error);
        await interaction.reply({ 
            content: ':exclamation: **Error:** Failed to add purchase. Please try again.', 
            ephemeral: true 
        });
    }
} 