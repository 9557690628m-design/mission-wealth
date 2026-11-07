import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCombinedSecuritiesMaster,
  loadBseEquitySecuritiesFromCsv,
  loadNseEquitySecurities,
  OFFICIAL_NSE_EQUITY_URL,
} from "../src/lib/market/securities-loader";

function createResponse(
  body: string,
  options?: {
    status?: number;
    contentType?: string;
  }
): Response {
  const status =
    options?.status ?? 200;

  const contentType =
    options?.contentType ??
    "text/csv";

  return new Response(
    body,
    {
      status,

      headers: {
        "content-type":
          contentType,
      },
    }
  );
}

test("OFFICIAL_NSE_EQUITY_URL points to official NSE archive", () => {
  assert.equal(
    OFFICIAL_NSE_EQUITY_URL,
    "https://nsearchives.nseindia.com/content/equities/EQUITY_L.csv"
  );
});

test("loadNseEquitySecurities downloads and parses valid NSE CSV", async () => {
  const fetchImpl =
    async () =>
      createResponse(`
SYMBOL,NAME OF COMPANY,SERIES,ISIN NUMBER
BEL,Bharat Electronics Limited,EQ,INE263A01024
TITAGARH,Titagarh Rail Systems Limited,EQ,INE615H01020
`);

  const result =
    await loadNseEquitySecurities(
      fetchImpl
    );

  assert.equal(
    result.status,
    "available"
  );

  assert.equal(
    result.securities.length,
    2
  );

  assert.equal(
    result.securities[0].nseSymbol,
    "BEL"
  );
});

test("loadNseEquitySecurities reports failed HTTP response", async () => {
  const fetchImpl =
    async () =>
      createResponse(
        "Not Found",
        {
          status: 404,
        }
      );

  const result =
    await loadNseEquitySecurities(
      fetchImpl
    );

  assert.equal(
    result.status,
    "download_failed"
  );

  assert.equal(
    result.securities.length,
    0
  );

  assert.equal(
    result.reason,
    "HTTP 404"
  );
});

test("loadNseEquitySecurities reports network failure", async () => {
  const fetchImpl =
    async (): Promise<Response> => {
      throw new Error(
        "network failure"
      );
    };

  const result =
    await loadNseEquitySecurities(
      fetchImpl
    );

  assert.equal(
    result.status,
    "download_failed"
  );

  assert.equal(
    result.securities.length,
    0
  );
});

test("loadNseEquitySecurities rejects unsupported content type", async () => {
  const fetchImpl =
    async () =>
      createResponse(
        "<html></html>",
        {
          contentType:
            "text/html",
        }
      );

  const result =
    await loadNseEquitySecurities(
      fetchImpl
    );

  assert.equal(
    result.status,
    "invalid_content_type"
  );

  assert.equal(
    result.securities.length,
    0
  );
});

test("loadNseEquitySecurities rejects empty response", async () => {
  const fetchImpl =
    async () =>
      createResponse(
        "   "
      );

  const result =
    await loadNseEquitySecurities(
      fetchImpl
    );

  assert.equal(
    result.status,
    "empty_content"
  );

  assert.equal(
    result.securities.length,
    0
  );
});

test("loadNseEquitySecurities rejects malformed CSV data", async () => {
  const fetchImpl =
    async () =>
      createResponse(`
WRONG HEADER,ANOTHER HEADER
ABC,Example
`);

  const result =
    await loadNseEquitySecurities(
      fetchImpl
    );

  assert.equal(
    result.status,
    "invalid_data"
  );

  assert.equal(
    result.securities.length,
    0
  );
});

test("loadBseEquitySecuritiesFromCsv downloads and parses valid BSE CSV", async () => {
  const fetchImpl =
    async () =>
      createResponse(`
Scrip Code,Instrument Code,Scrip Name,ISIN Code,Security Type Flag
500049,BEL,Bharat Electronics Limited,INE263A01024,EQ
532966,TITAGARH,Titagarh Rail Systems Limited,INE615H01020,EQ
`);

  const result =
    await loadBseEquitySecuritiesFromCsv(
      "https://example.com/bse.csv",
      fetchImpl
    );

  assert.equal(
    result.status,
    "available"
  );

  assert.equal(
    result.securities.length,
    2
  );

  assert.equal(
    result.securities[0].bseCode,
    "500049"
  );
});

test("loadBseEquitySecuritiesFromCsv rejects malformed BSE CSV", async () => {
  const fetchImpl =
    async () =>
      createResponse(`
WRONG HEADER,ANOTHER HEADER
ABC,Example
`);

  const result =
    await loadBseEquitySecuritiesFromCsv(
      "https://example.com/bse.csv",
      fetchImpl
    );

  assert.equal(
    result.status,
    "invalid_data"
  );

  assert.equal(
    result.securities.length,
    0
  );
});

test("buildCombinedSecuritiesMaster merges NSE and BSE by ISIN", () => {
  const nse = [
    {
      symbol: "BEL",
      companyName:
        "Bharat Electronics Limited",
      nseSymbol: "BEL",
      isin: "INE263A01024",
      series: "EQ",
      source: "NSE" as const,
    },
  ];

  const bse = [
    {
      symbol: "BEL",
      companyName:
        "Bharat Electronics Limited",
      bseCode: "500049",
      isin: "INE263A01024",
      source: "BSE" as const,
    },
  ];

  const result =
    buildCombinedSecuritiesMaster(
      nse,
      bse
    );

  assert.equal(
    result.length,
    1
  );

  assert.equal(
    result[0].nseSymbol,
    "BEL"
  );

  assert.equal(
    result[0].bseCode,
    "500049"
  );

  assert.equal(
    result[0].source,
    "NSE_BSE_MASTER"
  );
});