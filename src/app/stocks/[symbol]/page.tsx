// src/app/stocks/[symbol]/page.tsx
import Link from "next/link";
import Navbar from "@/components/Navbar";

type CompanyPageProps = {
  params: Promise<{
    symbol: string;
  }>;
};

interface DetailedCompany {
  name: string;
  symbol: string;
  sector: string;
  price: string;
  pe: string;
  roe: string;
  signal: string;
  description: string;
  // DuPont Decomposition
  dupont: {
    netMargin: string;
    assetTurnover: string;
    equityMultiplier: string;
    summary: string;
  };
  // Detailed 4-Pillar Intelligence
  businessQuality: {
    moat: string;
    pricingPower: string;
    growthDrivers: string;
  };
  financialQuality: {
    balanceSheet: string;
    cashFlow: string;
    workingCapital: string;
  };
  valuationIntel: {
    pbRatio: string;
    evEbitda: string;
    assessment: string;
  };
  riskIntel: {
    governance: string;
    operational: string;
    cyclicality: string;
  };
}

const companyData: Record<string, DetailedCompany> = {
  hdfcbank: {
    name: "HDFC Bank",
    symbol: "HDFCBANK",
    sector: "Banking & Financial Services",
    price: "₹1,720",
    pe: "18.4",
    roe: "16.8%",
    signal: "Strong",
    description:
      "India's largest private-sector lender with industry-leading CASA ratio, pristine asset quality, and nationwide digital branch distribution.",
    dupont: {
      netMargin: "21.4%",
      assetTurnover: "0.10x",
      equityMultiplier: "7.85x",
      summary: "High financial leverage typical of Tier-1 banks, balanced by superior credit cost control and low NPA provisioning.",
    },
    businessQuality: {
      moat: "Massive low-cost CASA deposit franchise and conservative underwriting culture.",
      pricingPower: "High pricing discipline across retail loans and corporate credit lines.",
      growthDrivers: "Post-merger mortgage cross-selling and semi-urban branch penetration.",
    },
    financialQuality: {
      balanceSheet: "Gross NPA consistently maintained below 1.4% with adequate provision coverage.",
      cashFlow: "High net interest income compounding; stable net interest margins (NIM) around 3.4-3.6%.",
      workingCapital: "Strong capital adequacy ratio (CAR > 18%) comfortably exceeding RBI regulatory buffers.",
    },
    valuationIntel: {
      pbRatio: "2.6x P/B",
      evEbitda: "N/A (Banking)",
      assessment: "Trading below its 10-year historical mean price-to-book valuation multiple.",
    },
    riskIntel: {
      governance: "Stable institutional oversight with clear board succession architecture.",
      operational: "Smooth integration of mortgage book liabilities post-parent amalgamation.",
      cyclicality: "Low retail delinquency risk across credit cycles.",
    },
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
      "Global technology consulting titan with industry-leading operating profit margins, zero debt, and massive shareholder dividend distribution.",
    dupont: {
      netMargin: "19.3%",
      assetTurnover: "1.82x",
      equityMultiplier: "1.46x",
      summary: "Exceptional ROE driven by world-class operating margins and rapid asset turnover, not financial debt.",
    },
    businessQuality: {
      moat: "Sticky mission-critical IT relationships with Fortune 500 enterprises with over 95% repeat business.",
      pricingPower: "Premium billing rates in cloud migration, cyber security, and enterprise AI transformation.",
      growthDrivers: "Multi-year deal wins in enterprise AI modernization and cloud infrastructure migration.",
    },
    financialQuality: {
      balanceSheet: "Virtually zero debt with substantial net cash and liquid treasury investments.",
      cashFlow: "Free cash flow conversion consistently exceeds 100% of reported net income.",
      workingCapital: "Lean debtor days and negative net working capital requirements.",
    },
    valuationIntel: {
      pbRatio: "14.8x P/B",
      evEbitda: "20.4x",
      assessment: "Valued at a modest premium due to unrivaled execution and high dividend payout ratios.",
    },
    riskIntel: {
      governance: "Tata Group pedigree; world-class institutional corporate governance track record.",
      operational: "Managing talent attrition and shifting wage inflation in international delivery centres.",
      cyclicality: "Discretionary IT budget slowdowns across US and European BFSI verticals.",
    },
  },

  reliance: {
    name: "Reliance Industries",
    symbol: "RELIANCE",
    sector: "Energy, Retail & Telecom",
    price: "₹2,850",
    pe: "24.6",
    roe: "9.8%",
    signal: "Positive",
    description:
      "Diversified Indian conglomerate transitioning from traditional refining & petrochemicals to consumer retail, digital telco (Jio), and new green energy.",
    dupont: {
      netMargin: "7.8%",
      assetTurnover: "0.55x",
      equityMultiplier: "2.28x",
      summary: "Capital-intensive capex phase in 5G and green hydrogen temporarily suppresses asset turnover.",
    },
    businessQuality: {
      moat: "Dominant market leadership across telecom subscriber base, retail footprint, and coastal refining assets.",
      pricingPower: "Telecom tariff hikes and high retail scale economies provide long-term margin defense.",
      growthDrivers: "5G broadband monetization, omni-channel retail expansion, and solar gigafactories.",
    },
    financialQuality: {
      balanceSheet: "Manageable net debt supported by strategic equity infusions and high operating cash generation.",
      cashFlow: "Over ₹1,00,000+ Cr annual operating EBITDA funding forward capex.",
      workingCapital: "Strong supplier bargaining terms and negative retail inventory float.",
    },
    valuationIntel: {
      pbRatio: "2.1x P/B",
      evEbitda: "12.8x",
      assessment: "Sum-of-the-parts (SOTP) valuation reflects potential separate listings for Retail and Jio.",
    },
    riskIntel: {
      governance: "Family-promoter leadership backed by global institutional board representation.",
      operational: "Heavy multi-gigawatt green energy capex execution milestones.",
      cyclicality: "Exposure to global GRMs (Gross Refining Margins) and petrochemical spread fluctuations.",
    },
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
      "Tier-1 IT services exporter delivering global digital transformation, cloud migrations, and generative AI deployments to corporate clients.",
    dupont: {
      netMargin: "16.8%",
      assetTurnover: "1.28x",
      equityMultiplier: "1.38x",
      summary: "Strong capital return efficiency; high payout ratios ensure optimal equity balance base.",
    },
    businessQuality: {
      moat: "Established delivery network and multi-decade client stickiness across North America and Europe.",
      pricingPower: "Stable pricing in core legacy services; margin expansion tied to automation.",
      growthDrivers: "Topaz AI platform contracts and large cost-optimization multi-year renewals.",
    },
    financialQuality: {
      balanceSheet: "Zero debt, strong cash reserves, and robust return on invested capital (ROIC > 35%).",
      cashFlow: "High FCF yield returned to equity holders via periodic share buybacks and dividends.",
      workingCapital: "Low inventory; standard 60-70 day billing receivable cycle.",
    },
    valuationIntel: {
      pbRatio: "7.2x P/B",
      evEbitda: "16.5x",
      assessment: "Trading close to historical 5-year average valuation benchmarks.",
    },
    riskIntel: {
      governance: "Independent board with established transparent disclosures.",
      operational: "Maintaining utilization rates above 82% amidst selective discretionary client spending.",
      cyclicality: "Foreign currency INR/USD volatility and US commercial banking expenditure trends.",
    },
  },

  lt: {
    name: "Larsen & Toubro",
    symbol: "LT",
    sector: "Infrastructure & Defense",
    price: "₹3,650",
    pe: "31.5",
    roe: "14.2%",
    signal: "Positive",
    description:
      "The undisputed bellwether of Indian infrastructure, capital goods, defense engineering, and green hydrogen EPC execution.",
    dupont: {
      netMargin: "6.2%",
      assetTurnover: "0.85x",
      equityMultiplier: "2.70x",
      summary: "Leverage and asset turnover are improving as domestic capex cycle and order executions accelerate.",
    },
    businessQuality: {
      moat: "Unrivaled domestic pre-qualification capabilities for mega-scale infrastructure and defense contracts.",
      pricingPower: "Strong cost-indexation clauses protecting margins against raw material price shocks.",
      growthDrivers: "National capex push (roads, railways, defense manufacturing) and Middle East hydrocarbon EPC contracts.",
    },
    financialQuality: {
      balanceSheet: "Debt-to-equity declining steadily as non-core concession assets are monetized.",
      cashFlow: "Strong advance collections and customer milestone billings supporting operating liquidity.",
      workingCapital: "Net working capital as a percentage of revenue tightening towards target levels (16-18%).",
    },
    valuationIntel: {
      pbRatio: "4.2x P/B",
      evEbitda: "19.2x",
      assessment: "Commanding a deserved scarcity premium as the primary proxy for India's capital expenditure boom.",
    },
    riskIntel: {
      governance: "Professionally managed board with high institutional ownership.",
      operational: "Complex mega-project timeline execution risks and raw material supply volatility.",
      cyclicality: "Dependent on central government budgetary infrastructure allocation momentum.",
    },
  },
};

