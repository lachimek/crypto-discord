import { ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { SupportedSymbols } from '../pricing-api';

/**
 * Handles the /c-help command for displaying the help message.
 * @param interaction - The Discord interaction object
 */
export async function handleCSymbols(interaction: ChatInputCommandInteraction): Promise<void> {
    const symbolsMessage = `**:robot: Crypto Discord Bot Supported Symbols**\n\n${Object.keys(SupportedSymbols).join(', ')}`;
    await interaction.reply({ content: symbolsMessage, flags: MessageFlags.Ephemeral });
} 