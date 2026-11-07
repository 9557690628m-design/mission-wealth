import assert from "node:assert/strict";
import test from "node:test";

import type { AnnualFinancialStatement } from "../src/lib/financials/types";
import {
  buildValuationMetrics,
  calculateEnterpriseValueCrores,
  calculateEvToEbitda,
  calculateMarketCapitalisationCrores,
  calculatePriceToBook,
  calculatePriceToEarnings,
} from "../src/lib/financials/valuation";

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

test("calculateMarketCapitalisationCrores returns correct value", () => {
  assert.equal(
    calculateMarketCapitalisationCrores(
      300,
      730.98
    ),
    219294
  );
});

test("calculateMarketCapitalisationCrores rejects invalid price", () => {
  assert.equal(
    calculateMarketCapitalisationCrores(
      0,
      730.98
    ),
    null
  );
});

test("calculateMarketCapitalisationCrores rejects invalid shares", () => {
  assert.equal(
    calculateMarketCapitalisationCrores(
      300,
      0
    ),
    null
  );
});

test("calculatePriceToEarnings returns correct ratio", () => {
  assert.equal(
    calculatePriceToEarnings(
      300,
      10
    ),
    30
  );
});

test("calculatePriceToEarnings rejects zero or negative EPS", () => {
  assert.equal(
    calculatePriceToEarnings(
      300,
      0
    ),
    null
  );

  assert.equal(
    calculatePriceToEarnings(
      300,
      -5
    ),
    null
  );
});

test("calculatePriceToBook returns correct ratio", () => {
  assert.equal(
    calculatePriceToBook(
      300,
      100
    ),
    3
  );
});

test("calculatePriceToBook rejects invalid book value", () => {
  assert.equal(
    calculatePriceToBook(
      300,
      0
    ),
    null
  );
});

test("calculateEnterpriseValueCrores returns correct value", () => {
  assert.equal(
    calculateEnterpriseValueCrores(
      1000,
      200,
      100
    ),
    1100
  );
});

test("calculateEnterpriseValueCrores allows net cash to reduce EV", () => {
  assert.equal(
    calculateEnterpriseValueCrores(
      1000,
      50,
      200
    ),
    850
  );
});

test("calculateEnterpriseValueCrores rejects missing debt", () => {
  assert.equal(
    calculateEnterpriseValueCrores(
      1000,
      undefined,
      100
    ),
    null
  );
});

test("calculateEnterpriseValueCrores rejects negative debt", () => {
  assert.equal(
    calculateEnterpriseValueCrores(
      1000,
      -50,
      100
    ),
    null
  );
});

test("calculateEvToEbitda returns correct ratio", () => {
  assert.equal(
    calculateEvToEbitda(
      1200,
      300
    ),
    4
  );
});

test("calculateEvToEbitda rejects zero EBITDA", () => {
  assert.equal(
    calculateEvToEbitda(
      1200,
      0
    ),
    null
  );
});

test("buildValuationMetrics calculates market cap, P/E and P/B", () => {
  const annual =
    makeAnnualStatement();

  const result =
    buildValuationMetrics(
      300,
      annual
    );

  assert.equal(
    result.marketCapitalisationCrores,
    219294
  );

  assert.equal(
    result.priceToEarnings,
    300 / 7.23
  );

  assert.equal(
    result.priceToBook,
    300 /
      (19697.68 / 730.98)
  );

  assert.equal(
    result.enterpriseValueCrores,
    null
  );

  assert.equal(
    result.evToEbitda,
    null
  );
});

test("buildValuationMetrics returns null values when annual statement is missing", () => {
  assert.deepEqual(
    buildValuationMetrics(
      300,
      null
    ),
    {
      marketCapitalisationCrores:
        null,
      priceToEarnings: null,
      priceToBook: null,
      enterpriseValueCrores: null,
      evToEbitda: null,
    }
  );
});

test("buildValuationMetrics returns null valuation ratios when price is unavailable", () => {
  const result =
    buildValuationMetrics(
      null,
      makeAnnualStatement()
    );

  assert.equal(
    result.marketCapitalisationCrores,
    null
  );

  assert.equal(
    result.priceToEarnings,
    null
  );

  assert.equal(
    result.priceToBook,
    null
  );
});

test("buildValuationMetrics calculates enterprise value when verified debt is available", () => {
  const result =
    buildValuationMetrics(
      300,
      makeAnnualStatement({
        totalDebt: 500,
      })
    );

  assert.equal(
    result.enterpriseValueCrores,
    219294 + 500 - 681.68
  );

  assert.equal(
    result.evToEbitda,
    null
  );
});