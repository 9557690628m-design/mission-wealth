import type { AnnualFinancialStatement } from "@/lib/financials/types";

export const BEL_ANNUAL_FINANCIALS: AnnualFinancialStatement[] = [
  {
    symbol: "BEL",

    fiscalYear: "FY2024-25",
    periodStart: "2024-04-01",
    periodEnd: "2025-03-31",

    revenue: 23658.01,
    profitBeforeTax: 7089.99,
    netProfit: 5288.25,
    eps: 7.23,

    totalAssets: 40418.08,
    totalEquity: 19697.68,
    currentLiabilities: 19698.51,

    cashAndEquivalents: 681.68,

    operatingCashFlow: 480.41,
    capitalExpenditure: 1004.07,
    investingCashFlow: 748.41,
    financingCashFlow: -1696.14,

    sharesOutstandingCrores: 730.98,

    currency: "INR",
    unit: "crores",

    reportedAt: "2025-05-19",

    sourceId: "BEL-ANNUAL-FY2024-25",

    source:
      "Bharat Electronics Limited - Integrated Annual Report 2024-25, Standalone Financial Statements",
  },

  {
    symbol: "BEL",

    fiscalYear: "FY2023-24",
    periodStart: "2023-04-01",
    periodEnd: "2024-03-31",

    revenue: 20169.39,
    profitBeforeTax: 5334.56,
    netProfit: 4020.0,
    eps: 5.5,

    totalAssets: 39155.65,
    totalEquity: 16082.39,
    currentLiabilities: 21990.08,

    cashAndEquivalents: 1149.0,

    operatingCashFlow: 4648.01,
    capitalExpenditure: 647.14,
    investingCashFlow: -5888.85,
    financingCashFlow: -1474.34,

    sharesOutstandingCrores: 730.98,

    currency: "INR",
    unit: "crores",

    sourceId: "BEL-ANNUAL-FY2023-24",

    source:
      "Bharat Electronics Limited - Integrated Annual Report 2024-25, Comparative Standalone Financial Statements",
  },
];