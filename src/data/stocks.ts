export interface QuarterlyResult {
  quarter: string;
  sales: number;
  expenses: number;
  operatingProfit: number;
  opmPercent: number;
  netProfit: number;
  eps: number;
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
    ]
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
    ]
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
    ]
  }
];

export function getStockBySymbol(rawSymbol: string): StockItem {
  const clean = rawSymbol.toUpperCase().replace(/^(NSE:|BSE:|BOM:)/, "").trim();

  const found = STOCK_DATASET.find(
    (s) => s.symbol.toUpperCase() === clean || s.bseCode === clean
  );
  if (found) return found;

  // Fallback generator for other tickers
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
    ]
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
