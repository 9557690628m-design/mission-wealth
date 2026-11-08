export type ExchangeName =
  | "NSE"
  | "BSE";

export type FilingSubmissionType =
  | "original"
  | "revision"
  | "unknown";

export type FilingAuditStatus =
  | "audited"
  | "unaudited"
  | "unknown";

export type FilingReportingBasis =
  | "consolidated"
  | "standalone"
  | "unknown";

export interface ExchangeFinancialFiling {
  exchange: ExchangeName;

  symbol: string;

  companyName:
    | string
    | null;

  quarterEnd:
    | string
    | null;

  submissionType:
    FilingSubmissionType;

  auditStatus:
    FilingAuditStatus;

  reportingBasis:
    FilingReportingBasis;

  detailsUrl:
    | string
    | null;

  xbrlUrl:
    | string
    | null;

  broadcastAt:
    | string
    | null;

  revisedAt:
    | string
    | null;
}

export interface ExchangeFinancialFilingDiscoveryResult {
  symbol: string;

  filings:
    ExchangeFinancialFiling[];

  source:
    ExchangeName;

  fetchedAt: string;
}