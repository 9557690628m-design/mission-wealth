import {
  getLiveQuarterlyResultsProvider,
} from "./provider-registry";

import {
  registerLiveQuarterlyResultsProviders,
} from "./providers";

import {
  loadNseLiveQuarterlyResults,
} from "./nse-live-results";

import type {
  LiveQuarterlyResultsLoadOptions,
  LiveQuarterlyResultsResult,
} from "./types";

registerLiveQuarterlyResultsProviders();

const EMPTY_RESULT:
  LiveQuarterlyResultsResult = {
    results: [],
    discoveredCount: 0,
    parsedCount: 0,
  };

export interface LiveResultsDependencies {
  loadUniversalResults?: (
    symbol: string,
    options?:
      LiveQuarterlyResultsLoadOptions
  ) => Promise<
    LiveQuarterlyResultsResult
  >;
}

export async function loadLiveQuarterlyResults(
  symbol: string,
  options:
    LiveQuarterlyResultsLoadOptions = {},
  dependencies:
    LiveResultsDependencies = {}
): Promise<
  LiveQuarterlyResultsResult
> {
  const normalizedSymbol =
    symbol
      .trim()
      .toUpperCase();

  if (!normalizedSymbol) {
    return EMPTY_RESULT;
  }

  const specificProvider =
    getLiveQuarterlyResultsProvider(
      normalizedSymbol
    );

  if (specificProvider) {
    try {
      const specificResult =
        await specificProvider.load(
          options
        );

      if (
        specificResult.results.length >
          0
      ) {
        return specificResult;
      }
    } catch {
      /*
       * A company-specific provider
       * must never prevent the
       * universal exchange fallback.
       */
    }
  }

  const loadUniversalResults =
    dependencies
      .loadUniversalResults ??
    loadNseLiveQuarterlyResults;

  try {
    return await loadUniversalResults(
      normalizedSymbol,
      options
    );
  } catch {
    return EMPTY_RESULT;
  }
}