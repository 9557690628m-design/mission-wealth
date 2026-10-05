import type { QuarterlyResult } from "@/lib/financials/types";
import { isValidQuarterlyResult } from "@/lib/financials/validation";

type QuarterlyResultsLoader =
  () => Promise<QuarterlyResult[]>;

const quarterlyResultsRegistry: Record<
  string,
  QuarterlyResultsLoader
> = {
  BEL: async () => {
    const { BEL_QUARTERLY_RESULTS } =
      await import(
        "@/data/financials/bel-quarterly"
      );

    return BEL_QUARTERLY_RESULTS;
  },
};

export async function getQuarterlyResults(
  symbol: string
): Promise<QuarterlyResult[]> {
  const normalizedSymbol = symbol
    .trim()
    .toUpperCase();

  const loader =
    quarterlyResultsRegistry[normalizedSymbol];

  if (!loader) {
    return [];
  }

  const results = await loader();

  const validResults = results.filter(
    (result) =>
      result.symbol.trim().toUpperCase() ===
        normalizedSymbol &&
      isValidQuarterlyResult(result)
  );

  const uniqueResults: QuarterlyResult[] = [];
  const seenPeriods = new Set<string>();

  for (const result of validResults) {
    if (seenPeriods.has(result.periodEnd)) {
      continue;
    }

    seenPeriods.add(result.periodEnd);
    uniqueResults.push(result);
  }

  return uniqueResults.sort(
    (a, b) =>
      b.periodEnd.localeCompare(a.periodEnd)
  );
}