import type {
  FundamentalSnapshot,
  HistoricalPrice,
  MarketQuoteResult,
} from "./types";

export interface MarketDataProvider {
  getQuote(
    symbol: string
  ): Promise<MarketQuoteResult>;

  getHistoricalPrices(
    symbol: string,
    from: string,
    to: string
  ): Promise<HistoricalPrice[]>;

  getFundamentals(
    symbol: string
  ): Promise<FundamentalSnapshot | null>;
}