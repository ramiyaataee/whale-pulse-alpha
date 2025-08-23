import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusReport as StatusReportType } from "@/services/whaleDetector";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface StatusReportProps {
  statusReport: StatusReportType | null;
}

const StatusReport = ({ statusReport }: StatusReportProps) => {
  if (!statusReport) {
    return (
      <Card className="bg-gradient-card border border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">📊 گزارش وضعیت WhalePulse</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fa-IR', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return price.toLocaleString('fa-IR', { maximumFractionDigits: 0 });
    }
    return price.toLocaleString('fa-IR', { maximumFractionDigits: 4 });
  };

  return (
    <Card className="bg-gradient-card border border-border/50 shadow-card hover:shadow-glow transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>📊 گزارش وضعیت WhalePulse</span>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-bullish rounded-full animate-pulse"></div>
            <span>⏰ {formatTime(statusReport.timestamp)}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {statusReport.markets.map((market) => {
            const isPositive = market.change > 0;
            return (
              <div key={market.symbol} className="flex items-center justify-between py-2 border-b border-border/30 last:border-b-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{isPositive ? '🟢' : '🔴'}</span>
                  <span className="text-lg">{market.emoji}</span>
                  <span className="font-medium">{market.name}:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">
                    ${formatPrice(market.price)}
                  </span>
                  <div className={`flex items-center gap-1 font-semibold ${
                    isPositive ? 'text-bullish' : 'text-bearish'
                  }`}>
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>({isPositive ? '+' : ''}{market.change.toFixed(2)}%)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-border/30">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-whale-primary" />
              <span className="text-muted-foreground">📈 تعداد هشدارها:</span>
            </div>
            <span className="font-bold text-whale-primary">{statusReport.alertCount}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
            <span>🔄 آخرین بروزرسانی:</span>
            <span>{formatTime(statusReport.timestamp)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusReport;