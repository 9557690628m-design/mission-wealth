import type {
  MarketCandle,
} from "../candles/types";

function isValidPeriod(
  period: number
): boolean {
  return (
    Number.isInteger(period) &&
    period > 0
  );
}

export function calculateExponentialMovingAverageSeries(
  candles: MarketCandle[],
  period: number
): Array<number | null> {
  const result:
    Array<number | null> =
      new Array(
        candles.length
      ).fill(null);

  if (
    !isValidPeriod(period) ||
    candles.length < period
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
      candles[index]!.close;
  }

  let ema =
    initialTotal /
    period;

  result[
    period - 1
  ] = ema;

  const multiplier =
    2 /
    (period + 1);

  for (
    let index = period;
    index < candles.length;
    index += 1
  ) {
    ema =
      (
        candles[index]!.close -
        ema
      ) *
        multiplier +
      ema;

    result[index] =
      ema;
  }

  return result;
}

export function calculateExponentialMovingAverage(
  candles: MarketCandle[],
  period: number
): number | null {
  const series =
    calculateExponentialMovingAverageSeries(
      candles,
      period
    );

  for (
    let index =
      series.length - 1;
    index >= 0;
    index -= 1
  ) {
    const value =
      series[index];

    if (
      value !== null
    ) {
      return value;
    }
  }

  return null;
}
