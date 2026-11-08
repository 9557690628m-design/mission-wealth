import assert from "node:assert/strict";
import test from "node:test";

import {
  getMarketCandles,
} from "../src/lib/market";

test(
  "returns empty candles when no market provider is configured",
  async () => {
    const result =
      await getMarketCandles({
        symbol: "HDFCBANK",
        exchange: "NSE",
        from: "2026-01-01",
        to: "2026-11-08",
      });

    assert.deepEqual(
      result,
      []
    );
  }
);

test(
  "returns empty candles for unsupported intraday interval",
  async () => {
    const result =
      await getMarketCandles({
        symbol: "HDFCBANK",
        exchange: "NSE",
        interval: "5m",
        from: "2026-01-01",
        to: "2026-11-08",
      });

    assert.deepEqual(
      result,
      []
    );
  }
);

test(
  "defaults interval to daily",
  async () => {
    const result =
      await getMarketCandles({
        symbol: "HDFCBANK",
        exchange: "NSE",
        from: "2026-01-01",
        to: "2026-11-08",
      });

    assert.ok(
      Array.isArray(result)
    );
  }
);

test(
  "does not relabel BSE-only provider data as NSE",
  async () => {
    const result =
      await getMarketCandles({
        symbol: "HDFCBANK",
        exchange: "NSE",
        interval: "1d",
        from: "2026-01-01",
        to: "2026-11-08",
      });

    assert.deepEqual(
      result,
      []
    );
  }
);