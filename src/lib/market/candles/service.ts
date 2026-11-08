import type {
  Exchange,
  HistoricalPrice,
} from "../types";

import {
  normalizeHistoricalPrices,
} from "./normalization";

import type {
  MarketCandle,
  MarketInterval,
} from "./types";

export type HistoricalPriceLoader =
  (
    symbol: string,
    from: string,
    to: string
  ) => Promise<
    HistoricalPrice[]
  >;

export interface LoadMarketCandlesOptions {
  symbol: string;

  exchange: Exchange;

  interval: MarketInterval;

  from: string;

  to: string;

  source: string;

  adjusted?: boolean;

  limit?: number;

  loadHistoricalPrices:
    HistoricalPriceLoader;
}

function isValidDateInput(
  value: string
): boolean {
  const timestamp =
    Date.parse(value);

  return !Number.isNaN(
    timestamp
  );
}

function applyLimit(
  candles: MarketCandle[],
  limit: number | undefined
): MarketCandle[] {
  if (
    limit === undefined
  ) {
    return candles;
  }

  if (
    !Number.isInteger(
      limit
    ) ||
    limit <= 0
  ) {
    return [];
  }

  if (
    candles.length <=
    limit
  ) {
    return candles;
  }

  return candles.slice(
    candles.length - limit
  );
}

export async function loadMarketCandles(
  options:
    LoadMarketCandlesOptions
): Promise<MarketCandle[]> {
  const symbol =
    options.symbol
      .trim()
      .toUpperCase();

  const source =
    options.source
      .trim();

  if (
    !symbol ||
    !source
  ) {
    return [];
  }

  if (
    !isValidDateInput(
      options.from
    ) ||
    !isValidDateInput(
      options.to
    )
  ) {
    return [];
  }

  if (
    Date.parse(
      options.from
    ) >
    Date.parse(
      options.to
    )
  ) {
    return [];
  }

  let prices:
    HistoricalPrice[];

  try {
    prices =
      await options.loadHistoricalPrices(
        symbol,
        options.from,
        options.to
      );
  } catch {
    return [];
  }

  const candles =
    normalizeHistoricalPrices(
      prices,
      {
        symbol,
        exchange:
          options.exchange,
        interval:
          options.interval,
        source,
        adjusted:
          options.adjusted ??
          false,
      }
    );

  return applyLimit(
    candles,
    options.limit
  );
}