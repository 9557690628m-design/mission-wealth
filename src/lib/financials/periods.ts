import type { QuarterlyResult } from "./types";

export interface FinancialPeriodComparison {
  current: QuarterlyResult | null;
  previousQuarter: QuarterlyResult | null;
  previousYearQuarter: QuarterlyResult | null;
}

function parsePeriodEnd(
  periodEnd: string
): Date | null {
  const date = new Date(
    `${periodEnd}T00:00:00Z`
  );

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function getQuarterIndex(
  date: Date
): number {
  const year = date.getUTCFullYear();
  const quarter = Math.floor(
    date.getUTCMonth() / 3
  );

  return year * 4 + quarter;
}

function findQuarterByOffset(
  current: QuarterlyResult,
  results: QuarterlyResult[],
  offset: number
): QuarterlyResult | null {
  const currentDate =
    parsePeriodEnd(current.periodEnd);

  if (!currentDate) {
    return null;
  }

  const targetQuarterIndex =
    getQuarterIndex(currentDate) + offset;

  const match = results.find(
    (result) => {
      if (
        result.periodEnd ===
        current.periodEnd
      ) {
        return false;
      }

      const resultDate =
        parsePeriodEnd(
          result.periodEnd
        );

      if (!resultDate) {
        return false;
      }

      return (
        getQuarterIndex(resultDate) ===
        targetQuarterIndex
      );
    }
  );

  return match ?? null;
}

export function findPreviousQuarter(
  current: QuarterlyResult,
  results: QuarterlyResult[]
): QuarterlyResult | null {
  return findQuarterByOffset(
    current,
    results,
    -1
  );
}

export function findPreviousYearQuarter(
  current: QuarterlyResult,
  results: QuarterlyResult[]
): QuarterlyResult | null {
  return findQuarterByOffset(
    current,
    results,
    -4
  );
}

export function getFinancialPeriodComparison(
  results: QuarterlyResult[]
): FinancialPeriodComparison {
  const sortedResults = [...results]
    .filter(
      (result) =>
        parsePeriodEnd(
          result.periodEnd
        ) !== null
    )
    .sort(
      (a, b) =>
        b.periodEnd.localeCompare(
          a.periodEnd
        )
    );

  const current =
    sortedResults[0] ?? null;

  if (!current) {
    return {
      current: null,
      previousQuarter: null,
      previousYearQuarter: null,
    };
  }

  return {
    current,
    previousQuarter:
      findPreviousQuarter(
        current,
        sortedResults
      ),
    previousYearQuarter:
      findPreviousYearQuarter(
        current,
        sortedResults
      ),
  };
}