import { BEL_QUARTERLY_RESULTS } from "@/data/financials/bel-quarterly";
import { isFreshMarketData } from "./freshness";
import type { MarketDataProvider } from "./provider";
import type {
  FundamentalSnapshot,
  HistoricalPrice,
  MarketQuote,
QuarterlyResult,
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

export class AlphaVantageProvider
  implements MarketDataProvider
{
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

    const dates = Object.keys(series)
      .sort()
      .reverse();

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
      volume: Number.isFinite(volume)
        ? volume
        : undefined,
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
    const apiKey = process.env.ALPHAVANTAGE_API_KEY;

    if (!apiKey) {
      return [];
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
      return [];
    }

    const payload =
      (await response.json()) as AlphaVantageDailyResponse;

    const series = payload["Time Series (Daily)"];

    if (!series) {
      return [];
    }

    const prices: HistoricalPrice[] = [];

    for (const [date, values] of Object.entries(series)) {
      if (date < from || date > to) {
        continue;
      }

      const open = Number(values["1. open"]);
      const high = Number(values["2. high"]);
      const low = Number(values["3. low"]);
      const close = Number(values["4. close"]);
      const volume = Number(values["5. volume"]);

      if (!Number.isFinite(close)) {
        continue;
      }

      const price: HistoricalPrice = {
        date,
        close,
      };

      if (Number.isFinite(open)) {
        price.open = open;
      }

      if (Number.isFinite(high)) {
        price.high = high;
      }

      if (Number.isFinite(low)) {
        price.low = low;
      }

      if (Number.isFinite(volume)) {
        price.volume = volume;
      }

      prices.push(price);
    }

    return prices.sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  }

  async getFundamentals(
    symbol: string
  ): Promise<FundamentalSnapshot | null> {
    void symbol;
    return null;
  }
async getQuarterlyResults(
  symbol: string
): Promise<QuarterlyResult[]> {
  const normalizedSymbol = symbol
    .trim()
    .toUpperCase();

  if (normalizedSymbol === "BEL") {
    return BEL_QUARTERLY_RESULTS;
  }

  return [];
}
}