import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  getQuarterlyResultSymbols,
  getQuarterlyResults,
} from "@/lib/financials/results";
import { getFinancialPeriodComparison } from "@/lib/financials/periods";
import { getStockIdentity } from "@/lib/market/stocks";

export default async function ResearchPage() {
  const symbols =
    getQuarterlyResultSymbols();

  const coverage = await Promise.all(
    symbols.map(async (symbol) => {
      const company =
        getStockIdentity(symbol);

      const results =
        await getQuarterlyResults(
          symbol
        );

      const {
        current,
      } =
        getFinancialPeriodComparison(
          results
        );

      if (!company || !current) {
        return null;
      }

      return {
        symbol,
        company: company.name,
        sector: company.sector,
        industry:
          company.industry,
        quarter:
          current.quarter,
        fiscalYear:
          current.fiscalYear,
        periodEnd:
          current.periodEnd,
      };
    })
  );

  const verifiedCoverage =
    coverage.filter(
      (
        item
      ): item is NonNullable<
        typeof item
      > => item !== null
    );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#07111f] text-white">
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-4 text-sm uppercase tracking-[0.2em] text-emerald-400">
            Research
          </div>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            Research built around
            evidence and understanding.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            Mission Wealth separates
            reported facts, calculated
            metrics, business analysis,
            valuation, risk and
            monitoring so investors can
            understand how a research
            conclusion is formed.
          </p>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <Link
              href="/stocks"
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition hover:border-emerald-400/30 hover:bg-white/[0.05]"
            >
              <div className="text-sm text-emerald-400">
                01
              </div>

              <h2 className="mt-4 text-xl font-semibold">
                Company Research
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Study business
                identity, market data,
                financial performance,
                valuation, risk and
                monitoring points.
              </p>

              <div className="mt-6 text-xs font-medium text-emerald-300">
                Explore companies →
              </div>
            </Link>

            <Link
              href="/results"
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition hover:border-emerald-400/30 hover:bg-white/[0.05]"
            >
              <div className="text-sm text-emerald-400">
                02
              </div>

              <h2 className="mt-4 text-xl font-semibold">
                Results Intelligence
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Review verified
                quarterly results,
                period comparisons and
                calculated financial
                changes.
              </p>

              <div className="mt-6 text-xs font-medium text-emerald-300">
                View results →
              </div>
            </Link>

            <Link
              href="/sectors"
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition hover:border-emerald-400/30 hover:bg-white/[0.05]"
            >
              <div className="text-sm text-emerald-400">
                03
              </div>

              <h2 className="mt-4 text-xl font-semibold">
                Sector Research
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Understand industry
                structure, competitive
                dynamics, growth
                drivers, cycles and
                sector-specific risks.
              </p>

              <div className="mt-6 text-xs font-medium text-emerald-300">
                Explore sectors →
              </div>
            </Link>
          </div>

          <section className="mt-16">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">
                Verified Research
                Coverage
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500">
                A company appears here
                only when verified
                quarterly financial
                data has been
                registered and
                validated in the
                Mission Wealth
                financial pipeline.
              </p>
            </div>

            {verifiedCoverage.length >
            0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {verifiedCoverage.map(
                  (item) => (
                    <Link
                      key={
                        item.symbol
                      }
                      href={`/stocks/${item.symbol.toLowerCase()}`}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-emerald-400/30 hover:bg-white/[0.05]"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="text-lg font-semibold text-white">
                            {
                              item.company
                            }
                          </div>

                          <div className="mt-1 text-xs text-slate-500">
                            {
                              item.symbol
                            }
                            {" • "}
                            {
                              item.sector
                            }
                          </div>

                          {item.industry && (
                            <div className="mt-1 text-xs text-slate-600">
                              {
                                item.industry
                              }
                            </div>
                          )}
                        </div>

                        <div className="rounded border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-xs font-medium text-emerald-300">
                          Verified
                        </div>
                      </div>

                      <div className="mt-5 border-t border-white/5 pt-4 text-xs text-slate-500">
                        Latest verified
                        result:{" "}
                        {item.quarter ??
                          "Quarter"}{" "}
                        {
                          item.fiscalYear
                        }
                        {" • "}
                        Period ended{" "}
                        {
                          item.periodEnd
                        }
                      </div>

                      <div className="mt-4 text-xs font-medium text-emerald-300">
                        Open research
                        profile →
                      </div>
                    </Link>
                  )
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-slate-500">
                Verified research
                coverage is not
                currently available.
              </div>
            )}
          </section>

          <section className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <div className="text-sm font-medium text-emerald-400">
              TECH-FUNDA™ Research
              Process
            </div>

            <h2 className="mt-3 text-2xl font-semibold">
              Market → Business →
              Value → Risk → Monitor
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
              Research conclusions are
              built from verified data
              and clearly separated
              from management
              statements, assumptions,
              calculated metrics and
              Mission Wealth
              interpretation.
            </p>

            <Link
              href="/methodology"
              className="mt-6 inline-block text-sm font-medium text-emerald-300 transition hover:text-emerald-200"
            >
              Learn the methodology →
            </Link>
          </section>

          <p className="mt-8 text-xs leading-6 text-slate-500">
            Mission Wealth does not
            display synthetic or
            estimated financial
            figures as reported company
            data. Research coverage
            expands only as verified
            source information is
            added.
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