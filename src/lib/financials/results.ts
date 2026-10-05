import type { QuarterlyResult } from "@/lib/financials/types";

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

  return loader();
}