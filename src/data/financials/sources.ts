import type { FinancialSource } from "@/lib/financials/types";

export const FINANCIAL_SOURCES: Record<
  string,
  FinancialSource
> = {
  "BEL-Q2-FY2026-27": {
    type: "company_filing",
    name:
      "Bharat Electronics Limited Q2 FY2026-27 Financial Results",
    filingDate: "2026-10-30",
    reportingBasis: "standalone",
    auditStatus: "unaudited",
  },

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

  "BEL-Q3-FY2025-26": {
    type: "company_filing",
    name:
      "Bharat Electronics Limited Q3 FY2025-26 Financial Results",
    filingDate: "2026-01-28",
    reportingBasis: "standalone",
    auditStatus: "unaudited",
  },

  "BEL-Q2-FY2025-26": {
    type: "company_filing",
    name:
      "Bharat Electronics Limited Q2 FY2025-26 Financial Results",
    filingDate: "2025-10-31",
    reportingBasis: "standalone",
    auditStatus: "unaudited",
  },

  "BEL-Q1-FY2025-26": {
    type: "company_filing",
    name:
      "Bharat Electronics Limited Q1 FY2025-26 Financial Results",
    filingDate: "2025-07-28",
    reportingBasis: "standalone",
    auditStatus: "unaudited",
  },
};