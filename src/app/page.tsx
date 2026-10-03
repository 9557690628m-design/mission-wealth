import Navbar from "@/components/Navbar";
import StockSearch from "@/components/StockSearch";
import Link from "next/link";
export default function Home() {

  return (
    <main className="min-h-screen bg-[#07111f] text-white">

           {/* Navigation */}
     <Navbar />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-24 md:pt-32">
        <div className="grid items-center gap-16 md:grid-cols-2">

          {/* Hero Text */}
          <div>
            <div className="mb-6 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-sm text-emerald-300">
              Powered by TECH-FUNDA™
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Understand the business.
              <span className="block text-emerald-400">
                Invest with discipline.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
              Structured investment research for long-term Indian investors.
              We bring together business fundamentals, market structure,
              valuation and risk into one disciplined research framework.
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

            <p className="mt-6 text-sm text-slate-500">
              Data → Evidence → Analysis → Conclusion
            </p>
          </div>

          {/* Framework Visual */}
          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl">

              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Research Framework
                  </p>

                  <p className="mt-1 text-xl font-semibold">
                    TECH-FUNDA™
                  </p>
                </div>

                <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.7)]" />
              </div>

              <div className="space-y-3">

                {[
                  ["01", "Market", "Trend • Momentum • Structure"],
                  ["02", "Business", "Growth • Quality • Cash Flow"],
                  ["03", "Value", "Valuation • Expectations"],
                  ["04", "Risk", "Business • Financial • Governance"],
                  ["05", "Monitor", "Results • Catalysts • Thesis"],
                ].map(([number, title, description]) => (

                  <div
                    key={number}
                    className="rounded-xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex items-center gap-4">

                      <span className="text-xs text-emerald-400">
                        {number}
                      </span>

                      <div>
                        <p className="font-semibold">
                          {title}
                        </p>

                        <p className="text-sm text-slate-500">
                          {description}
                        </p>
                      </div>

                    </div>
                  </div>

                ))}

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Trust */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 md:grid-cols-4">

          {[
            ["Business First", "Understand what the company actually does."],
            ["Data Driven", "Focus on evidence rather than market noise."],
            ["Valuation", "Study price in the context of business value."],
            ["Risk Aware", "Identify what can go wrong before investing."],
          ].map(([title, text]) => (

            <div key={title}>
              <h3 className="font-semibold">
                {title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {text}
              </p>
            </div>

          ))}

        </div>
      </section>

      {/* Research */}
      <section
        id="research"
        className="mx-auto max-w-7xl px-6 py-24"
      >

        <div className="max-w-2xl">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Research
          </p>

          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Research built around understanding.
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            Explore companies through business fundamentals, financial
            performance, market behaviour, valuation, risk and ongoing
            monitoring.
          </p>

        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">

          {[
            [
              "Company Research",
              "Business → Financials → Quality → Valuation → Risk",
            ],
            [
              "Results Intelligence",
              "What changed? Why did it change? What should investors monitor?",
            ],
            [
              "Sector Research",
              "Understand industry structure, cycles, competition and growth drivers.",
            ],
          ].map(([title, text]) => (

            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-7"
            >

              <h3 className="text-xl font-semibold">
                {title}
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                {text}
              </p>

              <div className="mt-7 text-sm font-semibold text-emerald-400">
                Explore →
              </div>

            </div>

          ))}

        </div>
      </section>
      {/* Stocks */}
      <section
        id="stocks"
        className="border-y border-white/10 bg-[#06101d]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24">

         {/* Section Header */}
<div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

  <div>
    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
      Stocks
    </p>

    <h2 className="mt-4 text-4xl font-bold md:text-5xl">
      Indian Equity Research
    </h2>

    <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
      Explore companies through business quality, financial
      performance, valuation, market structure and risk.
    </p>
  </div>

</div>

<StockSearch />

{/* Market Overview */}
<div className="mt-12 grid gap-4 md:grid-cols-4">

  {[
    ["NIFTY 50", "25,000", "+0.82%"],
    ["SENSEX", "81,500", "+0.71%"],
    ["NIFTY BANK", "56,200", "+0.64%"],
    ["NIFTY IT", "42,850", "+1.12%"],
  ].map(([name, value, change]) => (

    <div
      key={name}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
    >
      <div className="text-xs font-medium tracking-wider text-slate-500">
        {name}
      </div>

      <div className="mt-3 text-2xl font-semibold">
        {value}
      </div>

      <div className="mt-2 text-sm text-emerald-400">
        {change}
      </div>
    </div>

  ))}

</div>

{/* Disclaimer */}
<p className="mt-5 text-xs leading-6 text-slate-600">
  Demo data shown for interface development only. This section will
  use verified market data when the live data infrastructure is connected.
</p>
          
        </div>
      </section>
            {/* Results */}
      <section
        id="results"
        className="border-y border-white/10 bg-[#07111f]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24">

          {/* Section Header */}
          <div className="max-w-3xl">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Results Intelligence
            </p>

            <h2 className="mt-4 text-4xl font-bold md:text-5xl">
              Understand what changed.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-400">
              Quarterly results analysed through business performance,
              profitability, cash flow, management commentary and
              TECH-FUNDA™ research principles.
            </p>

          </div>

          {/* Company Result Header */}
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Latest Result
                </p>

                <h3 className="mt-2 text-2xl font-semibold">
                  HDFC Bank
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Quarterly Performance • Demo Data
                </p>
              </div>

             <Link
  href="/stocks/hdfcbank"
  className="rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-sm text-emerald-300 transition hover:bg-emerald-400/10"
>
  Result Analysis →
</Link>

            </div>

          </div>

          {/* Financial Metrics */}
          <div className="mt-6 grid gap-4 md:grid-cols-4">

            {[
              ["Revenue", "₹78,400 Cr", "+8.4% YoY"],
              ["Net Profit", "₹16,900 Cr", "+10.2% YoY"],
              ["EPS", "₹21.40", "+9.1% YoY"],
              ["ROE", "16.8%", "Stable"],
            ].map(([title, value, change]) => (

              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >

                <div className="text-xs uppercase tracking-wider text-slate-500">
                  {title}
                </div>

                <div className="mt-3 text-2xl font-semibold">
                  {value}
                </div>

                <div className="mt-2 text-sm text-emerald-400">
                  {change}
                </div>

              </div>

            ))}

          </div>

          {/* Results Analysis */}
          <div className="mt-8 grid gap-5 md:grid-cols-3">

            {/* What Changed */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">

              <div className="text-sm font-semibold text-emerald-400">
                01 • What Changed?
              </div>

              <h3 className="mt-4 text-xl font-semibold">
                Business performance
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                Revenue and earnings increased compared with the previous
                year, indicating continued operating growth in the demo
                dataset.
              </p>

            </div>

            {/* Why Changed */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">

              <div className="text-sm font-semibold text-emerald-400">
                02 • Why Did It Change?
              </div>

              <h3 className="mt-4 text-xl font-semibold">
                Key business drivers
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                Profitability can be examined through revenue growth,
                margins, operating efficiency, credit growth and other
                company-specific operating metrics.
              </p>

            </div>

            {/* Monitor */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">

              <div className="text-sm font-semibold text-emerald-400">
                03 • What To Monitor?
              </div>

              <h3 className="mt-4 text-xl font-semibold">
                Future indicators
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                Investors can monitor future results, management commentary,
                margins, balance-sheet quality, cash generation and changes
                to the investment thesis.
              </p>

            </div>

          </div>

          {/* Quarterly Trend */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">

            <div className="border-b border-white/10 bg-white/[0.04] px-6 py-5">

              <h3 className="font-semibold">
                Quarterly Financial Trend
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Illustrative data for interface development
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px] text-left">

                <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">

                  <tr>
                    <th className="px-6 py-4 font-medium">
                      Metric
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Q1
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Q2
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Q3
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Q4
                    </th>

                    <th className="px-6 py-4 font-medium">
                      YoY
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {[
                    ["Revenue", "₹70,200 Cr", "₹72,800 Cr", "₹75,100 Cr", "₹78,400 Cr", "+8.4%"],
                    ["Operating Profit", "₹31,800 Cr", "₹32,600 Cr", "₹33,900 Cr", "₹35,200 Cr", "+7.6%"],
                    ["Net Profit", "₹15,100 Cr", "₹15,700 Cr", "₹16,200 Cr", "₹16,900 Cr", "+10.2%"],
                    ["EPS", "₹19.10", "₹19.80", "₹20.50", "₹21.40", "+9.1%"],
                  ].map(([metric, q1, q2, q3, q4, yoy]) => (

                    <tr
                      key={metric}
                      className="border-b border-white/10 last:border-b-0"
                    >

                      <td className="px-6 py-4 text-sm font-medium">
                        {metric}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-400">
                        {q1}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-400">
                        {q2}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-400">
                        {q3}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-300">
                        {q4}
                      </td>

                      <td className="px-6 py-4 text-sm text-emerald-400">
                        {yoy}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

          {/* Disclaimer */}
          <p className="mt-5 text-xs leading-6 text-slate-600">
            Demo figures are illustrative and provided only for interface
            development. Production results will be based on verified
            company filings and market data.
          </p>

        </div>
      </section>
            {/* Sectors */}
      <section
        id="sectors"
        className="border-y border-white/10 bg-[#06101d]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24">

          {/* Section Header */}
          <div className="max-w-3xl">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Sector Research
            </p>

            <h2 className="mt-4 text-4xl font-bold md:text-5xl">
              Understand the industry behind the company.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-400">
              Study sector structure, growth drivers, competitive dynamics,
              earnings trends, valuation and the risks that can influence
              businesses within an industry.
            </p>

          </div>

          {/* Sector Overview */}
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            {[
              [
                "Banking & Financial Services",
                "Credit growth • Asset quality • Margins",
                "18 Companies",
              ],
              [
                "Information Technology",
                "Digital demand • Margins • Global exposure",
                "15 Companies",
              ],
              [
                "Oil & Gas",
                "Energy prices • Refining • Capacity",
                "12 Companies",
              ],
              [
                "Automobile",
                "Volumes • EV transition • Margins",
                "16 Companies",
              ],
              [
                "Pharmaceuticals",
                "Domestic demand • Exports • R&D",
                "14 Companies",
              ],
              [
                "Industrials & Infrastructure",
                "Capex • Order book • Execution",
                "22 Companies",
              ],
              [
                "FMCG",
                "Consumption • Margins • Distribution",
                "13 Companies",
              ],
              [
                "Telecom",
                "Subscribers • ARPU • Capex",
                "5 Companies",
              ],
].map(([sector, drivers, companies]) => (
  <Link
    key={sector}
    href="/sectors"
    className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-emerald-400/30 hover:bg-white/[0.05]"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/5">
        <span className="text-sm font-semibold text-emerald-400">
          {sector.charAt(0)}
        </span>
      </div>

      <span className="text-xs text-slate-600">
        {companies}                                                                                   
      </span>
    </div>

    <h3 className="mt-6 text-lg font-semibold">                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
      {sector}
    </h3>

    <p className="mt-3 text-sm leading-6 text-slate-400">                                                                                                  
      {drivers}
    </p>

    <div className="mt-6 text-sm font-semibold text-emerald-400">
      Explore Sector →
    </div>
  </Link>
))}                                                                               

          </div>

          {/* Sector Analysis */}
          <div className="mt-10 grid gap-5 md:grid-cols-3">

            {/* Growth Drivers */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">

              <div className="text-sm font-semibold text-emerald-400">
                01 • Growth Drivers
              </div>

              <h3 className="mt-4 text-xl font-semibold">
                What drives the sector?
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                Identify the economic, industry and company-level factors
                that influence demand, revenue growth and profitability.
              </p>

            </div>

            {/* Competitive Structure */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">

              <div className="text-sm font-semibold text-emerald-400">
                02 • Competitive Structure
              </div>

              <h3 className="mt-4 text-xl font-semibold">
                Who has the advantage?
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                Examine market share, competitive intensity, entry barriers,
                pricing power, scale advantages and business models.
              </p>

            </div>

            {/* Sector Risks */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">

              <div className="text-sm font-semibold text-emerald-400">
                03 • Sector Risks
              </div>

              <h3 className="mt-4 text-xl font-semibold">
                What can go wrong?
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                Monitor regulation, cyclicality, commodity prices, demand
                changes, competition, leverage and other industry-specific
                risks.
              </p>

            </div>

          </div>

          {/* Sector Dashboard */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">

            <div className="border-b border-white/10 bg-white/[0.04] px-6 py-5">

              <h3 className="font-semibold">
                Sector Research Dashboard
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Illustrative data for interface development
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[800px] text-left">

                <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">

                  <tr>

                    <th className="px-6 py-4 font-medium">
                      Sector
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Earnings Trend
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Valuation
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Market Structure
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Risk
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {[
                    [
                      "Banking & Financial Services",
                      "Improving",
                      "Moderate",
                      "Competitive",
                      "Medium",
                    ],
                    [
                      "Information Technology",
                      "Stable",
                      "Premium",
                      "Competitive",
                      "Medium",
                    ],
                    [
                      "Oil & Gas",
                      "Cyclical",
                      "Moderate",
                      "Concentrated",
                      "High",
                    ],
                    [
                      "Automobile",
                      "Improving",
                      "Moderate",
                      "Competitive",
                      "Medium",
                    ],
                    [
                      "Pharmaceuticals",
                      "Stable",
                      "Moderate",
                      "Fragmented",
                      "Medium",
                    ],
                  ].map(
                    ([
                      sector,
                      earnings,
                      valuation,
                      structure,
                      risk,
                    ]) => (

                      <tr
                        key={sector}
                        className="border-b border-white/10 last:border-b-0"
                      >

                        <td className="px-6 py-5 text-sm font-medium">
                          {sector}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-400">
                          {earnings}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-400">
                          {valuation}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-400">
                          {structure}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-400">
                          {risk}
                        </td>

                      </tr>

                    ),
                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* Disclaimer */}
          <p className="mt-5 text-xs leading-6 text-slate-600">
            Sector figures and classifications shown above are illustrative
            demo data for interface development. Production research will use
            verified financial and market information.
          </p>

        </div>
      </section>
    {/* Methodology */}
<section
  id="methodology"
  className="border-y border-white/10 bg-[#06101d]"
>
  <div className="mx-auto max-w-7xl px-6 py-24">

    {/* Header */}
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
        Research Intelligence System
      </p>

      <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
        TECH-FUNDA™
      </h2>

      <p className="mt-6 text-lg leading-8 text-slate-400">
        A structured research framework designed to connect market behaviour,
        business quality, valuation, risk and continuous monitoring.
      </p>
    </div>

    {/* Core Research Flow */}
    <div className="mt-14 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">

      <div className="border-b border-white/10 px-6 py-5">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Core Research Flow
        </div>
      </div>

      <div className="grid md:grid-cols-5">

        {[
          {
            no: "01",
            title: "Market",
            desc: "Understand price behaviour",
          },
          {
            no: "02",
            title: "Business",
            desc: "Understand the company",
          },
          {
            no: "03",
            title: "Value",
            desc: "Assess what the business is worth",
          },
          {
            no: "04",
            title: "Risk",
            desc: "Identify what can go wrong",
          },
          {
            no: "05",
            title: "Monitor",
            desc: "Track what changes over time",
          },
        ].map((item, index) => (
          <div
            key={item.title}
            className={`group relative p-7 transition hover:bg-white/[0.04] ${
              index !== 4 ? "border-b md:border-b-0 md:border-r border-white/10" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400">
                {item.no}
              </span>

              {index !== 4 && (
                <span className="hidden text-slate-600 md:block">
                  →
                </span>
              )}
            </div>

            <h3 className="mt-7 text-2xl font-semibold">
              {item.title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {item.desc}
            </p>
          </div>
        ))}

      </div>
    </div>

    {/* Five Pillars */}
    <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">

      {[
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
      ].map((pillar, index) => (
        <div
          key={pillar.title}
          className="group rounded-2xl border border-white/10 bg-[#07111f] p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-bold tracking-[0.18em] text-emerald-400">
                0{index + 1}
              </div>

              <h3 className="mt-3 text-xl font-bold tracking-wide">
                {pillar.title}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {pillar.subtitle}
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-xs text-slate-500">
              +
            </div>
          </div>

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
    <div className="mt-10 grid gap-4 lg:grid-cols-2">

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Research Logic
        </p>

        <h3 className="mt-4 text-2xl font-semibold">
          Data → Evidence → Analysis → Conclusion
        </h3>

        <p className="mt-4 leading-7 text-slate-400">
          Every research view is designed to separate reported information,
          calculated metrics, analytical interpretation and final conclusions.
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
          TECH-FUNDA™ is designed to help investors examine the business,
          valuation and risk together rather than relying on a single metric
          or short-term market movement.
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

    {/* Disclaimer */}
    <p className="mt-8 text-xs leading-5 text-slate-600">
      TECH-FUNDA™ is an analytical framework for investment research and
      educational purposes. It does not constitute a guarantee of investment
      returns or a recommendation to buy or sell any security.
    </p>

  </div>
</section>
{/* Learn */}
<section
  id="learn"
  className="border-y border-white/10 bg-[#07111f]"
>
  <div className="mx-auto max-w-7xl px-6 py-24">

    {/* Header */}
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
        Investor Education
      </p>

      <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
        Learn to think like an investor.
      </h2>

      <p className="mt-5 text-lg leading-8 text-slate-400">
        Clear, practical education covering businesses, financial statements,
        valuation, market behaviour and investment risk.
      </p>
    </div>

    {/* Learning Cards */}
    <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

      {[
        {
          no: "01",
          title: "Understand Businesses",
          desc: "Learn how companies make money, grow, compete and create long-term value.",
          topics: ["Business Model", "Moat", "Growth"],
        },
        {
          no: "02",
          title: "Read Financials",
          desc: "Understand revenue, profit, cash flow, balance sheets and important ratios.",
          topics: ["P&L", "Balance Sheet", "Cash Flow"],
        },
        {
          no: "03",
          title: "Understand Valuation",
          desc: "Learn how investors evaluate what they are paying for a company's earnings and growth.",
          topics: ["P/E", "EV/EBITDA", "DCF"],
        },
        {
          no: "04",
          title: "Read Market Behaviour",
          desc: "Understand price trends, momentum, volume and market structure.",
          topics: ["Trend", "Momentum", "Volume"],
        },
        {
          no: "05",
          title: "Understand Risk",
          desc: "Identify business, financial, valuation, governance and market risks.",
          topics: ["Risk", "Red Flags", "Scenarios"],
        },
        {
          no: "06",
          title: "Build Investment Discipline",
          desc: "Develop a repeatable process for research, decision-making and monitoring.",
          topics: ["Process", "Patience", "Monitoring"],
        },
      ].map((lesson) => (
        <div
          key={lesson.no}
          className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30"
        >

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-[0.2em] text-emerald-400">
              {lesson.no}
            </span>

            <span className="text-slate-600 transition group-hover:text-emerald-400">
              →
            </span>
          </div>

          <h3 className="mt-7 text-xl font-semibold">
            {lesson.title}
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {lesson.desc}
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

    {/* Education Philosophy */}
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
            The objective is not to create dependency on stock calls.
            It is to build the knowledge and discipline required to
            understand an investment thesis independently.
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
        className="mx-auto max-w-5xl px-6 py-28 text-center"
      >

        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
          MISSION WEALTH™
        </p>

        <h2 className="mt-5 text-4xl font-bold md:text-6xl">
          Serve With Honour.
          <span className="block text-emerald-400">
            Invest With Discipline.
          </span>
        </h2>

        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-400">
          Our objective is simple: make investment research more structured,
          transparent and understandable for long-term investors.
        </p>

      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">

          <div>
            © 2026 MISSION WEALTH™. Investment Research & Advisory.
          </div>

          <div className="flex gap-6">
            <span>Disclosures</span>
            <span>Privacy</span>
            <span>Terms</span>
          </div>

        </div>

      </footer>

    </main>
  );
}