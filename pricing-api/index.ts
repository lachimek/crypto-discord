import axios from 'axios';

export enum SupportedSymbols {
    BTC = 'bitcoin',
    ETH = 'ethereum',
    ADA = 'cardano',
    DOGE = 'dogecoin',
    SOL = 'solana',
    XRP = 'ripple',
    BNB = 'binancecoin',
    USDT = 'tether',
    USDC = 'usd-coin',
    MATIC = 'matic-network',
    DOT = 'polkadot',
    LTC = 'litecoin',
    AVAX = 'avalanche-2',
    TRX = 'tron',
    LINK = 'chainlink',
    XLM = 'stellar',
    XMR = 'monero',
    ZEC = 'zcash',
    BCH = 'bitcoin-cash',
}

const supportedSymbolValues = Object.values(SupportedSymbols)

interface CoinGeckoResponse {
    [symbol: string]: {
        [key: string]: number | undefined;
    };
}

export interface PricingResponse {
    symbol: string;
    currentPrice: number;
    priceChange24h: number;
}

export interface ProfitLossData {
    currentProfitLoss: number;
    currentProfitLossPercentage: number;
    profitLoss24h: number;
    profitLoss24hPercentage: number;
}

export class Pricing {
  private static cache: PricingResponse[] | null = null;
  private static lastFetch: number = 0;
  private static readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in ms

  static async GetPrices(): Promise<PricingResponse[]> {
    const now = Date.now();
    if (
      Pricing.cache &&
      now - Pricing.lastFetch < Pricing.CACHE_DURATION
    ) {
      console.log("Using cached prices");
      return Pricing.cache;
    }

    const currency = process.env.CURRENCY?.toLowerCase() || 'usd';
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${supportedSymbolValues.join(',')}&vs_currencies=${currency}&include_24hr_change=true`;
    const res = await axios.get(url);
    if (res.status !== 200) {
      throw new Error(`Failed to fetch price from CoinGecko: ${res.statusText}`);
    }
    const data = Object.entries(res.data as CoinGeckoResponse).map(([symbol, priceData]) => ({
      symbol: Object.keys(SupportedSymbols).find(key => SupportedSymbols[key as keyof typeof SupportedSymbols] === symbol) || symbol,
      currentPrice: priceData[currency] || 0,
      priceChange24h: priceData[`${currency}_24h_change`] || 0
    }));

    // Update cache
    Pricing.cache = data;
    Pricing.lastFetch = now;

    return data;
  }

  /**
   * Calculate historical price based on current price and percentage change
   */
  private static calculateHistoricalPrice(currentPrice: number, percentageChange: number | undefined): number | undefined {
    if (percentageChange === undefined) return undefined;
    // If current price changed by X%, then historical price = currentPrice / (1 + percentageChange/100)
    return currentPrice / (1 + percentageChange / 100);
  }

  /**
   * Calculate profit/loss data relative to average buy price
   */
  static calculateProfitLossData(
    priceData: PricingResponse, 
    averageBuyPrice: number, 
    totalQuantity: number
  ): ProfitLossData {
    const currentProfitLoss = (priceData.currentPrice - averageBuyPrice) * totalQuantity;
    const currentProfitLossPercentage = ((priceData.currentPrice - averageBuyPrice) / averageBuyPrice) * 100;

    // Calculate historical price 24 hours ago
    const price24hAgo = this.calculateHistoricalPrice(priceData.currentPrice, priceData.priceChange24h);

    // Calculate profit/loss 24 hours ago
    const profitLoss24h = price24hAgo !== undefined ? (price24hAgo - averageBuyPrice) * totalQuantity : 0;
    
    // Calculate the change in profit/loss over the last 24 hours
    const profitLossChange24h = currentProfitLoss - profitLoss24h;
    const totalInvested = averageBuyPrice * totalQuantity;
    const profitLoss24hPercentage = totalInvested > 0 ? (profitLossChange24h / totalInvested) * 100 : 0;

    return {
      currentProfitLoss,
      currentProfitLossPercentage,
      profitLoss24h: profitLossChange24h, // Changed to represent the change, not the absolute value
      profitLoss24hPercentage
    };
  }
}
