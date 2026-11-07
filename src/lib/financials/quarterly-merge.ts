import type {
  QuarterlyResult,
} from "./types";

import {
  isValidQuarterlyResult,
} from "./validation";

function mergeSamePeriod(
  existing: QuarterlyResult,
  incoming: QuarterlyResult
): QuarterlyResult {
  return {
    ...existing,
    ...incoming,

    revenue:
      incoming.revenue ??
      existing.revenue,

    operatingProfit:
      incoming.operatingProfit ??
      existing.operatingProfit,

    profitBeforeTax:
      incoming.profitBeforeTax ??
      existing.profitBeforeTax,

    netProfit:
      incoming.netProfit ??
      existing.netProfit,

    eps:
      incoming.eps ??
      existing.eps,

    totalAssets:
      incoming.totalAssets ??
      existing.totalAssets,

    totalDebt:
      incoming.totalDebt ??
      existing.totalDebt,

    cashAndEquivalents:
      incoming.cashAndEquivalents ??
      existing.cashAndEquivalents,

    operatingCashFlow:
      incoming.operatingCashFlow ??
      existing.operatingCashFlow,

    capitalExpenditure:
      incoming.capitalExpenditure ??
      existing.capitalExpenditure,

    freeCashFlow:
      incoming.freeCashFlow ??
      existing.freeCashFlow,

    sourceId:
      incoming.sourceId ??
      existing.sourceId,

    sourceDetails:
      incoming.sourceDetails ??
      existing.sourceDetails,

    reportedAt:
      incoming.reportedAt ??
      existing.reportedAt,
  };
}

export function mergeQuarterlyResults(
  existingResults:
    QuarterlyResult[],
  incomingResults:
    QuarterlyResult[]
): QuarterlyResult[] {
  const byPeriod =
    new Map<
      string,
      QuarterlyResult
    >();

  for (
    const result of
    existingResults
  ) {
    if (
      !isValidQuarterlyResult(
        result
      )
    ) {
      continue;
    }

    if (
      !byPeriod.has(
        result.periodEnd
      )
    ) {
      byPeriod.set(
        result.periodEnd,
        result
      );
    }
  }

  for (
    const incoming of
    incomingResults
  ) {
    if (
      !isValidQuarterlyResult(
        incoming
      )
    ) {
      continue;
    }

    const existing =
      byPeriod.get(
        incoming.periodEnd
      );

    if (!existing) {
      byPeriod.set(
        incoming.periodEnd,
        incoming
      );

      continue;
    }

    const merged =
      mergeSamePeriod(
        existing,
        incoming
      );

    if (
      isValidQuarterlyResult(
        merged
      )
    ) {
      byPeriod.set(
        incoming.periodEnd,
        merged
      );
    }
  }

  return Array.from(
    byPeriod.values()
  ).sort(
    (a, b) =>
      b.periodEnd.localeCompare(
        a.periodEnd
      )
  );
}