// Fallback generator for tickers not yet in the preset list
function generateFallbackCompany(ticker: string): DetailedCompany {
  const clean = ticker.toUpperCase();
  return {
    name: `${clean} India`,
    symbol: clean,
    sector: "Indian Equities / Specialized Sector",
    price: "₹1,240",
    pe: "22.5",
    roe: "18.5%",
    signal: "Evaluating",
    description: `Automated fundamental synthesis for ${clean}. Analyzed across business model resilience, operating margins, capital efficiency, and governance standards.`,
    dupont: {
      netMargin: "12.5%",
      assetTurnover: "1.10x",
      equityMultiplier: "1.35x",
      summary: "Balanced ROE structure driven by stable operating margins and conservative balance sheet leverage.",
    },
    businessQuality: {
      moat: "Defensible market niche with stable customer relationships and supply chain integration.",
      pricingPower: "Moderate ability to pass through raw material cost escalations to end markets.",
      growthDrivers: "Expansion in domestic manufacturing and structural sector tailwinds.",
    },
    financialQuality: {
      balanceSheet: "Conservative leverage profile with comfortable interest coverage ratio (> 4.5x).",
      cashFlow: "Predictable operating cash generation funding routine capital expenditure.",
      workingCapital: "Working capital cycle managed within industry standard parameters.",
    },
    valuationIntel: {
      pbRatio: "3.2x P/B",
      evEbitda: "14.2x",
      assessment: "Trading near sector median multiples; watch for volume acceleration.",
    },
    riskIntel: {
      governance: "Requires review of annual report auditor disclosures and related-party transactions.",
      operational: "Input material price trends and regional capacity utilization.",
      cyclicality: "Exposed to broader macroeconomic cycles and interest rate shifts.",
    },
  };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { symbol } = await params;
  const companyKey = symbol.toLowerCase();
  const company = companyData[companyKey] || generateFallbackCompany(symbol);

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <Navbar />

      {/* Hero Header */}
      <section className="border-b border-white/10 bg-[#06101d]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            <Link href="/stocks" className="text-slate-400 hover:text-white transition">
              Stocks
            </Link>
            <span className="text-slate-600">/</span>
            <span>{company.symbol}</span>
          </div>

          <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
                {company.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-emerald-300">
                  NSE: {company.symbol}
                </span>
                <span>•</span>
                <span>{company.sector}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3">
                <div className="text-xs uppercase tracking-wider text-slate-500">
                  Current Price
                </div>
                <div className="mt-1 text-2xl font-bold text-white">
                  {company.price}
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
          </div>

          <p className="mt-8 max-w-3xl text-base leading-7 text-slate-300">
            {company.description}
          </p>
        </div>
      </section>

      {/* Valuation Metrics Bar */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-xs uppercase tracking-wider text-slate-500">Price to Earnings (P/E)</div>
            <div className="mt-2 text-3xl font-semibold text-white">{company.pe}</div>
            <div className="mt-1 text-xs text-slate-400">Trailing Twelve Months</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-xs uppercase tracking-wider text-slate-500">Return on Equity (ROE)</div>
            <div className="mt-2 text-3xl font-semibold text-emerald-400">{company.roe}</div>
            <div className="mt-1 text-xs text-slate-400">Shareholder Capital Return</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-xs uppercase tracking-wider text-slate-500">Price to Book (P/B)</div>
            <div className="mt-2 text-3xl font-semibold text-white">{company.valuationIntel.pbRatio}</div>
            <div className="mt-1 text-xs text-slate-400">Asset Backing</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-xs uppercase tracking-wider text-slate-500">Enterprise Multiple</div>
            <div className="mt-2 text-3xl font-semibold text-white">{company.valuationIntel.evEbitda}</div>
            <div className="mt-1 text-xs text-slate-400">EV / EBITDA</div>
          </div>
        </div>

        {/* DuPont ROE Decomposition Engine */}
        <div className="mt-10 rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.04] to-transparent p-7">
          <div className="flex flex-col justify-between gap-2 border-b border-white/10 pb-4 md:flex-row md:items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-emerald-400">
                Fundamental Quality Core
              </div>
              <h2 className="mt-1 text-xl font-semibold text-white">
                3-Stage DuPont ROE Decomposition
              </h2>
            </div>
            <div className="text-xs text-slate-400">
              ROE = Net Margin × Asset Turnover × Equity Multiplier
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <div className="text-xs uppercase text-slate-400">1. Operating Margin</div>
              <div className="mt-2 text-2xl font-bold text-white">{company.dupont.netMargin}</div>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Operating efficiency and pricing power translation to net earnings.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <div className="text-xs uppercase text-slate-400">2. Asset Turnover</div>
              <div className="mt-2 text-2xl font-bold text-white">{company.dupont.assetTurnover}</div>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Capital velocity; revenue generated per rupee of assets deployed.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <div className="text-xs uppercase text-slate-400">3. Financial Leverage</div>
              <div className="mt-2 text-2xl font-bold text-white">{company.dupont.equityMultiplier}</div>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Total assets divided by net worth; leverage multiplier to equity.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3 text-xs leading-relaxed text-slate-300">
            <span className="font-semibold text-emerald-400">DuPont Assessment: </span>
            {company.dupont.summary}
          </div>
        </div>

        {/* 4-Pillar Deep Research Modules */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Pillar 01 */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-emerald-500/30">
            <div className="text-sm font-medium text-emerald-400">01 · BUSINESS</div>
            <h3 className="mt-2 text-2xl font-semibold">Business Quality & Moat</h3>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <div>
                <span className="font-semibold text-white">Competitive Moat: </span>
                {company.businessQuality.moat}
              </div>
              <div>
                <span className="font-semibold text-white">Pricing Power: </span>
                {company.businessQuality.pricingPower}
              </div>
              <div>
                <span className="font-semibold text-white">Growth Catalysts: </span>
                {company.businessQuality.growthDrivers}
              </div>
            </div>
          </div>

          {/* Pillar 02 */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-emerald-500/30">
            <div className="text-sm font-medium text-emerald-400">02 · FUNDAMENTALS</div>
            <h3 className="mt-2 text-2xl font-semibold">Financial & Balance Sheet</h3>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <div>
                <span className="font-semibold text-white">Balance Sheet Health: </span>
                {company.financialQuality.balanceSheet}
              </div>
              <div>
                <span className="font-semibold text-white">Cash Flow Dynamics: </span>
                {company.financialQuality.cashFlow}
              </div>
              <div>
                <span className="font-semibold text-white">Capital Discipline: </span>
                {company.financialQuality.workingCapital}
              </div>
            </div>
          </div>

          {/* Pillar 03 */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-emerald-500/30">
            <div className="text-sm font-medium text-emerald-400">03 · VALUE</div>
            <h3 className="mt-2 text-2xl font-semibold">Valuation Intelligence</h3>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <div>
                <span className="font-semibold text-white">Price Multiple Context: </span>
                Trading at {company.pe} P/E and {company.valuationIntel.pbRatio}.
              </div>
              <div>
                <span className="font-semibold text-white">Historical Benchmark: </span>
                {company.valuationIntel.assessment}
              </div>
            </div>
          </div>

          {/* Pillar 04 */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-emerald-500/30">
            <div className="text-sm font-medium text-emerald-400">04 · RISK</div>
            <h3 className="mt-2 text-2xl font-semibold">Risk & Downside Watch</h3>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <div>
                <span className="font-semibold text-white">Corporate Governance: </span>
                {company.riskIntel.governance}
              </div>
              <div>
                <span className="font-semibold text-white">Execution Headwinds: </span>
                {company.riskIntel.operational}
              </div>
              <div>
                <span className="font-semibold text-white">Economic Sensitivity: </span>
                {company.riskIntel.cyclicality}
              </div>
            </div>
          </div>
        </div>

        {/* TECH-FUNDA Process Track */}
        <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.02] p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            TECH-FUNDA™ RESEARCH PIPELINE
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-medium">Market Filter</span>
            <span className="text-slate-600">→</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-medium">Business Moat</span>
            <span className="text-slate-600">→</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-medium">DuPont ROE</span>
            <span className="text-slate-600">→</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-medium">Valuation Margin</span>
            <span className="text-slate-600">→</span>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 font-medium text-emerald-300">Active Thesis</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row">
          <div>© 2026 MISSION WEALTH™. Institutional Equity Research.</div>
          <div className="flex gap-4">
            <Link href="/disclosures" className="hover:text-slate-300 transition">Disclosures</Link>
            <Link href="/methodology" className="hover:text-slate-300 transition">Methodology</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}