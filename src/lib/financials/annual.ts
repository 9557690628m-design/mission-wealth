import type { AnnualFinancialStatement } from "@/lib/financials/types";
import { isValidAnnualFinancialStatement } from "@/lib/financials/validation";

type AnnualFinancialsLoader =
  () => Promise<AnnualFinancialStatement[]>;

const annualFinancialsRegistry: Record<
  string,
  AnnualFinancialsLoader
> = {
  BEL: async () => {
    const { BEL_ANNUAL_FINANCIALS } =
      await import(
        "@/data/financials/bel-annual"
      );

    return BEL_ANNUAL_FINANCIALS;
  },
};

export function getAnnualFinancialSymbols(): string[] {
  return Object.keys(
    annualFinancialsRegistry
  ).sort();
}

export async function getAnnualFinancials(
  symbol: string
): Promise<AnnualFinancialStatement[]> {
  const normalizedSymbol = symbol
    .trim()
    .toUpperCase();

  const loader =
    annualFinancialsRegistry[
      normalizedSymbol
    ];

  if (!loader) {
    return [];
  }

  const results = await loader();

  const uniqueResults: AnnualFinancialStatement[] =
    [];

  const seenPeriods =
    new Set<string>();

  for (const result of results) {
    if (
      result.symbol
        .trim()
        .toUpperCase() !==
      normalizedSymbol
    ) {
      continue;
    }

    if (
      !isValidAnnualFinancialStatement(
        result
      )
    ) {
      continue;
    }

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

    uniqueResults.push(result);
  }

  return uniqueResults.sort(
    (a, b) =>
      b.periodEnd.localeCompare(
        a.periodEnd
      )
  );
}