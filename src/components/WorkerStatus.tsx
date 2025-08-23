import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { intelligentWorker, WorkerStatus as IWorkerStatus } from "@/services/intelligentWorker";
import { Bot, Play, Pause, RotateCcw, TrendingUp, Shield, Zap } from "lucide-react";

const WorkerStatus = () => {
  const [status, setStatus] = useState<IWorkerStatus | null>(null);

  useEffect(() => {
    // Get initial status
    setStatus(intelligentWorker.getStatus());

    // Subscribe to status updates
    intelligentWorker.onStatusUpdate((newStatus) => {
      setStatus(newStatus);
    });

    // Start worker automatically
    intelligentWorker.start();

    return () => {
      intelligentWorker.stop();
    };
  }, []);

  const handleToggleWorker = () => {
    if (status?.isActive) {
      intelligentWorker.stop();
    } else {
      intelligentWorker.start();
    }
  };

  const handleReset = () => {
    intelligentWorker.reset();
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getNextUpdateCountdown = () => {
    if (!status?.nextUpdate) return '--';
    const now = Date.now();
    const nextUpdate = new Date(status.nextUpdate).getTime();
    const diff = Math.max(0, Math.floor((nextUpdate - now) / 1000));
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const [countdown, setCountdown] = useState(getNextUpdateCountdown());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getNextUpdateCountdown());
    }, 1000);

    return () => clearInterval(interval);
  }, [status?.nextUpdate]);

  if (!status) {
    return (
      <Card className="bg-gradient-card border border-border/50 shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-pulse">🤖 در حال راه‌اندازی گماشته هوشمند...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card border border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bot className="w-6 h-6 text-whale-primary" />
              {status.isActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-bullish rounded-full animate-whale-pulse"></div>
              )}
            </div>
            <span>🤖 گماشته هوشمند WhalePulse</span>
          </div>
          <Badge 
            variant={status.isActive ? "default" : "secondary"}
            className={status.isActive 
              ? "bg-bullish/20 text-bullish border-bullish/30" 
              : "bg-muted text-muted-foreground"
            }
          >
            {status.isActive ? "فعال" : "غیرفعال"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Control Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleToggleWorker}
            variant={status.isActive ? "destructive" : "default"}
            size="sm"
            className="flex items-center gap-2"
          >
            {status.isActive ? (
              <>
                <Pause className="w-4 h-4" />
                توقف
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                شروع
              </>
            )}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            ریست
          </Button>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-background/50 rounded-lg border border-border/30">
            <div className="text-lg font-bold text-whale-primary">{status.cycleCount}</div>
            <div className="text-xs text-muted-foreground">چرخه‌ها</div>
          </div>
          
          <div className="text-center p-3 bg-background/50 rounded-lg border border-border/30">
            <div className="text-lg font-bold text-bullish">{status.totalAlerts}</div>
            <div className="text-xs text-muted-foreground">کل هشدارها</div>
          </div>
          
          <div className="text-center p-3 bg-background/50 rounded-lg border border-border/30">
            <div className="text-lg font-bold text-primary">{status.performance.successRate}%</div>
            <div className="text-xs text-muted-foreground">نرخ موفقیت</div>
          </div>
          
          <div className="text-center p-3 bg-background/50 rounded-lg border border-border/30">
            <div className="text-lg font-bold text-whale-accent">{status.performance.avgResponseTime}ms</div>
            <div className="text-xs text-muted-foreground">میانگین پاسخ</div>
          </div>
        </div>

        {/* Timing Information */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">آخرین بروزرسانی:</span>
            <span className="text-sm font-mono">{formatTime(status.lastUpdate)}</span>
          </div>
          
          {status.isActive && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">بروزرسانی بعدی:</span>
              <span className="text-sm font-mono text-whale-primary">{countdown}</span>
            </div>
          )}
        </div>

        {/* Performance Indicators */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-bullish" />
            <span className="text-muted-foreground">پایدار</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-whale-primary" />
            <span className="text-muted-foreground">امن</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-primary" />
            <span className="text-muted-foreground">بهینه‌سازی شده</span>
          </div>
        </div>

        {status.performance.errorCount > 0 && (
          <div className="text-xs text-bearish">
            ⚠️ {status.performance.errorCount} خطا در {status.cycleCount} چرخه
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkerStatus;