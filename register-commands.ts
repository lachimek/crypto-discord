import { SlashCommandBuilder, REST, Routes, Client } from 'discord.js';

// Define slash commands
const commands = [
    new SlashCommandBuilder()
        .setName('c-add')
        .setDescription('Add a new cryptocurrency purchase to your portfolio')
        .addStringOption(option =>
            option.setName('symbol')
                .setDescription('Cryptocurrency symbol (e.g., BTC, ETH, ADA)')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('total_spent')
                .setDescription('Total amount spent in USD')
                .setRequired(true)
                .setMinValue(0.01))
        .addNumberOption(option =>
            option.setName('quantity')
                .setDescription('Number of coins received')
                .setRequired(true)
                .setMinValue(0.0001)),
    new SlashCommandBuilder()
        .setName('c-status')
        .setDescription('Display your current portfolio with average buy prices'),
    new SlashCommandBuilder()
        .setName('c-help')
        .setDescription('Show help message with all available commands'),
    new SlashCommandBuilder()
        .setName('c-symbols')
        .setDescription('Show all supported symbols')
];

// Register slash commands
export async function registerCommands(client: Client): Promise<void> {
    try {
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
        
        console.log('Started refreshing application (/) commands.');
        
        await rest.put(
            Routes.applicationCommands(client.user!.id),
            { body: commands },
        );
        
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('Error registering commands:', error);
    }
}