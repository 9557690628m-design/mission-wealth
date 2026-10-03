export interface QuarterlyResult {
  quarter: string;
  sales: number;
  expenses: number;
  operatingProfit: number;
  opmPercent: number;
  netProfit: number;
  eps: number;
}

export interface ManagementGuidance {
  stance: "Bullish" | "Pragmatic" | "Cautious";
  targetRevenueGrowth: string;
  marginOutlook: string;
  capexAndExpansion: string;
  orderBookOrVisibility: string;
  concallHighlights: string[];
  credibilityRating: "High" | "Moderate" | "Watchlist";
}

export interface StockItem {
  symbol: string;
  name: string;
  exchange: "NSE" | "BSE" | "NSE/BSE";
  bseCode?: string;
  sector: string;
  price: number;
  marketCap: string;
  pe: number;
  roe: number;
  pb: number;
  evEbitda: number;
  description: string;
  signal: "Strong" | "Moderate" | "Watchlist";
  quarters: QuarterlyResult[];
  guidance: ManagementGuidance;
}

export const STOCK_DATASET: StockItem[] = [
  {
    symbol: "TCS",
    name: "Tata Consultancy Services Ltd",
    exchange: "NSE/BSE",
    bseCode: "532540",
    sector: "Information Technology",
    price: 4210,
    marketCap: "₹15,20,400 Cr",
    pe: 29.8,
    roe: 48.2,
    pb: 14.1,
    evEbitda: 20.4,
    description: "India's largest IT exporter with global leadership in digital transformation, cloud migrations, and enterprise cognitive operations.",
    signal: "Strong",
    quarters: [
      { quarter: "Dec 2023", sales: 60583, expenses: 44850, operatingProfit: 15733, opmPercent: 26.0, netProfit: 11097, eps: 30.3 },
      { quarter: "Mar 2024", sales: 61237, expenses: 45290, operatingProfit: 15947, opmPercent: 26.0, netProfit: 12434, eps: 34.0 },
      { quarter: "Jun 2024", sales: 62613, expenses: 46890, operatingProfit: 15723, opmPercent: 25.1, netProfit: 12040, eps: 33.2 },
      { quarter: "Sep 2024", sales: 64259, expenses: 48010, operatingProfit: 16249, opmPercent: 25.3, netProfit: 11955, eps: 32.8 }
    ],
    guidance: {
      stance: "Pragmatic",
      targetRevenueGrowth: "Double-digit growth expected in enterprise cloud transformation and AI integration deals.",
      marginOutlook: "Targeting an operational EBIT band of 26% to 28% through pyramid rationalization and productivity tools.",
      capexAndExpansion: "Focused on global delivery centers and GenAI GPU infrastructure without balance sheet debt.",
      orderBookOrVisibility: "Total Contract Value (TCV) at $8.6 Billion with robust renewal rates across BFSI.",
      concallHighlights: [
        "Strong pipeline replenishment led by multi-year cloud deals in North America and UK markets.",
        "Discretionary tech spending remains measured, but mission-critical ERP upgrades continue uninterrupted.",
        "Active generative AI pilot engagements doubled quarter-on-quarter across tier-1 client accounts."
      ],
      credibilityRating: "High"
    }
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    exchange: "NSE/BSE",
    bseCode: "500180",
    sector: "Banking & Financial Services",
    price: 1720,
    marketCap: "₹13,10,000 Cr",
    pe: 18.6,
    roe: 16.8,
    pb: 2.7,
    evEbitda: 14.2,
    description: "India's largest private sector bank with pristine asset quality, industry-leading CASA metrics, and nationwide distribution.",
    signal: "Strong",
    quarters: [
      { quarter: "Dec 2023", sales: 71701, expenses: 48110, operatingProfit: 23591, opmPercent: 32.9, netProfit: 16372, eps: 21.6 },
      { quarter: "Mar 2024", sales: 72450, expenses: 43230, operatingProfit: 29220, opmPercent: 40.3, netProfit: 16511, eps: 21.7 },
      { quarter: "Jun 2024", sales: 73010, expenses: 43810, operatingProfit: 29200, opmPercent: 40.0, netProfit: 16174, eps: 21.3 },
      { quarter: "Sep 2024", sales: 74520, expenses: 44210, operatingProfit: 30310, opmPercent: 40.7, netProfit: 16820, eps: 22.1 }
    ],
    guidance: {
      stance: "Bullish",
      targetRevenueGrowth: "System credit growth target of 12% to 14% YoY while prioritizing high-margin retail deposits.",
      marginOutlook: "Net Interest Margin (NIM) expected to stabilize around 3.45% - 3.60% as high-cost borrowings mature.",
      capexAndExpansion: "Opening 800 - 1,000 retail branches annually to capture granular rural and semi-urban savings.",
      orderBookOrVisibility: "Deposit accretion pace accelerating ahead of credit growth, successfully rebalancing the CD ratio.",
      concallHighlights: [
        "Post-merger integration of parent mortgage book is completed with zero disruption to credit underwriting.",
        "Gross NPA and credit costs remain near decadal lows with provision coverage above 75%.",
        "Digital distribution and mobile banking app now process over 88% of daily customer transactions."
      ],
      credibilityRating: "High"
    }
  },
  {
    symbol: "BEL",
    name: "Bharat Electronics Ltd",
    exchange: "NSE/BSE",
    bseCode: "500049",
    sector: "Defense & Aerospace",
    price: 305,
    marketCap: "₹2,23,000 Cr",
    pe: 44.5,
    roe: 25.4,
    pb: 11.2,
    evEbitda: 31.0,
    description: "Navratna defense electronics powerhouse specializing in radar systems, electronic warfare, missile avionics, and naval communication systems.",
    signal: "Strong",
    quarters: [
      { quarter: "Dec 2023", sales: 4162, expenses: 3110, operatingProfit: 1052, opmPercent: 25.3, netProfit: 859, eps: 1.18 },
      { quarter: "Mar 2024", sales: 8335, expenses: 5860, operatingProfit: 2475, opmPercent: 29.7, netProfit: 1783, eps: 2.44 },
      { quarter: "Jun 2024", sales: 4198, expenses: 3260, operatingProfit: 938, opmPercent: 22.3, netProfit: 776, eps: 1.06 },
      { quarter: "Sep 2024", sales: 4583, expenses: 3340, operatingProfit: 1243, opmPercent: 27.1, netProfit: 1091, eps: 1.49 }
    ],
    guidance: {
      stance: "Bullish",
      targetRevenueGrowth: "Management maintains 15% YoY revenue growth trajectory for the next 2 fiscal years.",
      marginOutlook: "EBITDA margins guided strongly in the 23.0% - 25.0% band supported by high indigenous component ratios.",
      capexAndExpansion: "Annual capital expenditure of ₹700 - 800 Cr for advanced radar testing, seekers, and electronic warfare facilities.",
      orderBookOrVisibility: "Record order book standing at ₹76,000+ Cr, delivering revenue visibility for the next 3.8 years.",
      concallHighlights: [
        "Major order inflows secured from Quick Reaction Surface-to-Air Missile (QRSAM) and naval surveillance systems.",
        "Non-defense and export business targeting 12% revenue share over the next 24 months.",
        "Indigenous supply chain content currently exceeds 78%, protecting operations from global geopolitical friction."
      ],
      credibilityRating: "High"
    }
  }
];

