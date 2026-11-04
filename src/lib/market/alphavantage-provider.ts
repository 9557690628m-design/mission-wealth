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

const DAILY_SERIES_REVALIDATE_SECONDS = 60 * 60;

export class AlphaVantageProvider
  implements MarketDataProvider
{
  private async getDailySeries(
    symbol: string
  ): Promise<AlphaVantageDailySeries | null> {
    const apiKey =
      process.env.ALPHAVANTAGE_API_KEY;

    if (!apiKey) {
      return null;
    }

    const alphaSymbol =
      `${symbol.toUpperCase()}.BSE`;

    const url =
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY` +
      `&symbol=${encodeURIComponent(alphaSymbol)}` +
      `&outputsize=compact` +
      `&apikey=${encodeURIComponent(apiKey)}`;

    try {
      const response = await fetch(url, {
        next: {
          revalidate:
            DAILY_SERIES_REVALIDATE_SECONDS,
        },
      });

      if (!response.ok) {
        return null;
      }

      const payload =
        (await response.json()) as AlphaVantageDailyResponse;

      return (
        payload["Time Series (Daily)"] ??
        null
      );
    } catch {
      return null;
    }
  }

  async getQuote(
    symbol: string
  ): Promise<MarketQuote | null> {
    const series =
      await this.getDailySeries(symbol);

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

    if (
      !isFreshMarketData(
        latestDate,
        7
      )
    ) {
      return null;
    }

    const latest =
      series[latestDate];

    const close =
      Number(latest["4. close"]);

    const volume =
      Number(latest["5. volume"]);

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
    const series =
      await this.getDailySeries(symbol);

    if (!series) {
      return [];
    }

    const prices: HistoricalPrice[] = [];

    for (
      const [date, values]
      of Object.entries(series)
    ) {
      if (
        date < from ||
        date > to
      ) {
        continue;
      }

      const open =
        Number(values["1. open"]);
      const high =
        Number(values["2. high"]);
      const low =
        Number(values["3. low"]);
      const close =
        Number(values["4. close"]);
      const volume =
        Number(values["5. volume"]);

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

    return prices.sort(
      (a, b) =>
        a.date.localeCompare(b.date)
    );
  }

  async getFundamentals(
    symbol: string
  ): Promise<FundamentalSnapshot | null> {
    void symbol;

    return null;
  }
}