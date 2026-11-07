import assert from "node:assert/strict";
import test from "node:test";

import {
  parseNseEquitySecurityCsv,
  searchListedSecurities,
} from "../src/lib/market/securities-master";

test("parseNseEquitySecurityCsv parses standard NSE equity rows", () => {
  const csv = `
SYMBOL,NAME OF COMPANY,SERIES,ISIN NUMBER
BEL,Bharat Electronics Limited,EQ,INE263A01024
TITAGARH,Titagarh Rail Systems Limited,EQ,INE615H01020
`;

  const result =
    parseNseEquitySecurityCsv(
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
      series: "EQ",
      isin:
        "INE263A01024",
      nseSymbol:
        "BEL",
      source: "NSE",
    }
  );

  assert.equal(
    result[1].symbol,
    "TITAGARH"
  );
});

test("parseNseEquitySecurityCsv supports quoted company names containing commas", () => {
  const csv = `
SYMBOL,NAME OF COMPANY,SERIES,ISIN NUMBER
TEST,"Example Industries, Limited",EQ,INE000A01001
`;

  const result =
    parseNseEquitySecurityCsv(
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

test("parseNseEquitySecurityCsv ignores rows missing symbol", () => {
  const csv = `
SYMBOL,NAME OF COMPANY,SERIES,ISIN NUMBER
,Bharat Electronics Limited,EQ,INE263A01024
`;

  const result =
    parseNseEquitySecurityCsv(
      csv
    );

  assert.equal(
    result.length,
    0
  );
});

test("parseNseEquitySecurityCsv ignores rows missing company name", () => {
  const csv = `
SYMBOL,NAME OF COMPANY,SERIES,ISIN NUMBER
BEL,,EQ,INE263A01024
`;

  const result =
    parseNseEquitySecurityCsv(
      csv
    );

  assert.equal(
    result.length,
    0
  );
});

test("parseNseEquitySecurityCsv removes duplicate symbol and ISIN rows", () => {
  const csv = `
SYMBOL,NAME OF COMPANY,SERIES,ISIN NUMBER
BEL,Bharat Electronics Limited,EQ,INE263A01024
BEL,Bharat Electronics Limited,EQ,INE263A01024
`;

  const result =
    parseNseEquitySecurityCsv(
      csv
    );

  assert.equal(
    result.length,
    1
  );
});

test("parseNseEquitySecurityCsv returns empty array when required headers are missing", () => {
  const csv = `
CODE,COMPANY
BEL,Bharat Electronics Limited
`;

  const result =
    parseNseEquitySecurityCsv(
      csv
    );

  assert.deepEqual(
    result,
    []
  );
});

test("searchListedSecurities finds a security by symbol", () => {
  const securities =
    parseNseEquitySecurityCsv(`
SYMBOL,NAME OF COMPANY,SERIES,ISIN NUMBER
BEL,Bharat Electronics Limited,EQ,INE263A01024
TITAGARH,Titagarh Rail Systems Limited,EQ,INE615H01020
`);

  const result =
    searchListedSecurities(
      securities,
      "TITAGARH"
    );

  assert.equal(
    result.length,
    1
  );

  assert.equal(
    result[0].symbol,
    "TITAGARH"
  );
});

test("searchListedSecurities finds a security by partial company name", () => {
  const securities =
    parseNseEquitySecurityCsv(`
SYMBOL,NAME OF COMPANY,SERIES,ISIN NUMBER
BEL,Bharat Electronics Limited,EQ,INE263A01024
TITAGARH,Titagarh Rail Systems Limited,EQ,INE615H01020
`);

  const result =
    searchListedSecurities(
      securities,
      "rail systems"
    );

  assert.equal(
    result.length,
    1
  );

  assert.equal(
    result[0].symbol,
    "TITAGARH"
  );
});

test("searchListedSecurities finds a security by ISIN", () => {
  const securities =
    parseNseEquitySecurityCsv(`
SYMBOL,NAME OF COMPANY,SERIES,ISIN NUMBER
BEL,Bharat Electronics Limited,EQ,INE263A01024
`);

  const result =
    searchListedSecurities(
      securities,
      "INE263A01024"
    );

  assert.equal(
    result.length,
    1
  );

  assert.equal(
    result[0].symbol,
    "BEL"
  );
});

test("searchListedSecurities respects the result limit", () => {
  const securities =
    parseNseEquitySecurityCsv(`
SYMBOL,NAME OF COMPANY,SERIES,ISIN NUMBER
TEST1,Test Company One,EQ,INE000A01001
TEST2,Test Company Two,EQ,INE000A01002
TEST3,Test Company Three,EQ,INE000A01003
`);

  const result =
    searchListedSecurities(
      securities,
      "test",
      2
    );

  assert.equal(
    result.length,
    2
  );
});

test("searchListedSecurities returns empty array for blank query", () => {
  const securities =
    parseNseEquitySecurityCsv(`
SYMBOL,NAME OF COMPANY,SERIES,ISIN NUMBER
BEL,Bharat Electronics Limited,EQ,INE263A01024
`);

  const result =
    searchListedSecurities(
      securities,
      "   "
    );

  assert.deepEqual(
    result,
    []
  );
});