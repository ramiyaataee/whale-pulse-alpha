import { TrendingUp, TrendingDown, Volume2, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  whaleActivity: number;
}

const mockData: MarketData[] = [
  { symbol: "BTCUSDT", price: 67245.32, change24h: 2.45, volume: 28547000000, whaleActivity: 14 },
  { symbol: "ETHUSDT", price: 3842.17, change24h: -1.23, volume: 15234000000, whaleActivity: 8 },
  { symbol: "BNBUSDT", price: 592.84, change24h: 0.87, volume: 1847000000, whaleActivity: 3 },
  { symbol: "SOLUSDT", price: 178.92, change24h: 4.12, volume: 3456000000, whaleActivity: 6 },
];

const MarketOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {mockData.map((data) => (
        <Card key={data.symbol} className="bg-gradient-card border border-border/50 shadow-card hover:shadow-glow transition-all duration-300 animate-slide-up">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="font-semibold">{data.symbol}</span>
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