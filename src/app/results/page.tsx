import Link from "next/link";
import Navbar from "@/components/Navbar";
import { buildFinancialDerivedMetrics } from "@/lib/financials/calculations";
import { getFinancialPeriodComparison } from "@/lib/financials/periods";
import {
  getQuarterlyResultsWithLiveData,
  getQuarterlyResultSymbols,
} from "@/lib/financials/results";
import { getStockIdentity } from "@/lib/market/stocks";

export default async function ResultsPage() {
  const symbols =
    getQuarterlyResultSymbols();

  const rows = await Promise.all(
    symbols.map(async (symbol) => {
      const company =
        getStockIdentity(symbol);

      const results =
        await getQuarterlyResultsWithLiveData(
          symbol
        );

      const {
        current,
        previousQuarter,
        previousYearQuarter,
      } =
        getFinancialPeriodComparison(
          results
        );

      if (!company || !current) {
        return null;
      }

      const metrics =
        buildFinancialDerivedMetrics(
          current,
          previousQuarter,
          previousYearQuarter
        );

      return {
        symbol,
        company: company.name,
        quarter: current.quarter,
        fiscalYear:
          current.fiscalYear,
        periodEnd:
          current.periodEnd,
        revenue:
          current.revenue,
        netProfit:
          current.netProfit,
        revenueQoQGrowth:
          metrics.revenueQoQGrowth,
        netProfitQoQGrowth:
          metrics.netProfitQoQGrowth,
        revenueYoYGrowth:
          metrics.revenueYoYGrowth,
        netProfitYoYGrowth:
          metrics.netProfitYoYGrowth,
      };
    })
  );

  const verifiedResults = rows
    .filter(
      (
        row
      ): row is NonNullable<
        typeof row
      > => row !== null
    )
    .sort((a, b) =>
      b.periodEnd.localeCompare(
        a.periodEnd
      )
    );

  const formatMoney = (
    value: number | undefined
  ): string => {
    if (value === undefined) {
      return "Data unavailable";
    }

    return `₹${value.toLocaleString(
      "en-IN"
    )} Cr`;
  };

  const formatGrowth = (
    value: number | null
  ): string => {
    if (value === null) {
      return "—";
    }

    const prefix =
      value > 0 ? "+" : "";

    return `${prefix}${value.toFixed(
      1
    )}%`;
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#07111f] text-white">
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-4 text-sm uppercase tracking-[0.2em] text-emerald-400">
            Results Intelligence
          </div>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            Understand what changed in
            quarterly results.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            Review verified company
            results, calculated growth
            metrics, and period
            comparisons using the Mission
            Wealth financial-data
            pipeline.
          </p>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <div className="text-sm text-emerald-400">
                01
              </div>

              <h2 className="mt-4 text-xl font-semibold">
                Reported Financials
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Revenue, profit and
                period information come
                only from validated
                company disclosures.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <div className="text-sm text-emerald-400">
                02
              </div>

              <h2 className="mt-4 text-xl font-semibold">
                Calculated Changes
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                QoQ and YoY metrics are
                calculated separately
                from reported company
                figures.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <div className="text-sm text-emerald-400">
                03
              </div>

              <h2 className="mt-4 text-xl font-semibold">
                Verified Coverage
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Companies appear here
                only after verified
                quarterly data has been
                registered and validated.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">
                Latest Verified Results
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                No illustrative or
                synthetic company
                financial figures are
                displayed.
              </p>
            </div>

            {verifiedResults.length >
            0 ? (
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1050px] text-left">
                    <thead className="border-b border-white/10 bg-white/[0.03]">
                      <tr>
                        <th className="px-6 py-4 text-sm font-medium text-slate-400">
                          Company
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-slate-400">
                          Period
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-slate-400">
                          Revenue
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-slate-400">
                          Net Profit
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-slate-400">
                          Revenue QoQ
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-slate-400">
                          Profit QoQ
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-slate-400">
                          Revenue YoY
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-slate-400">
                          Profit YoY
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-slate-400">
                          View
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {verifiedResults.map(
                        (result) => (
                          <tr
                            key={
                              result.symbol
                            }
                            className="border-b border-white/10 transition hover:bg-white/[0.05]"
                          >
                            <td className="px-6 py-5 font-medium">
                              <Link
                                href={`/stocks/${result.symbol.toLowerCase()}`}
                                className="transition hover:text-emerald-300"
                              >
                                {
                                  result.company
                                }
                              </Link>
                            </td>

                            <td className="px-6 py-5 text-slate-300">
                              <div>
                                {result.quarter ??
                                  "Quarter"}{" "}
                                {
                                  result.fiscalYear
                                }
                              </div>

                              <div className="mt-1 text-xs text-slate-500">
                                {
                                  result.periodEnd
                                }
                              </div>
                            </td>

                            <td className="px-6 py-5 text-slate-300">
                              {formatMoney(
                                result.revenue
                              )}
                            </td>

                            <td className="px-6 py-5 text-slate-300">
                              {formatMoney(
                                result.netProfit
                              )}
                            </td>

                            <td className="px-6 py-5 text-slate-300">
                              {formatGrowth(
                                result.revenueQoQGrowth
                              )}
                            </td>

                            <td className="px-6 py-5 text-slate-300">
                              {formatGrowth(
                                result.netProfitQoQGrowth
                              )}
                            </td>

                            <td className="px-6 py-5 text-slate-300">
                              {formatGrowth(
                                result.revenueYoYGrowth
                              )}
                            </td>

                            <td className="px-6 py-5 text-slate-300">
                              {formatGrowth(
                                result.netProfitYoYGrowth
                              )}
                            </td>

                            <td className="px-6 py-5">
                              <Link
                                href={`/stocks/${result.symbol.toLowerCase()}`}
                                className="text-xs font-medium text-emerald-300 transition hover:text-emerald-200"
                              >
                                Analysis →
                              </Link>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-slate-500">
                Verified quarterly
                results are not
                currently available.
              </div>
            )}
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <div className="text-sm font-medium text-emerald-400">
              MISSION WEALTH™ Approach
            </div>

            <h2 className="mt-3 text-2xl font-semibold">
              Numbers first. Context
              second. Conclusion last.
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
              Reported financial
              information remains
              separate from calculated
              metrics, management
              commentary, research
              interpretation,
              assumptions and
              conclusions.
            </p>
          </div>

          <p className="mt-8 text-xs leading-6 text-slate-500">
            Financial figures displayed
            on this page are sourced from
            the Mission Wealth verified
            financial-results registry.
            Missing comparison data is
            shown as unavailable rather
            than estimated.
          </p>
        </section>

        <footer className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-slate-500">
            © 2026 MISSION WEALTH™.
            Investment Research &
            Advisory.
          </div>
        </footer>
      </main>
    </>
  );
}