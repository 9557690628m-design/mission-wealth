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