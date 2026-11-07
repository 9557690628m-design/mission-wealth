import type {
  QuarterlyResult,
} from "../types";

export interface LiveQuarterlyResultsResult {
  results: QuarterlyResult[];
  discoveredCount: number;
  parsedCount: number;
}

export interface LiveQuarterlyResultsLoadOptions {
  limit?: number;
}

export interface LiveQuarterlyResultsProvider {
  symbol: string;

  load(
    options?: LiveQuarterlyResultsLoadOptions
  ): Promise<LiveQuarterlyResultsResult>;
}