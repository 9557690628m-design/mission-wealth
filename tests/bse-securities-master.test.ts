import assert from "node:assert/strict";
import test from "node:test";

import {
  parseBseEquitySecurityCsv,
  mergeNseAndBseSecurities,
} from "../src/lib/market/bse-securities-master";

import {
  parseNseEquitySecurityCsv,
} from "../src/lib/market/securities-master";

test("parseBseEquitySecurityCsv parses standard BSE equity rows", () => {
  const csv = `
Scrip Code,Instrument Code,Scrip Name,ISIN Code,Security Type Flag
500049,BEL,Bharat Electronics Limited,INE263A01024,EQ
532966,TITAGARH,Titagarh Rail Systems Limited,INE615H01020,EQ
`;

  const result =
    parseBseEquitySecurityCsv(
      csv
    );

  assert.equal(
    result.length,
    2
  );

  assert.deepEqual(
    result[0],
    {
      symbol: "BEL",
      companyName:
        "Bharat Electronics Limited",
      isin:
        "INE263A01024",
      bseCode:
        "500049",
      source: "BSE",
    }
  );

  assert.equal(
    result[1].bseCode,
    "532966"
  );
});

test("parseBseEquitySecurityCsv ignores non-equity rows", () => {
  const csv = `
Scrip Code,Instrument Code,Scrip Name,ISIN Code,Security Type Flag
500049,BEL,Bharat Electronics Limited,INE263A01024,EQ
900001,TESTDEBT,Test Debt Security,INE000A01001,DB
`;

  const result =
    parseBseEquitySecurityCsv(
      csv
    );

  assert.equal(
    result.length,
    1
  );

  assert.equal(
    result[0].bseCode,
    "500049"
  );
});

test("parseBseEquitySecurityCsv supports quoted company names containing commas", () => {
  const csv = `
Scrip Code,Instrument Code,Scrip Name,ISIN Code,Security Type Flag
500001,EXAMPLE,"Example Industries, Limited",INE000A01001,EQ
`;

  const result =
    parseBseEquitySecurityCsv(
      csv
    );

  assert.equal(
    result.length,
    1
  );

  assert.equal(
    result[0].companyName,
    "Example Industries, Limited"
  );
});

test("parseBseEquitySecurityCsv ignores rows missing BSE code", () => {
  const csv = `
Scrip Code,Instrument Code,Scrip Name,ISIN Code,Security Type Flag
,BEL,Bharat Electronics Limited,INE263A01024,EQ
`;

  const result =
    parseBseEquitySecurityCsv(
      csv
    );

  assert.equal(
    result.length,
    0
  );
});

test("parseBseEquitySecurityCsv ignores rows missing company name", () => {
  const csv = `
Scrip Code,Instrument Code,Scrip Name,ISIN Code,Security Type Flag
500049,BEL,,INE263A01024,EQ
`;

  const result =
    parseBseEquitySecurityCsv(
      csv
    );

  assert.equal(
    result.length,
    0
  );
});

test("parseBseEquitySecurityCsv removes duplicate rows", () => {
  const csv = `
Scrip Code,Instrument Code,Scrip Name,ISIN Code,Security Type Flag
500049,BEL,Bharat Electronics Limited,INE263A01024,EQ
500049,BEL,Bharat Electronics Limited,INE263A01024,EQ
`;

  const result =
    parseBseEquitySecurityCsv(
      csv
    );

  assert.equal(
    result.length,
    1
  );
});

test("mergeNseAndBseSecurities merges dual-listed company by ISIN", () => {
  const nse =
    parseNseEquitySecurityCsv(`
SYMBOL,NAME OF COMPANY,SERIES,ISIN NUMBER
BEL,Bharat Electronics Limited,EQ,INE263A01024
`);

  const bse =
    parseBseEquitySecurityCsv(`
Scrip Code,Instrument Code,Scrip Name,ISIN Code,Security Type Flag
500049,BEL,Bharat Electronics Limited,INE263A01024,EQ
`);

  const merged =
    mergeNseAndBseSecurities(
      nse,
      bse
    );

  assert.equal(
    merged.length,
    1
  );

  assert.deepEqual(
    merged[0],
    {
      symbol: "BEL",
      companyName:
        "Bharat Electronics Limited",
      series: "EQ",
      isin:
        "INE263A01024",
      nseSymbol:
        "BEL",
      bseCode:
        "500049",
      source:
        "NSE_BSE_MASTER",
    }
  );
});

test("mergeNseAndBseSecurities preserves NSE-only company", () => {
  const nse =
    parseNseEquitySecurityCsv(`
SYMBOL,NAME OF COMPANY,SERIES,ISIN NUMBER
NSEONLY,NSE Only Limited,EQ,INE111A01011
`);

  const merged =
    mergeNseAndBseSecurities(
      nse,
      []
    );

  assert.equal(
    merged.length,
    1
  );

  assert.equal(
    merged[0].nseSymbol,
    "NSEONLY"
  );

  assert.equal(
    merged[0].bseCode,
    undefined
  );
});

test("mergeNseAndBseSecurities preserves BSE-only company", () => {
  const bse =
    parseBseEquitySecurityCsv(`
Scrip Code,Instrument Code,Scrip Name,ISIN Code,Security Type Flag
599999,BSEONLY,BSE Only Limited,INE222A01022,EQ
`);

  const merged =
    mergeNseAndBseSecurities(
      [],
      bse
    );

  assert.equal(
    merged.length,
    1
  );

  assert.equal(
    merged[0].bseCode,
    "599999"
  );

  assert.equal(
    merged[0].nseSymbol,
    undefined
  );
});

test("mergeNseAndBseSecurities keeps separate companies with different ISINs", () => {
  const nse =
    parseNseEquitySecurityCsv(`
SYMBOL,NAME OF COMPANY,SERIES,ISIN NUMBER
TESTA,Test Company Limited,EQ,INE333A01033
`);

  const bse =
    parseBseEquitySecurityCsv(`
Scrip Code,Instrument Code,Scrip Name,ISIN Code,Security Type Flag
588888,TESTB,Test Company Limited,INE444A01044,EQ
`);

  const merged =
    mergeNseAndBseSecurities(
      nse,
      bse
    );

  assert.equal(
    merged.length,
    2
  );
});