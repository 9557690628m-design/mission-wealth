import Navbar from "@/components/Navbar";

export default function ResearchPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#07111f] text-white">
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-4 text-sm uppercase tracking-[0.2em] text-emerald-400">
            Research
          </div>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            Research built around understanding.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            Structured investment research designed to help investors
            understand businesses, financial performance, valuation, risk,
            and market behaviour.
          </p>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <div className="text-sm text-emerald-400">01</div>

              <h2 className="mt-4 text-xl font-semibold">
                Company Research
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Business model, financial quality, competitive position,
                valuation, risks, and key monitoring points.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <div className="text-sm text-emerald-400">02</div>

              <h2 className="mt-4 text-xl font-semibold">
                Results Intelligence
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Understand what changed in quarterly results, why it changed,
                and what investors should monitor next.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <div className="text-sm text-emerald-400">03</div>

              <h2 className="mt-4 text-xl font-semibold">
                Sector Research
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Study industry structure, competitive dynamics, growth
                drivers, cycles, and sector-specific risks.
              </p>
            </div>
          </div>
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