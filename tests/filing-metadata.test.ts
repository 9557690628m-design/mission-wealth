import assert from "node:assert/strict";
import test from "node:test";

import {
  parseBelFilingPeriodMetadata,
} from "../src/lib/financials/filing-metadata";

test("parses spaced BEL fiscal-year title", () => {
  assert.deepEqual(
    parseBelFilingPeriodMetadata(
      "BEL - 2026 - 27 Q1 Financial Results"
    ),
    {
      fiscalYear:
        "FY2026-27",
      quarter: "Q1",
      periodEnd:
        "2026-06-30",
    }
  );
});

test("parses compact BEL fiscal-year title", () => {
  assert.deepEqual(
    parseBelFilingPeriodMetadata(
      "BEL 2026-27 Q2 Financial Results"
    ),
    {
      fiscalYear:
        "FY2026-27",
      quarter: "Q2",
      periodEnd:
        "2026-09-30",
    }
  );
});

test("maps Q3 to December fiscal-year start", () => {
  assert.deepEqual(
    parseBelFilingPeriodMetadata(
      "BEL 2025-26 Q3 Financial Results"
    ),
    {
      fiscalYear:
        "FY2025-26",
      quarter: "Q3",
      periodEnd:
        "2025-12-31",
    }
  );
});

test("maps Q4 to March of following calendar year", () => {
  assert.deepEqual(
    parseBelFilingPeriodMetadata(
      "BEL 2025-26 Q4 Financial Results"
    ),
    {
      fiscalYear:
        "FY2025-26",
      quarter: "Q4",
      periodEnd:
        "2026-03-31",
    }
  );
});

test("matching is case insensitive", () => {
  assert.deepEqual(
    parseBelFilingPeriodMetadata(
      "bel 2026-27 q1 financial results"
    ),
    {
      fiscalYear:
        "FY2026-27",
      quarter: "Q1",
      periodEnd:
        "2026-06-30",
    }
  );
});

test("rejects inconsistent fiscal-year range", () => {
  assert.equal(
    parseBelFilingPeriodMetadata(
      "BEL 2026-28 Q1 Financial Results"
    ),
    null
  );
});

test("parses BEL title with separator before quarter", () => {
  assert.deepEqual(
    parseBelFilingPeriodMetadata(
      "BEL - 2025-26 - Q4 Financial Results"
    ),
    {
      fiscalYear:
        "FY2025-26",
      quarter: "Q4",
      periodEnd:
        "2026-03-31",
    }
  );
});

test("returns null when period metadata is missing", () => {
  assert.equal(
    parseBelFilingPeriodMetadata(
      "BEL Financial Results"
    ),
    null
  );
});