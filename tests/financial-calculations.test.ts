import test from "node:test";
import assert from "node:assert/strict";

import {
  buildFinancialDerivedMetrics,
  calculateMargin,
  calculateNetProfitMargin,
  calculateOperatingMargin,
  calculatePercentageChange,
  calculatePbtMargin,
  calculateQoQGrowth,
  calculateYoYGrowth,
} from "../src/lib/financials/calculations";

import type { QuarterlyResult } from "../src/lib/financials/types";

test("calculatePercentageChange returns correct growth", () => {
  assert.equal(
    calculatePercentageChange(120, 100),
    20
  );

  assert.equal(
    calculatePercentageChange(80, 100),
    -20
  );
});

test("calculatePercentageChange returns null for invalid comparison", () => {
  assert.equal(
    calculatePercentageChange(100, 0),
    null
  );

  assert.equal(
    calculatePercentageChange(undefined, 100),
    null
  );

  assert.equal(
    calculatePercentageChange(100, undefined),
    null
  );

  assert.equal(
    calculatePercentageChange(
      Number.NaN,
      100
    ),
    null
  );
});

test("QoQ and YoY growth use percentage change correctly", () => {
  assert.equal(
    calculateQoQGrowth(150, 100),
    50
  );

  assert.equal(
    calculateYoYGrowth(75, 100),
    -25
  );
});

test("calculateMargin returns correct percentage", () => {
  assert.equal(
    calculateMargin(25, 100),
    25
  );

  assert.equal(
    calculateMargin(50, 200),
    25
  );
});

test("calculateMargin returns null for invalid denominator", () => {
  assert.equal(
    calculateMargin(10, 0),
    null
  );

  assert.equal(
    calculateMargin(undefined, 100),
    null
  );

  assert.equal(
    calculateMargin(10, undefined),
    null
  );
});

test("named margin helpers return correct values", () => {
  assert.equal(
    calculateOperatingMargin(200, 1000),
    20
  );

  assert.equal(
    calculatePbtMargin(150, 1000),
    15
  );

  assert.equal(
    calculateNetProfitMargin(100, 1000),
    10
  );
});

test("buildFinancialDerivedMetrics calculates QoQ growth and margins", () => {
  const current: QuarterlyResult = {
    symbol: "TEST",
    periodEnd: "2026-06-30",
    revenue: 1200,
    operatingProfit: 240,
    profitBeforeTax: 180,
    netProfit: 120,
    currency: "INR",
    unit: "crores",
    source: "Test source",
  };

  const previousQuarter: QuarterlyResult = {
    symbol: "TEST",
    periodEnd: "2026-03-31",
    revenue: 1000,
    operatingProfit: 200,
    profitBeforeTax: 150,
    netProfit: 100,
    currency: "INR",
    unit: "crores",
    source: "Test source",
  };

  const previousYearQuarter: QuarterlyResult = {
    symbol: "TEST",
    periodEnd: "2025-06-30",
    revenue: 800,
    operatingProfit: 160,
    profitBeforeTax: 120,
    netProfit: 80,
    currency: "INR",
    unit: "crores",
    source: "Test source",
  };

  const metrics =
    buildFinancialDerivedMetrics(
      current,
      previousQuarter,
      previousYearQuarter
    );

  assert.equal(
    metrics.revenueQoQGrowth,
    20
  );

  assert.equal(
    metrics.profitBeforeTaxQoQGrowth,
    20
  );

  assert.equal(
    metrics.netProfitQoQGrowth,
    20
  );

  assert.equal(
    metrics.revenueYoYGrowth,
    50
  );

  assert.equal(
    metrics.profitBeforeTaxYoYGrowth,
    50
  );

  assert.equal(
    metrics.netProfitYoYGrowth,
    50
  );

  assert.equal(
    metrics.operatingMargin,
    20
  );

  assert.equal(
    metrics.profitBeforeTaxMargin,
    15
  );

  assert.equal(
    metrics.netProfitMargin,
    10
  );
});

test("buildFinancialDerivedMetrics returns null comparisons when prior periods are missing", () => {
  const current: QuarterlyResult = {
    symbol: "TEST",
    periodEnd: "2026-06-30",
    revenue: 1000,
    profitBeforeTax: 200,
    netProfit: 100,
    currency: "INR",
    unit: "crores",
    source: "Test source",
  };

  const metrics =
    buildFinancialDerivedMetrics(
      current,
      null,
      null
    );

  assert.equal(
    metrics.revenueQoQGrowth,
    null
  );

  assert.equal(
    metrics.netProfitQoQGrowth,
    null
  );

  assert.equal(
    metrics.revenueYoYGrowth,
    null
  );

  assert.equal(
    metrics.netProfitYoYGrowth,
    null
  );

  assert.equal(
    metrics.operatingMargin,
    null
  );

  assert.equal(
    metrics.profitBeforeTaxMargin,
    20
  );

  assert.equal(
    metrics.netProfitMargin,
    10
  );
});