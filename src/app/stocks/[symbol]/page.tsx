import Navbar from "@/components/Navbar";
import StockChart from "@/components/TradingViewWidget";
import StockSearch from "@/components/StockSearch";
import { buildFinancialDerivedMetrics } from "@/lib/financials/calculations";
import { getFinancialPeriodComparison } from "@/lib/financials/periods";
import { getQuarterlyResults } from "@/lib/financials/results";
import { getFinancialSource } from "@/lib/financials/sources";
import {
  getMarketHistory,
  getMarketQuote,
} from "@/lib/market";
import { getStockIdentity } from "@/lib/market/stocks";
import type { QuarterlyResult } from "@/lib/financials/types";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ symbol: string }>;
}

function formatCrores(
  value: number | undefined
): string {
  if (value === undefined) {
    return "Data unavailable";
  }

  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} Cr`;
}

function formatNumber(
  value: number | undefined
): string {
  if (value === undefined) {
    return "Data unavailable";
  }

  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function formatPercent(
  value: number | null | undefined
): string {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "Unavailable";
  }

  const sign = value > 0 ? "+" : "";

  return `${sign}${value.toFixed(1)}%`;
}

function formatDate(
  value: string | undefined
): string {
  if (!value) {
    return "Unavailable";
  }

  const date = new Date(
    `${value.slice(0, 10)}T00:00:00Z`
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function MetricCard({
  label,
  value,
  primaryComparison,
  secondaryComparison,
}: {
  label: string;
  value: string;
  primaryComparison?: string;
  secondaryComparison?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#06101d] p-5">
      <div className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
        {label}
      </div>

      <div className="mt-3 font-mono text-xl font-semibold text-white">
        {value}
      </div>

      {(primaryComparison ||
        secondaryComparison) && (
        <div className="mt-3 space-y-1 text-xs">
          {primaryComparison && (
            <div className="text-slate-400">
              {primaryComparison}
            </div>
          )}

          {secondaryComparison && (
            <div className="text-slate-500">
              {secondaryComparison}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ResultRow({
  result,
}: {
  result: QuarterlyResult;
}) {
  const source = getFinancialSource(
    result.sourceId
  );

  return (
    <tr className="border-b border-white/10 last:border-b-0">
      <td className="whitespace-nowrap px-5 py-4">
        <div className="font-medium text-white">
          {result.quarter ?? "Quarter"}
        </div>

        <div className="mt-1 text-xs text-slate-500">
          {result.fiscalYear ?? ""}
        </div>
      </td>

      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-400">
        {formatDate(result.periodEnd)}
      </td>

      <td className="whitespace-nowrap px-5 py-4 font-mono text-sm text-slate-300">
        {formatCrores(result.revenue)}
      </td>

      <td className="whitespace-nowrap px-5 py-4 font-mono text-sm text-slate-300">
        {formatCrores(
          result.profitBeforeTax
        )}
      </td>

      <td className="whitespace-nowrap px-5 py-4 font-mono text-sm text-slate-300">
        {formatCrores(result.netProfit)}
      </td>

      <td className="whitespace-nowrap px-5 py-4 font-mono text-sm text-slate-400">
        {result.eps !== undefined
          ? `₹${formatNumber(result.eps)}`
          : "Unavailable"}
      </td>

      <td className="min-w-[190px] px-5 py-4">
        <div className="text-sm text-slate-300">
          {source?.name ?? result.source}
        </div>

        {source && (
          <div className="mt-1 text-xs capitalize text-slate-600">
            {source.auditStatus} •{" "}
            {source.reportingBasis}
          </div>
        )}
      </td>
    </tr>
  );
}

export default async function StockPage({
  params,
}: PageProps) {
  const { symbol } = await params;

  const company = getStockIdentity(symbol);

  if (!company) {
    notFound();
  }

  const quoteResult =
    await getMarketQuote(company.symbol);

  const quote = quoteResult.quote;

  const historyEnd = new Date();

  const historyStart = new Date();

  historyStart.setFullYear(
    historyStart.getFullYear() - 1
  );

  const history =
    await getMarketHistory(
      company.symbol,
      historyStart
        .toISOString()
        .slice(0, 10),
      historyEnd.toISOString().slice(0, 10)
    );

  const quarterlyResults =
    await getQuarterlyResults(
      company.symbol
    );

  const {
    current: latestQuarter,
    previousQuarter,
    previousYearQuarter,
  } = getFinancialPeriodComparison(
    quarterlyResults
  );

  const latestQuarterSource =
    getFinancialSource(
      latestQuarter?.sourceId
    );

  const derivedMetrics =
    latestQuarter
      ? buildFinancialDerivedMetrics(
          latestQuarter,
          previousQuarter,
          previousYearQuarter
        )
      : null;

  const exchangeLabel =
    company.nseSymbol &&
    company.bseCode
      ? "NSE / BSE"
      : company.nseSymbol
        ? "NSE"
        : "BSE";

  const hasVerifiedFinancials =
    quarterlyResults.length > 0;

  return (
    <main className="min-h-screen bg-[#020813] text-slate-200">
      <Navbar />

      {/* Company Header */}
      <section className="border-b border-white/10 bg-[#06101d]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  Equity Research
                </span>

                {hasVerifiedFinancials && (
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
                    Verified financial coverage
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                {company.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-400">
                <span className="rounded border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 font-mono font-semibold text-emerald-400">
                  {company.symbol}
                </span>

                <span>{exchangeLabel}</span>

                {company.nseSymbol && (
                  <span>
                    NSE: {company.nseSymbol}
                  </span>
                )}

                {company.bseCode && (
                  <span>
                    BSE: {company.bseCode}
                  </span>
                )}

                <span>{company.sector}</span>

                {company.industry && (
                  <span>
                    {company.industry}
                  </span>
                )}
              </div>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400">
                Mission Wealth research profile
                for {company.name}, structured
                through the TECH-FUNDA™
                framework. Reported financial
                information is displayed only
                when it passes the verified-data
                pipeline.
              </p>
            </div>

            <div className="w-full lg:w-[360px]">
              <StockSearch />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Research Navigation */}
        <div className="mb-10 flex flex-wrap gap-2">
          {[
            ["Market", "#market"],
            ["Financials", "#financials"],
            ["Sources", "#sources"],
            ["TECH-FUNDA™", "#tech-funda"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-slate-400 transition hover:border-emerald-400/30 hover:text-white"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Coverage Summary */}
        <section className="mb-10">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
                Financial Coverage
              </p>

              <div className="mt-3 text-2xl font-semibold text-white">
                {quarterlyResults.length}
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Verified quarterly period
                {quarterlyResults.length === 1
                  ? ""
                  : "s"}{" "}
                currently available.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#06101d] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Market Data
              </p>

              <div className="mt-3 text-lg font-semibold text-white">
                {quoteResult.status ===
                "available"
                  ? "Available"
                  : quoteResult.status ===
                      "stale"
                    ? "Stale"
                    : "Unavailable"}
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Market-data freshness is
                validated before a price is
                shown as current.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#06101d] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Research Standard
              </p>

              <div className="mt-3 text-lg font-semibold text-white">
                Evidence First
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Missing information remains
                unavailable rather than being
                filled with synthetic figures.
              </p>
            </div>
          </div>
        </section>

        {/* Market */}
        <section
          id="market"
          className="mb-12 scroll-mt-24"
        >
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                01 • Market
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-white">
                Price & Market Behaviour
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-6 text-slate-500">
              Delayed end-of-day market data is
              kept separate from reported
              company financials.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#06101d]">
              <StockChart
                symbol={company.symbol}
                prices={history}
              />
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#06101d] p-5">
                <div className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                  Latest EOD Price
                </div>

                {quoteResult.status ===
                  "available" &&
                quote ? (
                  <>
                    <div className="mt-3 font-mono text-3xl font-semibold text-white">
                      ₹
                      {quote.price.toLocaleString(
                        "en-IN"
                      )}
                    </div>

                    <div className="mt-3 text-xs text-slate-400">
                      {quote.source} •{" "}
                      {quote.exchange} •{" "}
                      {quote.isDelayed
                        ? "Delayed"
                        : "Current"}
                    </div>

                    <div className="mt-1 text-xs text-slate-600">
                      As of{" "}
                      {formatDate(
                        quote.timestamp
                      )}
                    </div>
                  </>
                ) : quoteResult.status ===
                  "stale" ? (
                  <>
                    <div className="mt-3 text-lg font-semibold text-amber-300">
                      Market data stale
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      A stale quote is not shown
                      as the current market
                      price.
                    </p>

                    {quoteResult.lastKnownTimestamp && (
                      <div className="mt-2 text-xs text-slate-600">
                        Last known:{" "}
                        {formatDate(
                          quoteResult.lastKnownTimestamp
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="mt-3 text-lg font-semibold text-slate-400">
                      Temporarily unavailable
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      No verified current market
                      quote is available.
                    </p>
                  </>
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
                  <div className="text-xs text-slate-500">
                    {label}
                  </div>

                  <div className="mt-2 text-sm font-semibold text-slate-500">
                    Data unavailable
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Financials */}
        <section
          id="financials"
          className="mb-12 scroll-mt-24"
        >
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              02 • Business
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              Verified Financial Performance
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Financial figures below are
              reported company data accepted
              through the Mission Wealth
              validation layer.
            </p>
          </div>

          {latestQuarter ? (
            <>
              <div className="rounded-2xl border border-white/10 bg-[#06101d] p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                        Latest verified result
                      </span>

                      {latestQuarterSource && (
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs capitalize text-slate-400">
                          {
                            latestQuarterSource.auditStatus
                          }
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 text-2xl font-semibold text-white">
                      {latestQuarter.quarter}{" "}
                      {latestQuarter.fiscalYear}
                    </h3>

                    <p className="mt-2 text-sm text-slate-400">
                      Period ended{" "}
                      {formatDate(
                        latestQuarter.periodEnd
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#040c17] px-4 py-3 text-xs text-slate-500">
                    Reported{" "}
                    {formatDate(
                      latestQuarter.reportedAt
                    )}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <MetricCard
                    label="Revenue from Operations"
                    value={formatCrores(
                      latestQuarter.revenue
                    )}
                    primaryComparison={
                      previousQuarter
                        ? `QoQ: ${formatPercent(
                            derivedMetrics?.revenueQoQGrowth
                          )}`
                        : undefined
                    }
                    secondaryComparison={
                      previousYearQuarter
                        ? `YoY: ${formatPercent(
                            derivedMetrics?.revenueYoYGrowth
                          )}`
                        : undefined
                    }
                  />

                  <MetricCard
                    label="Profit Before Tax"
                    value={formatCrores(
                      latestQuarter.profitBeforeTax
                    )}
                    primaryComparison={
                      previousQuarter
                        ? `QoQ: ${formatPercent(
                            derivedMetrics?.profitBeforeTaxQoQGrowth
                          )}`
                        : undefined
                    }
                    secondaryComparison={
                      previousYearQuarter
                        ? `YoY: ${formatPercent(
                            derivedMetrics?.profitBeforeTaxYoYGrowth
                          )}`
                        : undefined
                    }
                  />

                  <MetricCard
                    label="Net Profit"
                    value={formatCrores(
                      latestQuarter.netProfit
                    )}
                    primaryComparison={
                      previousQuarter
                        ? `QoQ: ${formatPercent(
                            derivedMetrics?.netProfitQoQGrowth
                          )}`
                        : undefined
                    }
                    secondaryComparison={
                      previousYearQuarter
                        ? `YoY: ${formatPercent(
                            derivedMetrics?.netProfitYoYGrowth
                          )}`
                        : undefined
                    }
                  />
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <MetricCard
                    label="PBT Margin"
                    value={formatPercent(
                      derivedMetrics?.profitBeforeTaxMargin
                    )}
                  />

                  <MetricCard
                    label="Net Profit Margin"
                    value={formatPercent(
                      derivedMetrics?.netProfitMargin
                    )}
                  />

                  <MetricCard
                    label="EPS"
                    value={
                      latestQuarter.eps !==
                      undefined
                        ? `₹${formatNumber(
                            latestQuarter.eps
                          )}`
                        : "Data unavailable"
                    }
                  />
                </div>

                {!previousYearQuarter && (
                  <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs leading-6 text-slate-500">
                    YoY comparison is not shown
                    because the exact
                    corresponding prior-year
                    quarter is not yet available
                    in the verified dataset.
                  </div>
                )}
              </div>

              {/* Financial History */}
              <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#06101d]">
                <div className="border-b border-white/10 px-6 py-5">
                  <h3 className="font-semibold text-white">
                    Verified Quarterly History
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Only periods currently
                    present in the verified
                    financial registry are
                    shown.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[980px] text-left">
                    <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-5 py-4 font-medium">
                          Period
                        </th>

                        <th className="px-5 py-4 font-medium">
                          Period End
                        </th>

                        <th className="px-5 py-4 font-medium">
                          Revenue
                        </th>

                        <th className="px-5 py-4 font-medium">
                          PBT
                        </th>

                        <th className="px-5 py-4 font-medium">
                          Net Profit
                        </th>

                        <th className="px-5 py-4 font-medium">
                          EPS
                        </th>

                        <th className="px-5 py-4 font-medium">
                          Source
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {quarterlyResults.map(
                        (result) => (
                          <ResultRow
                            key={`${result.symbol}-${result.periodEnd}`}
                            result={result}
                          />
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#06101d] p-10 text-center">
              <div className="text-lg font-semibold text-white">
                Verified financial data unavailable
              </div>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
                Mission Wealth does not
                substitute missing company
                filings with synthetic or
                estimated financial figures.
              </p>
            </div>
          )}
        </section>

        {/* Sources */}
        <section
          id="sources"
          className="mb-12 scroll-mt-24"
        >
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Evidence
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              Source & Provenance
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Research credibility depends on
              knowing whether information came
              from a company filing, exchange
              disclosure, calculation or
              research interpretation.
            </p>
          </div>

          {quarterlyResults.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {quarterlyResults.map(
                (result) => {
                  const source =
                    getFinancialSource(
                      result.sourceId
                    );

                  return (
                    <div
                      key={result.periodEnd}
                      className="rounded-2xl border border-white/10 bg-[#06101d] p-6"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                          {result.quarter}
                        </span>

                        <span className="text-xs text-slate-500">
                          {result.fiscalYear}
                        </span>
                      </div>

                      <h3 className="mt-4 font-semibold text-white">
                        {source?.name ??
                          result.source}
                      </h3>

                      {source && (
                        <div className="mt-4 grid gap-2 text-xs text-slate-500">
                          <div>
                            Filing date:{" "}
                            {formatDate(
                              source.filingDate
                            )}
                          </div>

                          <div className="capitalize">
                            Reporting basis:{" "}
                            {
                              source.reportingBasis
                            }
                          </div>

                          <div className="capitalize">
                            Audit status:{" "}
                            {source.auditStatus}
                          </div>

                          <div className="capitalize">
                            Source type:{" "}
                            {source.type.replaceAll(
                              "_",
                              " "
                            )}
                          </div>
                        </div>
                      )}

                      {!source && (
                        <p className="mt-4 text-xs leading-6 text-slate-500">
                          Source metadata is not
                          available in the
                          registry.
                        </p>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#06101d] p-8 text-sm text-slate-500">
              No verified financial sources are
              registered for this company.
            </div>
          )}
        </section>

        {/* Management */}
        <section className="mb-12">
          <div className="rounded-2xl border border-white/10 bg-[#06101d] p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Management Intelligence
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              Management Outlook & Commentary
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
              Management statements will be
              published only when they can be
              tied to a verified earnings call,
              investor presentation, annual
              report or company disclosure.
            </p>

            <div className="mt-6 rounded-xl border border-white/10 bg-[#040c17] p-6 text-sm text-slate-500">
              Verified management commentary
              unavailable.
            </div>
          </div>
        </section>

        {/* TECH-FUNDA */}
        <section
          id="tech-funda"
          className="mb-12 scroll-mt-24"
        >
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Research Framework
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              TECH-FUNDA™ Analysis
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Each pillar is populated only
              when the underlying verified data
              is sufficient to support the
              analysis.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-2xl border border-white/10 bg-[#06101d] p-5">
              <div className="text-xs font-bold text-emerald-400">
                01
              </div>

              <h3 className="mt-3 text-lg font-semibold text-white">
                Market
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {quoteResult.status ===
                "available"
                  ? "Verified delayed market data available."
                  : quoteResult.status ===
                      "stale"
                    ? "Latest market data is stale."
                    : "Verified market data unavailable."}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#06101d] p-5">
              <div className="text-xs font-bold text-emerald-400">
                02
              </div>

              <h3 className="mt-3 text-lg font-semibold text-white">
                Business
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {hasVerifiedFinancials
                  ? `${quarterlyResults.length} verified quarterly period${
                      quarterlyResults.length ===
                      1
                        ? ""
                        : "s"
                    } available.`
                  : "Verified financial coverage unavailable."}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#06101d] p-5">
              <div className="text-xs font-bold text-emerald-400">
                03
              </div>

              <h3 className="mt-3 text-lg font-semibold text-white">
                Value
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Verified valuation metrics are
                not yet available.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#06101d] p-5">
              <div className="text-xs font-bold text-emerald-400">
                04
              </div>

              <h3 className="mt-3 text-lg font-semibold text-white">
                Risk
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Structured company-specific risk
                assessment is awaiting verified
                research inputs.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#06101d] p-5">
              <div className="text-xs font-bold text-emerald-400">
                05
              </div>

              <h3 className="mt-3 text-lg font-semibold text-white">
                Monitor
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Quarterly results and market
                availability are tracked as
                verified coverage expands.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Research Discipline
            </p>

            <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">
              A TECH-FUNDA™ conclusion is not
              generated merely because a stock
              exists in the research universe.
              The framework should become more
              complete only as verified market,
              financial, valuation, management
              and risk evidence is added.
            </p>
          </div>
        </section>

        {/* Research Integrity */}
        <section className="mb-10 rounded-2xl border border-white/10 bg-[#06101d] p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Mission Wealth Research Standard
              </p>

              <h2 className="mt-2 text-xl font-semibold text-white">
                Missing data is better than
                misleading data.
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
                Mission Wealth does not display
                estimated or synthetic
                financial metrics as reported
                company facts. Reported facts,
                calculated metrics, management
                statements and research
                interpretation should remain
                distinguishable.
              </p>
            </div>

            <Link
              href="/methodology"
              className="inline-flex rounded-lg border border-emerald-400/20 bg-emerald-400/[0.05] px-5 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/10"
            >
              Research Methodology →
            </Link>
          </div>
        </section>

        <div className="border-t border-white/10 pt-6 text-xs leading-6 text-slate-600">
          Information displayed on this page is
          intended for investment research and
          educational purposes. Availability of
          a company or financial metric does not
          constitute a recommendation to buy or
          sell a security.
        </div>
      </div>
    </main>
  );
}