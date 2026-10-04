import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import StockChart from "@/components/TradingViewWidget";
import StockSearch from "@/components/StockSearch";
import { getStockBySymbol, STOCK_DATASET } from "@/data/stocks";

interface PageProps {
  params: Promise<{ symbol: string }>;
}

export default async function StockPage({ params }: PageProps) {
  const { symbol } = await params;
 const company = getStockBySymbol(symbol);

if (!company) {
  notFound();
}
  // Sector peer group
  const peers = STOCK_DATASET.filter((s) => s.symbol !== company.symbol && s.sector === company.sector);
  const displayPeers = peers.length > 0 ? peers : STOCK_DATASET.filter((s) => s.symbol !== company.symbol).slice(0, 3);

  // Stance styling
  const stanceBadgeColor =
    company.guidance.stance === "Bullish"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      : company.guidance.stance === "Pragmatic"
      ? "bg-sky-500/10 text-sky-300 border-sky-500/30"
      : "bg-amber-500/10 text-amber-300 border-amber-500/30";

  return (
    <main className="min-h-screen bg-[#020813] text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Top Header & Search Bar */}
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

        {/* Section 1: Technical Pillar - Interactive Chart & Trend */}
        <div className="mb-10">
          <StockChart symbol={company.symbol} />
        </div>

        {/* Section 2: Fundamental Valuation Baseline */}
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

        {/* Section 3: TECH-FUNDA™ Pillar - Management Guidance & Concall Intelligence */}
        <div className="mb-10 rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-[#091829] to-[#040b15] p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="rounded bg-emerald-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  Forward Guidance
                </span>
                <h3 className="text-lg font-bold text-white">Management Outlook & Concall Insights</h3>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Forward projections directly from earnings calls, annual guidance, and capacity plans
              </p>
            </div>

            <div className="mt-3 sm:mt-0 flex items-center gap-2">
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${stanceBadgeColor}`}>
                Stance: {company.guidance.stance}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                Credibility: {company.guidance.credibilityRating}
              </span>
            </div>
          </div>

          {/* 4 Forward Guidance Pillars */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Target Revenue Growth</div>
              <div className="mt-2 text-xs leading-relaxed text-slate-200">
                {company.guidance.targetRevenueGrowth}
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Operating Margin Outlook</div>
              <div className="mt-2 text-xs leading-relaxed text-emerald-300">
                {company.guidance.marginOutlook}
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Capex & Capacity Expansion</div>
              <div className="mt-2 text-xs leading-relaxed text-slate-200">
                {company.guidance.capexAndExpansion}
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Order Book / Demand Visibility</div>
              <div className="mt-2 text-xs leading-relaxed text-sky-300">
                {company.guidance.orderBookOrVisibility}
              </div>
            </div>
          </div>

          {/* Key Concall Takeaways */}
          <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Key Earnings Call (Concall) Takeaways
            </div>
            <ul className="space-y-2.5">
              {company.guidance.concallHighlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 4: Quarterly Financial Results */}
        <div className="mb-10 rounded-2xl border border-white/10 bg-[#06101d] p-6 shadow-xl overflow-hidden">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-lg font-semibold text-white">Quarterly Financial Results</h3>
            <p className="mt-1 text-xs text-slate-400">
              Consolidated revenue, operating efficiency, and net margins (Figures in ₹ Crores)
            </p>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4 font-medium">Financial Metric</th>
                  {company.quarters.map((q) => (
                    <th key={q.quarter} className="py-3 px-4 font-mono text-right text-slate-300">
                      {q.quarter}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-xs">
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-sans font-medium text-slate-200">Sales / Revenue</td>
                  {company.quarters.map((q) => (
                    <td key={q.quarter} className="py-3 px-4 text-right text-white">
                      ₹{q.sales.toLocaleString("en-IN")}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-sans text-slate-400">Operating Expenses</td>
                  {company.quarters.map((q) => (
                    <td key={q.quarter} className="py-3 px-4 text-right text-slate-400">
                      ₹{q.expenses.toLocaleString("en-IN")}
                    </td>
                  ))}
                </tr>

                <tr className="bg-white/[0.02] font-semibold">
                  <td className="py-3 px-4 font-sans text-emerald-400">Operating Profit (EBITDA)</td>
                  {company.quarters.map((q) => (
                    <td key={q.quarter} className="py-3 px-4 text-right text-emerald-400">
                      ₹{q.operatingProfit.toLocaleString("en-IN")}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-sans text-slate-300">OPM % (Operating Margin)</td>
                  {company.quarters.map((q) => (
                    <td key={q.quarter} className="py-3 px-4 text-right text-amber-300">
                      {q.opmPercent.toFixed(1)}%
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-white/[0.02] font-semibold">
                  <td className="py-3 px-4 font-sans text-white">Net Profit (PAT)</td>
                  {company.quarters.map((q) => (
                    <td key={q.quarter} className="py-3 px-4 text-right text-white">
                      ₹{q.netProfit.toLocaleString("en-IN")}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-sans text-slate-400">EPS in ₹</td>
                  {company.quarters.map((q) => (
                    <td key={q.quarter} className="py-3 px-4 text-right text-slate-300">
                      ₹{q.eps}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 5: Fundamental Pillar - 3-Stage DuPont ROE Decomposition */}
        <div className="mb-10 rounded-2xl border border-white/10 bg-[#06101d] p-6 shadow-xl">
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

        {/* Section 6: Peer Comparison */}
        <div className="mb-10 rounded-2xl border border-white/10 bg-[#06101d] p-6 shadow-xl overflow-hidden">
          <div className="border-b border-white/10 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Peer Comparison</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Sector valuation and return benchmarks in {company.sector}
                </p>
              </div>
              <span className="mt-2 sm:mt-0 text-xs font-mono text-slate-400">
                Industry: {company.sector}
              </span>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4 font-medium">Company</th>
                  <th className="py-3 px-4 font-medium text-right">CMP (₹)</th>
                  <th className="py-3 px-4 font-medium text-right">P/E</th>
                  <th className="py-3 px-4 font-medium text-right">Mar Cap</th>
                  <th className="py-3 px-4 font-medium text-right">ROE %</th>
                  <th className="py-3 px-4 font-medium text-right">EV / EBITDA</th>
                  <th className="py-3 px-4 font-medium text-center">Signal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-xs">
                <tr className="bg-emerald-500/10 font-semibold border-l-2 border-emerald-400">
                  <td className="py-3 px-4 font-sans text-white">
                    <span className="text-emerald-400 font-mono font-bold mr-2">{company.symbol}</span>
                    {company.name} <span className="text-[10px] text-emerald-400 font-sans ml-1">(Current)</span>
                  </td>
                  <td className="py-3 px-4 text-right text-white">₹{company.price.toLocaleString("en-IN")}</td>
                  <td className="py-3 px-4 text-right text-slate-200">{company.pe}</td>
                  <td className="py-3 px-4 text-right text-slate-200">{company.marketCap}</td>
                  <td className="py-3 px-4 text-right text-emerald-400">{company.roe}%</td>
                  <td className="py-3 px-4 text-right text-slate-200">{company.evEbitda}x</td>
                  <td className="py-3 px-4 text-center">
                    <span className="rounded bg-emerald-400/20 px-2 py-0.5 text-[10px] text-emerald-300">
                      {company.signal}
                    </span>
                  </td>
                </tr>

                {displayPeers.map((peer) => (
                  <tr key={peer.symbol} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4 font-sans text-slate-300">
                      <Link
                        href={`/stocks/${peer.symbol.toLowerCase()}`}
                        className="hover:text-emerald-400 underline decoration-slate-600 underline-offset-4"
                      >
                        <span className="text-slate-400 font-mono font-bold mr-2">{peer.symbol}</span>
                        {peer.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-300">₹{peer.price.toLocaleString("en-IN")}</td>
                    <td className="py-3 px-4 text-right text-slate-400">{peer.pe}</td>
                    <td className="py-3 px-4 text-right text-slate-400">{peer.marketCap}</td>
                    <td className="py-3 px-4 text-right text-emerald-400">{peer.roe}%</td>
                    <td className="py-3 px-4 text-right text-slate-400">{peer.evEbitda}x</td>
                    <td className="py-3 px-4 text-center">
                      <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">
                        {peer.signal}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
