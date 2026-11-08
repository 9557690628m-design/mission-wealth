import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateRsi,
  calculateRsiSeries,
} from "../src/lib/market/indicators/rsi";

import type {
  MarketCandle,
} from "../src/lib/market/candles/types";

function makeCandle(
  close: number,
  index: number
): MarketCandle {
  return {
    symbol: "HDFCBANK",
    exchange: "NSE",
    interval: "1d",
    timestamp: new Date(
      Date.UTC(
        2026,
        0,
        index + 1
      )
    ).toISOString(),
    open: close,
    high: close,
    low: close,
    close,
    volume: null,
    source: "test-provider",
    adjusted: false,
  };
}

test(
  "returns all nulls when there are not enough candles",
  () => {
    const candles = [
      makeCandle(10, 0),
      makeCandle(11, 1),
      makeCandle(12, 2),
    ];

    assert.deepEqual(
      calculateRsiSeries(
        candles,
        14
      ),
      [
        null,
        null,
        null,
      ]
    );

    assert.equal(
      calculateRsi(
        candles,
        14
      ),
      null
    );
  }
);

test(
  "returns 100 when there are gains and no losses",
  () => {
    const candles =
      Array.from(
        { length: 15 },
        (_, index) =>
          makeCandle(
            100 + index,
            index
          )
      );

    const result =
      calculateRsi(
        candles,
        14
      );

    assert.equal(
      result,
      100
    );
  }
);

test(
  "returns 0 when there are losses and no gains",
  () => {
    const candles =
      Array.from(
        { length: 15 },
        (_, index) =>
          makeCandle(
            100 - index,
            index
          )
      );

    const result =
      calculateRsi(
        candles,
        14
      );

    assert.equal(
      result,
      0
    );
  }
);

test(
  "calculates RSI series with first value after period changes",
  () => {
    const closes = [
      44.34,
      44.09,
      44.15,
      43.61,
      44.33,
      44.83,
      45.10,
      45.42,
      45.84,
      46.08,
      45.89,
      46.03,
      45.61,
      46.28,
      46.28,
    ];

    const candles =
      closes.map(
        makeCandle
      );

    const series =
      calculateRsiSeries(
        candles,
        14
      );

    assert.equal(
      series.length,
      candles.length
    );

    assert.equal(
      series[13],
      null
    );

    assert.ok(
      series[14] !== null
    );

    assert.ok(
      Math.abs(
        series[14]! -
          70.46
      ) <
        0.1
    );
  }
);

test(
  "returns latest RSI from longer series",
  () => {
    const closes = [
      44.34,
      44.09,
      44.15,
      43.61,
      44.33,
      44.83,
      45.10,
      45.42,
      45.84,
      46.08,
      45.89,
      46.03,
      45.61,
      46.28,
      46.28,
      46.00,
      46.03,
      46.41,
      46.22,
      45.64,
    ];

    const candles =
      closes.map(
        makeCandle
      );

    const latest =
      calculateRsi(
        candles,
        14
      );

    assert.ok(
      latest !== null
    );

    assert.ok(
      latest >= 0 &&
      latest <= 100
    );
  }
);

test(
  "returns all nulls for zero period",
  () => {
    const candles = [
      makeCandle(10, 0),
      makeCandle(20, 1),
      makeCandle(30, 2),
    ];

    assert.deepEqual(
      calculateRsiSeries(
        candles,
        0
      ),
      [
        null,
        null,
        null,
      ]
    );
  }
);

test(
  "returns null for non-integer period",
  () => {
    const candles =
      Array.from(
        { length: 20 },
        (_, index) =>
          makeCandle(
            100 + index,
            index
          )
      );

    assert.equal(
      calculateRsi(
        candles,
        14.5
      ),
      null
    );
  }
);