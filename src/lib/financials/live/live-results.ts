import {
  getLiveQuarterlyResultsProvider,
} from "./provider-registry";

import {
  registerLiveQuarterlyResultsProviders,
} from "./providers";

import type {
  LiveQuarterlyResultsLoadOptions,
  LiveQuarterlyResultsResult,
} from "./types";

registerLiveQuarterlyResultsProviders();

export async function loadLiveQuarterlyResults(
  symbol: string,
  options:
    LiveQuarterlyResultsLoadOptions = {}
): Promise<
  LiveQuarterlyResultsResult
> {
  const provider =
    getLiveQuarterlyResultsProvider(
      symbol
    );

  if (!provider) {
    return {
      results: [],
      discoveredCount: 0,
      parsedCount: 0,
    };
  }

  return provider.load(
    options
  );
}