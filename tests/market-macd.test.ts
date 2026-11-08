import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateMacd,
  calculateMacdSeries,
} from "../src/lib/market/indicators/macd";

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
  "returns null MACD values when there are not enough candles",
  () => {
    const candles =
      Array.from(
        { length: 10 },
        (_, index) =>
          makeCandle(
            100 + index,
            index
          )
      );

    const series =
      calculateMacdSeries(
        candles
      );

    assert.equal(
      series.length,
      candles.length
    );

    assert.ok(
      series.every(
        (point) =>
          point.macd === null &&
          point.signal === null &&
          point.histogram === null
      )
    );

    assert.equal(
      calculateMacd(
        candles
      ),
      null
    );
  }
);

test(
  "calculates MACD line once slow EMA is available",
  () => {
    const candles =
      Array.from(
        { length: 30 },
        (_, index) =>
          makeCandle(
            100 + index,
            index
          )
      );

    const series =
      calculateMacdSeries(
        candles
      );

    assert.equal(
      series[24]?.macd,
      null
    );

    assert.ok(
      series[25]?.macd !== null
    );
  }
);

test(
  "signal line appears after enough MACD values exist",
  () => {
    const candles =
      Array.from(
        { length: 40 },
        (_, index) =>
          makeCandle(
            100 + index,
            index
          )
      );

    const series =
      calculateMacdSeries(
        candles
      );

    assert.equal(
      series[32]?.signal,
      null
    );

    assert.ok(
      series[33]?.signal !== null
    );
  }
);

test(
  "histogram equals MACD minus signal",
  () => {
    const candles =
      Array.from(
        { length: 40 },
        (_, index) =>
          makeCandle(
            100 + index,
            index
          )
      );

    const latest =
      calculateMacd(
        candles
      );

    assert.ok(latest);
    assert.ok(
      latest.macd !== null
    );
    assert.ok(
      latest.signal !== null
    );
    assert.ok(
      latest.histogram !== null
    );

    assert.ok(
      Math.abs(
        latest.histogram -
          (
            latest.macd -
            latest.signal
          )
      ) <
        1e-12
    );
  }
);

test(
  "supports custom MACD periods",
  () => {
    const candles =
      Array.from(
        { length: 15 },
        (_, index) =>
          makeCandle(
            50 + index,
            index
          )
      );

    const latest =
      calculateMacd(
        candles,
        3,
        6,
        3
      );

    assert.ok(latest);
    assert.ok(
      latest.macd !== null
    );
    assert.ok(
      latest.signal !== null
    );
    assert.ok(
      latest.histogram !== null
    );
  }
);

test(
  "returns empty values when fast period is not below slow period",
  () => {
    const candles =
      Array.from(
        { length: 40 },
        (_, index) =>
          makeCandle(
            100 + index,
            index
          )
      );

    const series =
      calculateMacdSeries(
        candles,
        26,
        12,
        9
      );

    assert.ok(
      series.every(
        (point) =>
          point.macd === null &&
          point.signal === null &&
          point.histogram === null
      )
    );
  }
);

test(
  "returns empty values for invalid periods",
  () => {
    const candles =
      Array.from(
        { length: 40 },
        (_, index) =>
          makeCandle(
            100 + index,
            index
          )
      );

    const series =
      calculateMacdSeries(
        candles,
        0,
        26,
        9
      );

    assert.ok(
      series.every(
        (point) =>
          point.macd === null &&
          point.signal === null &&
          point.histogram === null
      )
    );
  }
);