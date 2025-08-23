import { binanceApi, MarketData } from './binanceApi';
import { whaleDetector, WhaleAlert } from './whaleDetector';

export interface WorkerStatus {
  isActive: boolean;
  lastUpdate: string;
  nextUpdate: string;
  cycleCount: number;
  totalAlerts: number;
  performance: {
    avgResponseTime: number;
    successRate: number;
    errorCount: number;
  };
}

export interface IntelligentAnalysis {
  marketTrend: 'bullish' | 'bearish' | 'neutral';
  whaleActivity: 'high' | 'medium' | 'low';
  riskLevel: 'high' | 'medium' | 'low';
  recommendations: string[];
  predictions: {
    symbol: string;
    direction: 'up' | 'down' | 'stable';
    confidence: number;
  }[];
}

class IntelligentWorkerService {
  private isActive = false;
  private intervalId: NodeJS.Timeout | null = null;
  private cycleCount = 0;
  private totalAlerts = 0;
  private errorCount = 0;
  private responseTimes: number[] = [];
  private lastAnalysis: IntelligentAnalysis | null = null;
  private statusCallbacks: Array<(status: WorkerStatus) => void> = [];
  private analysisCallbacks: Array<(analysis: IntelligentAnalysis) => void> = [];

  private readonly UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private readonly TRACKED_SYMBOLS = ["BTCUSDT", "ETHUSDT", "nas100_i", "SOLUSDT", "ADAUSDT", "XRPUSDT"];

  start(): void {
    if (this.isActive) {
      console.log('🤖 Intelligent Worker already running');
      return;
    }

    this.isActive = true;
    console.log('🚀 Starting Intelligent Worker - 5-minute cycles');
    
    // Run immediately
    this.executeWorkCycle();
    
    // Set up 5-minute interval
    this.intervalId = setInterval(() => {
      this.executeWorkCycle();
    }, this.UPDATE_INTERVAL);

    this.notifyStatusUpdate();
  }

  stop(): void {
    if (!this.isActive) return;

    this.isActive = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    console.log('⏹️ Intelligent Worker stopped');
    this.notifyStatusUpdate();
  }

  private async executeWorkCycle(): Promise<void> {
    const startTime = Date.now();
    this.cycleCount++;

    try {
      console.log(`🔄 Worker Cycle #${this.cycleCount} - ${new Date().toLocaleTimeString('fa-IR')}`);
      
      // 1. Fetch market data
      const marketData = await binanceApi.getMarketData(this.TRACKED_SYMBOLS);
      
      // 2. Analyze whale activity
      const newAlerts = await whaleDetector.detectWhaleActivity(marketData);
      this.totalAlerts += newAlerts.length;
      
      // 3. Perform intelligent analysis
      const analysis = this.performIntelligentAnalysis(marketData, newAlerts);
      this.lastAnalysis = analysis;
      
      // 4. Clean up old data
      whaleDetector.clearOldAlerts();
      
      // 5. Record performance
      const responseTime = Date.now() - startTime;
      this.responseTimes.push(responseTime);
      if (this.responseTimes.length > 20) {
        this.responseTimes = this.responseTimes.slice(-20);
      }

      console.log(`✅ Cycle completed in ${responseTime}ms - ${newAlerts.length} new alerts`);
      
      // Notify callbacks
      this.notifyStatusUpdate();
      this.notifyAnalysisUpdate(analysis);

    } catch (error) {
      this.errorCount++;
      console.error('❌ Worker cycle failed:', error);
      this.notifyStatusUpdate();
    }
  }

