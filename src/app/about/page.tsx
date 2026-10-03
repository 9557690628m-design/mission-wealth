import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#07111f] text-white">
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-4 text-sm uppercase tracking-[0.2em] text-emerald-400">
            About MISSION WEALTH™
          </div>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            Investment research built around understanding.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            MISSION WEALTH™ is being built as an investment research platform
            focused on structured analysis of businesses, financial
            performance, valuation, risk, and market behaviour.
          </p>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <div className="text-sm text-emerald-400">01</div>

              <h2 className="mt-4 text-2xl font-semibold">
                Our Mission
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                To make high-quality investment research easier to understand
                through structured, evidence-based analysis.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <div className="text-sm text-emerald-400">02</div>

              <h2 className="mt-4 text-2xl font-semibold">
                Our Philosophy
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Data → Evidence → Analysis → Conclusion. We aim to separate
                facts, calculations, assumptions, and interpretation clearly.
              </p>
            </div>
          </div>

          <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
            <div className="text-sm font-medium text-emerald-400">
              TECH-FUNDA™
            </div>

            <h2 className="mt-4 text-3xl font-semibold">
              Market → Business → Value → Risk → Monitor
            </h2>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400">
              Our research framework brings together technical analysis,
              fundamental analysis, valuation, risk assessment, and ongoing
              monitoring into a single structured process.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <h3 className="text-lg font-semibold">
                Research
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                Company, sector, results, valuation, and market research.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <h3 className="text-lg font-semibold">
                Education
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                Practical resources to help investors understand financial
                analysis and investment concepts.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <h3 className="text-lg font-semibold">
                Discipline
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                A calm, structured approach focused on evidence rather than
                short-term market noise.
              </p>
            </div>
          </div>

          <div className="mt-16 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.03] p-8 md:p-10">
            <div className="text-sm font-medium text-emerald-400">
              Our Principle
            </div>

            <h2 className="mt-4 text-3xl font-semibold">
              Serve With Honour. Invest With Discipline.
            </h2>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400">
              The principle reflects the platform&apos;s focus on integrity,
              responsible research, transparency, and disciplined thinking.
            </p>
          </div>

          <p className="mt-8 text-xs leading-6 text-slate-500">
            MISSION WEALTH™ is an independent investment research platform and
            is not affiliated with the Government of India, Indian Armed
            Forces, Ministry of Defence, CAPF, police, or any other government
            organisation unless expressly stated and authorised.
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