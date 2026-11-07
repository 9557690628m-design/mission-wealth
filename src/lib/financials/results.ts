import type {
  QuarterlyResult,
} from "@/lib/financials/types";

import {
  isValidQuarterlyResult,
} from "@/lib/financials/validation";

import {
  loadBelLiveQuarterlyResults,
  type BelLiveQuarterlyResultsResult,
} from "./bel-live-results";

import {
  mergeQuarterlyResults,
} from "./quarterly-merge";

type QuarterlyResultsLoader =
  () => Promise<QuarterlyResult[]>;

type BelLiveResultsLoader =
  () => Promise<
    BelLiveQuarterlyResultsResult
  >;

export interface QuarterlyResultsWithLiveDataOptions {
  loadBelLiveResults?:
    BelLiveResultsLoader;
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

  const staticResults =
    await getQuarterlyResults(
      normalizedSymbol
    );

  if (
    normalizedSymbol !==
    "BEL"
  ) {
    return staticResults;
  }

  const loadBelLiveResults =
    options.loadBelLiveResults ??
    loadBelLiveQuarterlyResults;

  try {
    const liveResult =
      await loadBelLiveResults();

    return mergeQuarterlyResults(
      staticResults,
      liveResult.results
    );
  } catch {
    return staticResults;
  }
}