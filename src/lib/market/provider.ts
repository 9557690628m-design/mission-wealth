import type {
  FundamentalSnapshot,
  HistoricalPrice,
  MarketQuote,
  QuarterlyResult,
} from "./types";

export interface MarketDataProvider {
  getQuote(
    symbol: string
  ): Promise<MarketQuote | null>;

  getHistoricalPrices(
    symbol: string,
    from: string,
    to: string
  ): Promise<HistoricalPrice[]>;

  getFundamentals(
    symbol: string
  ): Promise<FundamentalSnapshot | null>;

  getQuarterlyResults(
    symbol: string
  ): Promise<QuarterlyResult[]>;
}