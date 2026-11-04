import test from "node:test";
import assert from "node:assert/strict";

import {
  findPreviousQuarter,
  findPreviousYearQuarter,
  getFinancialPeriodComparison,
} from "../src/lib/financials/periods";

import type { QuarterlyResult } from "../src/lib/financials/types";

function makeQuarter(
  periodEnd: string,
  quarter: string,
  fiscalYear: string
): QuarterlyResult {
  return {
    symbol: "TEST",
    periodEnd,
    quarter,
    fiscalYear,
    revenue: 100,
    profitBeforeTax: 20,
    netProfit: 10,
    currency: "INR",
    unit: "crores",
    source: "Test source",
  };
}

test("findPreviousQuarter matches the exact previous calendar quarter", () => {
  const current = makeQuarter(
    "2026-06-30",
    "Q1",
    "FY2026-27"
  );

  const previousQuarter = makeQuarter(
    "2026-03-31",
    "Q4",
    "FY2025-26"
  );

  const unrelatedQuarter = makeQuarter(
    "2025-12-31",
    "Q3",
    "FY2025-26"
  );

  const result = findPreviousQuarter(
    current,
    [
      current,
      unrelatedQuarter,
      previousQuarter,
    ]
  );

  assert.equal(
    result?.periodEnd,
    "2026-03-31"
  );
});

test("findPreviousQuarter returns null when the exact previous quarter is missing", () => {
  const current = makeQuarter(
    "2026-06-30",
    "Q1",
    "FY2026-27"
  );

  const olderQuarter = makeQuarter(
    "2025-12-31",
    "Q3",
    "FY2025-26"
  );

  const result = findPreviousQuarter(
    current,
    [
      current,
      olderQuarter,
    ]
  );

  assert.equal(result, null);
});

test("findPreviousYearQuarter matches the same calendar quarter one year earlier", () => {
  const current = makeQuarter(
    "2026-06-30",
    "Q1",
    "FY2026-27"
  );

  const previousYearQuarter = makeQuarter(
    "2025-06-30",
    "Q1",
    "FY2025-26"
  );

  const otherQuarter = makeQuarter(
    "2025-03-31",
    "Q4",
    "FY2024-25"
  );

  const result = findPreviousYearQuarter(
    current,
    [
      current,
      otherQuarter,
      previousYearQuarter,
    ]
  );

  assert.equal(
    result?.periodEnd,
    "2025-06-30"
  );
});

test("findPreviousYearQuarter returns null when exact prior-year quarter is missing", () => {
  const current = makeQuarter(
    "2026-06-30",
    "Q1",
    "FY2026-27"
  );

  const olderQuarter = makeQuarter(
    "2025-03-31",
    "Q4",
    "FY2024-25"
  );

  const result = findPreviousYearQuarter(
    current,
    [
      current,
      olderQuarter,
    ]
  );

  assert.equal(result, null);
});

test("getFinancialPeriodComparison selects the latest period regardless of input order", () => {
  const q4 = makeQuarter(
    "2026-03-31",
    "Q4",
    "FY2025-26"
  );

  const q1 = makeQuarter(
    "2026-06-30",
    "Q1",
    "FY2026-27"
  );

  const q1PreviousYear = makeQuarter(
    "2025-06-30",
    "Q1",
    "FY2025-26"
  );

  const result =
    getFinancialPeriodComparison([
      q4,
      q1PreviousYear,
      q1,
    ]);

  assert.equal(
    result.current?.periodEnd,
    "2026-06-30"
  );

  assert.equal(
    result.previousQuarter?.periodEnd,
    "2026-03-31"
  );

  assert.equal(
    result.previousYearQuarter?.periodEnd,
    "2025-06-30"
  );
});

test("getFinancialPeriodComparison ignores invalid period dates", () => {
  const validQuarter = makeQuarter(
    "2026-06-30",
    "Q1",
    "FY2026-27"
  );

  const invalidQuarter = makeQuarter(
    "invalid-date",
    "QX",
    "FY2026-27"
  );

  const result =
    getFinancialPeriodComparison([
      invalidQuarter,
      validQuarter,
    ]);

  assert.equal(
    result.current?.periodEnd,
    "2026-06-30"
  );

  assert.equal(
    result.previousQuarter,
    null
  );

  assert.equal(
    result.previousYearQuarter,
    null
  );
});

test("getFinancialPeriodComparison returns null values for empty input", () => {
  const result =
    getFinancialPeriodComparison([]);

  assert.equal(
    result.current,
    null
  );

  assert.equal(
    result.previousQuarter,
    null
  );

  assert.equal(
    result.previousYearQuarter,
    null
  );
});

test("period matching does not substitute the nearest older quarter", () => {
  const current = makeQuarter(
    "2026-09-30",
    "Q2",
    "FY2026-27"
  );

  const olderButNotPrevious = makeQuarter(
    "2026-03-31",
    "Q4",
    "FY2025-26"
  );

  const result = findPreviousQuarter(
    current,
    [
      current,
      olderButNotPrevious,
    ]
  );

  assert.equal(result, null);
});