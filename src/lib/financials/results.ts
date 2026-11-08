import {
  unstable_cache,
} from "next/cache";

import type {
  QuarterlyResult,
} from "@/lib/financials/types";

import {
  isValidQuarterlyResult,
} from "@/lib/financials/validation";

import type {
  LiveQuarterlyResultsResult,
} from "./live/types";

import {
  mergeQuarterlyResults,
} from "./quarterly-merge";

type QuarterlyResultsLoader =
  () => Promise<QuarterlyResult[]>;

type LiveResultsLoader =
  (
    symbol: string
  ) => Promise<
    LiveQuarterlyResultsResult
  >;

export interface QuarterlyResultsWithLiveDataOptions {
  loadLiveResults?:
    LiveResultsLoader;
}

const quarterlyResultsRegistry: Record<
  string,
  QuarterlyResultsLoader
> = {
  BEL: async () => {
    const {
      BEL_QUARTERLY_RESULTS,
    } =
      await import(
        "@/data/financials/bel-quarterly"
      );

    return BEL_QUARTERLY_RESULTS;
  },
};

const loadCachedLiveResults =
  unstable_cache(
    async (
      symbol: string
    ): Promise<
      LiveQuarterlyResultsResult
    > => {
      const {
        loadLiveQuarterlyResults,
      } =
        await import(
          "./live/live-results"
        );

      return loadLiveQuarterlyResults(
        symbol
      );
    },
    [
      "live-quarterly-results",
      "v2",
    ],
    {
      revalidate:
        60 * 60 * 6,
      tags: [
        "quarterly-results",
      ],
    }
  );

export function getQuarterlyResultSymbols(): string[] {
  return Object.keys(
    quarterlyResultsRegistry
  ).sort();
}

export async function getQuarterlyResults(
  symbol: string
): Promise<QuarterlyResult[]> {
  const normalizedSymbol =
    symbol
      .trim()
      .toUpperCase();

  const loader =
    quarterlyResultsRegistry[
      normalizedSymbol
    ];

  if (!loader) {
    return [];
  }

  const results =
    await loader();

  const validResults =
    results.filter(
      (result) =>
        result.symbol
          .trim()
          .toUpperCase() ===
          normalizedSymbol &&
        isValidQuarterlyResult(
          result
        )
    );

  const uniqueResults:
    QuarterlyResult[] = [];

  const seenPeriods =
    new Set<string>();

  for (
    const result of
    validResults
  ) {
    if (
      seenPeriods.has(
        result.periodEnd
      )
    ) {
      continue;
    }

    seenPeriods.add(
      result.periodEnd
    );

    uniqueResults.push(
      result
    );
  }

  return uniqueResults.sort(
    (a, b) =>
      b.periodEnd.localeCompare(
        a.periodEnd
      )
  );
}

export async function getQuarterlyResultsWithLiveData(
  symbol: string,
  options:
    QuarterlyResultsWithLiveDataOptions = {}
): Promise<QuarterlyResult[]> {
  const normalizedSymbol =
    symbol
      .trim()
      .toUpperCase();

  if (!normalizedSymbol) {
    return [];
  }

  const staticResults =
    await getQuarterlyResults(
      normalizedSymbol
    );

  try {
    const loadLiveResults =
      options.loadLiveResults ??
      loadCachedLiveResults;

    const liveResult =
      await loadLiveResults(
        normalizedSymbol
      );

    if (
      liveResult.results.length ===
      0
    ) {
      return staticResults;
    }

    return mergeQuarterlyResults(
      staticResults,
      liveResult.results
    );
  } catch {
    return staticResults;
  }
}