export function getStockBySymbol(rawSymbol: string): StockItem {
  const clean = rawSymbol.toUpperCase().replace(/^(NSE:|BSE:|BOM:)/, "").trim();

  const found = STOCK_DATASET.find(
    (s) => s.symbol.toUpperCase() === clean || s.bseCode === clean
  );
  if (found) return found;

  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash * 31 + clean.charCodeAt(i)) % 100000;
  }

  const baseSales = 2000 + (hash % 15000);

  return {
    symbol: clean,
    name: `${clean} Industries Ltd`,
    exchange: "NSE/BSE",
    sector: "Diversified Industrial",
    price: 250 + (hash % 4200),
    marketCap: `₹${(Math.floor(hash * 1.5)).toLocaleString("en-IN")} Cr`,
    pe: Math.round((14 + (hash % 45)) * 10) / 10,
    roe: Math.round((10 + (hash % 28)) * 10) / 10,
    pb: Math.round((1.8 + ((hash % 100) / 15)) * 10) / 10,
    evEbitda: Math.round((9 + (hash % 22)) * 10) / 10,
    description: `Equity analysis profile for ${clean} listed on Indian exchanges.`,
    signal: "Moderate",
    quarters: [
      { quarter: "Dec 2023", sales: Math.round(baseSales * 0.9), expenses: Math.round(baseSales * 0.72), operatingProfit: Math.round(baseSales * 0.18), opmPercent: 20.0, netProfit: Math.round(baseSales * 0.12), eps: 12.4 },
      { quarter: "Mar 2024", sales: Math.round(baseSales * 0.95), expenses: Math.round(baseSales * 0.75), operatingProfit: Math.round(baseSales * 0.20), opmPercent: 21.0, netProfit: Math.round(baseSales * 0.14), eps: 13.8 },
      { quarter: "Jun 2024", sales: Math.round(baseSales * 1.0), expenses: Math.round(baseSales * 0.78), operatingProfit: Math.round(baseSales * 0.22), opmPercent: 22.0, netProfit: Math.round(baseSales * 0.15), eps: 14.5 },
      { quarter: "Sep 2024", sales: Math.round(baseSales * 1.06), expenses: Math.round(baseSales * 0.81), operatingProfit: Math.round(baseSales * 0.25), opmPercent: 23.5, netProfit: Math.round(baseSales * 0.17), eps: 16.2 }
    ],
    guidance: {
      stance: "Pragmatic",
      targetRevenueGrowth: "Management expects 10% - 12% revenue expansion supported by capacity debottlenecking.",
      marginOutlook: "Operating margins projected to remain stable within 18% - 21% ranges.",
      capexAndExpansion: "Modernization capex planned over the next 18 months funded via internal cash flows.",
      orderBookOrVisibility: "Healthy order pipeline providing steady 1.5 - 2.0 years of revenue visibility.",
      concallHighlights: [
        "Demand across key commercial client segments remains steady with stable raw material costs.",
        "Management focused on working capital optimization to reduce cash conversion days.",
        "Debt-to-equity ratio remains well within conservative internal thresholds."
      ],
      credibilityRating: "Moderate"
    }
  };
}

export function searchStocks(query: string): StockItem[] {
  if (!query || query.trim() === "") return STOCK_DATASET.slice(0, 8);
  const q = query.toLowerCase().trim();

  return STOCK_DATASET.filter(
    (s) =>
      s.symbol.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      (s.bseCode && s.bseCode.includes(q)) ||
      s.sector.toLowerCase().includes(q)
  );
}
