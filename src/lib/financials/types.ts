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

sourceDetails?: FinancialSource;

  source: string;
}