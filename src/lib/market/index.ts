import { AlphaVantageProvider } from "./alphavantage-provider";
import { MarketstackProvider } from "./marketstack-provider";
import { NullMarketDataProvider } from "./null-provider";
import type { MarketDataProvider } from "./provider";

const provider: MarketDataProvider =
  process.env.ALPHAVANTAGE_API_KEY
    ? new AlphaVantageProvider()
    : process.env.MARKETSTACK_API_KEY
      ? new MarketstackProvider()
      : new NullMarketDataProvider();

export function getMarketDataProvider(): MarketDataProvider {
  return provider;
}