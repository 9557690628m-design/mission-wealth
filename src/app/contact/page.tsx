import Navbar from "@/components/Navbar";

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#07111f] text-white">
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-4 text-sm uppercase tracking-[0.2em] text-emerald-400">
            Contact
          </div>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            Connect with MISSION WEALTH™.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            Have a question about our research, methodology, company analysis,
            or educational content? Get in touch with us.
          </p>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <div className="text-sm text-emerald-400">
                General Enquiries
              </div>

              <h2 className="mt-4 text-2xl font-semibold">
                Research & Platform
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                For questions related to company research, results analysis,
                sectors, methodology, or the MISSION WEALTH™ platform.
              </p>

              <div className="mt-6 text-sm text-slate-300">
                Email: contact@missionwealth.in
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <div className="text-sm text-emerald-400">
                Research Feedback
              </div>

              <h2 className="mt-4 text-2xl font-semibold">
                Help Us Improve
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                We welcome feedback about research presentation, educational
                resources, website experience, and areas you would like us to
                cover.
              </p>

              <div className="mt-6 text-sm text-slate-300">
                Subject: Research Feedback
              </div>
            </div>
          </div>

          <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
            <div className="text-sm font-medium text-emerald-400">
              Before You Contact Us
            </div>

            <h2 className="mt-4 text-3xl font-semibold">
              Research is information, not a promise.
            </h2>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400">
              MISSION WEALTH™ research is designed to support independent
              understanding and decision-making. Market investments involve
              risk, and past performance does not guarantee future results.
            </p>
          </div>

          <p className="mt-8 text-xs leading-6 text-slate-500">
            MISSION WEALTH™ does not provide personalised investment advice
            through this contact page. Any future advisory or regulated
            services will be offered only in accordance with applicable
            regulations and registrations.
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