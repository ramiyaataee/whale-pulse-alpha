import { binanceApi, MarketData } from './binanceApi';

export interface WhaleAlert {
  id: string;
  symbol: string;
  price: number;
  priceChange: number;
  volume: number;
  volumeIncrease: number;
  timestamp: string;
  type: 'whale_volume_spike' | 'whale_price_movement';
  confidence: 'High' | 'Medium' | 'Low';
}

export interface StatusReport {
  timestamp: string;
  markets: {
    symbol: string;
    price: number;
    change: number;
    emoji: string;
    name: string;
  }[];
  alertCount: number;
}

class WhaleDetectionService {
  private previousVolumeData: Map<string, number> = new Map();
  private alerts: WhaleAlert[] = [];
  private lastMarketData: MarketData[] = [];
  private readonly VOLUME_SPIKE_THRESHOLD = 25; // 25% increase
  private readonly HIGH_VOLUME_SPIKE_THRESHOLD = 100; // 100% increase
  private readonly PRICE_MOVEMENT_THRESHOLD = 5; // 5% price change

  private generateAlertId(): string {
    return `whale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateVolumeIncrease(symbol: string, currentVolume: number): number {
    const previousVolume = this.previousVolumeData.get(symbol);
    if (!previousVolume) {
      this.previousVolumeData.set(symbol, currentVolume);
      return 0;
    }

    const increase = ((currentVolume - previousVolume) / previousVolume) * 100;
    this.previousVolumeData.set(symbol, currentVolume);
    return increase;
  }

  private getConfidenceLevel(volumeIncrease: number, priceChange: number): 'High' | 'Medium' | 'Low' {
    if (volumeIncrease > this.HIGH_VOLUME_SPIKE_THRESHOLD && Math.abs(priceChange) > 8) {
      return 'High';
    } else if (volumeIncrease > this.VOLUME_SPIKE_THRESHOLD && Math.abs(priceChange) > 5) {
      return 'Medium';
    }
    return 'Low';
  }

  async detectWhaleActivity(marketData: MarketData[]): Promise<WhaleAlert[]> {
    const newAlerts: WhaleAlert[] = [];
    const now = new Date().toISOString();

    // Store market data for later access
    this.lastMarketData = marketData;

    for (const data of marketData) {
      const volumeIncrease = this.calculateVolumeIncrease(data.symbol, data.volume);
      
      // Detect volume spike whale activity
      if (volumeIncrease > this.VOLUME_SPIKE_THRESHOLD) {
        const alert: WhaleAlert = {
          id: this.generateAlertId(),
          symbol: data.symbol,
          price: data.price,
          priceChange: data.change24h,
          volume: data.volume,
          volumeIncrease,
          timestamp: now,
          type: 'whale_volume_spike',
          confidence: this.getConfidenceLevel(volumeIncrease, data.change24h)
        };
        newAlerts.push(alert);
      }

      // Detect significant price movement with volume
      if (Math.abs(data.change24h) > this.PRICE_MOVEMENT_THRESHOLD && volumeIncrease > 10) {
        const alert: WhaleAlert = {
          id: this.generateAlertId(),
          symbol: data.symbol,
          price: data.price,
          priceChange: data.change24h,
          volume: data.volume,
          volumeIncrease,
          timestamp: now,
          type: 'whale_price_movement',
          confidence: this.getConfidenceLevel(volumeIncrease, data.change24h)
        };
        newAlerts.push(alert);
      }
    }

    // Keep only last 50 alerts
    this.alerts = [...newAlerts, ...this.alerts].slice(0, 50);
    return newAlerts;
  }

  getRecentAlerts(limit: number = 10): WhaleAlert[] {
    return this.alerts.slice(0, limit);
  }

  generateStatusReport(marketData: MarketData[]): StatusReport {
    const cryptoMap: Record<string, { emoji: string; name: string }> = {
      'BTCUSDT': { emoji: '₿', name: 'Bitcoin' },
      'ETHUSDT': { emoji: 'Ξ', name: 'Ethereum' },
      'ADAUSDT': { emoji: '🔵', name: 'Cardano' },
      'SOLUSDT': { emoji: '🟣', name: 'Solana' },
      'XRPUSDT': { emoji: '⨯', name: 'Ripple' },
      'BNBUSDT': { emoji: '🟡', name: 'BNB' },
    };

    return {
      timestamp: new Date().toISOString(),
      markets: marketData.map(data => ({
        symbol: data.symbol,
        price: data.price,
        change: data.change24h,
        emoji: cryptoMap[data.symbol]?.emoji || '🪙',
        name: cryptoMap[data.symbol]?.name || data.symbol.replace('USDT', '')
      })),
      alertCount: this.alerts.length
    };
  }

  clearOldAlerts(): void {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    this.alerts = this.alerts.filter(alert => {
      return new Date(alert.timestamp).getTime() > oneHourAgo;
    });
  }

  getLastMarketData(): MarketData[] {
    return this.lastMarketData;
  }
}

export const whaleDetector = new WhaleDetectionService();
