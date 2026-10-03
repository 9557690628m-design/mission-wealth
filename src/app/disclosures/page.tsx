import Navbar from "@/components/Navbar";

export default function DisclosuresPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#07111f] text-white">
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-4 text-sm uppercase tracking-[0.2em] text-emerald-400">
            Disclosures
          </div>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            Transparency before everything else.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            Important information about the nature, limitations, and intended
            use of MISSION WEALTH™ research and educational content.
          </p>

          <div className="mt-16 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <h2 className="text-2xl font-semibold">
                1. Research & Educational Purpose
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                MISSION WEALTH™ provides investment research, financial
                analysis, market information, and educational material intended
                to help users understand businesses, financial performance,
                valuation, risk, and market behaviour.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <h2 className="text-2xl font-semibold">
                2. Not a Guarantee of Returns
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Investing in securities involves risk. Past performance,
                historical financial performance, valuation analysis, or any
                research conclusion does not guarantee future results.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <h2 className="text-2xl font-semibold">
                3. Information & Data
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Information presented on the platform may include data obtained
                from public sources, company disclosures, calculated metrics,
                analytical assumptions, and other research inputs. Reasonable
                care may be taken in presenting information, but completeness,
                accuracy, and timeliness cannot always be guaranteed.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <h2 className="text-2xl font-semibold">
                4. Independent Decision-Making
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Users should conduct their own research and consider their
                individual financial circumstances, objectives, risk tolerance,
                and applicable professional advice before making investment
                decisions.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <h2 className="text-2xl font-semibold">
                5. No Unauthorised Government Affiliation
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                MISSION WEALTH™ is an independent platform and should not be
                interpreted as being affiliated with, endorsed by, sponsored
                by, or representing the Government of India, Indian Armed
                Forces, Ministry of Defence, CAPF, police, or any other
                government organisation unless expressly stated and authorised.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <h2 className="text-2xl font-semibold">
                6. Future Advisory Services
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Any future personalised investment advisory, research
                subscription, portfolio management, or other regulated
                financial service will be offered only after establishing the
                appropriate legal, regulatory, registration, and compliance
                framework applicable to that service.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.03] p-8">
              <div className="text-sm font-medium text-emerald-400">
                Core Principle
              </div>

              <h2 className="mt-4 text-3xl font-semibold">
                Data → Evidence → Analysis → Conclusion
              </h2>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400">
                MISSION WEALTH™ aims to clearly distinguish reported facts,
                calculated metrics, management statements, assumptions, and
                analytical interpretation.
              </p>
            </div>
          </div>

          <p className="mt-10 text-xs leading-6 text-slate-500">
            This disclosure page is a general website framework and should be
            reviewed and updated with appropriate legal and regulatory advice
            before the platform is launched publicly or begins offering
            regulated financial services.
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