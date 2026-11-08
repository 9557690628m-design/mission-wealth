import type {
  ExchangeFinancialFiling,
  FilingAuditStatus,
  FilingReportingBasis,
  FilingSubmissionType,
} from "./exchange-filings";

interface NseIntegratedFilingRecord {
  symbol?: unknown;

  companyName?: unknown;
  cmName?: unknown;
  smName?: unknown;

  periodEnded?: unknown;
  period_ended?: unknown;
  quarterEndDate?: unknown;
  qe_Date?: unknown;

  typeOfSubmission?: unknown;
  type_Sub?: unknown;

  audited?: unknown;

  consolidated?: unknown;

  pdf_attach?: unknown;

  xbrl?: unknown;
  xbrlFile?: unknown;
  ixbrl?: unknown;

  broadcastDateTime?: unknown;
  broadcastDate?: unknown;
  broadcast_Date?: unknown;

  revisedDateTime?: unknown;
  revised_Date?: unknown;
}

export interface NseIntegratedFilingResponse {
  data?: unknown;
  size?: unknown;
  page?: unknown;
  totalCount?: unknown;
}

function asTrimmedString(
  value: unknown
): string | null {
  if (
    typeof value !== "string"
  ) {
    return null;
  }

  const trimmed =
    value.trim();

  return trimmed || null;
}

function normalizeSubmissionType(
  value: unknown
): FilingSubmissionType {
  const normalized =
    asTrimmedString(
      value
    )?.toLowerCase();

  if (
    normalized ===
    "original"
  ) {
    return "original";
  }

  if (
    normalized ===
      "revision" ||
    normalized ===
      "revised"
  ) {
    return "revision";
  }

  return "unknown";
}

function normalizeAuditStatus(
  value: unknown
): FilingAuditStatus {
  const normalized =
    asTrimmedString(
      value
    )
      ?.toLowerCase()
      .replace(
        /[\s-]+/g,
        ""
      );

  if (
    normalized ===
    "audited"
  ) {
    return "audited";
  }

  if (
    normalized ===
    "unaudited"
  ) {
    return "unaudited";
  }

  return "unknown";
}

function normalizeReportingBasis(
  value: unknown
): FilingReportingBasis {
  const normalized =
    asTrimmedString(
      value
    )?.toLowerCase();

  if (
    normalized ===
    "consolidated"
  ) {
    return "consolidated";
  }

  if (
    normalized ===
    "standalone"
  ) {
    return "standalone";
  }

  return "unknown";
}

function normalizeUrl(
  value: unknown
): string | null {
  const url =
    asTrimmedString(
      value
    );

  if (
    !url ||
    url.toLowerCase() ===
      "null" ||
    url.endsWith(
      "/null"
    )
  ) {
    return null;
  }

  try {
    return new URL(
      url,
      "https://www.nseindia.com"
    ).toString();
  } catch {
    return null;
  }
}

function normalizePeriodEnd(
  record:
    NseIntegratedFilingRecord
): string | null {
  const raw =
    asTrimmedString(
      record.qe_Date
    ) ??
    asTrimmedString(
      record.periodEnded
    ) ??
    asTrimmedString(
      record.period_ended
    ) ??
    asTrimmedString(
      record.quarterEndDate
    );

  if (!raw) {
    return null;
  }

  if (
    /^\d{4}-\d{2}-\d{2}$/.test(
      raw
    )
  ) {
    return raw;
  }

  const match =
    raw
      .toUpperCase()
      .match(
        /^(\d{1,2})-([A-Z]{3})-(\d{4})$/
      );

  if (!match) {
    return null;
  }

  const monthMap:
    Record<string, string> = {
      JAN: "01",
      FEB: "02",
      MAR: "03",
      APR: "04",
      MAY: "05",
      JUN: "06",
      JUL: "07",
      AUG: "08",
      SEP: "09",
      OCT: "10",
      NOV: "11",
      DEC: "12",
    };

  const month =
    monthMap[
      match[2]
    ];

  if (!month) {
    return null;
  }

  const day =
    match[1].padStart(
      2,
      "0"
    );

  return `${match[3]}-${month}-${day}`;
}

export function normalizeNseIntegratedFilingRecord(
  record:
    NseIntegratedFilingRecord
):
  | ExchangeFinancialFiling
  | null {
  const symbol =
    asTrimmedString(
      record.symbol
    );

  if (!symbol) {
    return null;
  }

  const companyName =
    asTrimmedString(
      record.companyName
    ) ??
    asTrimmedString(
      record.cmName
    ) ??
    asTrimmedString(
      record.smName
    );

  return {
    exchange: "NSE",

    symbol:
      symbol.toUpperCase(),

    companyName,

    quarterEnd:
      normalizePeriodEnd(
        record
      ),

    submissionType:
      normalizeSubmissionType(
        record.type_Sub ??
          record.typeOfSubmission
      ),

    auditStatus:
      normalizeAuditStatus(
        record.audited
      ),

    reportingBasis:
      normalizeReportingBasis(
        record.consolidated
      ),

    detailsUrl:
      normalizeUrl(
        record.pdf_attach
      ),

    xbrlUrl:
      normalizeUrl(
        record.xbrl ??
          record.xbrlFile ??
          record.ixbrl
      ),

    broadcastAt:
      asTrimmedString(
        record.broadcast_Date
      ) ??
      asTrimmedString(
        record.broadcastDateTime
      ) ??
      asTrimmedString(
        record.broadcastDate
      ),

    revisedAt:
      asTrimmedString(
        record.revised_Date
      ) ??
      asTrimmedString(
        record.revisedDateTime
      ),
  };
}

export function normalizeNseIntegratedFilingResponse(
  payload:
    NseIntegratedFilingResponse
): ExchangeFinancialFiling[] {
  if (
    !Array.isArray(
      payload.data
    )
  ) {
    return [];
  }

  return payload.data
    .map(
      (record) =>
        normalizeNseIntegratedFilingRecord(
          record as
            NseIntegratedFilingRecord
        )
    )
    .filter(
      (
        filing
      ): filing is
        ExchangeFinancialFiling =>
        filing !== null
    );
}