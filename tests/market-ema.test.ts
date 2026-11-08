import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateExponentialMovingAverage,
  calculateExponentialMovingAverageSeries,
} from "../src/lib/market/indicators/ema";

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

const candles = [
  makeCandle(10, 0),
  makeCandle(20, 1),
  makeCandle(30, 2),
  makeCandle(40, 3),
  makeCandle(50, 4),
];

test(
  "calculates EMA series using SMA seed",
  () => {
    const result =
      calculateExponentialMovingAverageSeries(
        candles,
        3
      );

    assert.equal(
      result[0],
      null
    );

    assert.equal(
      result[1],
      null
    );

    assert.equal(
      result[2],
      20
    );

    assert.equal(
      result[3],
      30
    );

    assert.equal(
      result[4],
      40
    );
  }
);

test(
  "calculates latest exponential moving average",
  () => {
    const result =
      calculateExponentialMovingAverage(
        candles,
        3
      );

    assert.equal(
      result,
      40
    );
  }
);

test(
  "returns all nulls when there are not enough candles",
  () => {
    const result =
      calculateExponentialMovingAverageSeries(
        candles,
        10
      );

    assert.deepEqual(
      result,
      [
        null,
        null,
        null,
        null,
        null,
      ]
    );
  }
);

test(
  "returns null latest EMA when there are not enough candles",
  () => {
    assert.equal(
      calculateExponentialMovingAverage(
        candles,
        10
      ),
      null
    );
  }
);

test(
  "returns all nulls for zero period",
  () => {
    const result =
      calculateExponentialMovingAverageSeries(
        candles,
        0
      );

    assert.deepEqual(
      result,
      [
        null,
        null,
        null,
        null,
        null,
      ]
    );
  }
);

test(
  "returns null latest EMA for non-integer period",
  () => {
    assert.equal(
      calculateExponentialMovingAverage(
        candles,
        2.5
      ),
      null
    );
  }
);

test(
  "supports a one-period EMA",
  () => {
    const result =
      calculateExponentialMovingAverageSeries(
        candles,
        1
      );

    assert.deepEqual(
      result,
      [
        10,
        20,
        30,
        40,
        50,
      ]
    );
  }
);