import {
  normalizeNseIntegratedFilingResponse,
  type NseIntegratedFilingResponse,
} from "./nse-integrated-filings";

import type {
  ExchangeFinancialFiling,
} from "./exchange-filings";

export const NSE_INTEGRATED_FILING_API =
  "https://www.nseindia.com/api/integrated-filing-results";

export type NseFilingLoadStatus =
  | "available"
  | "download_failed"
  | "invalid_content_type"
  | "invalid_data";

export interface NseFilingLoadResult {
  status: NseFilingLoadStatus;

  symbol: string;

  filings:
    ExchangeFinancialFiling[];

  sourceUrl: string;

  totalCount:
    number | null;

  reason?: string;
}

type FetchLike = (
  input: string,
  init?: RequestInit
) => Promise<Response>;

function buildNseIntegratedFilingUrl(
  symbol: string,
  size = 20
): string {
  const url =
    new URL(
      NSE_INTEGRATED_FILING_API
    );

  url.searchParams.set(
    "type",
    "Integrated Filing- Financials"
  );

  url.searchParams.set(
    "index",
    "equities"
  );

  url.searchParams.set(
    "symbol",
    symbol
  );

  url.searchParams.set(
    "period_ended",
    "all"
  );

  url.searchParams.set(
    "page",
    "1"
  );

  url.searchParams.set(
    "size",
    String(size)
  );

  return url.toString();
}

function isJsonContentType(
  contentType:
    string | null
): boolean {
  if (!contentType) {
    return true;
  }

  return contentType
    .toLowerCase()
    .includes(
      "application/json"
    );
}

function normalizeTotalCount(
  value: unknown
): number | null {
  if (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0
  ) {
    return value;
  }

  if (
    typeof value === "string"
  ) {
    const parsed =
      Number(value);

    if (
      Number.isFinite(parsed) &&
      parsed >= 0
    ) {
      return parsed;
    }
  }

  return null;
}

export async function loadNseIntegratedFinancialFilings(
  symbol: string,
  fetchImpl:
    FetchLike = fetch,
  size = 20
): Promise<NseFilingLoadResult> {
  const normalizedSymbol =
    symbol
      .trim()
      .toUpperCase();

  const url =
    buildNseIntegratedFilingUrl(
      normalizedSymbol,
      size
    );

  if (!normalizedSymbol) {
    return {
      status:
        "invalid_data",

      symbol:
        normalizedSymbol,

      filings: [],

      sourceUrl:
        url,

      totalCount:
        null,

      reason:
        "NSE symbol is required.",
    };
  }

  let response: Response;

  try {
    response =
      await fetchImpl(
        url,
        {
          headers: {
            Accept:
              "application/json,text/plain,*/*",

            "Accept-Language":
              "en-IN,en;q=0.9",

            Referer:
              "https://www.nseindia.com/companies-listing/corporate-integrated-filing",

            "User-Agent":
              "Mozilla/5.0 MissionWealth/1.0",
          },

          cache:
            "no-store",
        }
      );
  } catch {
    return {
      status:
        "download_failed",

      symbol:
        normalizedSymbol,

      filings: [],

      sourceUrl:
        url,

      totalCount:
        null,

      reason:
        "Network request failed.",
    };
  }

  if (!response.ok) {
    return {
      status:
        "download_failed",

      symbol:
        normalizedSymbol,

      filings: [],

      sourceUrl:
        url,

      totalCount:
        null,

      reason:
        `HTTP ${response.status}`,
    };
  }

  const contentType =
    response.headers.get(
      "content-type"
    );

  if (
    !isJsonContentType(
      contentType
    )
  ) {
    return {
      status:
        "invalid_content_type",

      symbol:
        normalizedSymbol,

      filings: [],

      sourceUrl:
        url,

      totalCount:
        null,

      reason:
        contentType ??
        "Unknown content type",
    };
  }

  let payload:
    NseIntegratedFilingResponse;

  try {
    payload =
      await response.json() as
        NseIntegratedFilingResponse;
  } catch {
    return {
      status:
        "invalid_data",

      symbol:
        normalizedSymbol,

      filings: [],

      sourceUrl:
        url,

      totalCount:
        null,

      reason:
        "NSE response was not valid JSON.",
    };
  }

  const filings =
    normalizeNseIntegratedFilingResponse(
      payload
    )
      .filter(
        (filing) =>
          filing.symbol ===
          normalizedSymbol
      );

  return {
    status:
      "available",

    symbol:
      normalizedSymbol,

    filings,

    sourceUrl:
      url,

    totalCount:
      normalizeTotalCount(
        payload.totalCount
      ),
  };
}