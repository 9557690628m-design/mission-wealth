import { AlphaVantageProvider } from "./alphavantage-provider";
import { MarketstackProvider } from "./marketstack-provider";
import { NullMarketDataProvider } from "./null-provider";
import type { MarketDataProvider } from "./provider";
import type {
  FundamentalSnapshot,
  HistoricalPrice,
  MarketQuoteResult,
} from "./types";

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