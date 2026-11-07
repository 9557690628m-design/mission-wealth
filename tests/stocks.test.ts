import assert from "node:assert/strict";
import test from "node:test";

import {
  getStockIdentity,
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