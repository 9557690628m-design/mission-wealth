import {
  buildBelQuarterlyResultFromIngestion,
} from "./filing-adapter";

import {
  ingestBelFinancialFiling,
  type FilingIngestionResult,
} from "./filing-ingestion";

import {
  parseBelFilingPeriodMetadata,
} from "./filing-metadata";

import {
  discoverBelFinancialFilings,
  type FinancialFiling,
} from "./filings";

import type {
  QuarterlyResult,
} from "./types";

export interface BelLiveQuarterlyResultsResult {
  results: QuarterlyResult[];
  discoveredCount: number;
  parsedCount: number;
}

type BelFilingDiscovery =
  () => Promise<
    FinancialFiling[]
  >;

type BelFilingIngestion =
  (
    filing: FinancialFiling
  ) => Promise<
    FilingIngestionResult
  >;

export interface BelLiveQuarterlyResultsOptions {
  discoverFilings?:
    BelFilingDiscovery;

  ingestFiling?:
    BelFilingIngestion;
}

function sortBelFilingsNewestFirst(
  filings: FinancialFiling[]
): FinancialFiling[] {
  return filings
    .map((filing) => ({
      filing,
      metadata:
        parseBelFilingPeriodMetadata(
          filing.title
        ),
    }))
    .filter(
      (
        item
      ): item is {
        filing: FinancialFiling;
        metadata: NonNullable<
          ReturnType<
            typeof parseBelFilingPeriodMetadata
          >
        >;
      } =>
        item.metadata !==
        null
    )
    .sort(
      (a, b) =>
        b.metadata.periodEnd.localeCompare(
          a.metadata.periodEnd
        )
    )
    .map(
      (item) =>
        item.filing
    );
}

export async function loadBelLiveQuarterlyResults(
  limit = 8,
  options:
    BelLiveQuarterlyResultsOptions = {}
): Promise<BelLiveQuarterlyResultsResult> {
  const discoverFilings =
    options.discoverFilings ??
    discoverBelFinancialFilings;

  const ingestFiling =
    options.ingestFiling ??
    ingestBelFinancialFiling;

  const filings =
    await discoverFilings();

  const rankedFilings =
    sortBelFilingsNewestFirst(
      filings
    );

  const selectedFilings =
    rankedFilings.slice(
      0,
      Math.max(
        0,
        limit
      )
    );

  const results:
    QuarterlyResult[] = [];

  let parsedCount = 0;

  for (
    const filing of
    selectedFilings
  ) {
    const ingestion =
      await ingestFiling(
        filing
      );

    const quarterlyResult =
      buildBelQuarterlyResultFromIngestion(
        ingestion
      );

    if (quarterlyResult) {
      results.push(
        quarterlyResult
      );

      parsedCount += 1;
    }
  }

  return {
    results,
    discoveredCount:
      filings.length,
    parsedCount,
  };
}