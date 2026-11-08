import type {
  FinancialAuditStatus,
  FinancialReportingBasis,
  QuarterlyResult,
} from "../types";

import type {
  ParsedNseQuarterlyXbrl,
} from "./nse-xbrl-parser";

export interface NseQuarterlyAdapterInput {
  symbol: string;

  parsed:
    ParsedNseQuarterlyXbrl;

  filingUrl?: string | null;

  xbrlUrl?: string | null;

  reportedAt?: string | null;
}

function getQuarter(
  periodEnd: string
): string | undefined {
  const month =
    Number(
      periodEnd.slice(
        5,
        7
      )
    );

  if (month === 6) {
    return "Q1";
  }

  if (month === 9) {
    return "Q2";
  }

  if (month === 12) {
    return "Q3";
  }

  if (month === 3) {
    return "Q4";
  }

  return undefined;
}

function getFiscalYear(
  periodEnd: string
): string | undefined {
  const year =
    Number(
      periodEnd.slice(
        0,
        4
      )
    );

  const month =
    Number(
      periodEnd.slice(
        5,
        7
      )
    );

  if (
    !Number.isInteger(
      year
    ) ||
    !Number.isInteger(
      month
    )
  ) {
    return undefined;
  }

  if (month <= 3) {
    return `FY${year - 1}-${String(
      year
    ).slice(-2)}`;
  }

  return `FY${year}-${String(
    year + 1
  ).slice(-2)}`;
}

function normalizeReportingBasis(
  value:
    ParsedNseQuarterlyXbrl["reportingBasis"]
): FinancialReportingBasis {
  if (
    value ===
    "standalone"
  ) {
    return "standalone";
  }

  return "consolidated";
}

function normalizeAuditStatus(
  value:
    ParsedNseQuarterlyXbrl["auditStatus"]
): FinancialAuditStatus {
  if (
    value ===
    "audited"
  ) {
    return "audited";
  }

  return "unaudited";
}

export function adaptNseQuarterlyXbrlToQuarterlyResult(
  input:
    NseQuarterlyAdapterInput
): QuarterlyResult {
  const symbol =
    input.symbol
      .trim()
      .toUpperCase();

  const {
    parsed,
  } = input;

  return {
    symbol,

    periodEnd:
      parsed.periodEnd,

    fiscalYear:
      getFiscalYear(
        parsed.periodEnd
      ),

    quarter:
      getQuarter(
        parsed.periodEnd
      ),

    revenue:
      parsed.revenue,

    profitBeforeTax:
      parsed.profitBeforeTax,

    netProfit:
      parsed.netProfit,

    eps:
      parsed.eps,

    currency:
      "INR",

    unit:
      "crores",

    reportedAt:
      input.reportedAt ??
      undefined,

    sourceDetails: {
      type:
        "exchange_filing",

      name:
        "NSE Integrated Filing",

      filingDate:
        input.reportedAt ??
        parsed.periodEnd,

      reportingBasis:
        normalizeReportingBasis(
          parsed.reportingBasis
        ),

      auditStatus:
        normalizeAuditStatus(
          parsed.auditStatus
        ),

      url:
        input.filingUrl ??
        input.xbrlUrl ??
        undefined,

      documentReference:
        input.xbrlUrl ??
        undefined,
    },

    source:
      "NSE Integrated Filing",
  };
}