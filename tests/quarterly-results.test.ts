import assert from "node:assert/strict";
import test from "node:test";

import {
  getQuarterlyResults,
  getQuarterlyResultsWithLiveData,
  getQuarterlyResultSymbols,
} from "../src/lib/financials/results";

test("quarterly results registry exposes BEL coverage", () => {
  assert.deepEqual(
    getQuarterlyResultSymbols(),
    ["BEL"]
  );
});

test("quarterly results loader normalizes symbol and returns BEL results newest first", async () => {
  const results =
    await getQuarterlyResults(
      " bel "
    );

  assert.equal(
    results.length,
    6
  );

  assert.equal(
    results[0].symbol,
    "BEL"
  );

  assert.equal(
    results[0].periodEnd,
    "2026-09-30"
  );

  assert.equal(
    results[0].fiscalYear,
    "FY2026-27"
  );

  assert.equal(
    results[0].quarter,
    "Q2"
  );

  assert.equal(
    results[0].revenue,
    7290.87
  );

  assert.equal(
    results[0].netProfit,
    1540.73
  );

  for (
    let index = 1;
    index < results.length;
    index += 1
  ) {
    assert.ok(
      results[index - 1]
        .periodEnd >=
        results[index].periodEnd
    );
  }
});

test("quarterly results loader returns unique reporting periods", async () => {
  const results =
    await getQuarterlyResults(
      "BEL"
    );

  const periods =
    results.map(
      (result) =>
        result.periodEnd
    );

  assert.equal(
    new Set(periods).size,
    periods.length
  );
});

test("quarterly results loader returns empty results for unsupported symbol", async () => {
  const results =
    await getQuarterlyResults(
      "UNKNOWN"
    );

  assert.deepEqual(
    results,
    []
  );
});

test("live-aware loader supports generic symbol-aware live loader", async () => {
  const receivedSymbols:
    string[] = [];

  const results =
    await getQuarterlyResultsWithLiveData(
      "BEL",
      {
        loadLiveResults:
          async (symbol) => {
            receivedSymbols.push(
              symbol
            );

            return {
              results: [],
              discoveredCount: 0,
              parsedCount: 0,
            };
          },
      }
    );

  assert.equal(
    receivedSymbols.length,
    1
  );

  assert.equal(
    receivedSymbols[0],
    "BEL"
  );

  assert.equal(
    results.length,
    6
  );
});

test("live-aware loader adds a new live quarter and keeps newest first", async () => {
  const results =
    await getQuarterlyResultsWithLiveData(
      "BEL",
      {
        loadLiveResults:
          async (symbol) => {
            assert.equal(
              symbol,
              "BEL"
            );

            return {
              discoveredCount: 1,
              parsedCount: 1,

              results: [
                {
                  symbol: "BEL",
                  periodEnd:
                    "2026-12-31",
                  fiscalYear:
                    "FY2026-27",
                  quarter: "Q3",

                  revenue: 8000,
                  profitBeforeTax:
                    2200,
                  netProfit: 1650,
                  eps: 2.25,

                  currency: "INR",
                  unit: "crores",

                  source:
                    "Official live BEL Q3 filing",
                },
              ],
            };
          },
      }
    );

  assert.equal(
    results.length,
    7
  );

  assert.equal(
    results[0].periodEnd,
    "2026-12-31"
  );

  assert.equal(
    results[0].quarter,
    "Q3"
  );

  assert.equal(
    results[0].eps,
    2.25
  );
});

test("live-aware loader enriches an existing quarter without duplicating the period", async () => {
  const results =
    await getQuarterlyResultsWithLiveData(
      "BEL",
      {
        loadLiveResults:
          async () => ({
            discoveredCount: 1,
            parsedCount: 1,

            results: [
              {
                symbol: "BEL",
                periodEnd:
                  "2026-06-30",
                fiscalYear:
                  "FY2026-27",
                quarter: "Q1",

                revenue:
                  5533.06,
                profitBeforeTax:
                  1402.83,
                netProfit:
                  1048.33,
                eps: 1.43,

                currency: "INR",
                unit: "crores",

                reportedAt:
                  "2026-07-27",

                sourceId:
                  "BEL-Q1-FY2026-27",

                sourceDetails: {
                  type:
                    "company_filing",
                  name:
                    "Bharat Electronics Limited Q1 FY2026-27 Financial Results",
                  filingDate:
                    "2026-07-27",
                  reportingBasis:
                    "standalone",
                  auditStatus:
                    "unaudited",
                  url:
                    "https://bel-india.in/files/q1.pdf",
                },

                source:
                  "Official live BEL Q1 filing",
              },
            ],
          }),
      }
    );

  assert.equal(
    results.length,
    6
  );

  const q1 =
    results.find(
      (result) =>
        result.periodEnd ===
        "2026-06-30"
    );

  assert.ok(q1);

  assert.equal(
    q1.eps,
    1.43
  );

  assert.equal(
    q1.sourceDetails?.url,
    "https://bel-india.in/files/q1.pdf"
  );
});

test("live-aware loader preserves static data when live fields are missing", async () => {
  const results =
    await getQuarterlyResultsWithLiveData(
      "BEL",
      {
        loadLiveResults:
          async () => ({
            discoveredCount: 1,
            parsedCount: 1,

            results: [
              {
                symbol: "BEL",
                periodEnd:
                  "2026-09-30",
                fiscalYear:
                  "FY2026-27",
                quarter: "Q2",

                eps: 2.11,

                currency: "INR",
                unit: "crores",

                source:
                  "Partial live BEL Q2 filing",
              },
            ],
          }),
      }
    );

  const q2 =
    results.find(
      (result) =>
        result.periodEnd ===
        "2026-09-30"
    );

  assert.ok(q2);

  assert.equal(
    q2.revenue,
    7290.87
  );

  assert.equal(
    q2.netProfit,
    1540.73
  );

  assert.equal(
    q2.eps,
    2.11
  );
});

test("live-aware loader falls back to static results when generic live loading fails", async () => {
  const staticResults =
    await getQuarterlyResults(
      "BEL"
    );

  const results =
    await getQuarterlyResultsWithLiveData(
      "BEL",
      {
        loadLiveResults:
          async () => {
            throw new Error(
              "Live provider unavailable"
            );
          },
      }
    );

  assert.deepEqual(
    results,
    staticResults
  );
});