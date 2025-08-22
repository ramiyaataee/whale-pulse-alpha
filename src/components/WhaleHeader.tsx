import { Activity, TrendingUp, Zap } from "lucide-react";

const WhaleHeader = () => {
  return (
    <header className="border-b border-border/50 bg-gradient-card backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-whale rounded-lg flex items-center justify-center shadow-whale animate-whale-pulse">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-bullish rounded-full animate-pulse border-2 border-background"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-whale bg-clip-text text-transparent">
                WhalePulse
              </h1>
              <p className="text-sm text-muted-foreground">
                Real-time Whale Activity Monitor
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-background/50 rounded-full border border-border/50">
              <div className="w-2 h-2 bg-bullish rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live</span>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-bullish" />
                <span className="text-foreground/80">24h Whales: 47</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-whale-primary" />
                <span className="text-foreground/80">Active Signals: 12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default WhaleHeader;