import WhaleHeader from "@/components/WhaleHeader";
import MarketOverview from "@/components/MarketOverview";
import WhaleAlerts from "@/components/WhaleAlerts";
import SignalStrength from "@/components/SignalStrength";
import SystemStatus from "@/components/SystemStatus";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-ocean">
      <WhaleHeader />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center py-12">
          <div className="space-y-6">
            <div className="relative inline-block">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-whale bg-clip-text text-transparent animate-glow-pulse">
                Real-Time Whale Detection
              </h1>
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-whale-primary/20 rounded-full animate-whale-pulse"></div>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Monitor large cryptocurrency transactions and market movements with advanced algorithmic detection. 
              Professional-grade analytics for serious traders.
            </p>
            <div className="flex items-center justify-center gap-8 pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-whale-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Live Monitoring</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-bullish">47</div>
                <div className="text-sm text-muted-foreground">Whales Today</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">12</div>
                <div className="text-sm text-muted-foreground">Active Signals</div>
              </div>
            </div>
          </div>
        </section>

        {/* Market Overview */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Market Overview</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-bullish rounded-full animate-pulse"></div>
              <span>Live data from Binance, Bybit</span>
            </div>
          </div>
          <MarketOverview />
        </section>

        {/* Analytics Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <WhaleAlerts />
          </div>
          <div className="space-y-6">
            <SignalStrength />
          </div>
        </section>

        {/* System Monitoring */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">System Health</h2>
          <SystemStatus />
        </section>

        {/* Footer */}
        <footer className="pt-12 pb-6 text-center text-sm text-muted-foreground border-t border-border/30">
          <div className="space-y-2">
            <p>
              WhalePulse - Professional Cryptocurrency Whale Detection System
            </p>
            <p className="text-xs">
              Data sourced from public APIs. Not financial advice. For informational purposes only.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;