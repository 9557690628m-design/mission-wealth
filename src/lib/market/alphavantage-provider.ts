import { isFreshMarketData } from "./freshness";
import type { MarketDataProvider } from "./provider";
import type {
  FundamentalSnapshot,
  HistoricalPrice,
  MarketQuote,
} from "./types";

type AlphaVantageDailySeries = Record<
  string,
  {
    "1. open"?: string;
    "2. high"?: string;
    "3. low"?: string;
    "4. close"?: string;
    "5. volume"?: string;
  }
>;

type AlphaVantageDailyResponse = {
  "Time Series (Daily)"?: AlphaVantageDailySeries;
};

export class AlphaVantageProvider implements MarketDataProvider {
  async getQuote(
    symbol: string
  ): Promise<MarketQuote | null> {
    const apiKey = process.env.ALPHAVANTAGE_API_KEY;

    if (!apiKey) {
      return null;
    }

    const alphaSymbol = `${symbol.toUpperCase()}.BSE`;

    const url =
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY` +
      `&symbol=${encodeURIComponent(alphaSymbol)}` +
      `&outputsize=compact` +
      `&apikey=${encodeURIComponent(apiKey)}`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload =
      (await response.json()) as AlphaVantageDailyResponse;

    const series = payload["Time Series (Daily)"];

    if (!series) {
      return null;
    }

    const dates = Object.keys(series).sort().reverse();
    const latestDate = dates[0];

    if (!latestDate) {
      return null;
    }

    if (!isFreshMarketData(latestDate, 7)) {
      return null;
    }

    const latest = series[latestDate];
    const close = Number(latest["4. close"]);
    const volume = Number(latest["5. volume"]);

    if (!Number.isFinite(close)) {
      return null;
    }

    return {
      symbol: symbol.toUpperCase(),
      exchange: "BSE",
      price: close,
      volume: Number.isFinite(volume) ? volume : undefined,
      timestamp: latestDate,
      source: "Alpha Vantage",
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