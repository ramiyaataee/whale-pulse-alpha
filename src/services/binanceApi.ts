import axios from 'axios';

const BINANCE_BASE_URL = 'https://api.binance.com/api/v3';

export interface BinanceTickerData {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  askPrice: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  whaleActivity: number;
}

class BinanceApiService {
  private async fetchTicker(symbol: string): Promise<BinanceTickerData> {
    try {
      const response = await axios.get(`${BINANCE_BASE_URL}/ticker/24hr`, {
        params: { symbol }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ticker for ${symbol}:`, error);
      throw error;
    }
  }

  private async fetchAllTickers(): Promise<BinanceTickerData[]> {
    try {
      const response = await axios.get(`${BINANCE_BASE_URL}/ticker/24hr`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all tickers:', error);
      throw error;
    }
  }

  async getMarketData(symbols: string[]): Promise<MarketData[]> {
    try {
      const allTickers = await this.fetchAllTickers();
      
      const marketData: MarketData[] = symbols
        .map(symbol => {
          const ticker = allTickers.find(t => t.symbol === symbol);
          if (!ticker) return null;

          // Simulate whale activity based on volume (this would be replaced with real whale detection)
          const volume24h = parseFloat(ticker.quoteVolume);
          const whaleActivity = Math.floor(Math.random() * 15) + Math.floor(volume24h / 1e10);

          return {
            symbol: ticker.symbol,
            price: parseFloat(ticker.lastPrice),
            change24h: parseFloat(ticker.priceChangePercent),
            volume: volume24h,
            whaleActivity: Math.min(whaleActivity, 20)
          };
        })
        .filter((data): data is MarketData => data !== null);

      return marketData;
    } catch (error) {
      console.error('Error processing market data:', error);
      // Return empty array on error to prevent app crash
      return [];
    }
  }

  async getPrice(symbol: string): Promise<number> {
    try {
      const ticker = await this.fetchTicker(symbol);
      return parseFloat(ticker.lastPrice);
    } catch (error) {
      console.error(`Error getting price for ${symbol}:`, error);
      return 0;
    }
  }
}

export const binanceApi = new BinanceApiService();