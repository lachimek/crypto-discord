const { Client, GatewayIntentBits, Events } = require('discord.js');
require('dotenv').config();
const { handleCAdd, handleCStatus, handleCHelp } = require('./commands');
const { registerCommands } = require('./register-commands');

// Initialize Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Bot ready event
client.once(Events.ClientReady, () => {
    console.log(`Bot is ready! Logged in as ${client.user.tag}`);
    registerCommands(client);
});

// Interaction event handler for slash commands
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'c-add') {
        await handleCAdd(interaction);
    } else if (commandName === 'c-status') {
        await handleCStatus(interaction);
    } else if (commandName === 'c-help') {
        await handleCHelp(interaction);
    }
});

// Error handling
client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

// Login to Discord
const token = process.env.DISCORD_TOKEN;

if (!token) {
    console.error('? **Error:** DISCORD_TOKEN not found in environment variables.');
    console.log('Please create a .env file with your Discord bot token:');
    console.log('DISCORD_TOKEN=your_bot_token_here');
    process.exit(1);
}

client.login(token);
