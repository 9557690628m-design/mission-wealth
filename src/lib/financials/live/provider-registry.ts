import type {
  LiveQuarterlyResultsProvider,
} from "./types";

const providers = new Map<
  string,
  LiveQuarterlyResultsProvider
>();

export function registerLiveQuarterlyResultsProvider(
  provider: LiveQuarterlyResultsProvider
): void {
  const symbol =
    provider.symbol
      .trim()
      .toUpperCase();

  if (!symbol) {
    throw new Error(
      "Live quarterly results provider requires a symbol"
    );
  }

  providers.set(
    symbol,
    {
      ...provider,
      symbol,
    }
  );
}

export function getLiveQuarterlyResultsProvider(
  symbol: string
):
  | LiveQuarterlyResultsProvider
  | undefined {
  const normalizedSymbol =
    symbol
      .trim()
      .toUpperCase();

  if (!normalizedSymbol) {
    return undefined;
  }

  return providers.get(
    normalizedSymbol
  );
}

export function getLiveQuarterlyResultsProviderSymbols(): string[] {
  return Array.from(
    providers.keys()
  ).sort();
}