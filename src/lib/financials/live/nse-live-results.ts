import type {
  ExchangeFinancialFiling,
} from "./exchange-filings";

import {
  loadNseIntegratedFinancialFilings,
} from "./nse-filing-loader";

import {
  parseNseQuarterlyXbrl,
} from "./nse-xbrl-parser";

import {
  adaptNseQuarterlyXbrlToQuarterlyResult,
} from "./nse-quarterly-adapter";

import type {
  LiveQuarterlyResultsResult,
} from "./types";

type FetchLike = (
  input: string,
  init?: RequestInit
) => Promise<Response>;

export interface LoadNseLiveResultsOptions {
  limit?: number;
}

function filingPriority(
  filing:
    ExchangeFinancialFiling
): number {
  let score = 0;

  if (
    filing.reportingBasis ===
    "consolidated"
  ) {
    score += 100;
  }

  if (
    filing.submissionType ===
    "revision"
  ) {
    score += 20;
  }

  if (
    filing.auditStatus ===
    "audited"
  ) {
    score += 5;
  }

  if (filing.xbrlUrl) {
    score += 10;
  }

  return score;
}

function selectPreferredFilings(
  filings:
    ExchangeFinancialFiling[]
): ExchangeFinancialFiling[] {
  const byQuarter =
    new Map<
      string,
      ExchangeFinancialFiling[]
    >();

  for (
    const filing of filings
  ) {
    if (
      !filing.quarterEnd ||
      !filing.xbrlUrl
    ) {
      continue;
    }

    const existing =
      byQuarter.get(
        filing.quarterEnd
      ) ?? [];

    existing.push(
      filing
    );

    byQuarter.set(
      filing.quarterEnd,
      existing
    );
  }

  return [
    ...byQuarter.entries(),
  ]
    .sort(
      ([a], [b]) =>
        b.localeCompare(a)
    )
    .map(
      ([, quarterFilings]) =>
        [...quarterFilings]
          .sort(
            (a, b) =>
              filingPriority(b) -
              filingPriority(a)
          )[0]
    );
}

function normalizeReportedAt(
  value:
    string | null
): string | null {
  if (!value) {
    return null;
  }

  if (
    /^\d{4}-\d{2}-\d{2}/.test(
      value
    )
  ) {
    return value.slice(
      0,
      10
    );
  }

  const match =
    value.match(
      /^(\d{1,2})-([A-Za-z]{3})-(\d{4})/
    );

  if (!match) {
    return null;
  }

  const months:
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
    months[
      match[2].toUpperCase()
    ];

  if (!month) {
    return null;
  }

  return `${match[3]}-${month}-${match[1].padStart(
    2,
    "0"
  )}`;
}

async function downloadXbrl(
  url: string,
  fetchImpl:
    FetchLike
): Promise<string | null> {
  let response: Response;

  try {
    response =
      await fetchImpl(
        url,
        {
          headers: {
            Accept:
              "application/xml,text/xml,text/plain,*/*",

            "User-Agent":
              "MissionWealth/1.0",
          },

          cache:
            "no-store",
        }
      );
  } catch {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  const xml =
    (
      await response.text()
    ).trim();

  if (
    !xml ||
    !xml.includes(
      "<xbrli:xbrl"
    )
  ) {
    return null;
  }

  return xml;
}

export async function loadNseLiveQuarterlyResults(
  symbol: string,
  options:
    LoadNseLiveResultsOptions = {},
  fetchImpl:
    FetchLike = fetch
): Promise<LiveQuarterlyResultsResult> {
  const normalizedSymbol =
    symbol
      .trim()
      .toUpperCase();

  if (!normalizedSymbol) {
    return {
      results: [],
      discoveredCount: 0,
      parsedCount: 0,
    };
  }

  const discovery =
    await loadNseIntegratedFinancialFilings(
      normalizedSymbol,
      fetchImpl
    );

  if (
    discovery.status !==
    "available"
  ) {
    return {
      results: [],
      discoveredCount: 0,
      parsedCount: 0,
    };
  }

  const selected =
    selectPreferredFilings(
      discovery.filings
    );

  const limit =
    Math.max(
      1,
      options.limit ?? 6
    );

  const results = [];

  for (
    const filing of selected.slice(
      0,
      limit
    )
  ) {
    if (!filing.xbrlUrl) {
      continue;
    }

    const xml =
      await downloadXbrl(
        filing.xbrlUrl,
        fetchImpl
      );

    if (!xml) {
      continue;
    }

    const parsed =
      parseNseQuarterlyXbrl(
        xml
      );

    if (!parsed) {
      continue;
    }

    /*
     * Safety check:
     * the XBRL period must match
     * the filing metadata quarter.
     */
    if (
      filing.quarterEnd &&
      parsed.periodEnd !==
        filing.quarterEnd
    ) {
      continue;
    }

    results.push(
      adaptNseQuarterlyXbrlToQuarterlyResult({
        symbol:
          normalizedSymbol,

        parsed,

        filingUrl:
          filing.detailsUrl,

        xbrlUrl:
          filing.xbrlUrl,

        reportedAt:
          normalizeReportedAt(
            filing.revisedAt ??
              filing.broadcastAt
          ),
      })
    );
  }

  return {
    results,

    discoveredCount:
      discovery.filings.length,

    parsedCount:
      results.length,
  };
}