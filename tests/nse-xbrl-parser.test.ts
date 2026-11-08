import assert from "node:assert/strict";
import test from "node:test";

import {
  parseNseQuarterlyXbrl,
} from "../src/lib/financials/live/nse-xbrl-parser";

test(
  "parses standardized NSE quarterly XBRL financial fields",
  () => {
    const xml = `
<xbrli:xbrl>
  <xbrli:context id="OneD">
    <xbrli:entity></xbrli:entity>
    <xbrli:period>
      <xbrli:startDate>2026-07-01</xbrli:startDate>
      <xbrli:endDate>2026-09-30</xbrli:endDate>
    </xbrli:period>
  </xbrli:context>

  <xbrli:context id="FourD">
    <xbrli:entity></xbrli:entity>
    <xbrli:period>
      <xbrli:startDate>2026-04-01</xbrli:startDate>
      <xbrli:endDate>2026-09-30</xbrli:endDate>
    </xbrli:period>
  </xbrli:context>

  <in-capmkt:NatureOfReportStandaloneConsolidated contextRef="OneD">Consolidated</in-capmkt:NatureOfReportStandaloneConsolidated>

  <in-capmkt:WhetherResultsAreAuditedOrUnaudited contextRef="OneD">Unaudited</in-capmkt:WhetherResultsAreAuditedOrUnaudited>

  <in-capmkt:RevenueFromOperations contextRef="OneD" unitRef="INR">305784000000</in-capmkt:RevenueFromOperations>

  <in-capmkt:ProfitBeforeTax contextRef="OneD" unitRef="INR">55976600000</in-capmkt:ProfitBeforeTax>

  <in-capmkt:ProfitLossForPeriod contextRef="OneD" unitRef="INR">42293300000</in-capmkt:ProfitLossForPeriod>

  <in-capmkt:ProfitOrLossAttributableToOwnersOfParent contextRef="OneD" unitRef="INR">41684000000</in-capmkt:ProfitOrLossAttributableToOwnersOfParent>

  <in-capmkt:BasicEarningsLossPerShareFromContinuingOperations contextRef="OneD" unitRef="INRPerShare">3.32</in-capmkt:BasicEarningsLossPerShareFromContinuingOperations>

  <in-capmkt:RevenueFromOperations contextRef="FourD" unitRef="INR">601017000000</in-capmkt:RevenueFromOperations>
</xbrli:xbrl>
`;

    const result =
      parseNseQuarterlyXbrl(
        xml
      );

    assert.ok(result);

    assert.equal(
      result.periodStart,
      "2026-07-01"
    );

    assert.equal(
      result.periodEnd,
      "2026-09-30"
    );

    assert.equal(
      result.reportingBasis,
      "consolidated"
    );

    assert.equal(
      result.auditStatus,
      "unaudited"
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
  }
);