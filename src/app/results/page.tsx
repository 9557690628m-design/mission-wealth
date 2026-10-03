import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ResultsPage() {
  const results = [
    {
      company: "HDFC Bank",
      period: "Q1 FY2027",
      revenue: "₹78,420 Cr",
      profit: "₹19,850 Cr",
      growth: "+6.8%",
      status: "Positive",
    },
    {
      company: "TCS",
      period: "Q1 FY2027",
      revenue: "₹64,190 Cr",
      profit: "₹12,760 Cr",
      growth: "+5.4%",
      status: "Positive",
    },
    {
      company: "Reliance Industries",
      period: "Q1 FY2027",
      revenue: "₹2,31,500 Cr",
      profit: "₹19,120 Cr",
      growth: "+4.2%",
      status: "Stable",
    },
    {
      company: "Infosys",
      period: "Q1 FY2027",
      revenue: "₹43,280 Cr",
      profit: "₹6,420 Cr",
      growth: "+3.9%",
      status: "Stable",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#07111f] text-white">
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-4 text-sm uppercase tracking-[0.2em] text-emerald-400">
            Results Intelligence
          </div>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            Understand what changed in quarterly results.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            Quarterly results are more than headline numbers. Study revenue,
            earnings, profitability, business performance, and the factors
            driving changes in financial performance.
          </p>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <div className="text-sm text-emerald-400">01</div>

              <h2 className="mt-4 text-xl font-semibold">
                Financial Performance
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Review revenue, profit, margins, earnings growth, and other
                important financial indicators.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <div className="text-sm text-emerald-400">02</div>

              <h2 className="mt-4 text-xl font-semibold">
                Business Drivers
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Understand the operational and industry factors that influenced
                the quarter.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <div className="text-sm text-emerald-400">03</div>

              <h2 className="mt-4 text-xl font-semibold">
                What To Monitor
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Identify important developments, management commentary,
                catalysts, and risks to monitor in future quarters.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">
                Latest Results
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Illustrative data for website development.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left">
                  <thead className="border-b border-white/10 bg-white/[0.03]">
                    <tr>
                      <th className="px-6 py-4 text-sm font-medium text-slate-400">
                        Company
                      </th>

                      <th className="px-6 py-4 text-sm font-medium text-slate-400">
                        Period
                      </th>

                      <th className="px-6 py-4 text-sm font-medium text-slate-400">
                        Revenue
                      </th>

                      <th className="px-6 py-4 text-sm font-medium text-slate-400">
                        Profit
                      </th>

                     <th className="px-6 py-4 text-sm font-medium text-slate-400">
  Growth
</th>

<th className="px-6 py-4 text-sm font-medium text-slate-400">
  Signal
</th>

<th className="px-6 py-4 text-sm font-medium text-slate-400">
  View
</th>
                     
                    </tr>
                  </thead>

                  <tbody>
                    {results.map((result) => (
                      <tr
                        key={result.company}
                        className="border-b border-white/10 transition hover:bg-white/[0.05]"
                      >
                        <td className="px-6 py-5 font-medium">
  <Link
    href={`/stocks/${result.company
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace("industries", "")
      .replace("larsen&toubro", "lt")}`}
    className="transition hover:text-emerald-300"
  >
    {result.company}
  </Link>
</td>

                        <td className="px-6 py-5 text-slate-300">
                          {result.period}
                        </td>

                        <td className="px-6 py-5 text-slate-300">
                          {result.revenue}
                        </td>

                        <td className="px-6 py-5 text-slate-300">
                          {result.profit}
                        </td>

                        <td className="px-6 py-5 text-emerald-300">
                          {result.growth}
                        </td>

<td className="px-6 py-5">
  <Link
    href={`/stocks/${result.company
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace("industries", "")
      .replace("larsen&toubro", "lt")}`}
    className="text-xs font-medium text-emerald-300 transition hover:text-emerald-200"
  >
    Analysis →
  </Link>
</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <div className="text-sm font-medium text-emerald-400">
              MISSION WEALTH™ Approach
            </div>

            <h2 className="mt-3 text-2xl font-semibold">
              Numbers first. Context second. Conclusion last.
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
              Our research process separates reported financial information,
              calculated metrics, management commentary, analysis, assumptions,
              and conclusions to make quarterly results easier to understand.
            </p>
          </div>

          <p className="mt-8 text-xs leading-6 text-slate-500">
            Note: All figures displayed on this page are illustrative/demo
            values for website development and do not represent live market
            data or investment recommendations.
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