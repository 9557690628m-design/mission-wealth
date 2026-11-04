import test from "node:test";
import assert from "node:assert/strict";

import { isValidQuarterlyResult } from "../src/lib/financials/validation";

import type { QuarterlyResult } from "../src/lib/financials/types";

function makeValidResult(): QuarterlyResult {
  return {
    symbol: "TEST",
    periodEnd: "2026-06-30",
    fiscalYear: "FY2026-27",
    quarter: "Q1",

    revenue: 1000,
    operatingProfit: 200,
    profitBeforeTax: 150,
    netProfit: 100,
    eps: 10,

    currency: "INR",
    unit: "crores",

    reportedAt: "2026-07-25",

    source: "Official company filing",
  };
}

test("accepts a valid quarterly result", () => {
  const result = makeValidResult();

  assert.equal(
    isValidQuarterlyResult(result),
    true
  );
});

test("rejects a blank symbol", () => {
  const result = makeValidResult();

  result.symbol = "   ";

  assert.equal(
    isValidQuarterlyResult(result),
    false
  );
});

test("rejects an invalid periodEnd date", () => {
  const result = makeValidResult();

  result.periodEnd = "2026-02-30";

  assert.equal(
    isValidQuarterlyResult(result),
    false
  );
});

test("rejects a periodEnd that is not ISO YYYY-MM-DD", () => {
  const result = makeValidResult();

  result.periodEnd = "30-06-2026";

  assert.equal(
    isValidQuarterlyResult(result),
    false
  );
});

test("rejects an invalid reportedAt date", () => {
  const result = makeValidResult();

  result.reportedAt = "2026-13-01";

  assert.equal(
    isValidQuarterlyResult(result),
    false
  );
});

test("allows reportedAt to be omitted", () => {
  const result = makeValidResult();

  delete result.reportedAt;

  assert.equal(
    isValidQuarterlyResult(result),
    true
  );
});

test("rejects a blank source description", () => {
  const result = makeValidResult();

  result.source = "   ";

  assert.equal(
    isValidQuarterlyResult(result),
    false
  );
});

test("rejects an unknown sourceId", () => {
  const result = makeValidResult();

  result.sourceId =
    "UNKNOWN-SOURCE-ID";

  assert.equal(
    isValidQuarterlyResult(result),
    false
  );
});

test("allows sourceId to be omitted", () => {
  const result = makeValidResult();

  delete result.sourceId;

  assert.equal(
    isValidQuarterlyResult(result),
    true
  );
});

test("accepts valid source details", () => {
  const result = makeValidResult();

  result.sourceDetails = {
    type: "exchange_filing",
    name: "NSE filing",
    filingDate: "2026-07-25",
    reportingBasis: "consolidated",
    auditStatus: "unaudited",
    url: "https://example.com/filing",
    documentReference: "Q1-FY2026-27",
  };

  assert.equal(
    isValidQuarterlyResult(result),
    true
  );
});

test("rejects source details with blank name", () => {
  const result = makeValidResult();

  result.sourceDetails = {
    type: "company_filing",
    name: "   ",
    filingDate: "2026-07-25",
    reportingBasis: "standalone",
    auditStatus: "unaudited",
  };

  assert.equal(
    isValidQuarterlyResult(result),
    false
  );
});

test("rejects source details with invalid filing date", () => {
  const result = makeValidResult();

  result.sourceDetails = {
    type: "company_filing",
    name: "Official filing",
    filingDate: "2026-02-30",
    reportingBasis: "standalone",
    auditStatus: "unaudited",
  };

  assert.equal(
    isValidQuarterlyResult(result),
    false
  );
});

test("rejects blank source documentReference when supplied", () => {
  const result = makeValidResult();

  result.sourceDetails = {
    type: "company_filing",
    name: "Official filing",
    filingDate: "2026-07-25",
    reportingBasis: "standalone",
    auditStatus: "unaudited",
    documentReference: "   ",
  };

  assert.equal(
    isValidQuarterlyResult(result),
    false
  );
});

test("rejects blank source URL when supplied", () => {
  const result = makeValidResult();

  result.sourceDetails = {
    type: "company_filing",
    name: "Official filing",
    filingDate: "2026-07-25",
    reportingBasis: "standalone",
    auditStatus: "unaudited",
    url: "   ",
  };

  assert.equal(
    isValidQuarterlyResult(result),
    false
  );
});

test("rejects non-INR currency", () => {
  const result =
    makeValidResult() as QuarterlyResult & {
      currency: string;
    };

  result.currency = "USD";

  assert.equal(
    isValidQuarterlyResult(result),
    false
  );
});

test("rejects NaN financial values", () => {
  const result = makeValidResult();

  result.revenue = Number.NaN;

  assert.equal(
    isValidQuarterlyResult(result),
    false
  );
});

test("rejects positive Infinity financial values", () => {
  const result = makeValidResult();

  result.netProfit =
    Number.POSITIVE_INFINITY;

  assert.equal(
    isValidQuarterlyResult(result),
    false
  );
});

test("rejects negative Infinity financial values", () => {
  const result = makeValidResult();

  result.totalDebt =
    Number.NEGATIVE_INFINITY;

  assert.equal(
    isValidQuarterlyResult(result),
    false
  );
});

test("allows optional financial values to be omitted", () => {
  const result: QuarterlyResult = {
    symbol: "TEST",
    periodEnd: "2026-06-30",
    currency: "INR",
    source: "Official filing",
  };

  assert.equal(
    isValidQuarterlyResult(result),
    true
  );
});