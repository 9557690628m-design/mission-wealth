export type Exchange = "NSE" | "BSE";

export interface StockIdentity {
  symbol: string;
  name: string;
  slug: string;

  nseSymbol?: string;
  bseCode?: string;
  isin?: string;

  sector: string;
  industry?: string;
}

export interface MarketQuote {
  symbol: string;
  exchange: Exchange;

  price: number;
  previousClose?: number;
  change?: number;
  changePercent?: number;

  volume?: number;
  marketCap?: number;

  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;

  timestamp: string;
  source: string;
  isDelayed: boolean;
}

export interface HistoricalPrice {
  date: string;

  open?: number;
  high?: number;
  low?: number;
  close: number;

  volume?: number;
}

export interface FundamentalSnapshot {
  symbol: string;

  pe?: number;
  pb?: number;
  roe?: number;
  roce?: number;

  revenue?: number;
  netProfit?: number;
  eps?: number;

  debt?: number;
  operatingCashFlow?: number;
  freeCashFlow?: number;

  timestamp: string;
  source: string;
}
export interface QuarterlyResult {
  symbol: string;

  periodEnd: string;
  fiscalYear?: string;
  quarter?: string;

  revenue?: number;
  operatingProfit?: number;
  profitBeforeTax?: number;
  netProfit?: number;
  eps?: number;

  totalAssets?: number;
  totalDebt?: number;
  cashAndEquivalents?: number;

  operatingCashFlow?: number;
  capitalExpenditure?: number;
  freeCashFlow?: number;

  currency: "INR";
  unit?: "rupees" | "lakhs" | "crores";

  reportedAt?: string;
  source: string;
}