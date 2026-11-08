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

export function calculateRsiSeries(
  candles: MarketCandle[],
  period = 14
): Array<number | null> {
  const result:
    Array<number | null> =
      new Array(
        candles.length
      ).fill(null);

  if (
    !isValidPeriod(period) ||
    candles.length <= period
  ) {
    return result;
  }

  let gainTotal = 0;
  let lossTotal = 0;

  for (
    let index = 1;
    index <= period;
    index += 1
  ) {
    const change =
      candles[index]!.close -
      candles[
        index - 1
      ]!.close;

    if (
      change > 0
    ) {
      gainTotal +=
        change;
    } else {
      lossTotal +=
        Math.abs(change);
    }
  }

  let averageGain =
    gainTotal /
    period;

  let averageLoss =
    lossTotal /
    period;

  const calculateRsiValue =
    (): number => {
      if (
        averageLoss === 0
      ) {
        return 100;
      }

      if (
        averageGain === 0
      ) {
        return 0;
      }

      const relativeStrength =
        averageGain /
        averageLoss;

      return (
        100 -
        100 /
          (
            1 +
            relativeStrength
          )
      );
    };

  result[
    period
  ] =
    calculateRsiValue();

  for (
    let index =
      period + 1;
    index <
      candles.length;
    index += 1
  ) {
    const change =
      candles[index]!.close -
      candles[
        index - 1
      ]!.close;

    const gain =
      change > 0
        ? change
        : 0;

    const loss =
      change < 0
        ? Math.abs(
            change
          )
        : 0;

    averageGain =
      (
        averageGain *
          (
            period - 1
          ) +
        gain
      ) /
      period;

    averageLoss =
      (
        averageLoss *
          (
            period - 1
          ) +
        loss
      ) /
      period;

    result[index] =
      calculateRsiValue();
  }

  return result;
}

export function calculateRsi(
  candles: MarketCandle[],
  period = 14
): number | null {
  const series =
    calculateRsiSeries(
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