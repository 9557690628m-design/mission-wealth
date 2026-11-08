import assert from "node:assert/strict";
import test from "node:test";

import {
  adaptNseQuarterlyXbrlToQuarterlyResult,
} from "../src/lib/financials/live/nse-quarterly-adapter";

test(
  "adapts NSE parsed XBRL into QuarterlyResult",
  () => {
    const result =
      adaptNseQuarterlyXbrlToQuarterlyResult({
        symbol: "itc",

        parsed: {
          periodStart:
            "2026-07-01",

          periodEnd:
            "2026-09-30",

          reportingBasis:
            "consolidated",

          auditStatus:
            "unaudited",

          revenue:
            30578.4,

          profitBeforeTax:
            5597.66,

          netProfit:
            4168.4,

          eps:
            3.32,
        },

        filingUrl:
          "https://example.com/result.pdf",

        xbrlUrl:
          "https://example.com/result.xml",

        reportedAt:
          "2026-11-02",
      });

    assert.equal(
      result.symbol,
      "ITC"
    );

    assert.equal(
      result.periodEnd,
      "2026-09-30"
    );

    assert.equal(
      result.quarter,
      "Q2"
    );

    assert.equal(
      result.fiscalYear,
      "FY2026-27"
    );

    assert.equal(
      result.revenue,
      30578.4
    );

    assert.equal(
      result.profitBeforeTax,
      5597.66
    );

    assert.equal(
      result.netProfit,
      4168.4
    );

    assert.equal(
      result.eps,
      3.32
    );

    assert.equal(
      result.currency,
      "INR"
    );

    assert.equal(
      result.unit,
      "crores"
    );

    assert.equal(
      result.sourceDetails?.type,
      "exchange_filing"
    );

    assert.equal(
      result.sourceDetails
        ?.reportingBasis,
      "consolidated"
    );

    assert.equal(
      result.sourceDetails
        ?.auditStatus,
      "unaudited"
    );
  }
);

test(
  "maps March quarter to Q4 and previous fiscal year",
  () => {
    const result =
      adaptNseQuarterlyXbrlToQuarterlyResult({
        symbol: "TCS",

        parsed: {
          periodStart:
            "2026-01-01",

          periodEnd:
            "2026-03-31",

          reportingBasis:
            "standalone",

          auditStatus:
            "audited",
        },
      });

    assert.equal(
      result.quarter,
      "Q4"
    );

    assert.equal(
      result.fiscalYear,
      "FY2025-26"
    );

    assert.equal(
      result.sourceDetails
        ?.reportingBasis,
      "standalone"
    );

    assert.equal(
      result.sourceDetails
        ?.auditStatus,
      "audited"
    );
  }
);