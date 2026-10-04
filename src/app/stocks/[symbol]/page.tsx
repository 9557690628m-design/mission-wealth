import { notFound } from "next/navigation";
import StockChart from "@/components/TradingViewWidget";
import StockSearch from "@/components/StockSearch";
import { getStockIdentity } from "@/lib/market/stocks";

interface PageProps {
  params: Promise<{ symbol: string }>;
}

export default async function StockPage({ params }: PageProps) {
  const { symbol } = await params;
  const company = getStockIdentity(symbol);

  if (!company) {
    notFound();
  }

  const exchangeLabel =
    company.nseSymbol && company.bseCode
      ? "NSE / BSE"
      : company.nseSymbol
        ? "NSE"
        : "BSE";

  return (
    <main className="min-h-screen bg-[#020813] text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="mb-10 flex flex-col gap-6 border-b border-white/5 pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {company.name}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="rounded border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 font-mono text-emerald-400">
                {company.symbol}
              </span>

              <span>•</span>
              <span>{exchangeLabel}</span>

              {company.bseCode && (
                <>
                  <span>•</span>
                  <span>BSE: {company.bseCode}</span>
                </>
              )}

              <span>•</span>
              <span>{company.sector}</span>

              {company.industry && (
                <>
                  <span>•</span>
                  <span>{company.industry}</span>
                </>
              )}
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
              Mission Wealth equity research profile for {company.name}.
              Verified market and fundamental data will appear here once the
              production data provider is connected.
            </p>
          </div>

          <div className="w-full lg:w-auto">
            <StockSearch />
          </div>
        </div>

        <div className="mb-10">
          <StockChart symbol={company.symbol} />
        </div>

        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              Market & Valuation
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Verified market metrics will be displayed from the Mission Wealth
              market-data provider.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[
              "Current Market Price",
              "Market Capitalisation",
              "P/E Ratio",
              "Price to Book",
              "EV / EBITDA",
            ].map((label) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-[#06101d] p-4"
              >
                <div className="text-xs text-slate-400">{label}</div>
                <div className="mt-2 text-sm font-semibold text-slate-500">
                  Data unavailable
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-white/10 bg-[#06101d] p-6">
          <h2 className="text-lg font-semibold text-white">
            Quarterly Financial Results
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Verified quarterly revenue, profitability, margins and EPS data
            will be displayed here after the fundamental-data source is
            connected.
          </p>

          <div className="mt-5 rounded-xl border border-white/5 bg-[#040c17] p-8 text-center text-sm text-slate-500">
            Financial statement data unavailable
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-white/10 bg-[#06101d] p-6">
          <h2 className="text-lg font-semibold text-white">
            Management Outlook & Concall Intelligence
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Mission Wealth will publish management commentary only when it can
            be tied to a verified earnings call, investor presentation, annual
            report or company disclosure.
          </p>

          <div className="mt-5 rounded-xl border border-white/5 bg-[#040c17] p-8 text-center text-sm text-slate-500">
            Verified management commentary unavailable
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-white/10 bg-[#06101d] p-6">
          <h2 className="text-lg font-semibold text-white">
            TECH-FUNDA™ Analysis
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Market, Business, Value, Risk and Monitor assessments will be
            generated only from verified source data.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {["Market", "Business", "Value", "Risk", "Monitor"].map(
              (pillar) => (
                <div
                  key={pillar}
                  className="rounded-xl border border-white/5 bg-[#040c17] p-4"
                >
                  <div className="text-sm font-semibold text-white">
                    {pillar}
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    Awaiting verified data
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        <div className="border-t border-white/5 pt-5 text-xs leading-5 text-slate-500">
          Mission Wealth does not display estimated or synthetic financial
          metrics as reported company data.
        </div>
      </div>
    </main>
  );
}