import { NullMarketDataProvider } from "./null-provider";
import type { MarketDataProvider } from "./provider";

const provider: MarketDataProvider =
  new NullMarketDataProvider();

export function getMarketDataProvider(): MarketDataProvider {
  return provider;
}