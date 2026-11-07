import assert from "node:assert/strict";
import test from "node:test";

import {
  ingestBelFinancialFiling,
} from "../src/lib/financials/filing-ingestion";

import type {
  FinancialFiling,
} from "../src/lib/financials/filings";

const filing: FinancialFiling = {
  title:
    "BEL - 2026 - 27 Q1 Financial Results",
  url:
    "https://bel-india.in/q1-results",
  source:
    "company_investor_page",
  company:
    "Bharat Electronics Limited",
  symbol: "BEL",
};

test("ingestBelFinancialFiling downloads and parses supported text content", async () => {
  const originalFetch =
    globalThis.fetch;

  globalThis.fetch =
    (async () =>
      new Response(
        `
          Revenue from operations 5,533.06
          Profit Before Tax 1,402.83
          Profit After Tax 1,048.33
          Basic EPS 1.43
        `,
        {
          status: 200,
          headers: {
            "content-type":
              "text/plain",
          },
        }
      )) as typeof fetch;

  try {
    const result =
      await ingestBelFinancialFiling(
        filing
      );

    assert.equal(
      result.status,
      "parsed"
    );

    assert.equal(
      result.contentType,
      "text/plain"
    );

    assert.deepEqual(
      result.financials,
      {
        revenue: 5533.06,
        profitBeforeTax:
          1402.83,
        netProfit: 1048.33,
        eps: 1.43,
      }
    );
  } finally {
    globalThis.fetch =
      originalFetch;
  }
});

test("ingestBelFinancialFiling reports download failure for non-success HTTP response", async () => {
  const originalFetch =
    globalThis.fetch;

  globalThis.fetch =
    (async () =>
      new Response(
        "Not found",
        {
          status: 404,
          headers: {
            "content-type":
              "text/html",
          },
        }
      )) as typeof fetch;

  try {
    const result =
      await ingestBelFinancialFiling(
        filing
      );

    assert.equal(
      result.status,
      "download_failed"
    );

    assert.equal(
      result.financials,
      null
    );

    assert.equal(
      result.contentType,
      "text/html"
    );
  } finally {
    globalThis.fetch =
      originalFetch;
  }
});

test("ingestBelFinancialFiling reports download failure when fetch throws", async () => {
  const originalFetch =
    globalThis.fetch;

  globalThis.fetch =
    (async () => {
      throw new Error(
        "Network failure"
      );
    }) as typeof fetch;

  try {
    const result =
      await ingestBelFinancialFiling(
        filing
      );

    assert.equal(
      result.status,
      "download_failed"
    );

    assert.equal(
      result.financials,
      null
    );

    assert.equal(
      result.contentType,
      null
    );
  } finally {
    globalThis.fetch =
      originalFetch;
  }
});

test("ingestBelFinancialFiling extracts and parses PDF financial text", async () => {
  const originalFetch =
    globalThis.fetch;

  globalThis.fetch =
    (async () =>
      new Response(
        new Uint8Array([
          37,
          80,
          68,
          70,
        ]),
        {
          status: 200,
          headers: {
            "content-type":
              "application/pdf",
          },
        }
      )) as typeof fetch;

  try {
    const result =
      await ingestBelFinancialFiling(
        filing,
        {
          extractPdfText:
            async () => `
              Revenue from operations 5,533.06
              Profit Before Tax 1,402.83
              Profit After Tax 1,048.33
              Basic EPS 1.43
            `,
        }
      );

    assert.equal(
      result.status,
      "parsed"
    );

    assert.equal(
      result.contentType,
      "application/pdf"
    );

    assert.deepEqual(
      result.financials,
      {
        revenue: 5533.06,
        profitBeforeTax:
          1402.83,
        netProfit: 1048.33,
        eps: 1.43,
      }
    );
  } finally {
    globalThis.fetch =
      originalFetch;
  }
});

test("ingestBelFinancialFiling reports PDF extraction failure", async () => {
  const originalFetch =
    globalThis.fetch;

  globalThis.fetch =
    (async () =>
      new Response(
        new Uint8Array([
          37,
          80,
          68,
          70,
        ]),
        {
          status: 200,
          headers: {
            "content-type":
              "application/pdf",
          },
        }
      )) as typeof fetch;

  try {
    const result =
      await ingestBelFinancialFiling(
        filing,
        {
          extractPdfText:
            async () => {
              throw new Error(
                "Invalid PDF"
              );
            },
        }
      );

    assert.equal(
      result.status,
      "pdf_extraction_failed"
    );

    assert.equal(
      result.financials,
      null
    );

    assert.equal(
      result.contentType,
      "application/pdf"
    );
  } finally {
    globalThis.fetch =
      originalFetch;
  }
});

test("ingestBelFinancialFiling rejects unsupported content types", async () => {
  const originalFetch =
    globalThis.fetch;

  globalThis.fetch =
    (async () =>
      new Response(
        "binary content",
        {
          status: 200,
          headers: {
            "content-type":
              "application/zip",
          },
        }
      )) as typeof fetch;

  try {
    const result =
      await ingestBelFinancialFiling(
        filing
      );

    assert.equal(
      result.status,
      "unsupported_content_type"
    );

    assert.equal(
      result.financials,
      null
    );
  } finally {
    globalThis.fetch =
      originalFetch;
  }
});

test("ingestBelFinancialFiling rejects empty supported content", async () => {
  const originalFetch =
    globalThis.fetch;

  globalThis.fetch =
    (async () =>
      new Response(
        "   \n   ",
        {
          status: 200,
          headers: {
            "content-type":
              "text/plain",
          },
        }
      )) as typeof fetch;

  try {
    const result =
      await ingestBelFinancialFiling(
        filing
      );

    assert.equal(
      result.status,
      "empty_content"
    );

    assert.equal(
      result.financials,
      null
    );
  } finally {
    globalThis.fetch =
      originalFetch;
  }
});