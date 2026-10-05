import { getQuarterlyResults } from "@/lib/financials/results";
import { getMarketDataProvider } from "@/lib/market";
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

const provider = getMarketDataProvider();
const quote = await provider.getQuote(company.symbol);
const historyEnd = new Date();

const historyStart = new Date();
historyStart.setFullYear(
  historyStart.getFullYear() - 1
);

const history = await provider.getHistoricalPrices(
  company.symbol,
  historyStart.toISOString().slice(0, 10),
  historyEnd.toISOString().slice(0, 10)
);
const quarterlyResults =
  await getQuarterlyResults(company.symbol);

const latestQuarter =
  quarterlyResults[0] ?? null;

const previousQuarter =
  quarterlyResults[1] ?? null;

const calculateGrowth = (
  current?: number,
  previous?: number
): number | null => {
  if (
    current === undefined ||
    previous === undefined ||
    previous === 0
  ) {
    return null;
  }

  return ((current - previous) / previous) * 100;
};

const revenueGrowth = calculateGrowth(
  latestQuarter?.revenue,
  previousQuarter?.revenue
);

const pbtGrowth = calculateGrowth(
  latestQuarter?.profitBeforeTax,
  previousQuarter?.profitBeforeTax
);

const netProfitGrowth = calculateGrowth(
  latestQuarter?.netProfit,
  previousQuarter?.netProfit
);

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
         <StockChart
  symbol={company.symbol}
  prices={history}
/>
        </div>

        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              Market & Valuation
            </h2>
            <p className="mt-1 text-xs text-slate-400">
             Verified delayed market metrics will be displayed from the Mission Wealth
market-data provider.
            </p>
          </div>

<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
  <div className="rounded-xl border border-white/10 bg-[#06101d] p-4">
    <div className="text-xs text-slate-400">
      Latest EOD Price
    </div>

    {quote ? (
      <>
        <div className="mt-1 font-mono text-base font-semibold text-white">
          ₹{quote.price.toLocaleString("en-IN")}
        </div>

        <div className="mt-1 text-[10px] text-slate-500">
          {quote.source} • {quote.exchange} • EOD
        </div>

        <div className="mt-1 text-[10px] text-slate-600">
          As of {new Date(quote.timestamp).toLocaleDateString("en-IN")}
        </div>
      </>
    ) : (
      <div className="mt-2 text-sm font-semibold text-slate-500">
        Data unavailable
      </div>
    )}
  </div>

  {[
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
    Reported company financial data from verified disclosures.
  </p>

  {latestQuarter ? (
    <div className="mt-5">
      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
        <span className="rounded border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 font-semibold text-emerald-300">
          {latestQuarter.quarter}
        </span>

        <span>{latestQuarter.fiscalYear}</span>
        <span>•</span>
        <span>Period ended {latestQuarter.periodEnd}</span>
      </div>


{previousQuarter && (
  <div className="mb-4 text-xs text-slate-500">
    QoQ comparison vs {previousQuarter.quarter}{" "}
    {previousQuarter.fiscalYear} — period ended{" "}
    {previousQuarter.periodEnd}
  </div>
)}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/5 bg-[#040c17] p-4">
          <div className="text-xs text-slate-500">
            Revenue from Operations
          </div>

          <div className="mt-2 font-mono text-lg font-semibold text-white">
            {latestQuarter.revenue !== undefined
              ? `₹${latestQuarter.revenue.toLocaleString("en-IN")} Cr`
              : "Data unavailable"}
          </div>
{revenueGrowth !== null && (
  <div className="mt-2 text-xs text-slate-400">
    QoQ: {revenueGrowth.toFixed(1)}%
  </div>
)}
        </div>

        <div className="rounded-xl border border-white/5 bg-[#040c17] p-4">
          <div className="text-xs text-slate-500">
            Profit Before Tax
          </div>

          <div className="mt-2 font-mono text-lg font-semibold text-white">
            {latestQuarter.profitBeforeTax !== undefined
              ? `₹${latestQuarter.profitBeforeTax.toLocaleString("en-IN")} Cr`
              : "Data unavailable"}
          </div>
{pbtGrowth !== null && (
  <div className="mt-2 text-xs text-slate-400">
    QoQ: {pbtGrowth.toFixed(1)}%
  </div>
)}
        </div>

        <div className="rounded-xl border border-white/5 bg-[#040c17] p-4">
          <div className="text-xs text-slate-500">
            Net Profit
          </div>

          <div className="mt-2 font-mono text-lg font-semibold text-white">
            {latestQuarter.netProfit !== undefined
              ? `₹${latestQuarter.netProfit.toLocaleString("en-IN")} Cr`
              : "Data unavailable"}
          </div>
{netProfitGrowth !== null && (
  <div className="mt-2 text-xs text-slate-400">
    QoQ: {netProfitGrowth.toFixed(1)}%
  </div>
)}
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-500">
        Source: {latestQuarter.source}
      </div>
    </div>
  ) : (
    <div className="mt-5 rounded-xl border border-white/5 bg-[#040c17] p-8 text-center text-sm text-slate-500">
      Financial statement data unavailable
    </div>
  )}
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