import Navbar from "@/components/Navbar";

export default function LearnPage() {
  const topics = [
    {
      number: "01",
      title: "Understanding Financial Statements",
      description:
        "Learn how to read the income statement, balance sheet, and cash-flow statement to understand the financial health of a business.",
    },
    {
      number: "02",
      title: "Business Quality",
      description:
        "Understand competitive advantages, pricing power, capital efficiency, scalability, and the characteristics of high-quality businesses.",
    },
    {
      number: "03",
      title: "Valuation",
      description:
        "Learn how P/E, P/B, EV/EBITDA, free-cash-flow yield, and other valuation methods can be used to study what the market is pricing in.",
    },
    {
      number: "04",
      title: "Risk",
      description:
        "Identify business, financial, valuation, governance, industry, and market risks before forming an investment thesis.",
    },
    {
      number: "05",
      title: "Technical Analysis",
      description:
        "Understand trend, momentum, volume, market structure, relative strength, and support and resistance.",
    },
    {
      number: "06",
      title: "Investment Discipline",
      description:
        "Build a structured process around research, position sizing, monitoring, patience, and evidence-based decision making.",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#07111f] text-white">
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-4 text-sm uppercase tracking-[0.2em] text-emerald-400">
            Learn
          </div>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            Learn to understand investments, not just prices.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            Build the knowledge required to understand businesses, financial
            statements, valuation, market behaviour, and investment risk.
          </p>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {topics.map((topic) => (
              <div
                key={topic.number}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition hover:bg-white/[0.05]"
              >
                <div className="text-sm text-emerald-400">
                  {topic.number}
                </div>

                <h2 className="mt-4 text-2xl font-semibold">
                  {topic.title}
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-400">
                  {topic.description}
                </p>

                <div className="mt-6 text-xs font-medium text-slate-500">
                  LEARNING MODULE →
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
            <div className="text-sm font-medium text-emerald-400">
              Recommended Learning Path
            </div>

            <h2 className="mt-4 text-3xl font-semibold">
              Business → Financials → Valuation → Risk → Market
            </h2>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400">
              Start by understanding what a company does and how it makes
              money. Then study its financial performance, valuation, risks,
              and market behaviour. The objective is to develop a repeatable
              research process rather than depend on short-term market noise.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <div className="text-sm font-medium text-emerald-400">
              MISSION WEALTH™ Principle
            </div>

            <h2 className="mt-3 text-2xl font-semibold">
              Research first. Decide with discipline.
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
              Education and research can improve understanding, but no
              framework can eliminate investment risk or guarantee future
              returns.
            </p>
          </div>

          <p className="mt-8 text-xs leading-6 text-slate-500">
            Educational content only. This page does not constitute
            personalized investment advice or a recommendation to buy or sell
            any security.
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