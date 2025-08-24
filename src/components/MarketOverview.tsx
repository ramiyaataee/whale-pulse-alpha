import { TrendingUp, TrendingDown, Volume2, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { binanceApi, MarketData } from "@/services/binanceApi";

const TRACKED_SYMBOLS = ["BTCUSDT", "ETHUSDT", "ADAUSDT", "SOLUSDT"];

const MarketOverview = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await binanceApi.getMarketData(TRACKED_SYMBOLS);
        setMarketData(data);
      } catch (err) {
        setError('Failed to fetch market data');
        console.error('Market data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    
    // Update every 10 seconds
    const interval = setInterval(fetchMarketData, 10000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading && marketData.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TRACKED_SYMBOLS.map((symbol) => (
          <Card key={symbol} className="bg-gradient-card border border-border/50 shadow-card animate-pulse">
            <CardHeader className="pb-3">
              <CardTitle className="h-6 bg-muted rounded w-24"></CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-8 bg-muted rounded w-32"></div>
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-4 bg-muted rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error && marketData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-bearish">{error}</p>
        <p className="text-muted-foreground text-sm mt-2">Using Binance public API</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {marketData.map((data) => (
        <Card key={data.symbol} className="bg-gradient-card border border-border/50 shadow-card hover:shadow-glow transition-all duration-300 animate-slide-up">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{data.symbol}</span>
                <div className="w-2 h-2 bg-bullish rounded-full animate-pulse" title="Live data from Binance" />
              </div>
              <div className="flex items-center gap-1">
                {data.whaleActivity > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-whale-primary/20 rounded-full">
                    <div className="w-2 h-2 bg-whale-primary rounded-full animate-pulse" />
                    <span className="text-xs text-whale-primary font-medium">{data.whaleActivity}</span>
                  </div>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-2xl font-bold text-foreground">
                ${data.price.toLocaleString()}
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                data.change24h >= 0 ? 'text-bullish' : 'text-bearish'
              }`}>
                {data.change24h >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(data.change24h)}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Volume2 className="w-4 h-4" />
                <span>Vol</span>
              </div>
              <span>${(data.volume / 1e9).toFixed(2)}B</span>
            </div>
            
            <div className="pt-2 border-t border-border/30">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Whale Activity</span>
                <div className={`px-2 py-1 rounded-full ${
                  data.whaleActivity > 10 
                    ? 'bg-bearish/20 text-bearish' 
                    : data.whaleActivity > 5 
                    ? 'bg-whale-primary/20 text-whale-primary'
                    : 'bg-bullish/20 text-bullish'
                }`}>
                  {data.whaleActivity > 10 ? 'High' : data.whaleActivity > 5 ? 'Medium' : 'Low'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MarketOverview;