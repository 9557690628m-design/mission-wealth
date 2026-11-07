import Navbar from "@/components/Navbar";
import StockChart from "@/components/TradingViewWidget";
import StockSearch from "@/components/StockSearch";
import { getAnnualFinancials } from "@/lib/financials/annual";
import {
  buildAnnualDerivedMetrics,
  buildFinancialDerivedMetrics,
} from "@/lib/financials/calculations";
import { getFinancialPeriodComparison } from "@/lib/financials/periods";
import { getQuarterlyResults } from "@/lib/financials/results";
import { getFinancialSource } from "@/lib/financials/sources";
import { buildTtmFinancials } from "@/lib/financials/ttm";
import type {
  AnnualFinancialStatement,
  QuarterlyResult,
} from "@/lib/financials/types";
import { buildValuationMetrics } from "@/lib/financials/valuation";
import {
  getMarketHistory,
  getMarketQuote,
} from "@/lib/market";
import { resolveStockIdentity } from "@/lib/market/stocks";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ symbol: string }>;
}

function formatCrores(
  value: number | undefined | null
): string {
  if (
    value === undefined ||
    value === null ||
    !Number.isFinite(value)
  ) {
    return "Data unavailable";
  }

  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} Cr`;
}

function formatNumber(
  value: number | undefined | null
): string {
  if (
    value === undefined ||
    value === null ||
    !Number.isFinite(value)
  ) {
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

function formatRatio(
  value: number | null | undefined
): string {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "Unavailable";
  }

  return `${value.toFixed(2)}x`;
}

function formatRupeesPerShare(
  value: number | null | undefined
): string {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "Unavailable";
  }

  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(
  value: string | undefined | null
): string {
  if (!value) {
    return "Unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unavailable";
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
  note,
}: {
  label: string;
  value: string;
  primaryComparison?: string;
  secondaryComparison?: string;
  note?: string;
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

      {note && (
        <p className="mt-3 text-xs leading-5 text-slate-600">
          {note}
        </p>
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

function AnnualResultRow({
  result,
}: {
  result: AnnualFinancialStatement;
}) {
  const source = getFinancialSource(
    result.sourceId
  );

  return (
    <tr className="border-b border-white/10 last:border-b-0">
      <td className="whitespace-nowrap px-5 py-4">
        <div className="font-medium text-white">
          {result.fiscalYear}
        </div>

        <div className="mt-1 text-xs text-slate-500">
          Annual
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

  const company = await resolveStockIdentity(symbol);

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
      historyEnd
        .toISOString()
        .slice(0, 10)
    );

  const quarterlyResults =
    await getQuarterlyResults(
      company.symbol
    );

  const annualResults =
    await getAnnualFinancials(
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

  const quarterlyDerivedMetrics =
    latestQuarter
      ? buildFinancialDerivedMetrics(
          latestQuarter,
          previousQuarter,
          previousYearQuarter
        )
      : null;

  const ttmFinancials =
    buildTtmFinancials(
      quarterlyResults
    );

  const latestAnnual =
    annualResults[0] ?? null;

  const previousAnnual =
    annualResults[1] ?? null;

  const latestAnnualSource =
    getFinancialSource(
      latestAnnual?.sourceId
    );

  const annualDerivedMetrics =
    latestAnnual
      ? buildAnnualDerivedMetrics(
          latestAnnual,
          previousAnnual
        )
      : null;

  const verifiedSharePrice =
    quoteResult.status === "available" &&
    quote
      ? quote.price
      : null;

  const valuationMetrics =
    buildValuationMetrics(
      verifiedSharePrice,
      latestAnnual
    );

  const exchangeLabel =
    company.nseSymbol &&
    company.bseCode
      ? "NSE / BSE"
      : company.nseSymbol
        ? "NSE"
        : "BSE";

  const hasQuarterlyFinancials =
    quarterlyResults.length > 0;

  const hasAnnualFinancials =
    annualResults.length > 0;

  const hasVerifiedFinancials =
    hasQuarterlyFinancials ||
    hasAnnualFinancials;

  return (
    <main className="min-h-screen bg-[#020813] text-slate-200">
      <Navbar />

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
                framework. Reported facts,
                calculated metrics and market
                data remain separate throughout
                the research process.
              </p>
            </div>

            <div className="w-full lg:w-[360px]">
              <StockSearch />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap gap-2">
          {[
            ["Market", "#market"],
            ["Quarterly", "#financials"],
            ["Annual", "#annual"],
            ["Valuation", "#valuation"],
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

        <section className="mb-10">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
                Quarterly Coverage
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

            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
                Annual Coverage
              </p>

              <div className="mt-3 text-2xl font-semibold text-white">
                {annualResults.length}
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Verified annual period
                {annualResults.length === 1
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
                Freshness is validated before a
                price is used for valuation.
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
                unavailable instead of being
                replaced by synthetic figures.
              </p>
            </div>
          </div>
        </section>

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
                      or used for current
                      valuation.
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

              <MetricCard
                label="Market Capitalisation"
                value={formatCrores(
                  valuationMetrics.marketCapitalisationCrores
                )}
                note={
                  valuationMetrics.marketCapitalisationCrores !==
                  null
                    ? "Calculated from verified share price × audited shares outstanding."
                    : "Unavailable until both a verified market price and audited share count are available."
                }
              />

              <MetricCard
                label="Annual P/E"
                value={formatRatio(
                  valuationMetrics.priceToEarnings
                )}
                note={
                  latestAnnual
                    ? `Price divided by audited EPS for ${latestAnnual.fiscalYear}. This is not a TTM P/E.`
                    : "Audited annual EPS is unavailable."
                }
              />

              <MetricCard
                label="Price to Book"
                value={formatRatio(
                  valuationMetrics.priceToBook
                )}
                note={
                  latestAnnual
                    ? `Price divided by audited book value per share for ${latestAnnual.fiscalYear}.`
                    : "Audited annual book value is unavailable."
                }
              />

              <MetricCard
                label="EV / EBITDA"
                value={formatRatio(
                  valuationMetrics.evToEbitda
                )}
                note="Unavailable until consistent verified debt and EBITDA inputs are available."
              />
            </div>
          </div>
        </section>

        <section
          id="financials"
          className="mb-12 scroll-mt-24"
        >
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              02 • Business
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              Verified Quarterly Performance
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Quarterly figures are reported
              company data accepted through the
              Mission Wealth validation layer.
              Growth and margins are calculated
              separately from those reported
              facts.
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
                            quarterlyDerivedMetrics?.revenueQoQGrowth
                          )}`
                        : undefined
                    }
                    secondaryComparison={
                      previousYearQuarter
                        ? `YoY: ${formatPercent(
                            quarterlyDerivedMetrics?.revenueYoYGrowth
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
                            quarterlyDerivedMetrics?.profitBeforeTaxQoQGrowth
                          )}`
                        : undefined
                    }
                    secondaryComparison={
                      previousYearQuarter
                        ? `YoY: ${formatPercent(
                            quarterlyDerivedMetrics?.profitBeforeTaxYoYGrowth
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
                            quarterlyDerivedMetrics?.netProfitQoQGrowth
                          )}`
                        : undefined
                    }
                    secondaryComparison={
                      previousYearQuarter
                        ? `YoY: ${formatPercent(
                            quarterlyDerivedMetrics?.netProfitYoYGrowth
                          )}`
                        : undefined
                    }
                  />
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <MetricCard
                    label="PBT Margin"
                    value={formatPercent(
                      quarterlyDerivedMetrics?.profitBeforeTaxMargin
                    )}
                  />

                  <MetricCard
                    label="Net Profit Margin"
                    value={formatPercent(
                      quarterlyDerivedMetrics?.netProfitMargin
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
                    unless the exact
                    corresponding prior-year
                    quarter exists in the
                    verified dataset.
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.03] p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
                      Trailing 12 Months
                    </p>

                    <h3 className="mt-2 text-xl font-semibold text-white">
                      TTM Financial Performance
                    </h3>
                  </div>

                  {ttmFinancials && (
                    <div className="text-xs text-slate-500">
                      Through{" "}
                      {formatDate(
                        ttmFinancials.periodEnd
                      )}
                    </div>
                  )}
                </div>

                {ttmFinancials ? (
                  <>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                      Calculated by aggregating
                      the latest four consecutive
                      verified quarterly results.
                      Each metric remains
                      unavailable independently
                      if any required quarterly
                      input is missing.
                    </p>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <MetricCard
                        label="TTM Revenue"
                        value={formatCrores(
                          ttmFinancials.revenue
                        )}
                        note="Sum of the latest four consecutive verified quarterly revenue figures."
                      />

                      <MetricCard
                        label="TTM Profit Before Tax"
                        value={formatCrores(
                          ttmFinancials.profitBeforeTax
                        )}
                        note="Sum of the latest four consecutive verified quarterly PBT figures."
                      />

                      <MetricCard
                        label="TTM Net Profit"
                        value={formatCrores(
                          ttmFinancials.netProfit
                        )}
                        note="Sum of the latest four consecutive verified quarterly PAT figures."
                      />

                      <MetricCard
                        label="TTM EPS"
                        value={
                          ttmFinancials.eps !==
                          null
                            ? `₹${formatNumber(
                                ttmFinancials.eps
                              )}`
                            : "Unavailable"
                        }
                        note={
                          ttmFinancials.eps ===
                          null
                            ? "Not calculated because at least one of the four verified quarterly EPS values is missing."
                            : "Sum of the latest four consecutive verified quarterly EPS values."
                        }
                      />
                    </div>
                  </>
                ) : (
                  <div className="mt-5 rounded-xl border border-white/10 bg-[#040c17] p-5 text-sm leading-6 text-slate-500">
                    TTM analysis requires four
                    consecutive verified
                    quarterly periods. The
                    current dataset does not yet
                    satisfy that requirement.
                  </div>
                )}
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#06101d]">
                <div className="border-b border-white/10 px-6 py-5">
                  <h3 className="font-semibold text-white">
                    Verified Quarterly History
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Only periods present in the
                    verified financial registry
                    are shown.
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
                Verified quarterly data unavailable
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

        <section
          id="annual"
          className="mb-12 scroll-mt-24"
        >
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Business Quality • Annual
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-white">
                Audited Annual Financial Analysis
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                Annual reported facts are kept
                separate from Mission Wealth
                calculations such as growth,
                ROE, free cash flow and cash
                conversion.
              </p>
            </div>

            {latestAnnualSource && (
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.04] px-4 py-3 text-xs capitalize text-emerald-300">
                {
                  latestAnnualSource.auditStatus
                }{" "}
                •{" "}
                {
                  latestAnnualSource.reportingBasis
                }
              </div>
            )}
          </div>

          {latestAnnual ? (
            <>
              <div className="rounded-2xl border border-white/10 bg-[#06101d] p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                        Audited annual statement
                      </span>

                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
                        Reported facts
                      </span>

                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
                        Calculated metrics
                      </span>
                    </div>

                    <h3 className="mt-4 text-2xl font-semibold text-white">
                      {latestAnnual.fiscalYear}
                    </h3>

                    <p className="mt-2 text-sm text-slate-400">
                      Financial year ended{" "}
                      {formatDate(
                        latestAnnual.periodEnd
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#040c17] px-4 py-3 text-xs text-slate-500">
                    Reported{" "}
                    {formatDate(
                      latestAnnual.reportedAt
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Reported Annual Facts
                  </p>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                      label="Revenue"
                      value={formatCrores(
                        latestAnnual.revenue
                      )}
                      primaryComparison={
                        previousAnnual
                          ? `YoY: ${formatPercent(
                              annualDerivedMetrics?.revenueGrowth
                            )}`
                          : undefined
                      }
                    />

                    <MetricCard
                      label="Profit Before Tax"
                      value={formatCrores(
                        latestAnnual.profitBeforeTax
                      )}
                      secondaryComparison={`Margin: ${formatPercent(
                        annualDerivedMetrics?.profitBeforeTaxMargin
                      )}`}
                    />

                    <MetricCard
                      label="Net Profit"
                      value={formatCrores(
                        latestAnnual.netProfit
                      )}
                      primaryComparison={
                        previousAnnual
                          ? `YoY: ${formatPercent(
                              annualDerivedMetrics?.netProfitGrowth
                            )}`
                          : undefined
                      }
                      secondaryComparison={`Margin: ${formatPercent(
                        annualDerivedMetrics?.netProfitMargin
                      )}`}
                    />

                    <MetricCard
                      label="EPS"
                      value={
                        latestAnnual.eps !==
                        undefined
                          ? `₹${formatNumber(
                              latestAnnual.eps
                            )}`
                          : "Data unavailable"
                      }
                    />
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                      label="Total Assets"
                      value={formatCrores(
                        latestAnnual.totalAssets
                      )}
                    />

                    <MetricCard
                      label="Total Equity"
                      value={formatCrores(
                        latestAnnual.totalEquity
                      )}
                    />

                    <MetricCard
                      label="Cash & Equivalents"
                      value={formatCrores(
                        latestAnnual.cashAndEquivalents
                      )}
                    />

                    <MetricCard
                      label="Operating Cash Flow"
                      value={formatCrores(
                        latestAnnual.operatingCashFlow
                      )}
                    />
                  </div>
                </div>

                <div className="mt-8 border-t border-white/10 pt-8">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
                        Mission Wealth Calculations
                      </p>

                      <h4 className="mt-2 text-lg font-semibold text-white">
                        Business Quality & Cash Flow
                      </h4>
                    </div>

                    <p className="max-w-xl text-xs leading-5 text-slate-500">
                      These metrics are calculated
                      from verified annual inputs;
                      they are not company-reported
                      figures unless explicitly
                      stated.
                    </p>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                      label="Return on Equity"
                      value={formatPercent(
                        annualDerivedMetrics?.returnOnEquity
                      )}
                      note="Calculated using net profit and average equity when both annual periods are available."
                    />

                    <MetricCard
                      label="Free Cash Flow"
                      value={formatCrores(
                        annualDerivedMetrics?.freeCashFlow
                      )}
                      note="Operating cash flow less absolute capital expenditure."
                    />

                    <MetricCard
                      label="Cash Conversion"
                      value={formatPercent(
                        annualDerivedMetrics?.cashConversion
                      )}
                      note="Operating cash flow as a percentage of net profit."
                    />

                    <MetricCard
                      label="Book Value / Share"
                      value={formatRupeesPerShare(
                        annualDerivedMetrics?.bookValuePerShare
                      )}
                      note="Calculated from total equity and shares outstanding."
                    />
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <MetricCard
                      label="ROCE"
                      value={formatPercent(
                        annualDerivedMetrics?.returnOnCapitalEmployed
                      )}
                      note={
                        annualDerivedMetrics?.returnOnCapitalEmployed ===
                        null
                          ? "Not calculated because a normalized operating-profit input is not yet available."
                          : "Calculated return on capital employed."
                      }
                    />

                    <MetricCard
                      label="Debt / Equity"
                      value={formatRatio(
                        annualDerivedMetrics?.debtToEquity
                      )}
                      note={
                        annualDerivedMetrics?.debtToEquity ===
                        null
                          ? "Not calculated until a consistent verified debt definition is available."
                          : "Calculated from total debt and total equity."
                      }
                    />

                    <MetricCard
                      label="Net Debt"
                      value={formatCrores(
                        annualDerivedMetrics?.netDebt
                      )}
                      note={
                        annualDerivedMetrics?.netDebt ===
                        null
                          ? "Not calculated until verified normalized debt data is available."
                          : "Total debt less cash and equivalents."
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#06101d]">
                <div className="border-b border-white/10 px-6 py-5">
                  <h3 className="font-semibold text-white">
                    Verified Annual History
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Annual history comes from
                    validated audited financial
                    statement records.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[980px] text-left">
                    <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-5 py-4 font-medium">
                          Fiscal Year
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
                      {annualResults.map(
                        (result) => (
                          <AnnualResultRow
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
                Verified annual data unavailable
              </div>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
                Annual ratios are not generated
                without validated annual
                financial statement inputs.
              </p>
            </div>
          )}
        </section>

        <section
          id="valuation"
          className="mb-12 scroll-mt-24"
        >
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              03 • Value
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              Verified Valuation Snapshot
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Valuation combines a verified
              market quote with audited annual
              financial inputs. These are
              calculated research metrics, not
              reported company figures.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Market Capitalisation"
              value={formatCrores(
                valuationMetrics.marketCapitalisationCrores
              )}
              note="Calculated from verified share price and audited shares outstanding."
            />

            <MetricCard
              label="Annual P/E"
              value={formatRatio(
                valuationMetrics.priceToEarnings
              )}
              note={
                latestAnnual
                  ? `Uses audited EPS from ${latestAnnual.fiscalYear}. Not a trailing-twelve-month P/E.`
                  : "Audited annual EPS unavailable."
              }
            />

            <MetricCard
              label="Price to Book"
              value={formatRatio(
                valuationMetrics.priceToBook
              )}
              note={
                latestAnnual
                  ? `Uses audited book value per share from ${latestAnnual.fiscalYear}.`
                  : "Audited book value unavailable."
              }
            />

            <MetricCard
              label="EV / EBITDA"
              value={formatRatio(
                valuationMetrics.evToEbitda
              )}
              note="Intentionally unavailable until verified normalized debt and EBITDA inputs exist."
            />
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-[#06101d] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Valuation Data Alignment
            </p>

            <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">
              The share price may be more recent
              than the annual financial period.
              P/E and P/B therefore show the
              relationship between the verified
              available market price and the
              latest audited annual EPS or book
              value currently in the Mission
              Wealth dataset.
            </p>
          </div>
        </section>

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
              distinguishing company filings,
              annual reports, calculated metrics,
              market data and research
              interpretation.
            </p>
          </div>

          {hasVerifiedFinancials ? (
            <div className="space-y-8">
              {annualResults.length > 0 && (
                <div>
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Annual Report Sources
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    {annualResults.map(
                      (result) => {
                        const source =
                          getFinancialSource(
                            result.sourceId
                          );

                        return (
                          <div
                            key={`annual-${result.periodEnd}`}
                            className="rounded-2xl border border-white/10 bg-[#06101d] p-6"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                                Annual
                              </span>

                              <span className="text-xs text-slate-500">
                                {
                                  result.fiscalYear
                                }
                              </span>
                            </div>

                            <h4 className="mt-4 font-semibold text-white">
                              {source?.name ??
                                result.source}
                            </h4>

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
                                  {
                                    source.auditStatus
                                  }
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
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              {quarterlyResults.length > 0 && (
                <div>
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Quarterly Filing Sources
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    {quarterlyResults.map(
                      (result) => {
                        const source =
                          getFinancialSource(
                            result.sourceId
                          );

                        return (
                          <div
                            key={`quarter-${result.periodEnd}`}
                            className="rounded-2xl border border-white/10 bg-[#06101d] p-6"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                                {result.quarter}
                              </span>

                              <span className="text-xs text-slate-500">
                                {
                                  result.fiscalYear
                                }
                              </span>
                            </div>

                            <h4 className="mt-4 font-semibold text-white">
                              {source?.name ??
                                result.source}
                            </h4>

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
                                  {
                                    source.auditStatus
                                  }
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
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#06101d] p-8 text-sm text-slate-500">
              No verified financial sources are
              registered for this company.
            </div>
          )}
        </section>

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
                  ? `${quarterlyResults.length} quarterly and ${annualResults.length} annual verified period${
                      quarterlyResults.length +
                        annualResults.length ===
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
                {valuationMetrics.priceToEarnings !==
                  null &&
                valuationMetrics.priceToBook !==
                  null
                  ? `Annual P/E ${formatRatio(
                      valuationMetrics.priceToEarnings
                    )} and P/B ${formatRatio(
                      valuationMetrics.priceToBook
                    )} are available from verified market and annual inputs.`
                  : annualDerivedMetrics?.bookValuePerShare !==
                        null &&
                      annualDerivedMetrics?.bookValuePerShare !==
                        undefined
                    ? `Audited book value per share is available (${formatRupeesPerShare(
                        annualDerivedMetrics.bookValuePerShare
                      )}), but current market valuation is unavailable.`
                    : "Verified valuation metrics are not yet available."}
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
                {hasAnnualFinancials
                  ? "Audited balance-sheet and cash-flow coverage is available. Debt ratios remain unavailable until debt is normalized consistently."
                  : "Structured company-specific risk assessment is awaiting verified annual inputs."}
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
                Quarterly results, annual
                statements, TTM performance,
                market data and valuation
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
              Reported facts, market data,
              calculated metrics, management
              statements and research
              interpretation remain distinct.
            </p>
          </div>
        </section>

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
                interpretation remain
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