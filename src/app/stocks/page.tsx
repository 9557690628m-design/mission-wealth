import Link from "next/link";
import Navbar from "@/components/Navbar";
import StockSearch from "@/components/StockSearch";
import { getQuarterlyResultSymbols } from "@/lib/financials/results";
import { STOCK_MASTER } from "@/lib/market/stocks";

export default function StocksPage() {
  const verifiedSymbols = new Set(
    getQuarterlyResultSymbols()
  );

  const stocks = [...STOCK_MASTER].sort(
    (a, b) =>
      a.name.localeCompare(b.name)
  );

  const verifiedCount =
    stocks.filter((stock) =>
      verifiedSymbols.has(stock.symbol)
    ).length;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#07111f] text-white">
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-4 text-sm uppercase tracking-[0.2em] text-emerald-400">
            Stocks
          </div>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            Understand the businesses
            you follow.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            Explore companies using
            identity, sector, industry,
            verified financial coverage
            and the Mission Wealth
            TECH-FUNDA™ research
            framework.
          </p>

          <div className="mt-10 max-w-xl">
            <StockSearch />
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="text-xs uppercase tracking-wider text-slate-500">
                Market
              </div>

              <div className="mt-3 text-2xl font-semibold">
                NSE / BSE
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="text-xs uppercase tracking-wider text-slate-500">
                Companies
              </div>

              <div className="mt-3 text-2xl font-semibold">
                {stocks.length}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="text-xs uppercase tracking-wider text-slate-500">
                Verified Financial Coverage
              </div>

              <div className="mt-3 text-2xl font-semibold">
                {verifiedCount}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="text-xs uppercase tracking-wider text-slate-500">
                Framework
              </div>

              <div className="mt-3 text-2xl font-semibold">
                TECH-FUNDA™
              </div>
            </div>
          </div>

          <section className="mt-14">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">
                Company Universe
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500">
                The stock universe is
                maintained separately
                from financial coverage.
                A company may appear in
                the Mission Wealth stock
                master before verified
                quarterly financial data
                is available.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
                  <thead className="border-b border-white/10 bg-white/[0.03]">
                    <tr>
                      <th className="px-6 py-4 text-sm font-medium text-slate-400">
                        Company
                      </th>

                      <th className="px-6 py-4 text-sm font-medium text-slate-400">
                        Symbol
                      </th>

                      <th className="px-6 py-4 text-sm font-medium text-slate-400">
                        Sector
                      </th>

                      <th className="px-6 py-4 text-sm font-medium text-slate-400">
                        Industry
                      </th>

                      <th className="px-6 py-4 text-sm font-medium text-slate-400">
                        Exchange
                      </th>

                      <th className="px-6 py-4 text-sm font-medium text-slate-400">
                        Financial Coverage
                      </th>

                      <th className="px-6 py-4 text-sm font-medium text-slate-400">
                        Research
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {stocks.map((stock) => {
                      const hasVerifiedFinancials =
                        verifiedSymbols.has(
                          stock.symbol
                        );

                      const exchange =
                        stock.nseSymbol &&
                        stock.bseCode
                          ? "NSE / BSE"
                          : stock.nseSymbol
                            ? "NSE"
                            : stock.bseCode
                              ? "BSE"
                              : "—";

                      return (
                        <tr
                          key={stock.symbol}
                          className="border-b border-white/10 transition hover:bg-white/[0.05]"
                        >
                          <td className="px-6 py-5 font-medium">
                            <Link
                              href={`/stocks/${stock.slug}`}
                              className="transition hover:text-emerald-300"
                            >
                              {stock.name}
                            </Link>
                          </td>

                          <td className="px-6 py-5 font-mono text-sm text-slate-300">
                            {stock.symbol}
                          </td>

                          <td className="px-6 py-5 text-sm text-slate-300">
                            {stock.sector}
                          </td>

                          <td className="px-6 py-5 text-sm text-slate-400">
                            {stock.industry ??
                              "—"}
                          </td>

                          <td className="px-6 py-5 text-sm text-slate-400">
                            {exchange}
                          </td>

                          <td className="px-6 py-5">
                            {hasVerifiedFinancials ? (
                              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                                Verified
                              </span>
                            ) : (
                              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-500">
                                Awaiting data
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-5">
                            <Link
                              href={`/stocks/${stock.slug}`}
                              className="text-xs font-medium text-emerald-300 transition hover:text-emerald-200"
                            >
                              Open profile →
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="mt-14 grid gap-6 md:grid-cols-3">
            <Link
              href="/results"
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-emerald-400/30 hover:bg-white/[0.05]"
            >
              <div className="text-sm font-semibold text-white">
                Results Intelligence
              </div>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                Review verified
                quarterly results and
                calculated period
                comparisons.
              </p>

              <div className="mt-5 text-xs font-medium text-emerald-300">
                View results →
              </div>
            </Link>

            <Link
              href="/research"
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-emerald-400/30 hover:bg-white/[0.05]"
            >
              <div className="text-sm font-semibold text-white">
                Research
              </div>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                Explore Mission Wealth
                company and financial
                research coverage.
              </p>

              <div className="mt-5 text-xs font-medium text-emerald-300">
                Open research →
              </div>
            </Link>

            <Link
              href="/sectors"
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-emerald-400/30 hover:bg-white/[0.05]"
            >
              <div className="text-sm font-semibold text-white">
                Sector Research
              </div>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                Understand the industry
                context behind company
                performance.
              </p>

              <div className="mt-5 text-xs font-medium text-emerald-300">
                Explore sectors →
              </div>
            </Link>
          </section>

          <p className="mt-10 text-xs leading-6 text-slate-500">
            Mission Wealth does not
            display synthetic or
            illustrative financial
            metrics as reported company
            data. Verified financial
            coverage is shown only when
            validated source information
            is available.
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