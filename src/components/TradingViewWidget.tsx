"use client";

interface TradingViewWidgetProps {
  symbol: string;
}

export default function StockChart({
  symbol,
}: TradingViewWidgetProps) {
  const rawSymbol = symbol.trim().toUpperCase();
  const nseSymbol = rawSymbol.replace(/^NSE:/, "");

  const tradingViewUrl =
    `https://in.tradingview.com/chart/?symbol=NSE:${encodeURIComponent(
      nseSymbol
    )}`;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#06101d] p-6 shadow-2xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold text-white">
              Price Trend & Market Structure
            </h3>

            <span className="rounded border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 font-mono text-xs font-medium text-emerald-400">
              NSE:{nseSymbol}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-400">
            Historical market data, volume and moving averages
          </p>
        </div>

        <a
          href={tradingViewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-300 transition hover:border-emerald-400/50 hover:bg-emerald-400/20"
        >
          Open on TradingView
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="mt-6 flex min-h-64 items-center justify-center rounded-xl border border-white/5 bg-[#040c17] px-6 py-12 text-center">
        <div className="max-w-lg">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
            ↗
          </div>

          <h4 className="text-sm font-semibold text-white">
            Historical market data coming soon
          </h4>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Mission Wealth will display verified price history, volume,
            50-day moving average and 200-day moving average once the
            production market-data provider is connected.
          </p>

          <p className="mt-3 text-xs text-slate-500">
            No estimated or synthetic market prices are displayed.
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-white/5 pt-3 text-xs text-slate-500">
        TECH-FUNDA™ Market Analysis • Trend • Momentum • Structure
      </div>
    </div>
  );
}