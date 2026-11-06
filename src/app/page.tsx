import Navbar from "@/components/Navbar";
import StockSearch from "@/components/StockSearch";
import Link from "next/link";

const researchPrinciples = [
  {
    title: "Business First",
    description:
      "Understand how the company makes money, competes and creates long-term value.",
  },
  {
    title: "Evidence Driven",
    description:
      "Separate reported facts, calculated metrics and research interpretation.",
  },
  {
    title: "Valuation Aware",
    description:
      "Study price in the context of business quality, growth and expectations.",
  },
  {
    title: "Risk Focused",
    description:
      "Identify business, financial, governance, valuation and market risks.",
  },
];

const framework = [
  {
    number: "01",
    title: "Market",
    description: "Trend • Momentum • Structure",
  },
  {
    number: "02",
    title: "Business",
    description: "Growth • Quality • Cash Flow",
  },
  {
    number: "03",
    title: "Value",
    description: "Valuation • Expectations",
  },
  {
    number: "04",
    title: "Risk",
    description: "Business • Financial • Governance",
  },
  {
    number: "05",
    title: "Monitor",
    description: "Results • Catalysts • Thesis",
  },
];

const researchPaths = [
  {
    title: "Company Research",
    description:
      "Understand the business, financial performance, quality, valuation, risks and what investors should monitor.",
    href: "/stocks",
    action: "Explore Companies",
  },
  {
    title: "Results Intelligence",
    description:
      "Examine quarterly results through reported performance, business drivers, profitability and changes in the investment thesis.",
    href: "/results",
    action: "Explore Results",
  },
  {
    title: "Sector Research",
    description:
      "Study industry structure, competitive dynamics, cycles, growth drivers and sector-specific risks.",
    href: "/sectors",
    action: "Explore Sectors",
  },
];

const resultQuestions = [
  {
    number: "01",
    title: "What changed?",
    description:
      "Identify the important movements in revenue, profit, margins, cash flow and operating performance.",
  },
  {
    number: "02",
    title: "Why did it change?",
    description:
      "Connect reported numbers with business drivers, operating conditions and management commentary.",
  },
  {
    number: "03",
    title: "What should be monitored?",
    description:
      "Track the variables that can strengthen, weaken or invalidate the investment thesis.",
  },
];

const sectorLenses = [
  {
    title: "Growth Drivers",
    description:
      "Understand the economic, industry and company-level forces influencing demand and profitability.",
  },
  {
    title: "Competitive Structure",
    description:
      "Examine market share, entry barriers, pricing power, scale and competitive intensity.",
  },
  {
    title: "Sector Risks",
    description:
      "Monitor regulation, cyclicality, leverage, commodities, disruption and demand changes.",
  },
];

const methodologyPillars = [
  {
    title: "MARKET",
    subtitle: "Technical Intelligence",
    items: [
      "Trend",
      "Momentum",
      "Volume",
      "Market Structure",
      "Relative Strength",
      "Support / Resistance",
    ],
  },
  {
    title: "BUSINESS",
    subtitle: "Fundamental Quality",
    items: [
      "Revenue Growth",
      "Earnings Growth",
      "ROE / ROCE",
      "Cash Flow",
      "Balance Sheet",
      "Competitive Position",
    ],
  },
  {
    title: "VALUE",
    subtitle: "Valuation Intelligence",
    items: [
      "P/E",
      "P/B",
      "EV / EBITDA",
      "FCF Yield",
      "Historical Valuation",
      "Growth Expectations",
    ],
  },
  {
    title: "RISK",
    subtitle: "Risk Intelligence",
    items: [
      "Business Risk",
      "Financial Risk",
      "Valuation Risk",
      "Governance Risk",
      "Industry Risk",
      "Market Risk",
    ],
  },
  {
    title: "MONITOR",
    subtitle: "Continuous Intelligence",
    items: [
      "Quarterly Results",
      "Management Commentary",
      "Catalysts",
      "Operating Metrics",
      "Thesis Changes",
      "Red Flags",
    ],
  },
];

