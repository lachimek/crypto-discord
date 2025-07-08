# Crypto Discord Bot

A Discord bot for tracking cryptocurrency purchases and monitoring portfolio performance. Keep track of your crypto investments with simple commands and get real-time price updates.

## Features

- **Portfolio Tracking**: Add cryptocurrency purchases with symbol, price, and quantity
- **Real-time Price Monitoring**: Get current market prices and percentage changes
- **Average Cost Calculation**: Automatically calculate average buy prices for each coin
- **JSON Storage**: Simple file-based storage (no database required)
- **Easy Commands**: Simple Discord slash commands for all operations

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
Display your current portfolio with average buy prices and percentage changes.

**Output includes:**
- List of all owned cryptocurrencies
- Average buy price for each coin
- Current market price
- Percentage change (profit/loss)
- Total value of each position

### `/c-help`
Show help message with all available commands.

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Discord Bot Token
- CoinGecko API (free, no API key required)

### Installation

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

4. **Invite the bot to your server**
   - Use the OAuth2 URL generator in the Discord Developer Portal
   - Select "bot" scope and "Send Messages" and "Use Slash Commands" permissions
   - Use the generated URL to invite the bot to your server

5. **Run the bot**
   ```bash
   node index.js
   ```

## Project Structure

```
crypto-discord/
??? index.js          # Main bot file
??? package.json      # Dependencies and scripts
??? portfolio.json    # Portfolio data storage
??? .env             # Environment variables (create this)
??? README.md        # This file
```

## Data Storage

The bot uses a simple JSON file (`portfolio.json`) to store portfolio data. Each entry includes:
- Cryptocurrency symbol
- Purchase price
- Quantity purchased
- Purchase date
- User ID (for multi-user support)

## API Integration

The bot uses the **CoinGecko API** to fetch real-time cryptocurrency prices. This API is free and doesn't require an API key, making it perfect for this project.

## Future Enhancements

- [ ] Multi-user support with user-specific portfolios
- [ ] Sell tracking and realized gains/losses
- [ ] Portfolio charts and graphs
- [ ] Price alerts and notifications
- [ ] Historical performance tracking
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Additional commands (/sell, /remove, /portfolio)

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
