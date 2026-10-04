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

export class MarketstackProvider implements MarketDataProvider {
  async getQuote(
    symbol: string
  ): Promise<MarketQuote | null> {
    const apiKey = process.env.MARKETSTACK_API_KEY;

    if (!apiKey) {
      return null;
    }

    const marketstackSymbol = `${symbol.toUpperCase()}.BO`;

    const url =
      `https://api.marketstack.com/v2/eod?access_key=${encodeURIComponent(
        apiKey
      )}&symbols=${encodeURIComponent(marketstackSymbol)}&limit=1`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload =
      (await response.json()) as MarketstackEodResponse;

    const record = payload.data?.[0];

    if (
      !record ||
      !record.date ||
      typeof record.close !== "number"
    ) {
      return null;
    }

    if (!isFreshMarketData(record.date, 7)) {
      return null;
    }

    return {
      symbol: symbol.toUpperCase(),
      exchange: "BSE",
      price: record.close,
      volume: record.volume,
      timestamp: record.date,
      source: "Marketstack",
      isDelayed: true,
    };
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