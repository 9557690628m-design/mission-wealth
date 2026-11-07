import assert from "node:assert/strict";
import test from "node:test";

import {
  getStockIdentity,
  resolveStockIdentity,
  searchStockIdentities,
} from "../src/lib/market/stocks";

test("getStockIdentity resolves Titagarh by NSE symbol", () => {
  const stock =
    getStockIdentity(
      "TITAGARH"
    );

  assert.ok(stock);

  assert.equal(
    stock.symbol,
    "TITAGARH"
  );

  assert.equal(
    stock.name,
    "Titagarh Rail Systems Ltd"
  );

  assert.equal(
    stock.bseCode,
    "532966"
  );
});

test("getStockIdentity resolves Titagarh by former company name", () => {
  const stock =
    getStockIdentity(
      "Titagarh Wagons Limited"
    );

  assert.ok(stock);

  assert.equal(
    stock.symbol,
    "TITAGARH"
  );
});

test("getStockIdentity resolves Titagarh Wagon alias", () => {
  const stock =
    getStockIdentity(
      "Titagarh Wagon"
    );

  assert.ok(stock);

  assert.equal(
    stock.symbol,
    "TITAGARH"
  );
});

test("getStockIdentity resolves Titagarh by BSE code", () => {
  const stock =
    getStockIdentity(
      "532966"
    );

  assert.ok(stock);

  assert.equal(
    stock.symbol,
    "TITAGARH"
  );
});

test("getStockIdentity ignores spaces and punctuation", () => {
  const stock =
    getStockIdentity(
      "Titagarh-Rail Systems"
    );

  assert.ok(stock);

  assert.equal(
    stock.symbol,
    "TITAGARH"
  );
});

test("searchStockIdentities finds Titagarh from partial rail query", () => {
  const results =
    searchStockIdentities(
      "Titagarh Rail"
    );

  assert.ok(
    results.some(
      (stock) =>
        stock.symbol ===
        "TITAGARH"
    )
  );
});

test("searchStockIdentities finds Titagarh from wagon query", () => {
  const results =
    searchStockIdentities(
      "wagon"
    );

  assert.ok(
    results.some(
      (stock) =>
        stock.symbol ===
        "TITAGARH"
    )
  );
});

test("existing BEL resolution still works", () => {
  const stock =
    getStockIdentity(
      "BEL"
    );

  assert.ok(stock);

  assert.equal(
    stock.name,
    "Bharat Electronics Ltd"
  );
});

test("existing stock search still finds HDFC Bank", () => {
  const results =
    searchStockIdentities(
      "HDFC"
    );

  assert.ok(
    results.some(
      (stock) =>
        stock.symbol ===
        "HDFCBANK"
    )
  );
});

test("unknown company returns undefined", () => {
  const stock =
    getStockIdentity(
      "UNKNOWN-COMPANY"
    );

  assert.equal(
    stock,
    undefined
  );
});

test("resolveStockIdentity keeps curated company identity", async () => {
  let loaderCalled = false;

  const stock =
    await resolveStockIdentity(
      "BEL",
      {
        loadSecurities:
          async () => {
            loaderCalled = true;

            return {
              status:
                "available",
              securities: [],
              sourceUrl:
                "https://example.com/equities.csv",
            };
          },
      }
    );

  assert.ok(stock);

  assert.equal(
    stock.symbol,
    "BEL"
  );

  assert.equal(
    stock.name,
    "Bharat Electronics Ltd"
  );

  assert.equal(
    loaderCalled,
    false
  );
});

test("resolveStockIdentity creates identity from NSE security", async () => {
  const stock =
    await resolveStockIdentity(
      "HAL",
      {
        loadSecurities:
          async () => ({
            status:
              "available",
            securities: [
              {
                symbol:
                  "HAL",
                companyName:
                  "Hindustan Aeronautics Limited",
                series:
                  "EQ",
                isin:
                  "INE066F01020",
                nseSymbol:
                  "HAL",
                source:
                  "NSE",
              },
            ],
            sourceUrl:
              "https://example.com/equities.csv",
          }),
      }
    );

  assert.ok(stock);

  assert.deepEqual(
    stock,
    {
      symbol:
        "HAL",
      name:
        "Hindustan Aeronautics Limited",
      slug:
        "hal",
      nseSymbol:
        "HAL",
      bseCode:
        undefined,
      isin:
        "INE066F01020",
      sector:
        "Listed Equity",
    }
  );
});

test("resolveStockIdentity accepts lowercase NSE slug", async () => {
  const stock =
    await resolveStockIdentity(
      "sbin",
      {
        loadSecurities:
          async () => ({
            status:
              "available",
            securities: [
              {
                symbol:
                  "SBIN",
                companyName:
                  "State Bank of India",
                isin:
                  "INE062A01020",
                nseSymbol:
                  "SBIN",
                source:
                  "NSE",
              },
            ],
            sourceUrl:
              "https://example.com/equities.csv",
          }),
      }
    );

  assert.ok(stock);

  assert.equal(
    stock.symbol,
    "SBIN"
  );

  assert.equal(
    stock.slug,
    "sbin"
  );
});

test("resolveStockIdentity returns undefined when NSE loader is unavailable", async () => {
  const stock =
    await resolveStockIdentity(
      "HAL",
      {
        loadSecurities:
          async () => ({
            status:
              "download_failed",
            securities: [],
            sourceUrl:
              "https://example.com/equities.csv",
            reason:
              "Network request failed.",
          }),
      }
    );

  assert.equal(
    stock,
    undefined
  );
});

test("resolveStockIdentity returns undefined when security is absent", async () => {
  const stock =
    await resolveStockIdentity(
      "UNKNOWN",
      {
        loadSecurities:
          async () => ({
            status:
              "available",
            securities: [
              {
                symbol:
                  "HAL",
                companyName:
                  "Hindustan Aeronautics Limited",
                nseSymbol:
                  "HAL",
                source:
                  "NSE",
              },
            ],
            sourceUrl:
              "https://example.com/equities.csv",
          }),
      }
    );

  assert.equal(
    stock,
    undefined
  );
});

test("resolveStockIdentity safely handles loader exception", async () => {
  const stock =
    await resolveStockIdentity(
      "HAL",
      {
        loadSecurities:
          async () => {
            throw new Error(
              "Test network failure"
            );
          },
      }
    );

  assert.equal(
    stock,
    undefined
  );
});