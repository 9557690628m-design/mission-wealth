import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeNseIntegratedFilingRecord,
  normalizeNseIntegratedFilingResponse,
} from "../src/lib/financials/live/nse-integrated-filings";

test(
  "normalizes a complete NSE integrated filing record",
  () => {
    const filing =
      normalizeNseIntegratedFilingRecord({
        symbol: " tcs ",
        companyName:
          "Tata Consultancy Services Limited",
        periodEnded:
          "2026-09-30",
        typeOfSubmission:
          "Original",
        audited:
          "Unaudited",
        consolidated:
          "Consolidated",
        pdf_attach:
          "/corporates/filings/tcs-q2.pdf",
        xbrl:
          "/corporates/xbrl/tcs-q2.xml",
        broadcastDateTime:
          "2026-10-10 18:30:00",
      });

    assert.ok(filing);

    assert.equal(
      filing.symbol,
      "TCS"
    );

    assert.equal(
      filing.companyName,
      "Tata Consultancy Services Limited"
    );

    assert.equal(
      filing.quarterEnd,
      "2026-09-30"
    );

    assert.equal(
      filing.submissionType,
      "original"
    );

    assert.equal(
      filing.auditStatus,
      "unaudited"
    );

    assert.equal(
      filing.reportingBasis,
      "consolidated"
    );

    assert.equal(
      filing.detailsUrl,
      "https://www.nseindia.com/corporates/filings/tcs-q2.pdf"
    );

    assert.equal(
      filing.xbrlUrl,
      "https://www.nseindia.com/corporates/xbrl/tcs-q2.xml"
    );

    assert.equal(
      filing.broadcastAt,
      "2026-10-10 18:30:00"
    );
  }
);

test(
  "normalizes revised submission and standalone basis",
  () => {
    const filing =
      normalizeNseIntegratedFilingRecord({
        symbol: "INFY",
        period_ended:
          "2026-06-30",
        typeOfSubmission:
          "Revised",
        audited:
          "Audited",
        consolidated:
          "Standalone",
        revisedDateTime:
          "2026-07-20 10:00:00",
      });

    assert.ok(filing);

    assert.equal(
      filing.submissionType,
      "revision"
    );

    assert.equal(
      filing.auditStatus,
      "audited"
    );

    assert.equal(
      filing.reportingBasis,
      "standalone"
    );

    assert.equal(
      filing.revisedAt,
      "2026-07-20 10:00:00"
    );
  }
);

test(
  "normalizes NSE quarter-end date to ISO format",
  () => {
    const filing =
      normalizeNseIntegratedFilingRecord({
        symbol: "HDFCBANK",
        qe_Date:
          "30-SEP-2026",
        type_Sub:
          "Original",
        audited:
          "Un-Audited",
        consolidated:
          "Consolidated",
      });

    assert.ok(filing);

    assert.equal(
      filing.quarterEnd,
      "2026-09-30"
    );

    assert.equal(
      filing.submissionType,
      "original"
    );

    assert.equal(
      filing.auditStatus,
      "unaudited"
    );

    assert.equal(
      filing.reportingBasis,
      "consolidated"
    );
  }
);

test(
  "returns null when symbol is missing",
  () => {
    const filing =
      normalizeNseIntegratedFilingRecord({
        companyName:
          "Example Limited",
      });

    assert.equal(
      filing,
      null
    );
  }
);

test(
  "treats null-like attachment URLs as unavailable",
  () => {
    const filing =
      normalizeNseIntegratedFilingRecord({
        symbol: "HAL",
        pdf_attach:
          "/null",
        xbrl:
          "null",
      });

    assert.ok(filing);

    assert.equal(
      filing.detailsUrl,
      null
    );

    assert.equal(
      filing.xbrlUrl,
      null
    );
  }
);

test(
  "normalizes response data array and skips invalid records",
  () => {
    const filings =
      normalizeNseIntegratedFilingResponse({
        data: [
          {
            symbol: "BEL",
            periodEnded:
              "2026-06-30",
          },

          {
            companyName:
              "Missing Symbol Limited",
          },
        ],
      });

    assert.equal(
      filings.length,
      1
    );

    assert.equal(
      filings[0].symbol,
      "BEL"
    );
  }
);

test(
  "returns empty array when response data is missing",
  () => {
    const filings =
      normalizeNseIntegratedFilingResponse(
        {}
      );

    assert.deepEqual(
      filings,
      []
    );
  }
);