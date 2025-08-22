import { CheckCircle, AlertCircle, Clock, Server, Wifi, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SystemMetrics {
  component: string;
  status: "online" | "warning" | "offline";
  latency: number;
  lastUpdate: string;
  details?: string;
}

const systemMetrics: SystemMetrics[] = [
  {
    component: "Binance WebSocket",
    status: "online",
    latency: 23,
    lastUpdate: "1s ago",
    details: "Real-time data flowing"
  },
  {
    component: "Bybit API",
    status: "online", 
    latency: 45,
    lastUpdate: "2s ago",
    details: "Backup source active"
  },
  {
    component: "Whale Detector",
    status: "online",
    latency: 12,
    lastUpdate: "1s ago",
    details: "Processing 247 tx/min"
  },
  {
    component: "Signal Engine",
    status: "warning",
    latency: 78,
    lastUpdate: "15s ago",
    details: "High load detected"
  },
  {
    component: "Storage System",
    status: "online",
    latency: 8,
    lastUpdate: "1s ago",
    details: "98.7% capacity"
  }
];

const SystemStatus = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online": return <CheckCircle className="w-4 h-4 text-bullish" />;
      case "warning": return <AlertCircle className="w-4 h-4 text-whale-primary" />;
      case "offline": return <AlertCircle className="w-4 h-4 text-bearish" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "text-bullish";
      case "warning": return "text-whale-primary";
      case "offline": return "text-bearish";
      default: return "text-muted-foreground";
    }
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 30) return "text-bullish";
    if (latency < 60) return "text-whale-primary";
    return "text-bearish";
  };

  const getComponentIcon = (component: string) => {
    if (component.includes("WebSocket") || component.includes("API")) {
      return <Wifi className="w-4 h-4" />;
    }
    if (component.includes("Storage")) {
      return <Database className="w-4 h-4" />;
    }
    return <Server className="w-4 h-4" />;
  };

  return (
    <Card className="bg-gradient-card border border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
            <Server className="w-3 h-3 text-white" />
          </div>
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {systemMetrics.map((metric, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border border-border/20 bg-background/20 hover:bg-background/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-muted-foreground">
                  {getComponentIcon(metric.component)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{metric.component}</span>
                    {getStatusIcon(metric.status)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {metric.details}
                  </div>
                </div>
              </div>
              
              <div className="text-right space-y-1">
                <div className={`text-sm font-medium ${getLatencyColor(metric.latency)}`}>
                  {metric.latency}ms
                </div>
                <div className="text-xs text-muted-foreground">
                  {metric.lastUpdate}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-border/30">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-lg font-bold text-bullish">99.8%</div>
              <div className="text-xs text-muted-foreground">Uptime</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-whale-primary">34ms</div>
              <div className="text-xs text-muted-foreground">Avg Latency</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-foreground">5.2M</div>
              <div className="text-xs text-muted-foreground">Events/24h</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatus;