import assert from "node:assert/strict";
import test from "node:test";

import type { QuarterlyResult } from "../src/lib/financials/types";
import { buildTtmFinancials } from "../src/lib/financials/ttm";

function makeQuarter(
  overrides: Partial<QuarterlyResult> = {}
): QuarterlyResult {
  return {
    symbol: "BEL",
    quarter: "Q2",
    fiscalYear: "FY2026-27",
    periodEnd: "2026-09-30",

    revenue: 100,
    profitBeforeTax: 20,
    netProfit: 15,
    eps: 2,

    currency: "INR",

    source:
      "Verified company filing",

    ...overrides,
  };
}

function makeValidFourQuarterSet(): QuarterlyResult[] {
  return [
    makeQuarter({
      quarter: "Q2",
      fiscalYear: "FY2026-27",
      periodEnd: "2026-09-30",
      revenue: 400,
      profitBeforeTax: 80,
      netProfit: 60,
      eps: 2.4,
    }),

    makeQuarter({
      quarter: "Q1",
      fiscalYear: "FY2026-27",
      periodEnd: "2026-06-30",
      revenue: 300,
      profitBeforeTax: 60,
      netProfit: 45,
      eps: 1.8,
    }),

    makeQuarter({
      quarter: "Q4",
      fiscalYear: "FY2025-26",
      periodEnd: "2026-03-31",
      revenue: 500,
      profitBeforeTax: 100,
      netProfit: 75,
      eps: 3,
    }),

    makeQuarter({
      quarter: "Q3",
      fiscalYear: "FY2025-26",
      periodEnd: "2025-12-31",
      revenue: 350,
      profitBeforeTax: 70,
      netProfit: 52.5,
      eps: 2.1,
    }),
  ];
}

test("buildTtmFinancials aggregates four consecutive quarters", () => {
  const result =
    buildTtmFinancials(
      makeValidFourQuarterSet()
    );

  assert.ok(result);

  assert.equal(
    result.symbol,
    "BEL"
  );

  assert.equal(
    result.revenue,
    1550
  );

  assert.equal(
    result.profitBeforeTax,
    310
  );

  assert.equal(
    result.netProfit,
    232.5
  );

  assert.equal(
    result.eps,
    9.3
  );

  assert.equal(
    result.quarterCount,
    4
  );

  assert.equal(
    result.complete,
    true
  );
});

test("buildTtmFinancials sorts quarters before aggregation", () => {
  const quarters =
    makeValidFourQuarterSet();

  const shuffled = [
    quarters[2],
    quarters[0],
    quarters[3],
    quarters[1],
  ];

  const result =
    buildTtmFinancials(shuffled);

  assert.ok(result);

  assert.equal(
    result.periodEnd,
    "2026-09-30"
  );

  assert.equal(
    result.revenue,
    1550
  );
});

test("buildTtmFinancials returns null when fewer than four quarters are available", () => {
  const quarters =
    makeValidFourQuarterSet().slice(
      0,
      3
    );

  assert.equal(
    buildTtmFinancials(quarters),
    null
  );
});

test("buildTtmFinancials rejects non-consecutive quarters", () => {
  const quarters =
    makeValidFourQuarterSet();

  quarters[2] =
    makeQuarter({
      quarter: "Q3",
      fiscalYear: "FY2025-26",
      periodEnd: "2025-12-31",
    });

  quarters[3] =
    makeQuarter({
      quarter: "Q2",
      fiscalYear: "FY2025-26",
      periodEnd: "2025-09-30",
    });

  assert.equal(
    buildTtmFinancials(quarters),
    null
  );
});

test("buildTtmFinancials rejects mixed symbols", () => {
  const quarters =
    makeValidFourQuarterSet();

  quarters[2] = {
    ...quarters[2],
    symbol: "TCS",
  };

  assert.equal(
    buildTtmFinancials(quarters),
    null
  );
});

test("buildTtmFinancials returns null EPS when one quarter EPS is missing", () => {
  const quarters =
    makeValidFourQuarterSet();

  quarters[1] = {
    ...quarters[1],
    eps: undefined,
  };

  const result =
    buildTtmFinancials(quarters);

  assert.ok(result);

  assert.equal(
    result.eps,
    null
  );

  assert.equal(
    result.revenue,
    1550
  );
});

test("buildTtmFinancials returns null revenue independently when one quarter revenue is missing", () => {
  const quarters =
    makeValidFourQuarterSet();

  quarters[1] = {
    ...quarters[1],
    revenue: undefined,
  };

  const result =
    buildTtmFinancials(quarters);

  assert.ok(result);

  assert.equal(
    result.revenue,
    null
  );

  assert.equal(
    result.netProfit,
    232.5
  );

  assert.equal(
    result.eps,
    9.3
  );
});

test("buildTtmFinancials returns null PBT independently when one quarter PBT is missing", () => {
  const quarters =
    makeValidFourQuarterSet();

  quarters[1] = {
    ...quarters[1],
    profitBeforeTax: undefined,
  };

  const result =
    buildTtmFinancials(quarters);

  assert.ok(result);

  assert.equal(
    result.profitBeforeTax,
    null
  );

  assert.equal(
    result.revenue,
    1550
  );
});

test("buildTtmFinancials returns null net profit independently when one quarter PAT is missing", () => {
  const quarters =
    makeValidFourQuarterSet();

  quarters[1] = {
    ...quarters[1],
    netProfit: undefined,
  };

  const result =
    buildTtmFinancials(quarters);

  assert.ok(result);

  assert.equal(
    result.netProfit,
    null
  );

  assert.equal(
    result.revenue,
    1550
  );
});

test("buildTtmFinancials ignores older quarters beyond the latest four", () => {
  const quarters = [
    ...makeValidFourQuarterSet(),
    makeQuarter({
      quarter: "Q2",
      fiscalYear: "FY2025-26",
      periodEnd: "2025-09-30",
      revenue: 9999,
      profitBeforeTax: 9999,
      netProfit: 9999,
      eps: 99,
    }),
  ];

  const result =
    buildTtmFinancials(quarters);

  assert.ok(result);

  assert.equal(
    result.revenue,
    1550
  );

  assert.equal(
    result.eps,
    9.3
  );
});