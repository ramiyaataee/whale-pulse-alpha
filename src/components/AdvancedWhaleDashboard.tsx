import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Waves, 
  Activity, 
  Clock, 
  Shield, 
  TrendingUp, 
  TrendingDown,
  Volume2,
  AlertTriangle,
  Wifi,
  WifiOff,
  Filter
} from "lucide-react";

interface WhaleAlert {
  id: string;
  symbol: string;
  emoji: string;
  time: string;
  description: string;
  confidence: number;
  priority: 'بالا' | 'متوسط' | 'پایین';
  type: string;
}

const AdvancedWhaleDashboard = () => {
  const [alerts, setAlerts] = useState<WhaleAlert[]>([
    {
      id: '1',
      symbol: 'BTCUSDT',
      emoji: '₿',
      time: '۸:۰۲:۳۹',
      description: 'فعالیت نهنگ در دفتر سفارشات',
      confidence: 89,
      priority: 'بالا',
      type: 'orderbook'
    },
    {
      id: '2',
      symbol: 'BTCUSDT',
      emoji: '₿',
      time: '۸:۰۲:۳۶',
      description: 'ناهنجاری در نقدینگی شناسایی شد',
      confidence: 73,
      priority: 'پایین',
      type: 'liquidity'
    },
    {
      id: '3',
      symbol: 'ETHUSDT',
      emoji: 'Ξ',
      time: '۸:۰۲:۳۳',
      description: 'ناهنجاری در نقدینگی شناسایی شد',
      confidence: 75,
      priority: 'پایین',
      type: 'liquidity'
    },
    {
      id: '4',
      symbol: 'XRPUSDT',
      emoji: 'XRP',
      time: '۸:۰۲:۳۰',
      description: 'افزایش ناگهانی حجم معاملات شناسایی شد',
      confidence: 84,
      priority: 'متوسط',
      type: 'volume'
    },
    {
      id: '5',
      symbol: 'XRPUSDT',
      emoji: 'XRP',
      time: '۸:۰۲:۲۷',
      description: 'تغییر احساسات بازار',
      confidence: 98,
      priority: 'بالا',
      type: 'sentiment'
    },
    {
      id: '6',
      symbol: 'ADAUSDT',
      emoji: 'ADA',
      time: '۸:۰۲:۲۴',
      description: 'حرکت بزرگ قیمت شناسایی شد',
      confidence: 92,
      priority: 'بالا',
      type: 'price'
    },
    {
      id: '7',
      symbol: 'ADAUSDT',
      emoji: 'ADA',
      time: '۸:۰۲:۲۱',
      description: 'تغییر احساسات بازار',
      confidence: 70,
      priority: 'پایین',
      type: 'sentiment'
    },
    {
      id: '8',
      symbol: 'SOLUSDT',
      emoji: 'SOL',
      time: '۸:۰۲:۱۸',
      description: 'فعالیت نهنگ در دفتر سفارشات',
      confidence: 80,
      priority: 'متوسط',
      type: 'orderbook'
    }
  ]);

  const [activeTime, setActiveTime] = useState(0);
  const [filter, setFilter] = useState<'همه' | 'بالا' | 'متوسط' | 'پایین'>('همه');
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'بالا':
        return 'bg-bearish/20 text-bearish border-bearish/30';
      case 'متوسط':
        return 'bg-whale-primary/20 text-whale-primary border-whale-primary/30';
      case 'پایین':
        return 'bg-bullish/20 text-bullish border-bullish/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const filteredAlerts = filter === 'همه' 
    ? alerts 
    : alerts.filter(alert => alert.priority === filter);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <Waves className="w-8 h-8 text-whale-primary" />
          <h1 className="text-3xl font-bold bg-gradient-whale bg-clip-text text-transparent">
            سیستم تشخیص نهنگ پیشرفته
          </h1>
        </div>
        <p className="text-muted-foreground">
          پایش لحظه‌ای فعالیت نهنگها در بازار ارزهای دیجیتال
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-whale-primary">۲۱۸</div>
            <div className="text-sm text-muted-foreground">کل هشدارها</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-bullish">۶</div>
            <div className="text-sm text-muted-foreground">ارزهای فعال</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">عادی</div>
            <div className="text-sm text-muted-foreground">وضعیت سیستم</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{formatTime(activeTime)}</div>
            <div className="text-sm text-muted-foreground">زمان فعال</div>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Connection Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gradient-card border border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              نمودار فعالیت هشدارها
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-muted/10 rounded-lg flex items-center justify-center">
              <div className="text-muted-foreground text-sm">نمودار فعالیت</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">وضعیت اتصال</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">اتصال به سرور:</span>
              <div className="flex items-center gap-2">
                {connected ? (
                  <Wifi className="w-4 h-4 text-bullish" />
                ) : (
                  <WifiOff className="w-4 h-4 text-bearish" />
                )}
                <span className={connected ? 'text-bullish' : 'text-bearish'}>
                  {connected ? 'متصل' : 'قطع'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">آخرین هشدار:</span>
              <span className="text-sm font-medium">۸:۰۲:۳۹</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">سرعت دریافت داده:</span>
              <span className="text-sm font-medium">۳ ثانیه</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card className="bg-gradient-card border border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              هشدارهای فعال
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <div className="flex gap-2">
                {(['همه', 'بالا', 'متوسط', 'پایین'] as const).map((f) => (
                  <Button
                    key={f}
                    variant={filter === f ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(f)}
                    className="text-xs"
                  >
                    {f}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredAlerts.map((alert, index) => (
              <div key={alert.id}>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors">
                  <div className="text-2xl font-bold text-whale-primary">
                    {alert.emoji}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{alert.symbol}</span>
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">اطمینان:</span>
                      <span className="text-xs font-medium">{alert.confidence}%</span>
                    </div>
                  </div>
                  
                  <Badge className={`${getPriorityColor(alert.priority)} border`}>
                    {alert.priority}
                  </Badge>
                </div>
                {index < filteredAlerts.length - 1 && (
                  <Separator className="my-2 opacity-30" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedWhaleDashboard;