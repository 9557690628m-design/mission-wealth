import Navbar from "@/components/Navbar";

export default function MethodologyPage() {
  const pillars = [
    {
      number: "01",
      title: "Technical",
      description:
        "Study trend, momentum, volume, market structure, relative strength, and important support and resistance levels.",
    },
    {
      number: "02",
      title: "Fundamental",
      description:
        "Analyse revenue growth, earnings, profitability, ROE, ROCE, cash flow, balance sheet strength, and business quality.",
    },
    {
      number: "03",
      title: "Valuation",
      description:
        "Evaluate P/E, P/B, EV/EBITDA, free-cash-flow yield, historical valuation, peer comparison, and growth expectations.",
    },
    {
      number: "04",
      title: "Risk",
      description:
        "Identify business, financial, valuation, governance, industry, cyclical, and market-related risks.",
    },
    {
      number: "05",
      title: "Monitor",
      description:
        "Track quarterly results, management commentary, catalysts, corporate developments, operating metrics, and thesis changes.",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#07111f] text-white">
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-4 text-sm uppercase tracking-[0.2em] text-emerald-400">
            TECH-FUNDA™ Framework
          </div>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            A structured framework for investment research.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            TECH-FUNDA™ combines technical behaviour, fundamental business
            analysis, valuation, risk assessment, and continuous monitoring
            into one structured research process.
          </p>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar) => (
              <div
                key={pillar.number}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition hover:bg-white/[0.05]"
              >
                <div className="text-sm text-emerald-400">
                  {pillar.number}
                </div>

                <h2 className="mt-4 text-2xl font-semibold">
                  {pillar.title}
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-400">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
            <div className="text-sm font-medium text-emerald-400">
              Core Mental Model
            </div>

            <h2 className="mt-4 text-3xl font-semibold">
              Market → Business → Value → Risk → Monitor
            </h2>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400">
              The framework is designed to move from the broader market
              environment toward the individual business, its intrinsic and
              market valuation, the risks involved, and the information that
              should be monitored over time.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.03] p-8">
            <div className="text-sm font-medium text-emerald-400">
              Research Philosophy
            </div>

            <h2 className="mt-3 text-2xl font-semibold">
              Data → Evidence → Analysis → Conclusion
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
              MISSION WEALTH™ aims to separate reported facts, calculated
              metrics, management statements, assumptions, and analytical
              interpretation so that research remains transparent and
              understandable.
            </p>
          </div>

          <p className="mt-8 text-xs leading-6 text-slate-500">
            Note: TECH-FUNDA™ is a research framework for educational and
            analytical purposes. It does not constitute a guarantee of
            investment performance or a recommendation to buy or sell any
            security.
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