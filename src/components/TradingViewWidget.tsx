"use client";

import type { HistoricalPrice } from "@/lib/market/types";

interface TradingViewWidgetProps {
  symbol: string;
  prices: HistoricalPrice[];
}

export default function StockChart({
  symbol,
  prices,
}: TradingViewWidgetProps) {
  const rawSymbol = symbol.trim().toUpperCase();
const marketSymbol = rawSymbol.replace(/^(NSE:|BSE:)/, "");

  const tradingViewUrl =
   `https://in.tradingview.com/chart/?symbol=BSE:${encodeURIComponent(
      marketSymbol
    )}`;

  if (prices.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#06101d] p-6 shadow-2xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Price Trend & Market Structure
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Verified historical market data
            </p>
          </div>

          <a
            href={tradingViewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-300"
          >
            Open on TradingView ?
          </a>
        </div>

        <div className="mt-6 rounded-xl border border-white/5 bg-[#040c17] px-6 py-16 text-center">
          <p className="text-sm font-semibold text-slate-400">
            Historical market data unavailable
          </p>

          <p className="mt-2 text-xs text-slate-500">
            No estimated or synthetic market prices are displayed.
          </p>
        </div>
      </div>
    );
  }

  const closes = prices.map((price) => price.close);

  const minPrice = Math.min(...closes);
  const maxPrice = Math.max(...closes);

  const priceRange =
    maxPrice - minPrice || Math.max(maxPrice * 0.01, 1);

  const width = 1000;
  const height = 300;

  const paddingLeft = 20;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth =
    width - paddingLeft - paddingRight;

  const chartHeight =
    height - paddingTop - paddingBottom;

  const getX = (index: number) => {
    if (prices.length === 1) {
      return width / 2;
    }

    return (
      paddingLeft +
      (index / (prices.length - 1)) * chartWidth
    );
  };

  const getY = (price: number) =>
    paddingTop +
    ((maxPrice - price) / priceRange) * chartHeight;

  const linePoints = prices
    .map(
      (price, index) =>
        `${getX(index)},${getY(price.close)}`
    )
    .join(" ");

  const first = prices[0];
  const latest = prices[prices.length - 1];

  const change =
    latest.close - first.close;

  const changePercent =
    first.close !== 0
      ? (change / first.close) * 100
      : 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#06101d] p-6 shadow-2xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold text-white">
              Price Trend & Market Structure
            </h3>

            <span className="rounded border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 font-mono text-xs font-medium text-emerald-400">
              NSE:{marketSymbol}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-400">
            Verified historical closing prices
          </p>
        </div>

        <a
          href={tradingViewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-300 transition hover:border-emerald-400/50 hover:bg-emerald-400/20"
        >
          Open on TradingView ?
        </a>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/5 bg-[#040c17] p-4">
          <div className="text-xs text-slate-500">
            Latest Close
          </div>

          <div className="mt-1 font-mono text-lg font-semibold text-white">
            ?{latest.close.toLocaleString("en-IN")}
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-[#040c17] p-4">
          <div className="text-xs text-slate-500">
            Period Change
          </div>

          <div
            className={`mt-1 font-mono text-lg font-semibold ${
              change >= 0
                ? "text-emerald-400"
                : "text-rose-400"
            }`}
          >
            {change >= 0 ? "+" : ""}
            {changePercent.toFixed(2)}%
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-[#040c17] p-4">
          <div className="text-xs text-slate-500">
            Observations
          </div>

          <div className="mt-1 font-mono text-lg font-semibold text-white">
            {prices.length}
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-white/5 bg-[#040c17] p-3">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full"
          role="img"
          aria-label={`${marketSymbol} historical closing price chart`}
        >
          <line
            x1={paddingLeft}
            y1={paddingTop}
            x2={paddingLeft}
            y2={height - paddingBottom}
            stroke="currentColor"
            className="text-white/10"
          />

          <line
            x1={paddingLeft}
            y1={height - paddingBottom}
            x2={width - paddingRight}
            y2={height - paddingBottom}
            stroke="currentColor"
            className="text-white/10"
          />

          <polyline
            points={linePoints}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="text-emerald-400"
          />

          {prices.map((price, index) => (
            <circle
              key={price.date}
              cx={getX(index)}
              cy={getY(price.close)}
              r="3"
              fill="currentColor"
              className="text-emerald-300"
            />
          ))}

          <text
            x={paddingLeft}
            y={height - 12}
            fill="currentColor"
            className="text-slate-500"
            fontSize="12"
          >
            {first.date}
          </text>

          <text
            x={width - paddingRight}
            y={height - 12}
            textAnchor="end"
            fill="currentColor"
            className="text-slate-500"
            fontSize="12"
          >
            {latest.date}
          </text>

          <text
            x={paddingLeft + 5}
            y={paddingTop + 14}
            fill="currentColor"
            className="text-slate-500"
            fontSize="12"
          >
            ?{maxPrice.toLocaleString("en-IN")}
          </text>

          <text
            x={paddingLeft + 5}
            y={height - paddingBottom - 8}
            fill="currentColor"
            className="text-slate-500"
            fontSize="12"
          >
            ?{minPrice.toLocaleString("en-IN")}
          </text>
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-3 text-xs text-slate-500">
        <span>
          Historical range: {first.date} ? {latest.date}
        </span>

        <span>
          Verified provider data • No synthetic prices
        </span>
      </div>

      <div className="mt-3 text-xs text-slate-500">
        TECH-FUNDA™ Market Analysis • Trend • Momentum • Structure
      </div>
    </div>
  );
}
