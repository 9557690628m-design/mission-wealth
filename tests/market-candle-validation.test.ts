import assert from "node:assert/strict";
import test from "node:test";

import {
  isValidMarketCandle,
  isValidMarketCandleSeries,
} from "../src/lib/market/candles/validation";

import type {
  MarketCandle,
  MarketCandleSeries,
} from "../src/lib/market/candles/types";

const validCandle: MarketCandle = {
  symbol: "HDFCBANK",
  exchange: "NSE",
  interval: "1d",
  timestamp: "2026-11-06T00:00:00.000Z",
  open: 1725,
  high: 1750,
  low: 1710,
  close: 1740,
  volume: 1250000,
  source: "test-provider",
  adjusted: false,
};

test(
  "accepts a valid market candle",
  () => {
    assert.equal(
      isValidMarketCandle(
        validCandle
      ),
      true
    );
  }
);

test(
  "rejects blank candle symbol",
  () => {
    assert.equal(
      isValidMarketCandle({
        ...validCandle,
        symbol: "   ",
      }),
      false
    );
  }
);

test(
  "rejects blank candle source",
  () => {
    assert.equal(
      isValidMarketCandle({
        ...validCandle,
        source: "",
      }),
      false
    );
  }
);

test(
  "rejects invalid candle timestamp",
  () => {
    assert.equal(
      isValidMarketCandle({
        ...validCandle,
        timestamp: "not-a-date",
      }),
      false
    );
  }
);

test(
  "rejects zero or negative OHLC values",
  () => {
    assert.equal(
      isValidMarketCandle({
        ...validCandle,
        open: 0,
      }),
      false
    );

    assert.equal(
      isValidMarketCandle({
        ...validCandle,
        close: -1,
      }),
      false
    );
  }
);

test(
  "rejects candle when high is below low",
  () => {
    assert.equal(
      isValidMarketCandle({
        ...validCandle,
        high: 1700,
        low: 1710,
      }),
      false
    );
  }
);

test(
  "rejects candle when high is below open or close",
  () => {
    assert.equal(
      isValidMarketCandle({
        ...validCandle,
        high: 1730,
        close: 1740,
      }),
      false
    );
  }
);

test(
  "rejects candle when low is above open or close",
  () => {
    assert.equal(
      isValidMarketCandle({
        ...validCandle,
        low: 1730,
        open: 1725,
      }),
      false
    );
  }
);

test(
  "allows null volume",
  () => {
    assert.equal(
      isValidMarketCandle({
        ...validCandle,
        volume: null,
      }),
      true
    );
  }
);

test(
  "rejects negative volume",
  () => {
    assert.equal(
      isValidMarketCandle({
        ...validCandle,
        volume: -1,
      }),
      false
    );
  }
);

test(
  "rejects non-finite OHLC values",
  () => {
    assert.equal(
      isValidMarketCandle({
        ...validCandle,
        close: Number.NaN,
      }),
      false
    );

    assert.equal(
      isValidMarketCandle({
        ...validCandle,
        high: Number.POSITIVE_INFINITY,
      }),
      false
    );
  }
);

const validSeries: MarketCandleSeries = {
  symbol: "HDFCBANK",
  exchange: "NSE",
  interval: "1d",
  source: "test-provider",
  adjusted: false,
  from: "2026-11-01T00:00:00.000Z",
  to: "2026-11-30T23:59:59.999Z",
  candles: [
    validCandle,
  ],
};

test(
  "accepts a valid candle series",
  () => {
    assert.equal(
      isValidMarketCandleSeries(
        validSeries
      ),
      true
    );
  }
);

test(
  "rejects candle series with invalid date range",
  () => {
    assert.equal(
      isValidMarketCandleSeries({
        ...validSeries,
        from: "2026-12-01T00:00:00.000Z",
        to: "2026-11-01T00:00:00.000Z",
      }),
      false
    );
  }
);

test(
  "rejects candle series with mismatched symbol",
  () => {
    assert.equal(
      isValidMarketCandleSeries({
        ...validSeries,
        candles: [
          {
            ...validCandle,
            symbol: "RELIANCE",
          },
        ],
      }),
      false
    );
  }
);

test(
  "rejects candle series with mismatched exchange",
  () => {
    assert.equal(
      isValidMarketCandleSeries({
        ...validSeries,
        candles: [
          {
            ...validCandle,
            exchange: "BSE",
          },
        ],
      }),
      false
    );
  }
);

test(
  "rejects candle series with mismatched interval",
  () => {
    assert.equal(
      isValidMarketCandleSeries({
        ...validSeries,
        candles: [
          {
            ...validCandle,
            interval: "1h",
          },
        ],
      }),
      false
    );
  }
);

test(
  "rejects candle series with mismatched source",
  () => {
    assert.equal(
      isValidMarketCandleSeries({
        ...validSeries,
        candles: [
          {
            ...validCandle,
            source: "other-provider",
          },
        ],
      }),
      false
    );
  }
);

test(
  "rejects candle series with mismatched adjusted flag",
  () => {
    assert.equal(
      isValidMarketCandleSeries({
        ...validSeries,
        candles: [
          {
            ...validCandle,
            adjusted: true,
          },
        ],
      }),
      false
    );
  }
);