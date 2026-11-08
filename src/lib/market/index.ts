import { AlphaVantageProvider } from "./alphavantage-provider";
import { MarketstackProvider } from "./marketstack-provider";
import { NullMarketDataProvider } from "./null-provider";

import type {
  MarketDataProvider,
} from "./provider";

import type {
  Exchange,
  FundamentalSnapshot,
  HistoricalPrice,
  MarketQuoteResult,
} from "./types";

import {
  loadMarketCandles,
} from "./candles/service";

import type {
  MarketCandle,
  MarketInterval,
} from "./candles/types";

const provider: MarketDataProvider =
  process.env.ALPHAVANTAGE_API_KEY
    ? new AlphaVantageProvider()
    : process.env.MARKETSTACK_API_KEY
      ? new MarketstackProvider()
      : new NullMarketDataProvider();

export async function getMarketQuote(
  symbol: string
): Promise<MarketQuoteResult> {
  return provider.getQuote(symbol);
}

export async function getMarketHistory(
  symbol: string,
  from: string,
  to: string
): Promise<HistoricalPrice[]> {
  return provider.getHistoricalPrices(
    symbol,
    from,
    to
  );
}

export async function getMarketFundamentals(
  symbol: string
): Promise<FundamentalSnapshot | null> {
  return provider.getFundamentals(symbol);
}

export interface GetMarketCandlesOptions {
  symbol: string;

  exchange: Exchange;

  interval?: MarketInterval;

  from: string;

  to: string;

  limit?: number;
}

interface ActiveMarketProviderMetadata {
  source: string;
  exchange: Exchange | null;
}

function getActiveProviderMetadata():
  ActiveMarketProviderMetadata {
  if (
    provider instanceof
    AlphaVantageProvider
  ) {
    return {
      source:
        "Alpha Vantage",
      exchange:
        "BSE",
    };
  }

  if (
    provider instanceof
    MarketstackProvider
  ) {
    return {
      source:
        "Marketstack",
      exchange:
        "BSE",
    };
  }

  return {
    source:
      "Unavailable",
    exchange:
      null,
  };
}

export async function getMarketCandles(
  options:
    GetMarketCandlesOptions
): Promise<MarketCandle[]> {
  const interval =
    options.interval ??
    "1d";

  if (
    interval !== "1d"
  ) {
    return [];
  }

  const metadata =
    getActiveProviderMetadata();

  if (
    metadata.exchange ===
    null
  ) {
    return [];
  }

  if (
    options.exchange !==
    metadata.exchange
  ) {
    return [];
  }

  return loadMarketCandles({
    symbol:
      options.symbol,

    exchange:
      metadata.exchange,

    interval,

    from:
      options.from,

    to:
      options.to,

    source:
      metadata.source,

    adjusted:
      false,

    limit:
      options.limit,

    loadHistoricalPrices:
      (
        symbol,
        from,
        to
      ) =>
        provider.getHistoricalPrices(
          symbol,
          from,
          to
        ),
  });
}
