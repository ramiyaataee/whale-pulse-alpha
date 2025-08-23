import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { whaleDetector, WhaleAlert } from "@/services/whaleDetector";
import { binanceApi } from "@/services/binanceApi";
import WhaleAlertCard from "./WhaleAlertCard";
import StatusReport from "./StatusReport";
import { AlertTriangle, Activity } from "lucide-react";

const TRACKED_SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "ADAUSDT", "XRPUSDT"];

const WhaleAlerts = () => {
  const [alerts, setAlerts] = useState<WhaleAlert[]>([]);
  const [statusReport, setStatusReport] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    // Subscribe to whale detector updates
    const updateAlertsAndStatus = () => {
      const recentAlerts = whaleDetector.getRecentAlerts(10);
      setAlerts(recentAlerts);
      
      // Get status report from the last analysis
      const marketData = whaleDetector.getLastMarketData();
      if (marketData && marketData.length > 0) {
        const report = whaleDetector.generateStatusReport(marketData);
        setStatusReport(report);
      }
    };

    // Initial update
    updateAlertsAndStatus();
    
    // Update every 30 seconds for UI (worker runs every 5 minutes)
    const interval = setInterval(updateAlertsAndStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Status Report */}
      <StatusReport statusReport={statusReport} />
      
      {/* Whale Alerts */}
      <Card className="bg-gradient-card border border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Activity className="w-6 h-6 text-whale-primary" />
                {isMonitoring && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-bullish rounded-full animate-pulse"></div>
                )}
              </div>
              <span>🐋 هشدارهای نهنگ زنده</span>
            </div>
            <Badge variant="outline" className="bg-whale-primary/10 text-whale-primary border-whale-primary/20">
              {alerts.length} هشدار فعال
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🌊</div>
              <p className="text-muted-foreground">در حال پایش فعالیت نهنگ‌ها...</p>
              <p className="text-xs text-muted-foreground mt-1">
                سیستم به طور زنده بازار را رصد می‌کند
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {alerts.map((alert) => (
                <WhaleAlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WhaleAlerts;