import {
  parseBelQuarterlyFinancialText,
  type ParsedQuarterlyFinancials,
} from "./filing-parser";

import type {
  FinancialFiling,
} from "./filings";

export interface FilingIngestionResult {
  filing: FinancialFiling;

  status:
    | "parsed"
    | "unsupported_content_type"
    | "download_failed"
    | "empty_content";

  financials:
    | ParsedQuarterlyFinancials
    | null;

  contentType:
    | string
    | null;
}

function isSupportedTextContentType(
  contentType: string | null
): boolean {
  if (!contentType) {
    return true;
  }

  const normalized =
    contentType.toLowerCase();

  return (
    normalized.includes(
      "text/plain"
    ) ||
    normalized.includes(
      "text/html"
    ) ||
    normalized.includes(
      "application/xhtml+xml"
    )
  );
}

export async function ingestBelFinancialFiling(
  filing: FinancialFiling
): Promise<FilingIngestionResult> {
  let response: Response;

  try {
    response =
      await fetch(
        filing.url,
        {
          headers: {
            Accept:
              "text/plain,text/html,application/xhtml+xml",
            "User-Agent":
              "Mission-Wealth-Research/1.0",
          },

          cache: "no-store",
        }
      );
  } catch {
    return {
      filing,
      status:
        "download_failed",
      financials: null,
      contentType: null,
    };
  }

  const contentType =
    response.headers.get(
      "content-type"
    );

  if (!response.ok) {
    return {
      filing,
      status:
        "download_failed",
      financials: null,
      contentType,
    };
  }

  if (
    !isSupportedTextContentType(
      contentType
    )
  ) {
    return {
      filing,
      status:
        "unsupported_content_type",
      financials: null,
      contentType,
    };
  }

  const text =
    await response.text();

  if (!text.trim()) {
    return {
      filing,
      status:
        "empty_content",
      financials: null,
      contentType,
    };
  }

  const financials =
    parseBelQuarterlyFinancialText(
      text
    );

  return {
    filing,
    status: "parsed",
    financials,
    contentType,
  };
}