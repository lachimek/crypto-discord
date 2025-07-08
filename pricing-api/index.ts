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
        [currency: string]: number;
    };
}

interface PricingResponse {
    symbol: string;
    currentPrice: number;
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
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${supportedSymbolValues.join(',')}&vs_currencies=${currency}`;
    const res = await axios.get(url);
    if (res.status !== 200) {
      throw new Error(`Failed to fetch price from CoinGecko: ${res.statusText}`);
    }
    const data = Object.entries(res.data as CoinGeckoResponse).map(([symbol, price]) => ({
      symbol: Object.keys(SupportedSymbols).find(key => SupportedSymbols[key as keyof typeof SupportedSymbols] === symbol) || symbol,
      currentPrice: price[currency]
    }));

    // Update cache
    Pricing.cache = data;
    Pricing.lastFetch = now;

    return data;
  }
}
