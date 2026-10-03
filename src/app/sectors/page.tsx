import Navbar from "@/components/Navbar";

export default function SectorsPage() {
  const sectors = [
    {
      name: "Banking & Financial Services",
      description:
        "Study credit growth, asset quality, margins, profitability, capital strength, and valuation.",
      companies: "Banks • NBFCs • Insurance",
    },
    {
      name: "Information Technology",
      description:
        "Analyse technology demand, revenue growth, margins, deal activity, client concentration, and global exposure.",
      companies: "IT Services • Software • Digital",
    },
    {
      name: "Energy",
      description:
        "Track energy demand, commodity exposure, refining, exploration, renewable transition, and capital allocation.",
      companies: "Oil & Gas • Power • Renewables",
    },
    {
      name: "Consumer",
      description:
        "Understand consumption trends, pricing power, distribution strength, brand quality, and volume growth.",
      companies: "FMCG • Retail • Consumer Durables",
    },
    {
      name: "Industrials & Infrastructure",
      description:
        "Evaluate order books, execution, capital expenditure, margins, working capital, and infrastructure cycles.",
      companies: "Engineering • Construction • Capital Goods",
    },
    {
      name: "Healthcare & Pharmaceuticals",
      description:
        "Study product portfolios, regulatory exposure, research pipelines, margins, and healthcare demand.",
      companies: "Pharma • Hospitals • Healthcare",
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
            Understand industries before analysing companies.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            Sector research provides the context behind company performance.
            Study industry structure, growth drivers, competitive dynamics,
            cycles, valuations, and sector-specific risks.
          </p>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {sectors.map((sector, index) => (
              <div
                key={sector.name}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition hover:bg-white/[0.05]"
              >
                <div className="text-sm text-emerald-400">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <h2 className="mt-4 text-2xl font-semibold">
                  {sector.name}
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-400">
                  {sector.description}
                </p>

                <div className="mt-6 border-t border-white/10 pt-5 text-xs uppercase tracking-wider text-slate-500">
                  {sector.companies}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <div className="text-sm font-medium text-emerald-400">
              TECH-FUNDA™ Sector Lens
            </div>

            <h2 className="mt-3 text-2xl font-semibold">
              Market → Industry → Business → Value → Risk
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
              Sector analysis helps investors understand the environment in
              which individual companies operate. Industry structure,
              competitive intensity, growth expectations, cycles, and
              valuation are considered before forming a company-level view.
            </p>
          </div>

          <p className="mt-8 text-xs leading-6 text-slate-500">
            Note: This page provides an educational research framework and
            illustrative content. It does not constitute investment advice or
            a recommendation to buy or sell any security.
          </p>
        </section>

        <footer className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-slate-500">
            © 2026 MISSION WEALTH™. Investment Research & Advisory.
          </div>
        </footer>
      </main>
    </>
  );
}