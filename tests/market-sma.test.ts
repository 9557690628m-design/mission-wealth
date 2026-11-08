import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateSimpleMovingAverage,
  calculateSimpleMovingAverageSeries,
} from "../src/lib/market/indicators/sma";

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
  "calculates latest simple moving average",
  () => {
    const result =
      calculateSimpleMovingAverage(
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
  "returns null when there are not enough candles",
  () => {
    assert.equal(
      calculateSimpleMovingAverage(
        candles,
        10
      ),
      null
    );
  }
);

test(
  "returns null for zero period",
  () => {
    assert.equal(
      calculateSimpleMovingAverage(
        candles,
        0
      ),
      null
    );
  }
);

test(
  "returns null for non-integer period",
  () => {
    assert.equal(
      calculateSimpleMovingAverage(
        candles,
        2.5
      ),
      null
    );
  }
);

test(
  "calculates rolling SMA series",
  () => {
    const result =
      calculateSimpleMovingAverageSeries(
        candles,
        3
      );

    assert.deepEqual(
      result,
      [
        null,
        null,
        20,
        30,
        40,
      ]
    );
  }
);

test(
  "returns all nulls when period exceeds candle count",
  () => {
    const result =
      calculateSimpleMovingAverageSeries(
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
  "returns all nulls for invalid period",
  () => {
    const result =
      calculateSimpleMovingAverageSeries(
        candles,
        -1
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