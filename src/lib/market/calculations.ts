import type { HistoricalPrice } from "./types";

export function calculateMovingAverage(
  prices: HistoricalPrice[],
  period: number
): number | null {
  if (prices.length < period || period <= 0) {
    return null;
  }

  const recentPrices = prices.slice(-period);

  const total = recentPrices.reduce(
    (sum, item) => sum + item.close,
    0
  );

  return total / period;
}

export function calculateDMA50(
  prices: HistoricalPrice[]
): number | null {
  return calculateMovingAverage(prices, 50);
}

export function calculateDMA200(
  prices: HistoricalPrice[]
): number | null {
  return calculateMovingAverage(prices, 200);
}
export function calculateMovingAverageSeries(
  prices: HistoricalPrice[],
  period: number
): Array<number | null> {
  if (period <= 0) {
    return prices.map(() => null);
  }

  return prices.map((_, index) => {
    if (index + 1 < period) {
      return null;
    }

    const window = prices.slice(
      index + 1 - period,
      index + 1
    );

    const total = window.reduce(
      (sum, item) => sum + item.close,
      0
    );

    return total / period;
  });
}