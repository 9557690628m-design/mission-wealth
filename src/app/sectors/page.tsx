import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getQuarterlyResultSymbols } from "@/lib/financials/results";
import { getStockIdentity } from "@/lib/market/stocks";

interface SectorCoverage {
  sector: string;
  companies: {
    symbol: string;
    name: string;
    industry?: string;
  }[];
}

export default function SectorsPage() {
  const verifiedSymbols =
    getQuarterlyResultSymbols();

  const verifiedCompanies =
    verifiedSymbols
      .map((symbol) => {
        const company =
          getStockIdentity(symbol);

        if (!company) {
          return null;
        }

        return {
          symbol: company.symbol,
          name: company.name,
          sector: company.sector,
          industry: company.industry,
        };
      })
      .filter(
        (
          company
        ): company is NonNullable<
          typeof company
        > => company !== null
      );

  const coverageMap =
    new Map<
      string,
      SectorCoverage["companies"]
    >();

  for (const company of verifiedCompanies) {
    const existing =
      coverageMap.get(
        company.sector
      ) ?? [];

    existing.push({
      symbol: company.symbol,
      name: company.name,
      industry: company.industry,
    });

    coverageMap.set(
      company.sector,
      existing
    );
  }

  const verifiedSectorCoverage:
    SectorCoverage[] =
      Array.from(
        coverageMap.entries()
      )
        .map(
          ([
            sector,
            companies,
          ]) => ({
            sector,
            companies: companies.sort(
              (a, b) =>
                a.name.localeCompare(
                  b.name
                )
            ),
          })
        )
        .sort((a, b) =>
          a.sector.localeCompare(
            b.sector
          )
        );

  const sectorFramework = [
    {
      name:
        "Banking & Financial Services",
      description:
        "Study credit growth, asset quality, margins, profitability, capital strength and valuation.",
      focus:
        "Banks • NBFCs • Insurance",
    },
    {
      name:
        "Information Technology",
      description:
        "Analyse technology demand, revenue growth, margins, deal activity, client concentration and global exposure.",
      focus:
        "IT Services • Software • Digital",
    },
    {
      name: "Energy",
      description:
        "Track energy demand, commodity exposure, refining, exploration, renewable transition and capital allocation.",
      focus:
        "Oil & Gas • Power • Renewables",
    },
    {
      name: "Consumer",
      description:
        "Understand consumption trends, pricing power, distribution strength, brand quality and volume growth.",
      focus:
        "FMCG • Retail • Consumer Durables",
    },
    {
      name:
        "Industrials & Infrastructure",
      description:
        "Evaluate order books, execution, capital expenditure, margins, working capital and infrastructure cycles.",
      focus:
        "Engineering • Construction • Capital Goods",
    },
    {
      name:
        "Healthcare & Pharmaceuticals",
      description:
        "Study product portfolios, regulatory exposure, research pipelines, margins and healthcare demand.",
      focus:
        "Pharma • Hospitals • Healthcare",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#07111f] text-white">
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-4 text-sm uppercase tracking-[0.2em] text-emerald-400">
            Sector Research
          </div>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            Understand industries before
            analysing companies.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            Sector research provides the
            context behind company
            performance. Study industry
            structure, growth drivers,
            competitive dynamics,
            cycles, valuation and
            sector-specific risks.
          </p>

          <section className="mt-16">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">
                Verified Sector Coverage
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500">
                This coverage is generated
                automatically from companies
                with verified financial data
                in the Mission Wealth
                registry.
              </p>
            </div>

            {verifiedSectorCoverage.length >
            0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {verifiedSectorCoverage.map(
                  (sector) => (
                    <div
                      key={
                        sector.sector
                      }
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-8"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <h3 className="text-xl font-semibold">
                          {
                            sector.sector
                          }
                        </h3>

                        <span className="rounded border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-xs font-medium text-emerald-300">
                          {
                            sector
                              .companies
                              .length
                          }{" "}
                          verified
                        </span>
                      </div>

                      <div className="mt-6 space-y-3">
                        {sector.companies.map(
                          (company) => (
                            <Link
                              key={
                                company.symbol
                              }
                              href={`/stocks/${company.symbol.toLowerCase()}`}
                              className="block rounded-xl border border-white/5 bg-[#07111f] p-4 transition hover:border-emerald-400/30"
                            >
                              <div className="font-medium text-white">
                                {
                                  company.name
                                }
                              </div>

                              <div className="mt-1 text-xs text-slate-500">
                                {
                                  company.symbol
                                }

                                {company.industry
                                  ? ` • ${company.industry}`
                                  : ""}
                              </div>

                              <div className="mt-3 text-xs font-medium text-emerald-300">
                                Open research
                                profile →
                              </div>
                            </Link>
                          )
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-slate-500">
                Verified sector coverage is
                not currently available.
              </div>
            )}
          </section>

          <section className="mt-20">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">
                Sector Analysis Framework
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500">
                These sector lenses describe
                the factors Mission Wealth
                considers when evaluating
                industries. They are research
                frameworks, not company
                recommendations.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {sectorFramework.map(
                (sector, index) => (
                  <div
                    key={sector.name}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-8"
                  >
                    <div className="text-sm text-emerald-400">
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </div>

                    <h3 className="mt-4 text-2xl font-semibold">
                      {sector.name}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-slate-400">
                      {
                        sector.description
                      }
                    </p>

                    <div className="mt-6 border-t border-white/10 pt-5 text-xs uppercase tracking-wider text-slate-500">
                      {sector.focus}
                    </div>
                  </div>
                )
              )}
            </div>
          </section>

          <section className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <div className="text-sm font-medium text-emerald-400">
              TECH-FUNDA™ Sector Lens
            </div>

            <h2 className="mt-3 text-2xl font-semibold">
              Market → Industry →
              Business → Value → Risk
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
              Sector analysis provides the
              environment in which individual
              businesses operate. Industry
              structure, competitive
              intensity, growth expectations,
              cycles and valuation are
              considered before forming a
              company-level research view.
            </p>

            <Link
              href="/methodology"
              className="mt-6 inline-block text-sm font-medium text-emerald-300 transition hover:text-emerald-200"
            >
              Learn TECH-FUNDA™ →
            </Link>
          </section>

          <p className="mt-8 text-xs leading-6 text-slate-500">
            Verified company coverage expands
            only when validated financial data
            is added to the Mission Wealth
            financial registry. Sector
            frameworks are educational
            research context and are not
            investment recommendations.
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