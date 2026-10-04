import type { MarketDataProvider } from "./provider";
import type {
  FundamentalSnapshot,
  HistoricalPrice,
  MarketQuote,
} from "./types";

export class MarketstackProvider implements MarketDataProvider {
  async getQuote(
    symbol: string
  ): Promise<MarketQuote | null> {
    void symbol;
    return null;
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