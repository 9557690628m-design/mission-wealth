import test from "node:test";
import assert from "node:assert/strict";

import { isFreshMarketData } from "../src/lib/market/freshness";

const DAY_MS = 24 * 60 * 60 * 1000;

test("returns true for recent market data", () => {
  const timestamp = new Date(
    Date.now() - 2 * DAY_MS
  ).toISOString();

  assert.equal(
    isFreshMarketData(timestamp, 7),
    true
  );
});

test("returns false for stale market data", () => {
  const timestamp = new Date(
    Date.now() - 10 * DAY_MS
  ).toISOString();

  assert.equal(
    isFreshMarketData(timestamp, 7),
    false
  );
});

test("returns false for invalid timestamps", () => {
  assert.equal(
    isFreshMarketData(
      "not-a-valid-date",
      7
    ),
    false
  );
});

test("uses the default seven-day freshness window", () => {
  const recentTimestamp = new Date(
    Date.now() - 6 * DAY_MS
  ).toISOString();

  const staleTimestamp = new Date(
    Date.now() - 8 * DAY_MS
  ).toISOString();

  assert.equal(
    isFreshMarketData(
      recentTimestamp
    ),
    true
  );

  assert.equal(
    isFreshMarketData(
      staleTimestamp
    ),
    false
  );
});

test("respects a custom freshness window", () => {
  const timestamp = new Date(
    Date.now() - 2 * DAY_MS
  ).toISOString();

  assert.equal(
    isFreshMarketData(
      timestamp,
      3
    ),
    true
  );

  assert.equal(
    isFreshMarketData(
      timestamp,
      1
    ),
    false
  );
});

test("returns false for timestamps in the future", () => {
  const futureTimestamp = new Date(
    Date.now() + DAY_MS
  ).toISOString();

  assert.equal(
    isFreshMarketData(
      futureTimestamp,
      7
    ),
    false
  );
});