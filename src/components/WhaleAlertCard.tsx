import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WhaleAlert } from "@/services/whaleDetector";
import { TrendingUp, TrendingDown, Volume, Clock } from "lucide-react";

interface WhaleAlertCardProps {
  alert: WhaleAlert;
}

const WhaleAlertCard = ({ alert }: WhaleAlertCardProps) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fa-IR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `${(volume / 1e9).toLocaleString('fa-IR', { maximumFractionDigits: 1 })}B`;
    } else if (volume >= 1e6) {
      return `${(volume / 1e6).toLocaleString('fa-IR', { maximumFractionDigits: 1 })}M`;
    }
    return volume.toLocaleString('fa-IR');
  };

  const isPositive = alert.priceChange > 0;

  return (
    <Card className="bg-gradient-card border border-border/50 shadow-card hover:shadow-glow transition-all duration-300 animate-slide-up">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="text-2xl">🐋</div>
            <div>
              <h3 className="font-bold text-lg">{alert.symbol}</h3>
              <Badge 
                variant={alert.confidence === 'High' ? 'default' : alert.confidence === 'Medium' ? 'secondary' : 'outline'}
                className="text-xs"
              >
                {alert.confidence}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{formatTime(alert.timestamp)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">💰 قیمت:</span>
            <span className="font-bold text-foreground">
              ${alert.price.toLocaleString('fa-IR', { maximumFractionDigits: 4 })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">📈 تغییر قیمت:</span>
            <div className={`flex items-center gap-1 font-semibold ${
              isPositive ? 'text-bullish' : 'text-bearish'
            }`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{isPositive ? '+' : ''}{alert.priceChange.toFixed(2)}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">📊 حجم معاملات:</span>
            <span className="font-medium">{formatVolume(alert.volume)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">🐋 افزایش حجم:</span>
            <div className="flex items-center gap-1">
              <Volume className="w-4 h-4 text-whale-primary" />
              <span className="font-bold text-whale-primary">
                +{alert.volumeIncrease.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {alert.type === 'whale_volume_spike' && (
          <div className="mt-3 p-2 bg-whale-primary/10 rounded-lg border border-whale-primary/20">
            <span className="text-xs text-whale-primary font-medium">
              🟢 هشدار فعالیت نهنگ! 🚀
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhaleAlertCard;