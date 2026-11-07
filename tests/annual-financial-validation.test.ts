import assert from "node:assert/strict";
import test from "node:test";

import {
  getAnnualFinancials,
  getAnnualFinancialSymbols,
} from "../src/lib/financials/annual";
import type { AnnualFinancialStatement } from "../src/lib/financials/types";
import { isValidAnnualFinancialStatement } from "../src/lib/financials/validation";

function makeAnnualStatement(
  overrides: Partial<AnnualFinancialStatement> = {}
): AnnualFinancialStatement {
  return {
    symbol: "BEL",

    fiscalYear: "FY2024-25",
    periodStart: "2024-04-01",
    periodEnd: "2025-03-31",

    revenue: 23658.01,
    profitBeforeTax: 7089.99,
    netProfit: 5288.25,
    eps: 7.23,

    totalAssets: 40418.08,
    totalEquity: 19697.68,
    currentLiabilities: 19698.51,

    cashAndEquivalents: 681.68,

    operatingCashFlow: 480.41,
    capitalExpenditure: 1004.07,

    sharesOutstandingCrores: 730.98,

    currency: "INR",
    unit: "crores",

    reportedAt: "2025-05-19",

    sourceId: "BEL-ANNUAL-FY2024-25",

    source:
      "Bharat Electronics Limited Integrated Annual Report 2024-25",

    ...overrides,
  };
}

test("accepts a valid annual financial statement", () => {
  assert.equal(
    isValidAnnualFinancialStatement(
      makeAnnualStatement()
    ),
    true
  );
});

test("rejects a blank annual symbol", () => {
  assert.equal(
    isValidAnnualFinancialStatement(
      makeAnnualStatement({
        symbol: " ",
      })
    ),
    false
  );
});

test("rejects a blank fiscal year", () => {
  assert.equal(
    isValidAnnualFinancialStatement(
      makeAnnualStatement({
        fiscalYear: " ",
      })
    ),
    false
  );
});

test("rejects invalid annual periodEnd date", () => {
  assert.equal(
    isValidAnnualFinancialStatement(
      makeAnnualStatement({
        periodEnd: "2025-02-30",
      })
    ),
    false
  );
});

test("rejects invalid annual periodStart date", () => {
  assert.equal(
    isValidAnnualFinancialStatement(
      makeAnnualStatement({
        periodStart: "2024-02-30",
      })
    ),
    false
  );
});

test("rejects periodStart later than periodEnd", () => {
  assert.equal(
    isValidAnnualFinancialStatement(
      makeAnnualStatement({
        periodStart: "2026-04-01",
        periodEnd: "2025-03-31",
      })
    ),
    false
  );
});

test("rejects invalid annual reportedAt date", () => {
  assert.equal(
    isValidAnnualFinancialStatement(
      makeAnnualStatement({
        reportedAt: "2025-13-01",
      })
    ),
    false
  );
});

test("rejects a blank annual source", () => {
  assert.equal(
    isValidAnnualFinancialStatement(
      makeAnnualStatement({
        source: " ",
      })
    ),
    false
  );
});

test("rejects unknown annual sourceId", () => {
  assert.equal(
    isValidAnnualFinancialStatement(
      makeAnnualStatement({
        sourceId: "UNKNOWN-SOURCE",
      })
    ),
    false
  );
});

test("allows annual sourceId to be omitted", () => {
  assert.equal(
    isValidAnnualFinancialStatement(
      makeAnnualStatement({
        sourceId: undefined,
      })
    ),
    true
  );
});

test("rejects non-INR annual currency", () => {
  const result = {
    ...makeAnnualStatement(),
    currency: "USD",
  } as unknown as AnnualFinancialStatement;

  assert.equal(
    isValidAnnualFinancialStatement(result),
    false
  );
});

test("rejects NaN annual financial values", () => {
  assert.equal(
    isValidAnnualFinancialStatement(
      makeAnnualStatement({
        revenue: Number.NaN,
      })
    ),
    false
  );
});

test("rejects infinite annual financial values", () => {
  assert.equal(
    isValidAnnualFinancialStatement(
      makeAnnualStatement({
        totalAssets:
          Number.POSITIVE_INFINITY,
      })
    ),
    false
  );
});

test("rejects zero shares outstanding", () => {
  assert.equal(
    isValidAnnualFinancialStatement(
      makeAnnualStatement({
        sharesOutstandingCrores: 0,
      })
    ),
    false
  );
});

test("rejects negative shares outstanding", () => {
  assert.equal(
    isValidAnnualFinancialStatement(
      makeAnnualStatement({
        sharesOutstandingCrores: -10,
      })
    ),
    false
  );
});

test("allows optional annual fields to be omitted", () => {
  assert.equal(
    isValidAnnualFinancialStatement(
      makeAnnualStatement({
        periodStart: undefined,
        revenue: undefined,
        profitBeforeTax: undefined,
        netProfit: undefined,
        totalAssets: undefined,
        totalEquity: undefined,
        currentLiabilities: undefined,
        operatingCashFlow: undefined,
        capitalExpenditure: undefined,
        sharesOutstandingCrores:
          undefined,
      })
    ),
    true
  );
});

test("annual registry exposes BEL coverage", () => {
  assert.deepEqual(
    getAnnualFinancialSymbols(),
    ["BEL"]
  );
});

test("annual loader returns BEL annual statements sorted newest first", async () => {
  const results =
    await getAnnualFinancials("bel");

  assert.equal(results.length, 2);

  assert.equal(
    results[0].periodEnd,
    "2025-03-31"
  );

  assert.equal(
    results[1].periodEnd,
    "2024-03-31"
  );
});

test("annual loader returns empty results for unsupported symbol", async () => {
  const results =
    await getAnnualFinancials("TCS");

  assert.deepEqual(results, []);
});