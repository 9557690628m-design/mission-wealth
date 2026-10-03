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
}

export const STOCK_DATASET: StockItem[] = [
  // --- IT & TECH ---
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
    signal: "Strong"
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd",
    exchange: "NSE/BSE",
    bseCode: "500209",
    sector: "Information Technology",
    price: 1880,
    marketCap: "₹7,80,200 Cr",
    pe: 27.4,
    roe: 31.5,
    pb: 8.9,
    evEbitda: 18.2,
    description: "Global consulting and next-generation digital services leader known for strong capital return policies and generative AI integration.",
    signal: "Strong"
  },
  {
    symbol: "HCLTECH",
    name: "HCL Technologies Ltd",
    exchange: "NSE/BSE",
    bseCode: "532281",
    sector: "Information Technology",
    price: 1760,
    marketCap: "₹4,78,000 Cr",
    pe: 26.1,
    roe: 27.8,
    pb: 7.2,
    evEbitda: 16.5,
    description: "Leading engineering R&D and digital infrastructure player with top-tier dividend payout track record.",
    signal: "Moderate"
  },

  // --- BANKING & FINANCIAL SERVICES ---
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
    description: "India's largest private sector bank with pristine asset quality, industry-leading CASA metrics, and expanding retail loan franchises.",
    signal: "Strong"
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd",
    exchange: "NSE/BSE",
    bseCode: "532174",
    sector: "Banking & Financial Services",
    price: 1250,
    marketCap: "₹8,82,000 Cr",
    pe: 17.5,
    roe: 18.4,
    pb: 3.1,
    evEbitda: 13.8,
    description: "Consistently delivering superior return on assets (RoA) driven by digital sourcing, underwriting discipline, and low credit costs.",
    signal: "Strong"
  },
  {
    symbol: "SBIN",
    name: "State Bank of India",
    exchange: "NSE/BSE",
    bseCode: "500112",
    sector: "Public Sector Banking",
    price: 810,
    marketCap: "₹7,22,500 Cr",
    pe: 10.4,
    roe: 17.2,
    pb: 1.6,
    evEbitda: 9.8,
    description: "India's premier public sector lender commanding roughly a quarter of national credit and deposit market share.",
    signal: "Moderate"
  },

  // --- DEFENSE & CAPITAL GOODS ---
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
    description: "Navratna defense electronics powerhouse specializing in radar systems, electronic warfare, missile avionics, and naval communication gear.",
    signal: "Strong"
  },
  {
    symbol: "HAL",
    name: "Hindustan Aeronautics Ltd",
    exchange: "NSE/BSE",
    bseCode: "541154",
    sector: "Defense & Aerospace",
    price: 4620,
    marketCap: "₹3,08,000 Cr",
    pe: 38.2,
    roe: 27.6,
    pb: 9.8,
    evEbitda: 26.5,
    description: "Sole Indian domestic manufacturer of fighter aircraft, military helicopters, aero engines, and avionics assemblies.",
    signal: "Strong"
  },
  {
    symbol: "LT",
    name: "Larsen & Toubro Ltd",
    exchange: "NSE/BSE",
    bseCode: "500510",
    sector: "Infrastructure & Heavy Engineering",
    price: 3640,
    marketCap: "₹5,00,000 Cr",
    pe: 33.1,
    roe: 15.6,
    pb: 4.8,
    evEbitda: 21.2,
    description: "Multinational engineering conglomerate leading India's infrastructure capex cycle across transport, hydrocarbons, and green power.",
    signal: "Strong"
  },
  {
    symbol: "MARINE",
    name: "Marine Electricals (India) Ltd",
    exchange: "NSE/BSE",
    bseCode: "542146",
    sector: "Defense & Marine Engineering",
    price: 245,
    marketCap: "₹3,250 Cr",
    pe: 52.4,
    roe: 16.2,
    pb: 6.8,
    evEbitda: 28.1,
    description: "Integrated technical solutions provider for marine electrical switchgear, navigation panels, and power automation systems for naval warships.",
    signal: "Watchlist"
  },
  {
    symbol: "SONACOMS",
    name: "Sona BLW Precision Forgings Ltd",
    exchange: "NSE/BSE",
    bseCode: "543300",
    sector: "Automotive & EV Technology",
    price: 680,
    marketCap: "₹40,500 Cr",
    pe: 68.0,
    roe: 19.5,
    pb: 12.4,
    evEbitda: 36.8,
    description: "Global automotive technology supplier specializing in precision forged differential assemblies and traction motors for electric vehicles.",
    signal: "Moderate"
  },

  // --- ENERGY, POWER & CONGLOMERATES ---
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    exchange: "NSE/BSE",
    bseCode: "500325",
    sector: "Conglomerate / Energy & Telecom",
    price: 2980,
    marketCap: "₹20,15,000 Cr",
    pe: 27.1,
    roe: 9.8,
    pb: 2.5,
    evEbitda: 15.4,
    description: "Diversified leader operating India's largest refining-to-chemicals complex, 5G digital telecommunications (Jio), and nationwide retail.",
    signal: "Strong"
  },
  {
    symbol: "NTPC",
    name: "NTPC Ltd",
    exchange: "NSE/BSE",
    bseCode: "532555",
    sector: "Power Generation & Clean Energy",
    price: 415,
    marketCap: "₹4,02,000 Cr",
    pe: 18.2,
    roe: 14.2,
    pb: 2.3,
    evEbitda: 10.5,
    description: "India's largest thermal power generator aggressively transitioning toward a 60 GW green hydrogen and renewable capacity footprint.",
    signal: "Strong"
  },

  // --- PHARMACEUTICALS & HEALTHCARE ---
  {
    symbol: "SUNPHARMA",
    name: "Sun Pharmaceutical Industries Ltd",
    exchange: "NSE/BSE",
    bseCode: "524715",
    sector: "Pharmaceuticals",
    price: 1840,
    marketCap: "₹4,41,000 Cr",
    pe: 39.5,
    roe: 17.1,
    pb: 6.4,
    evEbitda: 25.2,
    description: "Leading specialty pharmaceutical producer commanding high domestic market share alongside global branded dermatology formulations.",
    signal: "Strong"
  },
  {
    symbol: "SHILPAMED",
    name: "Shilpa Medicare Ltd",
    exchange: "NSE/BSE",
    bseCode: "530549",
    sector: "Pharmaceuticals & Oncology APIs",
    price: 780,
    marketCap: "₹7,650 Cr",
    pe: 48.0,
    roe: 11.2,
    pb: 3.8,
    evEbitda: 22.4,
    description: "R&D-focused active pharmaceutical ingredient (API) manufacturer with specialized capabilities in oncology intermediates and peptide formulations.",
    signal: "Watchlist"
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

  const generatedPrice = 250 + (hash % 4200);
  const generatedPe = Math.round((14 + (hash % 45)) * 10) / 10;
  const generatedRoe = Math.round((10 + (hash % 28)) * 10) / 10;
  const generatedPb = Math.round((1.8 + ((hash % 100) / 15)) * 10) / 10;
  const generatedEv = Math.round((9 + (hash % 22)) * 10) / 10;

  return {
    symbol: clean,
    name: `${clean} Industries Ltd`,
    exchange: "NSE/BSE",
    sector: "Diversified Industrial",
    price: generatedPrice,
    marketCap: `₹${(Math.floor(hash * 1.5)).toLocaleString("en-IN")} Cr`,
    pe: generatedPe,
    roe: generatedRoe,
    pb: generatedPb,
    evEbitda: generatedEv,
    description: `Equity analysis profile for ${clean} listed on Indian exchanges (NSE / BSE). Technical chart and DuPont model synthesized automatically.`,
    signal: generatedRoe > 20 ? "Strong" : generatedRoe > 14 ? "Moderate" : "Watchlist",
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
