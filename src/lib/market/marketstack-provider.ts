import { isFreshMarketData } from "./freshness";
import type { MarketDataProvider } from "./provider";
import type {
  FundamentalSnapshot,
  HistoricalPrice,
  MarketQuote,
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
  ): Promise<MarketQuote | null> {
    const apiKey =
      process.env.MARKETSTACK_API_KEY;

    if (!apiKey) {
      return null;
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
        return null;
      }

      const payload =
        (await response.json()) as MarketstackEodResponse;

      const record =
        payload.data?.[0];

      if (
        !record ||
        !record.date ||
        typeof record.close !== "number" ||
        !Number.isFinite(record.close)
      ) {
        return null;
      }

      if (
        !isFreshMarketData(
          record.date,
          7
        )
      ) {
        return null;
      }

      return {
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
      };
    } catch {
      return null;
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