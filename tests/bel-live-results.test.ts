import assert from "node:assert/strict";
import test from "node:test";

import {
  loadBelLiveQuarterlyResults,
} from "../src/lib/financials/bel-live-results";

import type {
  FinancialFiling,
} from "../src/lib/financials/filings";

const filings:
  FinancialFiling[] = [
    {
      title:
        "BEL - 2026 - 27 Q1 Financial Results",
      url:
        "https://bel-india.in/files/q1.pdf",
      source:
        "company_investor_page",
      company:
        "Bharat Electronics Limited",
      symbol: "BEL",
    },

    {
      title:
        "BEL - 2026 - 27 Q2 Financial Results",
      url:
        "https://bel-india.in/files/q2.pdf",
      source:
        "company_investor_page",
      company:
        "Bharat Electronics Limited",
      symbol: "BEL",
    },

    {
      title:
        "BEL - 2025 - 26 Q4 Financial Results",
      url:
        "https://bel-india.in/files/q4.pdf",
      source:
        "company_investor_page",
      company:
        "Bharat Electronics Limited",
      symbol: "BEL",
    },
  ];

test("selects newest BEL filing by period metadata instead of page order", async () => {
  const ingestedUrls:
    string[] = [];

  const result =
    await loadBelLiveQuarterlyResults(
      1,
      {
        discoverFilings:
          async () =>
            filings,

        ingestFiling:
          async (filing) => {
            ingestedUrls.push(
              filing.url
            );

            return {
              filing,
              status:
                "parsed",
              contentType:
                "application/pdf",
              financials: {
                revenue:
                  7290.87,
                profitBeforeTax:
                  2064.04,
                netProfit:
                  1540.73,
                eps: 2.11,
              },
            };
          },
      }
    );

  assert.equal(
    result.discoveredCount,
    3
  );

  assert.equal(
    result.parsedCount,
    1
  );

  assert.equal(
    result.results.length,
    1
  );

  assert.equal(
    result.results[0]
      .periodEnd,
    "2026-09-30"
  );

  assert.deepEqual(
    ingestedUrls,
    [
      "https://bel-india.in/files/q2.pdf",
    ]
  );
});

test("returns multiple selected filings newest first", async () => {
  const result =
    await loadBelLiveQuarterlyResults(
      2,
      {
        discoverFilings:
          async () =>
            filings,

        ingestFiling:
          async (filing) => ({
            filing,
            status:
              "parsed",
            contentType:
              "application/pdf",
            financials: {
              revenue: 1,
            },
          }),
      }
    );

  assert.equal(
    result.results.length,
    2
  );

  assert.equal(
    result.results[0]
      .periodEnd,
    "2026-09-30"
  );

  assert.equal(
    result.results[1]
      .periodEnd,
    "2026-06-30"
  );
});

test("respects zero filing limit", async () => {
  let ingestionCalls = 0;

  const result =
    await loadBelLiveQuarterlyResults(
      0,
      {
        discoverFilings:
          async () =>
            filings,

        ingestFiling:
          async (filing) => {
            ingestionCalls += 1;

            return {
              filing,
              status:
                "parsed",
              contentType:
                "application/pdf",
              financials: {
                revenue: 1,
              },
            };
          },
      }
    );

  assert.equal(
    result.results.length,
    0
  );

  assert.equal(
    result.discoveredCount,
    3
  );

  assert.equal(
    result.parsedCount,
    0
  );

  assert.equal(
    ingestionCalls,
    0
  );
});

test("skips failed ingestion results", async () => {
  const result =
    await loadBelLiveQuarterlyResults(
      1,
      {
        discoverFilings:
          async () =>
            filings,

        ingestFiling:
          async (filing) => ({
            filing,
            status:
              "download_failed",
            contentType: null,
            financials: null,
          }),
      }
    );

  assert.equal(
    result.discoveredCount,
    3
  );

  assert.equal(
    result.parsedCount,
    0
  );

  assert.deepEqual(
    result.results,
    []
  );
});

test("ignores filings without usable quarter metadata", async () => {
  const mixedFilings:
    FinancialFiling[] = [
      ...filings,

      {
        title:
          "BEL Financial Results",
        url:
          "https://bel-india.in/files/unknown.pdf",
        source:
          "company_investor_page",
        company:
          "Bharat Electronics Limited",
        symbol: "BEL",
      },
    ];

  const ingestedUrls:
    string[] = [];

  await loadBelLiveQuarterlyResults(
    10,
    {
      discoverFilings:
        async () =>
          mixedFilings,

      ingestFiling:
        async (filing) => {
          ingestedUrls.push(
            filing.url
          );

          return {
            filing,
            status:
              "parsed",
            contentType:
              "application/pdf",
            financials: {
              revenue: 1,
            },
          };
        },
    }
  );

  assert.equal(
    ingestedUrls.includes(
      "https://bel-india.in/files/unknown.pdf"
    ),
    false
  );
});