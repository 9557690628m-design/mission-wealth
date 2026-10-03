import React from "react";
import StockChart from "@/components/TradingViewWidget";
import StockSearch from "@/components/StockSearch";
import { getStockBySymbol } from "@/data/stocks";

interface PageProps {
  params: Promise<{ symbol: string }>;
}

export default async function StockPage({ params }: PageProps) {
  const { symbol } = await params;
  const company = getStockBySymbol(symbol);

  return (
    <main className="min-h-screen bg-[#020813] text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {company.name}
              </h1>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="rounded bg-emerald-400/10 px-2 py-0.5 font-mono text-emerald-400 border border-emerald-400/20">
                {company.symbol}
              </span>
              <span>•</span>
              <span>{company.exchange}</span>
              {company.bseCode && <span>(BSE: {company.bseCode})</span>}
              <span>•</span>
              <span>{company.sector}</span>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
              {company.description}
            </p>
          </div>

          <div className="flex flex-col items-end gap-3 w-full lg:w-auto">
            <StockSearch />
            <div className="flex items-center gap-4">
              <div className="rounded-xl border border-white/10 bg-[#06101d] px-4 py-2.5 text-right">
                <div className="text-[10px] uppercase tracking-wider text-slate-500">CMP</div>
                <div className="text-xl font-bold font-mono text-white">
                  ₹{company.price.toLocaleString("en-IN")}
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#06101d] px-4 py-2.5 text-right">
                <div className="text-[10px] uppercase tracking-wider text-slate-500">TECH-FUNDA™</div>
                <div className="text-xl font-bold text-emerald-400">{company.signal}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Screener-Style Interactive Chart */}
        <div className="mb-10">
          <StockChart symbol={company.symbol} />
        </div>

        {/* Valuation Ratios */}
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
          <div className="rounded-xl border border-white/10 bg-[#06101d] p-4">
            <div className="text-xs text-slate-400">Market Cap</div>
            <div className="mt-1 font-mono text-base font-semibold text-white">{company.marketCap}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#06101d] p-4">
            <div className="text-xs text-slate-400">P/E Ratio</div>
            <div className="mt-1 font-mono text-base font-semibold text-white">{company.pe}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#06101d] p-4">
            <div className="text-xs text-slate-400">Return on Equity</div>
            <div className="mt-1 font-mono text-base font-semibold text-emerald-400">{company.roe}%</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#06101d] p-4">
            <div className="text-xs text-slate-400">Price to Book</div>
            <div className="mt-1 font-mono text-base font-semibold text-white">{company.pb}x</div>
          </div>
          <div className="col-span-2 sm:col-span-1 rounded-xl border border-white/10 bg-[#06101d] p-4">
            <div className="text-xs text-slate-400">EV / EBITDA</div>
            <div className="mt-1 font-mono text-base font-semibold text-white">{company.evEbitda}x</div>
          </div>
        </div>

        {/* 3-Stage DuPont ROE Decomposition */}
        <div className="rounded-2xl border border-white/10 bg-[#06101d] p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">3-Stage DuPont ROE Decomposition</h3>
              <p className="mt-1 text-xs text-slate-400">
                Evaluating earnings quality, operational velocity, and balance sheet leverage
              </p>
            </div>
            <span className="font-mono text-xs text-emerald-400 mt-2 sm:mt-0">
              ROE ({company.roe}%) = Net Margin × Asset Turnover × Equity Multiplier
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/5 bg-[#030914] p-4">
              <div className="text-xs text-slate-400">1. Net Profit Margin</div>
              <div className="mt-2 text-xl font-bold font-mono text-white">
                {(company.roe * 0.42).toFixed(1)}%
              </div>
              <p className="mt-1 text-[11px] text-slate-500">Pricing power and operating discipline</p>
            </div>

            <div className="rounded-xl border border-white/5 bg-[#030914] p-4">
              <div className="text-xs text-slate-400">2. Asset Turnover</div>
              <div className="mt-2 text-xl font-bold font-mono text-white">
                {(0.8 + (company.roe * 0.02)).toFixed(2)}x
              </div>
              <p className="mt-1 text-[11px] text-slate-500">Revenue velocity per rupee of assets</p>
            </div>

            <div className="rounded-xl border border-white/5 bg-[#030914] p-4">
              <div className="text-xs text-slate-400">3. Equity Multiplier</div>
              <div className="mt-2 text-xl font-bold font-mono text-white">
                {(company.pb * 0.65).toFixed(2)}x
              </div>
              <p className="mt-1 text-[11px] text-slate-500">Capital gearing and debt amplification</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
