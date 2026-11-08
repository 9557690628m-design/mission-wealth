import type {
  HistoricalPrice,
} from "../types";

import type {
  MarketCandle,
  MarketInterval,
} from "./types";

import {
  isValidMarketCandle,
} from "./validation";

export interface NormalizeHistoricalPricesOptions {
  symbol: string;

  exchange: "NSE" | "BSE";

  interval: MarketInterval;

  source: string;

  adjusted?: boolean;
}

function normalizeDailyTimestamp(
  date: string
): string | null {
  const timestamp =
    Date.parse(
      `${date}T00:00:00.000Z`
    );

  if (
    Number.isNaN(
      timestamp
    )
  ) {
    return null;
  }

  return new Date(
    timestamp
  ).toISOString();
}

function normalizeVolume(
  value: number | undefined
): number | null {
  if (
    value === undefined
  ) {
    return null;
  }

  if (
    !Number.isFinite(
      value
    ) ||
    value < 0
  ) {
    return null;
  }

  return value;
}

export function normalizeHistoricalPrice(
  price: HistoricalPrice,
  options:
    NormalizeHistoricalPricesOptions
): MarketCandle | null {
  const timestamp =
    normalizeDailyTimestamp(
      price.date
    );

  if (!timestamp) {
    return null;
  }

  if (
    price.open === undefined ||
    price.high === undefined ||
    price.low === undefined
  ) {
    return null;
  }

  const candle: MarketCandle = {
    symbol:
      options.symbol
        .trim()
        .toUpperCase(),

    exchange:
      options.exchange,

    interval:
      options.interval,

    timestamp,

    open:
      price.open,

    high:
      price.high,

    low:
      price.low,

    close:
      price.close,

    volume:
      normalizeVolume(
        price.volume
      ),

    source:
      options.source
        .trim(),

    adjusted:
      options.adjusted ??
      false,
  };

  if (
    !isValidMarketCandle(
      candle
    )
  ) {
    return null;
  }

  return candle;
}

export function normalizeHistoricalPrices(
  prices: HistoricalPrice[],
  options:
    NormalizeHistoricalPricesOptions
): MarketCandle[] {
  const candles:
    MarketCandle[] = [];

  const seenTimestamps =
    new Set<string>();

  for (
    const price of prices
  ) {
    const candle =
      normalizeHistoricalPrice(
        price,
        options
      );

    if (!candle) {
      continue;
    }

    if (
      seenTimestamps.has(
        candle.timestamp
      )
    ) {
      continue;
    }

    seenTimestamps.add(
      candle.timestamp
    );

    candles.push(
      candle
    );
  }

  return candles.sort(
    (a, b) =>
      a.timestamp.localeCompare(
        b.timestamp
      )
  );
}