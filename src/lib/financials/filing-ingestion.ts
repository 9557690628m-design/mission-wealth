import {
  PDFParse,
} from "pdf-parse";

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
    | "empty_content"
    | "pdf_extraction_failed";

  financials:
    | ParsedQuarterlyFinancials
    | null;

  contentType:
    | string
    | null;
}

type PdfTextExtractor = (
  data: Uint8Array
) => Promise<string>;

export interface FilingIngestionOptions {
  extractPdfText?: PdfTextExtractor;
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

function isPdfContentType(
  contentType: string | null
): boolean {
  if (!contentType) {
    return false;
  }

  return contentType
    .toLowerCase()
    .includes(
      "application/pdf"
    );
}

async function extractPdfText(
  data: Uint8Array
): Promise<string> {
  const parser =
    new PDFParse({
      data,
    });

  try {
    const result =
      await parser.getText();

    return result.text;
  } finally {
    await parser.destroy();
  }
}

export async function ingestBelFinancialFiling(
  filing: FinancialFiling,
  options: FilingIngestionOptions = {}
): Promise<FilingIngestionResult> {
  let response: Response;

  try {
    response =
      await fetch(
        filing.url,
        {
          headers: {
            Accept:
              "application/pdf,text/plain,text/html,application/xhtml+xml",
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

  let text: string;

  if (
    isPdfContentType(
      contentType
    )
  ) {
    const arrayBuffer =
      await response.arrayBuffer();

    if (
      arrayBuffer.byteLength === 0
    ) {
      return {
        filing,
        status:
          "empty_content",
        financials: null,
        contentType,
      };
    }

    const pdfData =
      new Uint8Array(
        arrayBuffer
      );

    const pdfTextExtractor =
      options.extractPdfText ??
      extractPdfText;

    try {
      text =
        await pdfTextExtractor(
          pdfData
        );
    } catch {
      return {
        filing,
        status:
          "pdf_extraction_failed",
        financials: null,
        contentType,
      };
    }
  } else if (
    isSupportedTextContentType(
      contentType
    )
  ) {
    text =
      await response.text();
  } else {
    return {
      filing,
      status:
        "unsupported_content_type",
      financials: null,
      contentType,
    };
  }

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