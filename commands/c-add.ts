// commands/c-add.ts
import { ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { addPurchase } from '../persistence';
import { formatNumber } from '../utils';
import { SupportedSymbols } from '../pricing-api';

/**
 * Handles the /c-add command for adding a new crypto purchase.
 * @param interaction - The Discord interaction object
 */
export async function handleCAdd(interaction: ChatInputCommandInteraction): Promise<void> {
    const symbol = interaction.options.getString('symbol')!;
    const totalSpent = interaction.options.getNumber('total_spent')!;
    const quantity = interaction.options.getNumber('quantity')!;

    try {

        if (!Object.keys(SupportedSymbols).includes(symbol as SupportedSymbols)) {
            await interaction.reply({ content: '**:interrobang: Invalid symbol.** Please use a valid symbol from the list. Use `/c-symbols` to see the list of supported symbols.', flags: MessageFlags.Ephemeral });
            return;
        }

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
            timestamp: new Date().toISOString()
        };
        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    } catch (error) {
        console.error('Error adding purchase:', error);
        await interaction.reply({ 
            content: ':warning: **Error:** Failed to add purchase. Please try again.', 
            flags: MessageFlags.Ephemeral 
        });
    }
} 