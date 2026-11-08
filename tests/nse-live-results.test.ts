import assert from "node:assert/strict";
import test from "node:test";

import {
  loadNseLiveQuarterlyResults,
} from "../src/lib/financials/live/nse-live-results";

function jsonResponse(
  body: unknown
): Response {
  return new Response(
    JSON.stringify(body),
    {
      status: 200,

      headers: {
        "content-type":
          "application/json",
      },
    }
  );
}

function xmlResponse(
  xml: string
): Response {
  return new Response(
    xml,
    {
      status: 200,

      headers: {
        "content-type":
          "application/xml",
      },
    }
  );
}

const consolidatedXml = `
<xbrli:xbrl>
  <xbrli:context id="OneD">
    <xbrli:entity></xbrli:entity>

    <xbrli:period>
      <xbrli:startDate>2026-07-01</xbrli:startDate>
      <xbrli:endDate>2026-09-30</xbrli:endDate>
    </xbrli:period>
  </xbrli:context>

  <in-capmkt:NatureOfReportStandaloneConsolidated contextRef="OneD">
    Consolidated
  </in-capmkt:NatureOfReportStandaloneConsolidated>

  <in-capmkt:WhetherResultsAreAuditedOrUnaudited contextRef="OneD">
    Unaudited
  </in-capmkt:WhetherResultsAreAuditedOrUnaudited>

  <in-capmkt:RevenueFromOperations contextRef="OneD" unitRef="INR">
    305784000000
  </in-capmkt:RevenueFromOperations>

  <in-capmkt:ProfitBeforeTax contextRef="OneD" unitRef="INR">
    55976600000
  </in-capmkt:ProfitBeforeTax>

  <in-capmkt:ProfitOrLossAttributableToOwnersOfParent contextRef="OneD" unitRef="INR">
    41684000000
  </in-capmkt:ProfitOrLossAttributableToOwnersOfParent>

  <in-capmkt:BasicEarningsLossPerShareFromContinuingOperations contextRef="OneD" unitRef="INRPerShare">
    3.32
  </in-capmkt:BasicEarningsLossPerShareFromContinuingOperations>
</xbrli:xbrl>
`;

test(
  "loads and converts NSE XBRL into QuarterlyResult",
  async () => {
    const fetchMock =
      async (
        input: string
      ): Promise<Response> => {
        if (
          input.includes(
            "/api/integrated-filing-results"
          )
        ) {
          return jsonResponse({
            totalCount: 2,

            data: [
              {
                symbol: "ITC",
                companyName:
                  "ITC Limited",
                qe_Date:
                  "30-SEP-2026",
                type_Sub:
                  "Original",
                audited:
                  "Unaudited",
                consolidated:
                  "Consolidated",
                pdf_attach:
                  "https://example.com/result.pdf",
                xbrl:
                  "https://example.com/consolidated.xml",
                broadcast_Date:
                  "02-Nov-2026 18:55:59",
              },

              {
                symbol: "ITC",
                companyName:
                  "ITC Limited",
                qe_Date:
                  "30-SEP-2026",
                type_Sub:
                  "Original",
                audited:
                  "Unaudited",
                consolidated:
                  "Standalone",
                xbrl:
                  "https://example.com/standalone.xml",
              },
            ],
          });
        }

        if (
          input ===
          "https://example.com/consolidated.xml"
        ) {
          return xmlResponse(
            consolidatedXml
          );
        }

        throw new Error(
          `Unexpected URL: ${input}`
        );
      };

    const result =
      await loadNseLiveQuarterlyResults(
        "itc",
        {
          limit: 1,
        },
        fetchMock
      );

    assert.equal(
      result.discoveredCount,
      2
    );

    assert.equal(
      result.parsedCount,
      1
    );

    assert.equal(
      result.results.length,
      1
    );

    assert.equal(
      result.results[0].symbol,
      "ITC"
    );

    assert.equal(
      result.results[0].quarter,
      "Q2"
    );

    assert.equal(
      result.results[0].fiscalYear,
      "FY2026-27"
    );

    assert.equal(
      result.results[0].revenue,
      30578.4
    );

    assert.equal(
      result.results[0].profitBeforeTax,
      5597.66
    );

    assert.equal(
      result.results[0].netProfit,
      4168.4
    );

    assert.equal(
      result.results[0].eps,
      3.32
    );

    assert.equal(
      result.results[0].sourceDetails
        ?.reportingBasis,
      "consolidated"
    );
  }
);

test(
  "returns empty results when symbol is blank",
  async () => {
    const result =
      await loadNseLiveQuarterlyResults(
        "   "
      );

    assert.deepEqual(
      result,
      {
        results: [],
        discoveredCount: 0,
        parsedCount: 0,
      }
    );
  }
);

test(
  "skips filing when XBRL period does not match filing quarter",
  async () => {
    const mismatchedXml =
      consolidatedXml
        .replace(
          /2026-09-30/g,
          "2026-06-30"
        )
        .replace(
          "2026-07-01",
          "2026-04-01"
        );

    const fetchMock =
      async (
        input: string
      ): Promise<Response> => {
        if (
          input.includes(
            "/api/integrated-filing-results"
          )
        ) {
          return jsonResponse({
            data: [
              {
                symbol: "ITC",
                qe_Date:
                  "30-SEP-2026",
                consolidated:
                  "Consolidated",
                xbrl:
                  "https://example.com/mismatch.xml",
              },
            ],
          });
        }

        return xmlResponse(
          mismatchedXml
        );
      };

    const result =
      await loadNseLiveQuarterlyResults(
        "ITC",
        {
          limit: 1,
        },
        fetchMock
      );

    assert.equal(
      result.parsedCount,
      0
    );

    assert.deepEqual(
      result.results,
      []
    );
  }
);

test(
  "skips filing when XBRL download fails",
  async () => {
    const fetchMock =
      async (
        input: string
      ): Promise<Response> => {
        if (
          input.includes(
            "/api/integrated-filing-results"
          )
        ) {
          return jsonResponse({
            data: [
              {
                symbol: "ITC",
                qe_Date:
                  "30-SEP-2026",
                consolidated:
                  "Consolidated",
                xbrl:
                  "https://example.com/fail.xml",
              },
            ],
          });
        }

        return new Response(
          "failure",
          {
            status: 500,
          }
        );
      };

    const result =
      await loadNseLiveQuarterlyResults(
        "ITC",
        {
          limit: 1,
        },
        fetchMock
      );

    assert.equal(
      result.discoveredCount,
      1
    );

    assert.equal(
      result.parsedCount,
      0
    );

    assert.deepEqual(
      result.results,
      []
    );
  }
);