const learningModules = [
  {
    number: "01",
    title: "Understand Businesses",
    description:
      "Learn how companies make money, grow, compete and create long-term value.",
    topics: ["Business Model", "Moat", "Growth"],
  },
  {
    number: "02",
    title: "Read Financials",
    description:
      "Understand revenue, profit, cash flow, balance sheets and important financial ratios.",
    topics: ["P&L", "Balance Sheet", "Cash Flow"],
  },
  {
    number: "03",
    title: "Understand Valuation",
    description:
      "Learn how investors assess what they are paying for earnings, assets and future growth.",
    topics: ["P/E", "EV/EBITDA", "DCF"],
  },
  {
    number: "04",
    title: "Read Market Behaviour",
    description:
      "Understand price trends, momentum, volume and market structure.",
    topics: ["Trend", "Momentum", "Volume"],
  },
  {
    number: "05",
    title: "Understand Risk",
    description:
      "Identify business, financial, valuation, governance and market risks.",
    topics: ["Risk", "Red Flags", "Scenarios"],
  },
  {
    number: "06",
    title: "Build Investment Discipline",
    description:
      "Develop a repeatable process for research, decision-making and monitoring.",
    topics: ["Process", "Patience", "Monitoring"],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/[0.06] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-24 md:pb-32 md:pt-32">
          <div className="grid items-center gap-16 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-2 text-sm text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Powered by TECH-FUNDA™
              </div>

              <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
                Understand the business.
                <span className="block text-emerald-400">
                  Invest with discipline.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
                Structured investment research for long-term Indian investors.
                Mission Wealth connects business fundamentals, financial
                performance, market behaviour, valuation and risk through one
                disciplined research framework.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/research"
                  className="rounded-lg bg-emerald-500 px-7 py-3.5 text-center font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  Explore Research
                </Link>

                <Link
                  href="/methodology"
                  className="rounded-lg border border-white/15 px-7 py-3.5 text-center font-semibold text-white transition hover:bg-white/5"
                >
                  Learn TECH-FUNDA™
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
                <span>Data → Evidence → Analysis → Conclusion</span>
                <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
                <span>Research before opinion</span>
              </div>
            </div>

            {/* Framework Card */}
            <div className="relative">
              <div className="absolute -inset-8 rounded-[40px] bg-emerald-500/[0.04] blur-3xl" />

              <div className="relative rounded-3xl border border-white/10 bg-[#0a1626]/90 p-6 shadow-2xl backdrop-blur">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Research Framework
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                      TECH-FUNDA™
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.05] px-3 py-1.5 text-xs text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Structured
                  </div>
                </div>

                <div className="space-y-3">
                  {framework.map((item) => (
                    <div
                      key={item.number}
                      className="group rounded-xl border border-white/10 bg-black/20 p-4 transition hover:border-emerald-400/20 hover:bg-white/[0.04]"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-emerald-400">
                          {item.number}
                        </span>

                        <div>
                          <p className="font-semibold">{item.title}</p>
                          <p className="mt-1 text-sm text-slate-500">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Research principle
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Facts, calculations and interpretation should remain
                    distinguishable throughout the research process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 md:grid-cols-2 lg:grid-cols-4">
          {researchPrinciples.map((item) => (
            <div key={item.title}>
              <h2 className="font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Research */}
      <section
        id="research"
        className="mx-auto max-w-7xl px-6 py-24 md:py-28"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Research
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Research built around understanding.
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            Move beyond isolated ratios and market noise. Study companies
            through their businesses, reported financial performance,
            valuation, risks and the variables that matter over time.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {researchPaths.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.045]"
            >
              <h3 className="text-xl font-semibold">{item.title}</h3>

              <p className="mt-4 leading-7 text-slate-400">
                {item.description}
              </p>

              <div className="mt-7 text-sm font-semibold text-emerald-400">
                {item.action} →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stocks */}
      <section
        id="stocks"
        className="border-y border-white/10 bg-[#06101d]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-28">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Company Research
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                Explore Indian equities with context.
              </h2>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
                Search the research universe and examine each company through
                business quality, financial performance, market data,
                valuation and risk.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Coverage Standard
              </p>

              <p className="mt-3 leading-7 text-slate-300">
                Verified coverage is being expanded progressively. Missing data
                is shown as unavailable rather than replaced with estimated or
                invented figures.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <StockSearch />
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Verified Financials",
                text: "Reported company data passes validation before entering the research layer.",
              },
              {
                title: "Market Data Status",
                text: "Available, stale and unavailable market data are handled explicitly.",
              },
              {
                title: "Source Awareness",
                text: "Research is designed to preserve the distinction between reported facts and interpretation.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section
        id="results"
        className="border-y border-white/10 bg-[#07111f]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-28">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Results Intelligence
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                Understand what changed.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-400">
                Quarterly results become useful only when reported numbers are
                connected with business performance, profitability, operating
                drivers and the investment thesis.
              </p>
            </div>

            <div className="lg:text-right">
              <Link
                href="/results"
                className="inline-flex rounded-lg border border-emerald-400/20 bg-emerald-400/[0.05] px-5 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/10"
              >
                Open Results Intelligence →
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {resultQuestions.map((item) => (
              <div
                key={item.number}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-7"
              >
                <div className="text-sm font-semibold text-emerald-400">
                  {item.number}
                </div>

                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>

                <p className="mt-4 leading-7 text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-[#06101d] p-6 md:p-8">
            <div className="grid gap-7 md:grid-cols-[auto_1fr] md:items-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] text-sm font-bold text-emerald-400">
                ✓
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Verified-data principle
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  No demo financial figures on production.
                </h3>

                <p className="mt-3 max-w-3xl leading-7 text-slate-400">
                  Results presented as company data should originate from
                  verified financial sources. When verified information is not
                  available, the interface should communicate that clearly
                  rather than displaying illustrative numbers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section
        id="sectors"
        className="border-y border-white/10 bg-[#06101d]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-28">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.65fr] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Sector Research
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                Understand the industry behind the company.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-400">
                A company does not operate in isolation. Sector structure,
                regulation, competition, cyclicality and capital intensity can
                materially influence long-term outcomes.
              </p>
            </div>

            <div className="lg:text-right">
              <Link
                href="/sectors"
                className="inline-flex rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                Explore Sector Research →
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {sectorLenses.map((item, index) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-7"
              >
                <div className="text-sm font-semibold text-emerald-400">
                  0{index + 1}
                </div>

                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>

                <p className="mt-4 leading-7 text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              "Industry Structure",
              "Demand Drivers",
              "Competitive Advantage",
              "Sector Risk",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/10 bg-black/10 px-5 py-4 text-sm text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section
        id="methodology"
        className="border-y border-white/10 bg-[#07111f]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-28">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Research Intelligence System
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              TECH-FUNDA™
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              A structured research framework connecting market behaviour,
              business quality, valuation, risk and continuous monitoring.
            </p>
          </div>

          {/* Research Flow */}
          <div className="mt-14 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
            <div className="border-b border-white/10 px-6 py-5">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Core Research Flow
              </div>
            </div>

            <div className="grid md:grid-cols-5">
              {framework.map((item, index) => (
                <div
                  key={item.title}
                  className={`group relative p-7 transition hover:bg-white/[0.04] ${
                    index !== framework.length - 1
                      ? "border-b border-white/10 md:border-b-0 md:border-r"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-400">
                      {item.number}
                    </span>

                    {index !== framework.length - 1 && (
                      <span className="hidden text-slate-600 md:block">→</span>
                    )}
                  </div>

                  <h3 className="mt-7 text-2xl font-semibold">{item.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pillars */}
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {methodologyPillars.map((pillar, index) => (
              <div
                key={pillar.title}
                className="group rounded-2xl border border-white/10 bg-[#07111f] p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30"
              >
                <div className="text-xs font-bold tracking-[0.18em] text-emerald-400">
                  0{index + 1}
                </div>

                <h3 className="mt-3 text-xl font-bold tracking-wide">
                  {pillar.title}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {pillar.subtitle}
                </p>

                <div className="mt-6 space-y-3">
                  {pillar.items.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-slate-400"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Research Logic */}
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Research Logic
              </p>

              <h3 className="mt-4 text-2xl font-semibold">
                Data → Evidence → Analysis → Conclusion
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                Research should preserve the distinction between reported
                information, calculated metrics, management statements and
                analytical interpretation.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {["Data", "Evidence", "Analysis", "Conclusion"].map((step) => (
                  <span
                    key={step}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300"
                  >
                    {step}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.04] p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Investor Mindset
              </p>

              <h3 className="mt-4 text-2xl font-semibold">
                Understand first. Decide with discipline.
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                TECH-FUNDA™ is designed to help investors examine business
                quality, valuation and risk together rather than relying on a
                single metric or short-term market movement.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  "Long-Term Thinking",
                  "Evidence First",
                  "Risk Awareness",
                  "Continuous Monitoring",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/10 bg-[#07111f]/70 p-4 text-sm text-slate-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex">
            <Link
              href="/methodology"
              className="rounded-lg border border-emerald-400/20 bg-emerald-400/[0.05] px-5 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/10"
            >
              Read Full Methodology →
            </Link>
          </div>
        </div>
      </section>

      {/* Data Integrity */}
      <section className="border-y border-white/10 bg-[#06101d]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Research Integrity
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                Know what the information represents.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-400">
                Reliable research depends not only on the number itself, but
                also on where it came from and whether it was reported,
                calculated or interpreted.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Reported Facts",
                  text: "Financial figures sourced from company or exchange disclosures.",
                },
                {
                  title: "Market Data",
                  text: "Price information handled separately with explicit freshness status.",
                },
                {
                  title: "Calculated Metrics",
                  text: "Growth, margins and other derived measures calculated from underlying data.",
                },
                {
                  title: "Research Interpretation",
                  text: "Analytical conclusions remain distinguishable from reported information.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Learn */}
      <section
        id="learn"
        className="border-y border-white/10 bg-[#07111f]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-28">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.5fr] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Investor Education
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                Learn to think like an investor.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-400">
                Clear, practical education covering businesses, financial
                statements, valuation, market behaviour and investment risk.
              </p>
            </div>

            <div className="lg:text-right">
              <Link
                href="/learn"
                className="inline-flex rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold transition hover:bg-white/5"
              >
                Explore Learning →
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {learningModules.map((lesson) => (
              <div
                key={lesson.number}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-[0.2em] text-emerald-400">
                    {lesson.number}
                  </span>

                  <span className="text-slate-600 transition group-hover:text-emerald-400">
                    →
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-semibold">{lesson.title}</h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {lesson.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {lesson.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.04] p-8 md:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  Mission Wealth Philosophy
                </p>

                <h3 className="mt-4 text-2xl font-semibold md:text-3xl">
                  Research should make investors more independent.
                </h3>

                <p className="mt-4 max-w-3xl leading-7 text-slate-400">
                  The objective is not to create dependency on stock calls. It
                  is to help investors build the knowledge, process and
                  discipline required to understand an investment thesis
                  independently.
                </p>
              </div>

              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-emerald-400/30 bg-[#07111f] text-center">
                <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                  Learn
                  <br />
                  Think
                  <br />
                  Decide
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section
        id="about"
        className="mx-auto max-w-5xl px-6 py-28 text-center md:py-32"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
          MISSION WEALTH™
        </p>

        <h2 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">
          Serve With Honour.
          <span className="block text-emerald-400">
            Invest With Discipline.
          </span>
        </h2>

        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-400">
          Our objective is to make investment research more structured,
          transparent and understandable for long-term investors.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/about"
            className="rounded-lg border border-white/15 px-6 py-3 text-sm font-semibold transition hover:bg-white/5"
          >
            About Mission Wealth
          </Link>

          <Link
            href="/disclosures"
            className="rounded-lg border border-emerald-400/20 bg-emerald-400/[0.05] px-6 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/10"
          >
            Read Disclosures
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#050d18]">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="font-semibold text-white">MISSION WEALTH™</div>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Structured investment research and investor education powered
                by the TECH-FUNDA™ framework.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
              <Link
                href="/research"
                className="transition hover:text-white"
              >
                Research
              </Link>

              <Link
                href="/methodology"
                className="transition hover:text-white"
              >
                Methodology
              </Link>

              <Link
                href="/about"
                className="transition hover:text-white"
              >
                About
              </Link>

              <Link
                href="/contact"
                className="transition hover:text-white"
              >
                Contact
              </Link>

              <Link
                href="/disclosures"
                className="transition hover:text-white"
              >
                Disclosures
              </Link>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6 text-xs leading-6 text-slate-600">
            <p>
              © 2026 MISSION WEALTH™. Investment Research & Education.
            </p>

            <p className="mt-2 max-w-4xl">
              Information presented on Mission Wealth is intended for research
              and educational purposes. It does not constitute a guarantee of
              investment returns or a recommendation to buy or sell any
              security. Investors should conduct their own due diligence and
              consider their individual circumstances before making investment
              decisions.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}