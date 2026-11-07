import assert from "node:assert/strict";
import test from "node:test";

import {
  buildBelQuarterlyResultFromIngestion,
} from "../src/lib/financials/filing-adapter";

import type {
  FilingIngestionResult,
} from "../src/lib/financials/filing-ingestion";

function createParsedIngestion(
  title:
    string =
      "BEL - 2026 - 27 Q1 Financial Results"
): FilingIngestionResult {
  return {
    filing: {
      title,
      url:
        "https://bel-india.in/files/q1.pdf",
      source:
        "company_investor_page",
      company:
        "Bharat Electronics Limited",
      symbol: "BEL",
    },

    status: "parsed",

    financials: {
      revenue: 5533.06,
      profitBeforeTax:
        1402.83,
      netProfit: 1048.33,
      eps: 1.43,
    },

    contentType:
      "application/pdf",
  };
}

test("builds a validated BEL quarterly result from parsed ingestion", () => {
  const result =
    buildBelQuarterlyResultFromIngestion(
      createParsedIngestion()
    );

  assert.ok(result);

  assert.equal(
    result.symbol,
    "BEL"
  );

  assert.equal(
    result.periodEnd,
    "2026-06-30"
  );

  assert.equal(
    result.fiscalYear,
    "FY2026-27"
  );

  assert.equal(
    result.quarter,
    "Q1"
  );

  assert.equal(
    result.revenue,
    5533.06
  );

  assert.equal(
    result.profitBeforeTax,
    1402.83
  );

  assert.equal(
    result.netProfit,
    1048.33
  );

  assert.equal(
    result.eps,
    1.43
  );
});

test("reuses registered BEL source metadata and adds official filing URL", () => {
  const result =
    buildBelQuarterlyResultFromIngestion(
      createParsedIngestion()
    );

  assert.ok(result);

  assert.equal(
    result.sourceId,
    "BEL-Q1-FY2026-27"
  );

  assert.equal(
    result.reportedAt,
    "2026-07-27"
  );

  assert.equal(
    result.sourceDetails
      ?.type,
    "company_filing"
  );

  assert.equal(
    result.sourceDetails
      ?.reportingBasis,
    "standalone"
  );

  assert.equal(
    result.sourceDetails
      ?.auditStatus,
    "unaudited"
  );

  assert.equal(
    result.sourceDetails
      ?.url,
    "https://bel-india.in/files/q1.pdf"
  );
});

test("does not invent source metadata for an unregistered future quarter", () => {
  const result =
    buildBelQuarterlyResultFromIngestion(
      createParsedIngestion(
        "BEL - 2027 - 28 Q1 Financial Results"
      )
    );

  assert.ok(result);

  assert.equal(
    result.periodEnd,
    "2027-06-30"
  );

  assert.equal(
    result.sourceId,
    undefined
  );

  assert.equal(
    result.reportedAt,
    undefined
  );

  assert.equal(
    result.sourceDetails,
    undefined
  );
});

test("returns null when ingestion failed", () => {
  const ingestion =
    createParsedIngestion();

  ingestion.status =
    "download_failed";

  ingestion.financials =
    null;

  assert.equal(
    buildBelQuarterlyResultFromIngestion(
      ingestion
    ),
    null
  );
});

test("returns null when filing title has no period metadata", () => {
  assert.equal(
    buildBelQuarterlyResultFromIngestion(
      createParsedIngestion(
        "BEL Financial Results"
      )
    ),
    null
  );
});

test("returns null when parsed filing contains no financial values", () => {
  const ingestion =
    createParsedIngestion();

  ingestion.financials =
    {};

  assert.equal(
    buildBelQuarterlyResultFromIngestion(
      ingestion
    ),
    null
  );
});