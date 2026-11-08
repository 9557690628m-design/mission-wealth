import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeHistoricalPrice,
  normalizeHistoricalPrices,
} from "../src/lib/market/candles/normalization";

import type {
  HistoricalPrice,
} from "../src/lib/market/types";

const options = {
  symbol: "HDFCBANK",
  exchange: "NSE" as const,
  interval: "1d" as const,
  source: "test-provider",
  adjusted: false,
};

const validPrice: HistoricalPrice = {
  date: "2026-11-06",
  open: 1725,
  high: 1750,
  low: 1710,
  close: 1740,
  volume: 1250000,
};

test(
  "normalizes a valid historical price",
  () => {
    const candle =
      normalizeHistoricalPrice(
        validPrice,
        options
      );

    assert.ok(candle);

    assert.equal(
      candle.symbol,
      "HDFCBANK"
    );

    assert.equal(
      candle.exchange,
      "NSE"
    );

    assert.equal(
      candle.interval,
      "1d"
    );

    assert.equal(
      candle.timestamp,
      "2026-11-06T00:00:00.000Z"
    );

    assert.equal(
      candle.open,
      1725
    );

    assert.equal(
      candle.high,
      1750
    );

    assert.equal(
      candle.low,
      1710
    );

    assert.equal(
      candle.close,
      1740
    );

    assert.equal(
      candle.volume,
      1250000
    );

    assert.equal(
      candle.source,
      "test-provider"
    );

    assert.equal(
      candle.adjusted,
      false
    );
  }
);

test(
  "normalizes symbol and source whitespace",
  () => {
    const candle =
      normalizeHistoricalPrice(
        validPrice,
        {
          ...options,
          symbol: "  hdfcbank  ",
          source:
            "  test-provider  ",
        }
      );

    assert.ok(candle);

    assert.equal(
      candle.symbol,
      "HDFCBANK"
    );

    assert.equal(
      candle.source,
      "test-provider"
    );
  }
);

test(
  "returns null for invalid date",
  () => {
    const candle =
      normalizeHistoricalPrice(
        {
          ...validPrice,
          date: "invalid-date",
        },
        options
      );

    assert.equal(
      candle,
      null
    );
  }
);

test(
  "returns null when open is missing",
  () => {
    const candle =
      normalizeHistoricalPrice(
        {
          ...validPrice,
          open: undefined,
        },
        options
      );

    assert.equal(
      candle,
      null
    );
  }
);

test(
  "returns null when high is missing",
  () => {
    const candle =
      normalizeHistoricalPrice(
        {
          ...validPrice,
          high: undefined,
        },
        options
      );

    assert.equal(
      candle,
      null
    );
  }
);

test(
  "returns null when low is missing",
  () => {
    const candle =
      normalizeHistoricalPrice(
        {
          ...validPrice,
          low: undefined,
        },
        options
      );

    assert.equal(
      candle,
      null
    );
  }
);

test(
  "uses null volume when volume is missing",
  () => {
    const candle =
      normalizeHistoricalPrice(
        {
          ...validPrice,
          volume: undefined,
        },
        options
      );

    assert.ok(candle);

    assert.equal(
      candle.volume,
      null
    );
  }
);

test(
  "uses null volume when volume is invalid",
  () => {
    const candle =
      normalizeHistoricalPrice(
        {
          ...validPrice,
          volume: -1,
        },
        options
      );

    assert.ok(candle);

    assert.equal(
      candle.volume,
      null
    );
  }
);

test(
  "returns null when OHLC values fail validation",
  () => {
    const candle =
      normalizeHistoricalPrice(
        {
          ...validPrice,
          high: 1700,
          low: 1710,
        },
        options
      );

    assert.equal(
      candle,
      null
    );
  }
);

test(
  "normalizes multiple historical prices and sorts oldest first",
  () => {
    const prices:
      HistoricalPrice[] = [
        {
          ...validPrice,
          date: "2026-11-08",
          close: 1760,
          high: 1770,
        },
        {
          ...validPrice,
          date: "2026-11-06",
        },
        {
          ...validPrice,
          date: "2026-11-07",
          close: 1750,
          high: 1760,
        },
      ];

    const candles =
      normalizeHistoricalPrices(
        prices,
        options
      );

    assert.equal(
      candles.length,
      3
    );

    assert.deepEqual(
      candles.map(
        (candle) =>
          candle.timestamp
      ),
      [
        "2026-11-06T00:00:00.000Z",
        "2026-11-07T00:00:00.000Z",
        "2026-11-08T00:00:00.000Z",
      ]
    );
  }
);

test(
  "removes duplicate timestamps",
  () => {
    const prices:
      HistoricalPrice[] = [
        validPrice,
        {
          ...validPrice,
          close: 1735,
        },
      ];

    const candles =
      normalizeHistoricalPrices(
        prices,
        options
      );

    assert.equal(
      candles.length,
      1
    );
  }
);

test(
  "skips invalid historical prices",
  () => {
    const prices:
      HistoricalPrice[] = [
        validPrice,
        {
          ...validPrice,
          date: "bad-date",
        },
      ];

    const candles =
      normalizeHistoricalPrices(
        prices,
        options
      );

    assert.equal(
      candles.length,
      1
    );
  }
);

test(
  "preserves adjusted flag",
  () => {
    const candle =
      normalizeHistoricalPrice(
        validPrice,
        {
          ...options,
          adjusted: true,
        }
      );

    assert.ok(candle);

    assert.equal(
      candle.adjusted,
      true
    );
  }
);