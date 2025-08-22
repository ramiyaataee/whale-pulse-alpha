import { Activity, Zap, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SignalData {
  type: string;
  strength: number;
  confidence: string;
  trend: "bullish" | "bearish" | "neutral";
  lastUpdate: string;
}

const mockSignals: SignalData[] = [
  {
    type: "Volume Spike",
    strength: 85,
    confidence: "High",
    trend: "bullish",
    lastUpdate: "2m ago"
  },
  {
    type: "Whale Activity",
    strength: 72,
    confidence: "Medium",
    trend: "bullish",
    lastUpdate: "1m ago"
  },
  {
    type: "Price Momentum",
    strength: 45,
    confidence: "Low",
    trend: "neutral",
    lastUpdate: "5m ago"
  },
  {
    type: "Order Imbalance",
    strength: 63,
    confidence: "Medium",
    trend: "bearish",
    lastUpdate: "3m ago"
  }
];

const SignalStrength = () => {
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "bullish": return "text-bullish";
      case "bearish": return "text-bearish";
      default: return "text-muted-foreground";
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 70) return "bg-bearish";
    if (strength >= 40) return "bg-whale-primary";
    return "bg-bullish";
  };

  return (
    <Card className="bg-gradient-card border border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center animate-glow-pulse">
            <Zap className="w-3 h-3 text-white" />
          </div>
          Signal Strength
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mockSignals.map((signal, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{signal.type}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className={`w-3 h-3 ${getTrendColor(signal.trend)}`} />
                  <span className="text-muted-foreground">{signal.lastUpdate}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Strength</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{signal.strength}%</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      signal.confidence === 'High' 
                        ? 'bg-bearish/20 text-bearish' 
                        : signal.confidence === 'Medium'
                        ? 'bg-whale-primary/20 text-whale-primary'
                        : 'bg-bullish/20 text-bullish'
                    }`}>
                      {signal.confidence}
                    </span>
                  </div>
                </div>
                
                <Progress 
                  value={signal.strength} 
                  className="h-2 bg-background/50"
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-border/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Market Sentiment</span>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-bullish" />
              <span className="font-medium text-bullish">Bullish</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignalStrength;