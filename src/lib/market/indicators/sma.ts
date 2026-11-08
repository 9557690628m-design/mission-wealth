import type {
  MarketCandle,
} from "../candles/types";

export function calculateSimpleMovingAverageSeries(
  candles: MarketCandle[],
  period: number
): Array<number | null> {
  if (
    !Number.isInteger(period) ||
    period <= 0
  ) {
    return candles.map(
      () => null
    );
  }

  const result:
    Array<number | null> =
      new Array(
        candles.length
      ).fill(null);

  if (
    candles.length <
    period
  ) {
    return result;
  }

  let rollingSum = 0;

  for (
    let index = 0;
    index < candles.length;
    index += 1
  ) {
    rollingSum +=
      candles[index]!.close;

    if (
      index >= period
    ) {
      rollingSum -=
        candles[
          index - period
        ]!.close;
    }

    if (
      index >=
      period - 1
    ) {
      result[index] =
        rollingSum /
        period;
    }
  }

  return result;
}

export function calculateSimpleMovingAverage(
  candles: MarketCandle[],
  period: number
): number | null {
  if (
    !Number.isInteger(period) ||
    period <= 0 ||
    candles.length < period
  ) {
    return null;
  }

  let total = 0;

  for (
    let index =
      candles.length - period;
    index <
      candles.length;
    index += 1
  ) {
    total +=
      candles[index]!.close;
  }

  return total / period;
}