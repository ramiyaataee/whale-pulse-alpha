import { AlertTriangle, TrendingUp, TrendingDown, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WhaleAlert {
  id: string;
  timestamp: string;
  symbol: string;
  type: "large_trade" | "large_order" | "volume_spike";
  side: "buy" | "sell";
  amount: number;
  price: number;
  confidence: "High" | "Medium" | "Low";
}

const mockAlerts: WhaleAlert[] = [
  {
    id: "1",
    timestamp: "2025-08-22T14:32:15Z",
    symbol: "BTCUSDT",
    type: "large_trade",
    side: "buy",
    amount: 2500000,
    price: 67245.32,
    confidence: "High"
  },
  {
    id: "2",
    timestamp: "2025-08-22T14:28:45Z",
    symbol: "ETHUSDT",
    type: "volume_spike",
    side: "sell",
    amount: 1800000,
    price: 3842.17,
    confidence: "Medium"
  },
  {
    id: "3",
    timestamp: "2025-08-22T14:25:12Z",
    symbol: "SOLUSDT",
    type: "large_order",
    side: "buy",
    amount: 890000,
    price: 178.92,
    confidence: "High"
  }
];

const WhaleAlerts = () => {
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "High": return "bg-bearish/20 text-bearish border-bearish/30";
      case "Medium": return "bg-whale-primary/20 text-whale-primary border-whale-primary/30";
      case "Low": return "bg-bullish/20 text-bullish border-bullish/30";
      default: return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "large_trade": return <DollarSign className="w-4 h-4" />;
      case "large_order": return <TrendingUp className="w-4 h-4" />;
      case "volume_spike": return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <Card className="bg-gradient-card border border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-whale rounded-full flex items-center justify-center animate-whale-pulse">
            <AlertTriangle className="w-3 h-3 text-white" />
          </div>
          Whale Alerts
          <Badge variant="secondary" className="ml-auto">Live</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {mockAlerts.map((alert) => (
            <div 
              key={alert.id} 
              className="flex items-center justify-between p-4 rounded-lg border border-border/30 bg-background/30 hover:bg-background/50 transition-colors animate-slide-up"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  alert.side === 'buy' ? 'bg-bullish/20' : 'bg-bearish/20'
                }`}>
                  {getTypeIcon(alert.type)}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{alert.symbol}</span>
                    <div className={`flex items-center gap-1 ${
                      alert.side === 'buy' ? 'text-bullish' : 'text-bearish'
                    }`}>
                      {alert.side === 'buy' ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span className="text-xs uppercase font-medium">{alert.side}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(alert.timestamp)}</span>
                    <span>•</span>
                    <span>${(alert.amount / 1e6).toFixed(2)}M</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right space-y-1">
                <div className="text-sm font-medium">
                  ${alert.price.toLocaleString()}
                </div>
                <Badge className={`text-xs ${getConfidenceColor(alert.confidence)}`}>
                  {alert.confidence}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WhaleAlerts;