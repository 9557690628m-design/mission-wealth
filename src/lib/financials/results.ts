import { BEL_QUARTERLY_RESULTS } from "@/data/financials/bel-quarterly";
import type { QuarterlyResult } from "@/lib/financials/types";

export async function getQuarterlyResults(
  symbol: string
): Promise<QuarterlyResult[]> {
  const normalizedSymbol = symbol
    .trim()
    .toUpperCase();

  if (normalizedSymbol === "BEL") {
    return BEL_QUARTERLY_RESULTS;
  }

  return [];
}