  private performIntelligentAnalysis(marketData: MarketData[], newAlerts: WhaleAlert[]): IntelligentAnalysis {
    // Calculate market trend
    const positiveChanges = marketData.filter(d => d.change24h > 0).length;
    const totalMarkets = marketData.length;
    const bullishRatio = positiveChanges / totalMarkets;
    
    let marketTrend: 'bullish' | 'bearish' | 'neutral';
    if (bullishRatio > 0.6) marketTrend = 'bullish';
    else if (bullishRatio < 0.4) marketTrend = 'bearish';
    else marketTrend = 'neutral';

    // Analyze whale activity
    const highConfidenceAlerts = newAlerts.filter(a => a.confidence === 'High').length;
    let whaleActivity: 'high' | 'medium' | 'low';
    if (highConfidenceAlerts > 2) whaleActivity = 'high';
    else if (newAlerts.length > 0) whaleActivity = 'medium';
    else whaleActivity = 'low';

    // Calculate risk level
    const avgVolatility = marketData.reduce((sum, d) => sum + Math.abs(d.change24h), 0) / marketData.length;
    let riskLevel: 'high' | 'medium' | 'low';
    if (avgVolatility > 10 || whaleActivity === 'high') riskLevel = 'high';
    else if (avgVolatility > 5 || whaleActivity === 'medium') riskLevel = 'medium';
    else riskLevel = 'low';

    // Generate recommendations
    const recommendations: string[] = [];
    if (marketTrend === 'bullish' && whaleActivity === 'high') {
      recommendations.push('فعالیت نهنگ‌ها در روند صعودی - احتمال ادامه صعود');
    }
    if (riskLevel === 'high') {
      recommendations.push('سطح ریسک بالا - مراقب نوسانات شدید باشید');
    }
    if (whaleActivity === 'low' && marketTrend === 'neutral') {
      recommendations.push('بازار آرام - فرصت مناسب برای ورود تدریجی');
    }

    // Generate predictions
    const predictions = marketData.map(data => {
      let direction: 'up' | 'down' | 'stable' = 'stable';
      let confidence = 0.5;

      if (data.change24h > 5 && whaleActivity === 'high') {
        direction = 'up';
        confidence = 0.75;
      } else if (data.change24h < -5 && whaleActivity === 'high') {
        direction = 'down';
        confidence = 0.7;
      } else if (Math.abs(data.change24h) > 3) {
        direction = data.change24h > 0 ? 'up' : 'down';
        confidence = 0.6;
      }

      return {
        symbol: data.symbol,
        direction,
        confidence: Math.round(confidence * 100)
      };
    });

    return {
      marketTrend,
      whaleActivity,
      riskLevel,
      recommendations,
      predictions
    };
  }

  getStatus(): WorkerStatus {
    const now = new Date();
    const nextUpdate = new Date(now.getTime() + this.UPDATE_INTERVAL);
    
    return {
      isActive: this.isActive,
      lastUpdate: now.toISOString(),
      nextUpdate: nextUpdate.toISOString(),
      cycleCount: this.cycleCount,
      totalAlerts: this.totalAlerts,
      performance: {
        avgResponseTime: this.responseTimes.length > 0 
          ? Math.round(this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length)
          : 0,
        successRate: this.cycleCount > 0 
          ? Math.round(((this.cycleCount - this.errorCount) / this.cycleCount) * 100)
          : 0,
        errorCount: this.errorCount
      }
    };
  }

  getLastAnalysis(): IntelligentAnalysis | null {
    return this.lastAnalysis;
  }

  onStatusUpdate(callback: (status: WorkerStatus) => void): void {
    this.statusCallbacks.push(callback);
  }

  onAnalysisUpdate(callback: (analysis: IntelligentAnalysis) => void): void {
    this.analysisCallbacks.push(callback);
  }

  private notifyStatusUpdate(): void {
    const status = this.getStatus();
    this.statusCallbacks.forEach(callback => callback(status));
  }

  private notifyAnalysisUpdate(analysis: IntelligentAnalysis): void {
    this.analysisCallbacks.forEach(callback => callback(analysis));
  }

  reset(): void {
    this.cycleCount = 0;
    this.totalAlerts = 0;
    this.errorCount = 0;
    this.responseTimes = [];
    this.lastAnalysis = null;
    console.log('🔄 Worker statistics reset');
  }
}

export const intelligentWorker = new IntelligentWorkerService();