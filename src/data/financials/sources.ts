import type { FinancialSource } from "@/lib/financials/types";

export const FINANCIAL_SOURCES: Record<
  string,
  FinancialSource
> = {
  "BEL-Q1-FY2026-27": {
    type: "company_filing",
    name:
      "Bharat Electronics Limited Q1 FY2026-27 Financial Results",
    filingDate: "2026-07-27",
    reportingBasis: "standalone",
    auditStatus: "unaudited",
  },

  "BEL-Q4-FY2025-26": {
    type: "company_filing",
    name:
      "Bharat Electronics Limited Q4 FY2025-26 Audited Financial Results",
    filingDate: "2026-05-19",
    reportingBasis: "standalone",
    auditStatus: "audited",
  },
};