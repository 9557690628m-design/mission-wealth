import Navbar from "@/components/Navbar";
type CompanyPageProps = {
  params: Promise<{
    symbol: string;
  }>;
};

const companyData: Record<
  string,
  {
    name: string;
    symbol: string;
    sector: string;
    price: string;
    pe: string;
    roe: string;
    signal: string;
    description: string;
  }
> = {
  hdfcbank: {
    name: "HDFC Bank",
    symbol: "HDFCBANK",
    sector: "Banking & Financial Services",
    price: "₹1,720",
    pe: "18.4",
    roe: "16.8%",
    signal: "Strong",
    description:
      "Large private-sector bank with a diversified retail, commercial, and corporate banking franchise.",
  },

  tcs: {
    name: "TCS",
    symbol: "TCS",
    sector: "Information Technology",
    price: "₹3,980",
    pe: "29.2",
    roe: "51.4%",
    signal: "Strong",
    description:
      "Large global information technology services company serving enterprises across multiple industries.",
  },

  reliance: {
    name: "Reliance Industries",
    symbol: "RELIANCE",
    sector: "Oil & Gas",
    price: "₹2,850",
    pe: "24.6",
    roe: "9.8%",
    signal: "Positive",
    description:
      "Diversified Indian business group with major operations across energy, consumer, telecommunications, and digital services.",
  },

  infosys: {
    name: "Infosys",
    symbol: "INFY",
    sector: "Information Technology",
    price: "₹1,620",
    pe: "25.8",
    roe: "29.6%",
    signal: "Neutral",
    description:
      "Global information technology services and consulting company serving enterprise clients worldwide.",
  },

  lt: {
    name: "Larsen & Toubro",
    symbol: "LT",
    sector: "Industrials & Infrastructure",
    price: "₹3,650",
    pe: "31.5",
    roe: "14.2%",
    signal: "Positive",
    description:
      "Major engineering, construction, infrastructure, and technology company with a diversified order-driven business.",
  },
};

export default async function CompanyPage({
  params,
}: CompanyPageProps) {
  const { symbol } = await params;

  const company = companyData[symbol.toLowerCase()];

  if (!company) {
    return (
      <main className="min-h-screen bg-[#07111f] text-white">
        <div className="mx-auto max-w-4xl px-6 py-24">
          <div className="text-sm uppercase tracking-[0.2em] text-slate-500">
            MISSION WEALTH™
          </div>

          <h1 className="mt-4 text-4xl font-semibold">
            Company not found
          </h1>

          <p className="mt-4 text-slate-400">
            The requested company research page is not available yet.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <Navbar />

      <section className="border-b border-white/10 bg-[#06101d]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-sm uppercase tracking-[0.2em] text-emerald-400">
            Company Research
          </div>

          <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
                {company.name}
              </h1>

              <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-400">
                <span>{company.symbol}</span>
                <span>•</span>
                <span>{company.sector}</span>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-5 py-3">
              <div className="text-xs uppercase tracking-wider text-slate-500">
                TECH-FUNDA™
              </div>

              <div className="mt-1 font-semibold text-emerald-300">
                {company.signal}
              </div>
            </div>
          </div>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-400">
            {company.description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <div className="text-xs uppercase tracking-wider text-slate-500">
              Price
            </div>

            <div className="mt-3 text-3xl font-semibold">
              {company.price}
            </div>

            <div className="mt-2 text-sm text-emerald-400">
              Demo data
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <div className="text-xs uppercase tracking-wider text-slate-500">
              P/E
            </div>

            <div className="mt-3 text-3xl font-semibold">
              {company.pe}
            </div>

            <div className="mt-2 text-sm text-slate-500">
              Illustrative
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <div className="text-xs uppercase tracking-wider text-slate-500">
              ROE
            </div>

            <div className="mt-3 text-3xl font-semibold">
              {company.roe}
            </div>

            <div className="mt-2 text-sm text-slate-500">
              Illustrative
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
            <div className="text-sm font-medium text-emerald-400">
              01 · BUSINESS
            </div>

            <h2 className="mt-3 text-2xl font-semibold">
              Business Quality
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              Business model, competitive position, growth drivers,
              industry structure, and operating quality will be analysed
              here.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
            <div className="text-sm font-medium text-emerald-400">
              02 · FUNDAMENTALS
            </div>

            <h2 className="mt-3 text-2xl font-semibold">
              Financial Quality
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              Revenue, earnings, margins, ROE, ROCE, cash flow, and
              balance-sheet trends will be analysed here.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
            <div className="text-sm font-medium text-emerald-400">
              03 · VALUE
            </div>

            <h2 className="mt-3 text-2xl font-semibold">
              Valuation Intelligence
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              P/E, P/B, EV/EBITDA, cash-flow valuation, historical
              valuation, and growth expectations will be assessed here.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
            <div className="text-sm font-medium text-emerald-400">
              04 · RISK
            </div>

            <h2 className="mt-3 text-2xl font-semibold">
              Risk Intelligence
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              Business, financial, valuation, governance, industry, and
              market risks will be identified and monitored.
            </p>
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.02] p-8">
          <div className="text-sm font-medium text-emerald-400">
            TECH-FUNDA™ RESEARCH LOGIC
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full border border-white/10 px-4 py-2">
              Market
            </span>

            <span className="text-slate-600">→</span>

            <span className="rounded-full border border-white/10 px-4 py-2">
              Business
            </span>

            <span className="text-slate-600">→</span>

            <span className="rounded-full border border-white/10 px-4 py-2">
              Value
            </span>

            <span className="text-slate-600">→</span>

            <span className="rounded-full border border-white/10 px-4 py-2">
              Risk
            </span>

            <span className="text-slate-600">→</span>

            <span className="rounded-full border border-white/10 px-4 py-2">
              Monitor
            </span>
          </div>
        </div>

        <p className="mt-6 text-xs leading-6 text-slate-600">
          Demo figures and research content shown for interface
          development only. Verified market data, financial statements,
          sources, and calculations will be connected later.
        </p>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-slate-500">
          © 2026 MISSION WEALTH™. Investment Research & Advisory.
        </div>
      </footer>
    </main>
  );
}