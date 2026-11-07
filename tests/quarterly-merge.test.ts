import assert from "node:assert/strict";
import test from "node:test";

import {
  mergeQuarterlyResults,
} from "../src/lib/financials/quarterly-merge";

import type {
  QuarterlyResult,
} from "../src/lib/financials/types";

function createQuarter(
  overrides:
    Partial<QuarterlyResult> = {}
): QuarterlyResult {
  return {
    symbol: "BEL",
    periodEnd:
      "2026-06-30",
    fiscalYear:
      "FY2026-27",
    quarter: "Q1",
    revenue: 5533.06,
    profitBeforeTax:
      1402.83,
    netProfit: 1048.33,
    currency: "INR",
    unit: "crores",
    source:
      "Static BEL data",
    ...overrides,
  };
}

test("adds a new incoming quarter and sorts newest first", () => {
  const existing = [
    createQuarter(),
  ];

  const incoming = [
    createQuarter({
      periodEnd:
        "2026-09-30",
      quarter: "Q2",
      revenue: 7290.87,
      source:
        "Live BEL Q2 filing",
    }),
  ];

  const result =
    mergeQuarterlyResults(
      existing,
      incoming
    );

  assert.equal(
    result.length,
    2
  );

  assert.equal(
    result[0].periodEnd,
    "2026-09-30"
  );

  assert.equal(
    result[1].periodEnd,
    "2026-06-30"
  );
});

test("incoming quarter replaces available financial values for the same period", () => {
  const existing = [
    createQuarter({
      eps: undefined,
    }),
  ];

  const incoming = [
    createQuarter({
      revenue: 5600,
      eps: 1.43,
      source:
        "Official live filing",
    }),
  ];

  const result =
    mergeQuarterlyResults(
      existing,
      incoming
    );

  assert.equal(
    result.length,
    1
  );

  assert.equal(
    result[0].revenue,
    5600
  );

  assert.equal(
    result[0].eps,
    1.43
  );

  assert.equal(
    result[0].source,
    "Official live filing"
  );
});

test("existing value is preserved when incoming financial field is missing", () => {
  const existing = [
    createQuarter({
      eps: 1.4,
    }),
  ];

  const incoming = [
    createQuarter({
      eps: undefined,
      netProfit:
        undefined,
      source:
        "Official live filing",
    }),
  ];

  const result =
    mergeQuarterlyResults(
      existing,
      incoming
    );

  assert.equal(
    result[0].eps,
    1.4
  );

  assert.equal(
    result[0].netProfit,
    1048.33
  );
});

test("incoming source metadata is preferred for the same period", () => {
  const existing = [
    createQuarter({
      reportedAt:
        "2026-07-27",
      sourceId:
        "BEL-Q1-FY2026-27",
    }),
  ];

  const incoming = [
    createQuarter({
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
        "Official live filing",
    }),
  ];

  const result =
    mergeQuarterlyResults(
      existing,
      incoming
    );

  assert.equal(
    result[0]
      .sourceDetails?.url,
    "https://bel-india.in/files/q1.pdf"
  );
});

test("invalid incoming result is ignored", () => {
  const existing = [
    createQuarter(),
  ];

  const invalidIncoming =
    createQuarter({
      periodEnd:
        "not-a-date",
      source:
        "Invalid",
    });

  const result =
    mergeQuarterlyResults(
      existing,
      [
        invalidIncoming,
      ]
    );

  assert.equal(
    result.length,
    1
  );

  assert.equal(
    result[0].periodEnd,
    "2026-06-30"
  );
});

test("duplicate existing reporting periods are reduced to one", () => {
  const existing = [
    createQuarter(),
    createQuarter({
      source:
        "Duplicate",
    }),
  ];

  const result =
    mergeQuarterlyResults(
      existing,
      []
    );

  assert.equal(
    result.length,
    1
  );
});