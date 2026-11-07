export type FinancialSourceType =
  | "company_filing"
  | "exchange_filing"
  | "annual_report"
  | "investor_presentation"
  | "other";

export type FinancialReportingBasis =
  | "standalone"
  | "consolidated";

export type FinancialAuditStatus =
  | "audited"
  | "unaudited";

export interface FinancialSource {
  type: FinancialSourceType;
  name: string;
  filingDate: string;

  reportingBasis: FinancialReportingBasis;
  auditStatus: FinancialAuditStatus;

  url?: string;
  documentReference?: string;
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

  sourceId?: string;
  sourceDetails?: FinancialSource;

  source: string;
}

export interface AnnualFinancialStatement {
  symbol: string;

  fiscalYear: string;
  periodStart?: string;
  periodEnd: string;

  revenue?: number;
  operatingProfit?: number;
  profitBeforeTax?: number;
  netProfit?: number;
  eps?: number;

  totalAssets?: number;
  totalEquity?: number;
  currentLiabilities?: number;

  totalDebt?: number;
  shortTermDebt?: number;
  longTermDebt?: number;

  cashAndEquivalents?: number;

  operatingCashFlow?: number;
  capitalExpenditure?: number;
  investingCashFlow?: number;
  financingCashFlow?: number;
  freeCashFlow?: number;

  sharesOutstandingCrores?: number;

  currency: "INR";
  unit?: "rupees" | "lakhs" | "crores";

  reportedAt?: string;

  sourceId?: string;
  sourceDetails?: FinancialSource;

  source: string;
}

export interface FinancialDerivedMetrics {
  revenueQoQGrowth: number | null;
  profitBeforeTaxQoQGrowth: number | null;
  netProfitQoQGrowth: number | null;

  revenueYoYGrowth: number | null;
  profitBeforeTaxYoYGrowth: number | null;
  netProfitYoYGrowth: number | null;

  operatingMargin: number | null;
  profitBeforeTaxMargin: number | null;
  netProfitMargin: number | null;
}

export interface AnnualDerivedMetrics {
  revenueGrowth: number | null;
  operatingProfitGrowth: number | null;
  netProfitGrowth: number | null;

  operatingMargin: number | null;
  profitBeforeTaxMargin: number | null;
  netProfitMargin: number | null;

  returnOnEquity: number | null;
  returnOnCapitalEmployed: number | null;

  debtToEquity: number | null;
  netDebt: number | null;

  freeCashFlow: number | null;
  cashConversion: number | null;

  bookValuePerShare: number | null;
}