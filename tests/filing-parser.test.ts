import assert from "node:assert/strict";
import test from "node:test";

import {
  parseBelQuarterlyFinancialText,
} from "../src/lib/financials/filing-parser";

test("parses BEL quarterly reported financial fields", () => {
  const text = `
    Revenue from operations 5,533.06
    Profit Before Tax 1,402.83
    Profit After Tax 1,048.33
    Basic EPS 1.43
  `;

  const result =
    parseBelQuarterlyFinancialText(
      text
    );

  assert.deepEqual(
    result,
    {
      revenue: 5533.06,
      profitBeforeTax: 1402.83,
      netProfit: 1048.33,
      eps: 1.43,
    }
  );
});

test("parses PBT and PAT abbreviations", () => {
  const text = `
    Revenue from operations: 7,290.87
    PBT: 2,064.04
    PAT: 1,540.73
    Basic EPS: 2.11
  `;

  const result =
    parseBelQuarterlyFinancialText(
      text
    );

  assert.equal(
    result.revenue,
    7290.87
  );

  assert.equal(
    result.profitBeforeTax,
    2064.04
  );

  assert.equal(
    result.netProfit,
    1540.73
  );

  assert.equal(
    result.eps,
    2.11
  );
});

test("parses Basic Earnings Per Share label", () => {
  const text = `
    Basic Earnings Per Share 3.01
  `;

  const result =
    parseBelQuarterlyFinancialText(
      text
    );

  assert.equal(
    result.eps,
    3.01
  );
});

test("parses generic Earnings Per Share label", () => {
  const text = `
    Earnings Per Share 1.76
  `;

  const result =
    parseBelQuarterlyFinancialText(
      text
    );

  assert.equal(
    result.eps,
    1.76
  );
});

test("handles rupee symbols and common separators", () => {
  const text = `
    Revenue from operations : ₹ 10,177.17
    Profit Before Tax : ₹ 2,903.82
    Profit After Tax : ₹ 2,203.16
    Basic EPS : ₹ 3.01
  `;

  const result =
    parseBelQuarterlyFinancialText(
      text
    );

  assert.deepEqual(
    result,
    {
      revenue: 10177.17,
      profitBeforeTax: 2903.82,
      netProfit: 2203.16,
      eps: 3.01,
    }
  );
});

test("matching is case insensitive", () => {
  const text = `
    REVENUE FROM OPERATIONS 5,763.65
    PROFIT BEFORE TAX 1,734.30
    PROFIT AFTER TAX 1,286.13
    BASIC EPS 1.76
  `;

  const result =
    parseBelQuarterlyFinancialText(
      text
    );

  assert.deepEqual(
    result,
    {
      revenue: 5763.65,
      profitBeforeTax: 1734.3,
      netProfit: 1286.13,
      eps: 1.76,
    }
  );
});

test("parses real BEL PDF-style broken spacing and narrative values", () => {
  const text = `
    Defence PSU Bharat Electronics Limited (BEL) has achieved

    Revenue
    from
    operations of
    Rs.
    5
    ,
    533.06 Crore

    registering a growth of 25.27% during the 1st Quarter
    of FY 2026-27.

    Profit
    Before Tax
    (
    PBT
    )
    during the
    1
    st
    Quarter
    of
    FY
    2026
    -27
    stood
    at
    Rs
    .
    1
    ,
    402.83
    Crore

    Profit After Tax
    (
    PAT
    )
    during the
    1
    st
    Quarter
    of
    FY
    2026
    -
    27
    stood
    at
    Rs
    .
    1
    ,
    048.33
    Crore

    Earnings per share (Basic & Diluted) (₹) (not annualised)
    13    1.43    3.01
  `;

  const result =
    parseBelQuarterlyFinancialText(
      text
    );

  assert.deepEqual(
    result,
    {
      revenue: 5533.06,
      profitBeforeTax: 1402.83,
      netProfit: 1048.33,
      eps: 1.43,
    }
  );
});

test("missing reported fields remain undefined", () => {
  const text = `
    Revenue from operations 5,533.06
    Profit Before Tax 1,402.83
    Profit After Tax 1,048.33
  `;

  const result =
    parseBelQuarterlyFinancialText(
      text
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
    undefined
  );
});

test("returns no values when filing text contains no recognised financial rows", () => {
  const text = `
    Bharat Electronics Limited
    Investor presentation
    Order book and business outlook
  `;

  const result =
    parseBelQuarterlyFinancialText(
      text
    );

  assert.deepEqual(
    result,
    {
      revenue: undefined,
      profitBeforeTax:
        undefined,
      netProfit: undefined,
      eps: undefined,
    }
  );
});