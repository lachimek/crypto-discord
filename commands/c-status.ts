// commands/c-status.ts
import { ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { getPortfolioStatus } from '../persistence';
import { formatPortfolioStatus } from '../utils';

/**
 * Handles the /c-status command for displaying the user's portfolio.
 * @param interaction - The Discord interaction object
 */
export async function handleCStatus(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
        const portfolio = getPortfolioStatus(interaction.user.id);
        const statusMessage = await formatPortfolioStatus(portfolio);
        await interaction.reply({ content: statusMessage, flags: MessageFlags.Ephemeral });
    } catch (error) {
        console.error('Error getting portfolio status:', error);
        await interaction.reply({ 
            content: '?? **Error:** Failed to retrieve portfolio status. Please try again.', 
            flags: MessageFlags.Ephemeral 
        });
    }
} 