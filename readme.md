# Crypto Discord Bot

A Discord bot for tracking cryptocurrency purchases and monitoring portfolio performance. Keep track of your crypto investments with simple commands and get real-time price updates.

## Features

- **Portfolio Tracking**: Add cryptocurrency purchases with symbol, price, and quantity
- **Real-time Price Monitoring**: Get current market prices and percentage changes
- **Average Cost Calculation**: Automatically calculate average buy prices for each coin
- **JSON Storage**: Simple file-based storage (no database required)
- **Easy Commands**: Simple Discord slash commands for all operations
- **Docker Support**: Easy deployment with Docker and Docker Compose

## Commands

### `/c-add {symbol} {total_spent} {quantity}`
Add a new cryptocurrency purchase to your portfolio.

**Parameters:**
- `symbol`: Cryptocurrency symbol (e.g., BTC, ETH, ADA)
- `total_spent`: Total amount spent in USD
- `quantity`: Number of coins received

**Example:**
```
/c-add BTC 500 0.002
/c-add ETH 3200 2.5
/c-add ADA 1200 1000
```

### `/c-status`
Display your current portfolio with detailed performance metrics and profit/loss calculations.

**Output includes:**
- List of all owned cryptocurrencies (sorted by total value)
- Average buy price for each coin
- Current market price
- Profit/Loss amount and percentage for each coin
- Total quantity held for each coin
- Total amount invested in each coin
- Current total holdings value for each coin
- Grand totals across all holdings:
  - Total portfolio value
  - Total amount invested
  - Overall profit/loss amount and percentage

**Example output:**
```
📊 Your Portfolio Status

BTC
Average Buy Price: $ 45,000.00
Current Price: $ 48,500.00
Profit/Loss: +$ 175.00 (+7.78%)
Total Quantity: 0.01000000
Total Invested: $ 450.00
Total Holdings: $ 485.00

---

ETH
Average Buy Price: $ 3,200.00
Current Price: $ 3,150.00
Profit/Loss: -$ 125.00 (-3.91%)
Total Quantity: 2.50000000
Total Invested: $ 8,000.00
Total Holdings: $ 7,875.00

Grand Total Holdings: $ 8,360.00
Grand Total Invested: $ 8,450.00
Grand Total Profit/Loss: -$ 90.00 (-1.07%)
```

### `/c-symbols`
Display all supported cryptocurrency symbols that can be used with the bot.

**Output includes:**
- Complete list of supported cryptocurrency symbols
- Useful for checking which coins are available for tracking

### `/c-help`
Show help message with all available commands.

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher) OR Docker and Docker Compose
- Discord Bot Token
- CoinGecko API (free, no API key required)

### Option 1: Local Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crypto-discord
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the bot**
   - Create a Discord application at [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a bot and copy the token
   - Create a `.env` file in the project root:
     ```
     DISCORD_TOKEN=your_discord_bot_token_here
     ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Invite the bot to your server**
   - Use the OAuth2 URL generator in the Discord Developer Portal
   - Select "bot" scope and "Send Messages" and "Use Slash Commands" permissions
   - Use the generated URL to invite the bot to your server

6. **Run the bot**
   ```bash
   npm start
   ```

### Option 2: Docker Installation (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crypto-discord
   ```

2. **Configure the bot**
   - Create a Discord application at [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a bot and copy the token
   - Create a `.env` file in the project root:
     ```
     DISCORD_TOKEN=your_discord_bot_token_here
     ```

3. **Invite the bot to your server**
   - Use the OAuth2 URL generator in the Discord Developer Portal
   - Select "bot" scope and "Send Messages" and "Use Slash Commands" permissions
   - Use the generated URL to invite the bot to your server

4. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

   The bot will automatically:
   - Build the Docker image
   - Start the container in the background
   - Restart automatically if it crashes
   - Persist portfolio data in `portfolio.json`

5. **View logs**
   ```bash
   docker-compose logs -f
   ```

6. **Stop the bot**
   ```bash
   docker-compose down
   ```

## Project Structure

```
crypto-discord/
├── commands/           # Discord slash commands
│   ├── c-add.ts       # Add cryptocurrency purchase
│   ├── c-help.ts      # Help command
│   ├── c-status.ts    # Portfolio status
│   ├── c-symbols.ts   # Supported symbols
│   └── index.ts       # Command exports
├── pricing-api/        # Price fetching logic
│   └── index.ts       # CoinGecko API integration
├── dist/              # Compiled JavaScript (generated)
├── index.ts           # Main bot file
├── persistence.ts     # Portfolio data management
├── types.d.ts         # TypeScript type definitions
├── utils.ts           # Utility functions
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript configuration
├── portfolio.json     # Portfolio data storage
├── .env              # Environment variables (create this)
├── Dockerfile        # Docker image configuration
├── docker-compose.yml # Docker Compose configuration
└── README.md         # This file
```

## Data Storage

The bot uses a simple JSON file (`portfolio.json`) to store portfolio data. Each entry includes:
- Cryptocurrency symbol
- Purchase price
- Quantity purchased
- Purchase date
- User ID (for multi-user support)

**Note**: When using Docker, the `portfolio.json` file is mounted as a volume to persist data between container restarts.

## API Integration

The bot uses the **CoinGecko API** to fetch real-time cryptocurrency prices. This API is free and doesn't require an API key, making it perfect for this project.

## Development

### Local Development
```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev:watch

# Build for production
npm run build
```

### Docker Development
```bash
# Build and run in development mode
docker-compose up --build

# View logs
docker-compose logs -f

# Stop and remove containers
docker-compose down
```

## Future Enhancements

- [ ] Portfolio charts and graphs
- [ ] Price alerts and notifications
- [ ] Historical performance tracking
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Option to remove last added position

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.

---

**Note**: This bot is for educational and personal use. Always do your own research before making cryptocurrency investments. The bot is not financial advice.
