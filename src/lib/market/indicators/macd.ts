import type {
  MarketCandle,
} from "../candles/types";

import {
  calculateExponentialMovingAverageSeries,
} from "./ema";

export interface MacdPoint {
  macd: number | null;
  signal: number | null;
  histogram: number | null;
}

function calculateEmaFromValues(
  values: Array<number | null>,
  period: number
): Array<number | null> {
  const result: Array<number | null> =
    new Array(values.length).fill(null);

  if (
    !Number.isInteger(period) ||
    period <= 0
  ) {
    return result;
  }

  const validIndexes: number[] = [];

  for (
    let index = 0;
    index < values.length;
    index += 1
  ) {
    if (
      values[index] !== null
    ) {
      validIndexes.push(index);
    }
  }

  if (
    validIndexes.length < period
  ) {
    return result;
  }

  let initialTotal = 0;

  for (
    let index = 0;
    index < period;
    index += 1
  ) {
    initialTotal +=
      values[validIndexes[index]!]!;
  }

  let ema =
    initialTotal / period;

  const firstOutputIndex =
    validIndexes[period - 1]!;

  result[firstOutputIndex] = ema;

  const multiplier =
    2 / (period + 1);

  for (
    let validIndex = period;
    validIndex < validIndexes.length;
    validIndex += 1
  ) {
    const sourceIndex =
      validIndexes[validIndex]!;

    const value =
      values[sourceIndex]!;

    ema =
      (value - ema) *
        multiplier +
      ema;

    result[sourceIndex] = ema;
  }

  return result;
}

export function calculateMacdSeries(
  candles: MarketCandle[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
): MacdPoint[] {
  const empty =
    candles.map(
      (): MacdPoint => ({
        macd: null,
        signal: null,
        histogram: null,
      })
    );

  if (
    !Number.isInteger(fastPeriod) ||
    !Number.isInteger(slowPeriod) ||
    !Number.isInteger(signalPeriod) ||
    fastPeriod <= 0 ||
    slowPeriod <= 0 ||
    signalPeriod <= 0 ||
    fastPeriod >= slowPeriod
  ) {
    return empty;
  }

  const fastEma =
    calculateExponentialMovingAverageSeries(
      candles,
      fastPeriod
    );

  const slowEma =
    calculateExponentialMovingAverageSeries(
      candles,
      slowPeriod
    );

  const macdValues: Array<number | null> =
    candles.map(
      (_, index) => {
        const fast =
          fastEma[index];

        const slow =
          slowEma[index];

        if (
          fast === null ||
          slow === null
        ) {
          return null;
        }

        return fast - slow;
      }
    );

  const signalValues =
    calculateEmaFromValues(
      macdValues,
      signalPeriod
    );

  return candles.map(
    (_, index): MacdPoint => {
      const macd =
        macdValues[index];

      const signal =
        signalValues[index];

      if (
        macd === null
      ) {
        return {
          macd: null,
          signal: null,
          histogram: null,
        };
      }

      if (
        signal === null
      ) {
        return {
          macd,
          signal: null,
          histogram: null,
        };
      }

      return {
        macd,
        signal,
        histogram:
          macd - signal,
      };
    }
  );
}

export function calculateMacd(
  candles: MarketCandle[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
): MacdPoint | null {
  const series =
    calculateMacdSeries(
      candles,
      fastPeriod,
      slowPeriod,
      signalPeriod
    );

  for (
    let index =
      series.length - 1;
    index >= 0;
    index -= 1
  ) {
    const point =
      series[index];

    if (
      point &&
      point.macd !== null
    ) {
      return point;
    }
  }

  return null;
}
