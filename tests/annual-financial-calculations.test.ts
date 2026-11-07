import assert from "node:assert/strict";
import test from "node:test";

import {
  buildAnnualDerivedMetrics,
  calculateAverage,
  calculateBookValuePerShare,
  calculateCapitalEmployed,
  calculateCashConversion,
  calculateDebtToEquity,
  calculateFreeCashFlow,
  calculateNetDebt,
  calculateReturnOnCapitalEmployed,
  calculateReturnOnEquity,
} from "../src/lib/financials/calculations";
import type { AnnualFinancialStatement } from "../src/lib/financials/types";

function makeAnnualStatement(
  overrides: Partial<AnnualFinancialStatement> = {}
): AnnualFinancialStatement {
  return {
    symbol: "TEST",
    fiscalYear: "FY2025-26",
    periodStart: "2025-04-01",
    periodEnd: "2026-03-31",

    revenue: 1000,
    operatingProfit: 200,
    profitBeforeTax: 180,
    netProfit: 150,
    eps: 10,

    totalAssets: 1200,
    totalEquity: 600,
    currentLiabilities: 300,

    totalDebt: 200,
    cashAndEquivalents: 80,

    operatingCashFlow: 180,
    capitalExpenditure: 40,

    sharesOutstandingCrores: 60,

    currency: "INR",
    unit: "crores",

    reportedAt: "2026-05-01",

    source: "Test annual filing",

    ...overrides,
  };
}

test("calculateAverage returns the mean of two valid values", () => {
  assert.equal(
    calculateAverage(100, 200),
    150
  );
});

test("calculateAverage returns null when a value is missing", () => {
  assert.equal(
    calculateAverage(100, undefined),
    null
  );
});

test("calculateReturnOnEquity uses average equity", () => {
  const result = calculateReturnOnEquity(
    150,
    600,
    400
  );

  assert.equal(result, 30);
});

test("calculateReturnOnEquity returns null without prior equity", () => {
  assert.equal(
    calculateReturnOnEquity(
      150,
      600,
      undefined
    ),
    null
  );
});

test("calculateCapitalEmployed subtracts current liabilities from total assets", () => {
  assert.equal(
    calculateCapitalEmployed(
      1200,
      300
    ),
    900
  );
});

test("calculateCapitalEmployed rejects zero or negative capital employed", () => {
  assert.equal(
    calculateCapitalEmployed(
      300,
      300
    ),
    null
  );

  assert.equal(
    calculateCapitalEmployed(
      200,
      300
    ),
    null
  );
});

test("calculateReturnOnCapitalEmployed uses operating profit and capital employed", () => {
  const result =
    calculateReturnOnCapitalEmployed(
      180,
      1200,
      300
    );

  assert.equal(result, 20);
});

test("calculateDebtToEquity returns the correct ratio", () => {
  assert.equal(
    calculateDebtToEquity(
      200,
      500
    ),
    0.4
  );
});

test("calculateDebtToEquity returns null for zero equity", () => {
  assert.equal(
    calculateDebtToEquity(
      200,
      0
    ),
    null
  );
});

test("calculateNetDebt subtracts cash from debt", () => {
  assert.equal(
    calculateNetDebt(
      200,
      80
    ),
    120
  );
});

test("calculateNetDebt allows a negative net debt position", () => {
  assert.equal(
    calculateNetDebt(
      50,
      100
    ),
    -50
  );
});

test("calculateFreeCashFlow subtracts absolute capital expenditure", () => {
  assert.equal(
    calculateFreeCashFlow(
      180,
      40
    ),
    140
  );

  assert.equal(
    calculateFreeCashFlow(
      180,
      -40
    ),
    140
  );
});

test("calculateCashConversion returns operating cash flow as percentage of net profit", () => {
  assert.equal(
    calculateCashConversion(
      180,
      150
    ),
    120
  );
});

test("calculateCashConversion returns null for zero net profit", () => {
  assert.equal(
    calculateCashConversion(
      180,
      0
    ),
    null
  );
});

test("calculateBookValuePerShare returns correct book value per share", () => {
  assert.equal(
    calculateBookValuePerShare(
      600,
      60
    ),
    10
  );
});

test("calculateBookValuePerShare returns null for invalid share count", () => {
  assert.equal(
    calculateBookValuePerShare(
      600,
      0
    ),
    null
  );
});

test("buildAnnualDerivedMetrics calculates annual growth and quality metrics", () => {
  const current =
    makeAnnualStatement();

  const previous =
    makeAnnualStatement({
      fiscalYear: "FY2024-25",
      periodStart: "2024-04-01",
      periodEnd: "2025-03-31",

      revenue: 800,
      operatingProfit: 160,
      netProfit: 120,
      totalEquity: 400,
    });

  const result =
    buildAnnualDerivedMetrics(
      current,
      previous
    );

  assert.equal(
    result.revenueGrowth,
    25
  );

  assert.equal(
    result.operatingProfitGrowth,
    25
  );

  assert.equal(
    result.netProfitGrowth,
    25
  );

  assert.equal(
    result.operatingMargin,
    20
  );

  assert.equal(
    result.profitBeforeTaxMargin,
    18
  );

  assert.equal(
    result.netProfitMargin,
    15
  );

  assert.equal(
    result.returnOnEquity,
    30
  );

  assert.equal(
    result.debtToEquity,
    200 / 600
  );

  assert.equal(
    result.netDebt,
    120
  );

  assert.equal(
    result.freeCashFlow,
    140
  );

  assert.equal(
    result.cashConversion,
    120
  );

  assert.equal(
    result.bookValuePerShare,
    10
  );
});

test("buildAnnualDerivedMetrics prefers reported free cash flow when supplied", () => {
  const current =
    makeAnnualStatement({
      freeCashFlow: 125,
    });

  const result =
    buildAnnualDerivedMetrics(
      current,
      null
    );

  assert.equal(
    result.freeCashFlow,
    125
  );
});

test("buildAnnualDerivedMetrics returns null when required inputs are unavailable", () => {
  const current =
    makeAnnualStatement({
      revenue: undefined,
      operatingProfit: undefined,
      netProfit: undefined,
      totalAssets: undefined,
      totalEquity: undefined,
      currentLiabilities: undefined,
      totalDebt: undefined,
      cashAndEquivalents: undefined,
      operatingCashFlow: undefined,
      capitalExpenditure: undefined,
      sharesOutstandingCrores:
        undefined,
    });

  const result =
    buildAnnualDerivedMetrics(
      current,
      null
    );

  assert.equal(
    result.revenueGrowth,
    null
  );

  assert.equal(
    result.returnOnEquity,
    null
  );

  assert.equal(
    result.returnOnCapitalEmployed,
    null
  );

  assert.equal(
    result.debtToEquity,
    null
  );

  assert.equal(
    result.netDebt,
    null
  );

  assert.equal(
    result.freeCashFlow,
    null
  );

  assert.equal(
    result.cashConversion,
    null
  );

  assert.equal(
    result.bookValuePerShare,
    null
  );
});