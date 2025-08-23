import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { intelligentWorker, IntelligentAnalysis as IIntelligentAnalysis } from "@/services/intelligentWorker";
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Target } from "lucide-react";

const IntelligentAnalysis = () => {
  const [analysis, setAnalysis] = useState<IIntelligentAnalysis | null>(null);

  useEffect(() => {
    // Get initial analysis
    setAnalysis(intelligentWorker.getLastAnalysis());

    // Subscribe to analysis updates
    intelligentWorker.onAnalysisUpdate((newAnalysis) => {
      setAnalysis(newAnalysis);
    });
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish': return <TrendingUp className="w-4 h-4 text-bullish" />;
      case 'bearish': return <TrendingDown className="w-4 h-4 text-bearish" />;
      default: return <div className="w-4 h-4 bg-muted-foreground rounded-full"></div>;
    }
  };

  const getTrendLabel = (trend: string) => {
    switch (trend) {
      case 'bullish': return 'صعودی';
      case 'bearish': return 'نزولی';
      default: return 'خنثی';
    }
  };

  const getActivityLevel = (level: string) => {
    switch (level) {
      case 'high': return { label: 'بالا', color: 'text-bearish' };
      case 'medium': return { label: 'متوسط', color: 'text-primary' };
      default: return { label: 'پایین', color: 'text-bullish' };
    }
  };

  const getRiskLevel = (level: string) => {
    switch (level) {
      case 'high': return { label: 'بالا', color: 'bg-bearish/20 text-bearish border-bearish/30' };
      case 'medium': return { label: 'متوسط', color: 'bg-primary/20 text-primary border-primary/30' };
      default: return { label: 'پایین', color: 'bg-bullish/20 text-bullish border-bullish/30' };
    }
  };

  const getPredictionIcon = (direction: string) => {
    switch (direction) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getPredictionColor = (direction: string) => {
    switch (direction) {
      case 'up': return 'text-bullish';
      case 'down': return 'text-bearish';
      default: return 'text-muted-foreground';
    }
  };

  if (!analysis) {
    return (
      <Card className="bg-gradient-card border border-border/50 shadow-card">
        <CardContent className="p-6">
          <div className="text-center">
            <Brain className="w-12 h-12 text-whale-primary mx-auto mb-2 animate-glow-pulse" />
            <p className="text-muted-foreground">در حال تحلیل هوشمند بازار...</p>
            <p className="text-xs text-muted-foreground mt-1">
              گماشته هوشمند در حال جمع‌آوری و تحلیل داده‌ها
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Market Overview */}
      <Card className="bg-gradient-card border border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-whale-primary" />
            <span>🧠 تحلیل هوشمند بازار</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Market Trend */}
            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/30">
              <div>
                <div className="text-sm text-muted-foreground">روند بازار</div>
                <div className="flex items-center gap-2 mt-1">
                  {getTrendIcon(analysis.marketTrend)}
                  <span className="font-semibold">{getTrendLabel(analysis.marketTrend)}</span>
                </div>
              </div>
            </div>

            {/* Whale Activity */}
            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/30">
              <div>
                <div className="text-sm text-muted-foreground">فعالیت نهنگ‌ها</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`font-semibold ${getActivityLevel(analysis.whaleActivity).color}`}>
                    {getActivityLevel(analysis.whaleActivity).label}
                  </span>
                </div>
              </div>
            </div>

            {/* Risk Level */}
            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/30">
              <div>
                <div className="text-sm text-muted-foreground">سطح ریسک</div>
                <div className="mt-1">
                  <Badge className={getRiskLevel(analysis.riskLevel).color}>
                    {getRiskLevel(analysis.riskLevel).label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <Card className="bg-gradient-card border border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              <span>💡 پیشنهادات هوشمند</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-background/30 rounded-lg border border-border/20">
                  <AlertTriangle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Predictions */}
      <Card className="bg-gradient-card border border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-whale-accent" />
            <span>🎯 پیش‌بینی‌های کوتاه‌مدت</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {analysis.predictions.map((prediction, index) => (
              <div key={index} className="p-3 bg-background/30 rounded-lg border border-border/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">{prediction.symbol.replace('USDT', '')}</span>
                  <span className="text-lg">{getPredictionIcon(prediction.direction)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${getPredictionColor(prediction.direction)}`}>
                    {prediction.direction === 'up' ? 'صعود' : 
                     prediction.direction === 'down' ? 'نزول' : 'ثبات'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {prediction.confidence}% اطمینان
                  </span>
                </div>
                {/* Confidence Bar */}
                <div className="mt-2 h-1.5 bg-background rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-whale-primary transition-all duration-500"
                    style={{ width: `${prediction.confidence}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntelligentAnalysis;