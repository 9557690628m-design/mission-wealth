import { isFreshMarketData } from "./freshness";
import type { MarketDataProvider } from "./provider";
import type {
  FundamentalSnapshot,
  HistoricalPrice,
  MarketQuoteResult,
} from "./types";

type MarketstackEodRecord = {
  symbol?: string;
  exchange?: string;
  date?: string;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
};

type MarketstackEodResponse = {
  data?: MarketstackEodRecord[];
};

const MARKETSTACK_QUOTE_REVALIDATE_SECONDS = 60 * 60;

export class MarketstackProvider
  implements MarketDataProvider
{
  async getQuote(
    symbol: string
  ): Promise<MarketQuoteResult> {
    const apiKey =
      process.env.MARKETSTACK_API_KEY;

    if (!apiKey) {
      return {
        status: "unavailable",
        quote: null,
        reason: "missing_configuration",
      };
    }

    const marketstackSymbol =
      `${symbol.toUpperCase()}.BO`;

    const url =
      `https://api.marketstack.com/v2/eod?access_key=${encodeURIComponent(
        apiKey
      )}` +
      `&symbols=${encodeURIComponent(
        marketstackSymbol
      )}` +
      `&limit=1`;

    try {
      const response = await fetch(url, {
        next: {
          revalidate:
            MARKETSTACK_QUOTE_REVALIDATE_SECONDS,
        },
      });

      if (!response.ok) {
        return {
          status: "unavailable",
          quote: null,
          reason: "provider_error",
        };
      }

      const payload =
        (await response.json()) as MarketstackEodResponse;

      const record =
        payload.data?.[0];

      if (
        !record ||
        !record.date
      ) {
        return {
          status: "unavailable",
          quote: null,
          reason: "no_data",
        };
      }

      if (
        typeof record.close !== "number" ||
        !Number.isFinite(record.close)
      ) {
        return {
          status: "unavailable",
          quote: null,
          reason: "invalid_response",
          lastKnownTimestamp: record.date,
        };
      }

      if (
        !isFreshMarketData(
          record.date,
          7
        )
      ) {
        return {
          status: "stale",
          quote: null,
          reason: "stale_data",
          lastKnownTimestamp: record.date,
        };
      }

      return {
        status: "available",
        quote: {
          symbol: symbol.toUpperCase(),
          exchange: "BSE",
          price: record.close,
          volume:
            typeof record.volume === "number" &&
            Number.isFinite(record.volume)
              ? record.volume
              : undefined,
          timestamp: record.date,
          source: "Marketstack",
          isDelayed: true,
        },
      };
    } catch {
      return {
        status: "unavailable",
        quote: null,
        reason: "provider_error",
      };
    }
  }

  async getHistoricalPrices(
    symbol: string,
    from: string,
    to: string
  ): Promise<HistoricalPrice[]> {
    void symbol;
    void from;
    void to;

    return [];
  }

  async getFundamentals(
    symbol: string
  ): Promise<FundamentalSnapshot | null> {
    void symbol;

    return null;
  }
}