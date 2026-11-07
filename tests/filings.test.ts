import assert from "node:assert/strict";
import test from "node:test";

import {
  extractBelFinancialFilings,
  type FinancialFiling,
} from "../src/lib/financials/filings";

test("extractBelFinancialFilings finds BEL financial result links", () => {
  const html = `
    <html>
      <body>
        <a href="/documents/q1.pdf">
          BEL - 2026 - 27 Q1 Financial Results
        </a>

        <a href="/documents/q2.pdf">
          BEL - 2026 - 27 Q2 Financial Results
        </a>
      </body>
    </html>
  `;

  const result =
    extractBelFinancialFilings(
      html,
      "https://bel-india.in/investors/"
    );

  assert.equal(result.length, 2);

  assert.deepEqual(
    result[0],
    {
      title:
        "BEL - 2026 - 27 Q1 Financial Results",
      url:
        "https://bel-india.in/documents/q1.pdf",
      source:
        "company_investor_page",
      company:
        "Bharat Electronics Limited",
      symbol: "BEL",
    } satisfies FinancialFiling
  );
});

test("extractBelFinancialFilings ignores unrelated links", () => {
  const html = `
    <a href="/annual-report.pdf">
      BEL Annual Report 2025-26
    </a>

    <a href="/presentation.pdf">
      BEL Investor Presentation
    </a>

    <a href="/other-company.pdf">
      TCS Financial Results
    </a>
  `;

  const result =
    extractBelFinancialFilings(
      html
    );

  assert.equal(
    result.length,
    0
  );
});

test("extractBelFinancialFilings handles nested HTML inside anchors", () => {
  const html = `
    <a href="/q1.pdf">
      <span>BEL</span>
      <strong>2026-27 Q1 Financial Results</strong>
    </a>
  `;

  const result =
    extractBelFinancialFilings(
      html
    );

  assert.equal(
    result.length,
    1
  );

  assert.equal(
    result[0].title,
    "BEL 2026-27 Q1 Financial Results"
  );
});

test("extractBelFinancialFilings decodes common HTML entities", () => {
  const html = `
    <a href="/q1.pdf?x=1&amp;y=2">
      BEL &amp; Company Financial Results
    </a>
  `;

  const result =
    extractBelFinancialFilings(
      html
    );

  assert.equal(
    result.length,
    1
  );

  assert.equal(
    result[0].url,
    "https://bel-india.in/q1.pdf?x=1&y=2"
  );

  assert.equal(
    result[0].title,
    "BEL & Company Financial Results"
  );
});

test("extractBelFinancialFilings removes duplicate URLs", () => {
  const html = `
    <a href="/q1.pdf">
      BEL Q1 Financial Results
    </a>

    <a href="/q1.pdf">
      BEL Q1 Financial Results
    </a>
  `;

  const result =
    extractBelFinancialFilings(
      html
    );

  assert.equal(
    result.length,
    1
  );
});

test("extractBelFinancialFilings accepts absolute URLs", () => {
  const html = `
    <a href="https://bel-india.in/files/q1.pdf">
      BEL Q1 Financial Results
    </a>
  `;

  const result =
    extractBelFinancialFilings(
      html
    );

  assert.equal(
    result.length,
    1
  );

  assert.equal(
    result[0].url,
    "https://bel-india.in/files/q1.pdf"
  );
});

test("extractBelFinancialFilings ignores malformed URLs", () => {
  const html = `
    <a href="http://[invalid">
      BEL Q1 Financial Results
    </a>
  `;

  const result =
    extractBelFinancialFilings(
      html
    );

  assert.equal(
    result.length,
    0
  );
});

test("extractBelFinancialFilings is case insensitive", () => {
  const html = `
    <a href="/q1.pdf">
      bel q1 FINANCIAL RESULTS
    </a>
  `;

  const result =
    extractBelFinancialFilings(
      html
    );

  assert.equal(
    result.length,
    1
  );
});

test("extractBelFinancialFilings returns empty array for empty HTML", () => {
  assert.deepEqual(
    extractBelFinancialFilings(
      ""
    ),
    []
  );
});