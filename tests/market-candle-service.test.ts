import assert from "node:assert/strict";
import test from "node:test";

import {
  loadMarketCandles,
} from "../src/lib/market/candles/service";

import type {
  HistoricalPrice,
} from "../src/lib/market/types";

const validPrices: HistoricalPrice[] = [
  {
    date: "2026-11-06",
    open: 1725,
    high: 1750,
    low: 1710,
    close: 1740,
    volume: 1250000,
  },
  {
    date: "2026-11-07",
    open: 1740,
    high: 1765,
    low: 1730,
    close: 1755,
    volume: 1100000,
  },
  {
    date: "2026-11-08",
    open: 1755,
    high: 1770,
    low: 1745,
    close: 1760,
    volume: 980000,
  },
];

test(
  "loads and normalizes market candles",
  async () => {
    const candles =
      await loadMarketCandles({
        symbol: "hdfcbank",
        exchange: "NSE",
        interval: "1d",
        from: "2026-11-01",
        to: "2026-11-30",
        source: "test-provider",
        loadHistoricalPrices:
          async () => validPrices,
      });

    assert.equal(
      candles.length,
      3
    );

    assert.equal(
      candles[0]?.symbol,
      "HDFCBANK"
    );

    assert.equal(
      candles[0]?.exchange,
      "NSE"
    );

    assert.equal(
      candles[0]?.interval,
      "1d"
    );
  }
);

test(
  "passes normalized symbol and requested date range to loader",
  async () => {
    let receivedSymbol = "";
    let receivedFrom = "";
    let receivedTo = "";

    await loadMarketCandles({
      symbol: "  hdfcbank  ",
      exchange: "NSE",
      interval: "1d",
      from: "2026-11-01",
      to: "2026-11-30",
      source: "test-provider",
      loadHistoricalPrices:
        async (
          symbol,
          from,
          to
        ) => {
          receivedSymbol =
            symbol;
          receivedFrom =
            from;
          receivedTo =
            to;

          return validPrices;
        },
    });

    assert.equal(
      receivedSymbol,
      "HDFCBANK"
    );

    assert.equal(
      receivedFrom,
      "2026-11-01"
    );

    assert.equal(
      receivedTo,
      "2026-11-30"
    );
  }
);

test(
  "returns empty array for blank symbol",
  async () => {
    let loaderCalled = false;

    const candles =
      await loadMarketCandles({
        symbol: "   ",
        exchange: "NSE",
        interval: "1d",
        from: "2026-11-01",
        to: "2026-11-30",
        source: "test-provider",
        loadHistoricalPrices:
          async () => {
            loaderCalled = true;

            return validPrices;
          },
      });

    assert.deepEqual(
      candles,
      []
    );

    assert.equal(
      loaderCalled,
      false
    );
  }
);

test(
  "returns empty array for blank source",
  async () => {
    const candles =
      await loadMarketCandles({
        symbol: "HDFCBANK",
        exchange: "NSE",
        interval: "1d",
        from: "2026-11-01",
        to: "2026-11-30",
        source: "   ",
        loadHistoricalPrices:
          async () => validPrices,
      });

    assert.deepEqual(
      candles,
      []
    );
  }
);

test(
  "returns empty array for invalid from date",
  async () => {
    const candles =
      await loadMarketCandles({
        symbol: "HDFCBANK",
        exchange: "NSE",
        interval: "1d",
        from: "bad-date",
        to: "2026-11-30",
        source: "test-provider",
        loadHistoricalPrices:
          async () => validPrices,
      });

    assert.deepEqual(
      candles,
      []
    );
  }
);

test(
  "returns empty array for invalid to date",
  async () => {
    const candles =
      await loadMarketCandles({
        symbol: "HDFCBANK",
        exchange: "NSE",
        interval: "1d",
        from: "2026-11-01",
        to: "bad-date",
        source: "test-provider",
        loadHistoricalPrices:
          async () => validPrices,
      });

    assert.deepEqual(
      candles,
      []
    );
  }
);

test(
  "returns empty array when from date is after to date",
  async () => {
    const candles =
      await loadMarketCandles({
        symbol: "HDFCBANK",
        exchange: "NSE",
        interval: "1d",
        from: "2026-12-01",
        to: "2026-11-01",
        source: "test-provider",
        loadHistoricalPrices:
          async () => validPrices,
      });

    assert.deepEqual(
      candles,
      []
    );
  }
);

test(
  "returns empty array when loader throws",
  async () => {
    const candles =
      await loadMarketCandles({
        symbol: "HDFCBANK",
        exchange: "NSE",
        interval: "1d",
        from: "2026-11-01",
        to: "2026-11-30",
        source: "test-provider",
        loadHistoricalPrices:
          async () => {
            throw new Error(
              "provider failed"
            );
          },
      });

    assert.deepEqual(
      candles,
      []
    );
  }
);

test(
  "skips invalid historical rows through normalization",
  async () => {
    const candles =
      await loadMarketCandles({
        symbol: "HDFCBANK",
        exchange: "NSE",
        interval: "1d",
        from: "2026-11-01",
        to: "2026-11-30",
        source: "test-provider",
        loadHistoricalPrices:
          async () => [
            validPrices[0]!,
            {
              date: "2026-11-07",
              open: 1740,
              high: 1700,
              low: 1730,
              close: 1755,
              volume: 1100000,
            },
          ],
      });

    assert.equal(
      candles.length,
      1
    );
  }
);

test(
  "applies limit to newest candles",
  async () => {
    const candles =
      await loadMarketCandles({
        symbol: "HDFCBANK",
        exchange: "NSE",
        interval: "1d",
        from: "2026-11-01",
        to: "2026-11-30",
        source: "test-provider",
        limit: 2,
        loadHistoricalPrices:
          async () => validPrices,
      });

    assert.equal(
      candles.length,
      2
    );

    assert.equal(
      candles[0]?.timestamp,
      "2026-11-07T00:00:00.000Z"
    );

    assert.equal(
      candles[1]?.timestamp,
      "2026-11-08T00:00:00.000Z"
    );
  }
);

test(
  "returns empty array for zero limit",
  async () => {
    const candles =
      await loadMarketCandles({
        symbol: "HDFCBANK",
        exchange: "NSE",
        interval: "1d",
        from: "2026-11-01",
        to: "2026-11-30",
        source: "test-provider",
        limit: 0,
        loadHistoricalPrices:
          async () => validPrices,
      });

    assert.deepEqual(
      candles,
      []
    );
  }
);

test(
  "returns empty array for non-integer limit",
  async () => {
    const candles =
      await loadMarketCandles({
        symbol: "HDFCBANK",
        exchange: "NSE",
        interval: "1d",
        from: "2026-11-01",
        to: "2026-11-30",
        source: "test-provider",
        limit: 1.5,
        loadHistoricalPrices:
          async () => validPrices,
      });

    assert.deepEqual(
      candles,
      []
    );
  }
);

test(
  "preserves adjusted flag",
  async () => {
    const candles =
      await loadMarketCandles({
        symbol: "HDFCBANK",
        exchange: "NSE",
        interval: "1d",
        from: "2026-11-01",
        to: "2026-11-30",
        source: "test-provider",
        adjusted: true,
        loadHistoricalPrices:
          async () => validPrices,
      });

    assert.equal(
      candles[0]?.adjusted,
      true
    );
  }
);