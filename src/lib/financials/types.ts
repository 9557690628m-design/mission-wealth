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