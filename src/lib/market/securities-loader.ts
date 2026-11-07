import {
  parseNseEquitySecurityCsv,
  type ListedSecurityRecord,
} from "./securities-master";

import {
  mergeNseAndBseSecurities,
  parseBseEquitySecurityCsv,
} from "./bse-securities-master";

export const OFFICIAL_NSE_EQUITY_URL =
  "https://nsearchives.nseindia.com/content/equities/EQUITY_L.csv";

export type SecuritiesLoadStatus =
  | "available"
  | "download_failed"
  | "invalid_content_type"
  | "empty_content"
  | "invalid_data";

export interface SecuritiesLoadResult {
  status: SecuritiesLoadStatus;
  securities: ListedSecurityRecord[];
  sourceUrl: string;
  reason?: string;
}

type FetchLike = (
  input: string,
  init?: RequestInit
) => Promise<Response>;

function isSupportedCsvContentType(
  contentType: string | null
): boolean {
  if (!contentType) {
    return true;
  }

  const normalized =
    contentType.toLowerCase();

  return (
    normalized.includes("text/csv") ||
    normalized.includes("text/plain") ||
    normalized.includes(
      "application/csv"
    ) ||
    normalized.includes(
      "application/octet-stream"
    )
  );
}

async function downloadCsv(
  url: string,
  fetchImpl: FetchLike
): Promise<
  | {
      status: "available";
      csv: string;
    }
  | {
      status:
        | "download_failed"
        | "invalid_content_type"
        | "empty_content";
      reason: string;
    }
> {
  let response: Response;

  try {
    response =
      await fetchImpl(url, {
        headers: {
          Accept:
            "text/csv,text/plain,*/*",
          "User-Agent":
            "MissionWealth/1.0",
        },

        cache: "no-store",
      });
  } catch {
    return {
      status:
        "download_failed",

      reason:
        "Network request failed.",
    };
  }

  if (!response.ok) {
    return {
      status:
        "download_failed",

      reason:
        `HTTP ${response.status}`,
    };
  }

  const contentType =
    response.headers.get(
      "content-type"
    );

  if (
    !isSupportedCsvContentType(
      contentType
    )
  ) {
    return {
      status:
        "invalid_content_type",

      reason:
        contentType ??
        "Unknown content type",
    };
  }

  const csv =
    (await response.text())
      .trim();

  if (!csv) {
    return {
      status:
        "empty_content",

      reason:
        "Downloaded file was empty.",
    };
  }

  return {
    status: "available",
    csv,
  };
}

export async function loadNseEquitySecurities(
  fetchImpl: FetchLike = fetch,
  url = OFFICIAL_NSE_EQUITY_URL
): Promise<SecuritiesLoadResult> {
  const download =
    await downloadCsv(
      url,
      fetchImpl
    );

  if (
    download.status !==
    "available"
  ) {
    return {
      status:
        download.status,

      securities: [],

      sourceUrl: url,

      reason:
        download.reason,
    };
  }

  const securities =
    parseNseEquitySecurityCsv(
      download.csv
    );

  if (
    securities.length === 0
  ) {
    return {
      status:
        "invalid_data",

      securities: [],

      sourceUrl: url,

      reason:
        "NSE CSV did not contain valid securities.",
    };
  }

  return {
    status: "available",
    securities,
    sourceUrl: url,
  };
}

export async function loadBseEquitySecuritiesFromCsv(
  url: string,
  fetchImpl: FetchLike = fetch
): Promise<SecuritiesLoadResult> {
  const download =
    await downloadCsv(
      url,
      fetchImpl
    );

  if (
    download.status !==
    "available"
  ) {
    return {
      status:
        download.status,

      securities: [],

      sourceUrl: url,

      reason:
        download.reason,
    };
  }

  const securities =
    parseBseEquitySecurityCsv(
      download.csv
    );

  if (
    securities.length === 0
  ) {
    return {
      status:
        "invalid_data",

      securities: [],

      sourceUrl: url,

      reason:
        "BSE CSV did not contain valid equity securities.",
    };
  }

  return {
    status: "available",
    securities,
    sourceUrl: url,
  };
}

export function buildCombinedSecuritiesMaster(
  nse:
    ListedSecurityRecord[],

  bse:
    ListedSecurityRecord[]
): ListedSecurityRecord[] {
  return mergeNseAndBseSecurities(
    nse,
    bse
  );
}