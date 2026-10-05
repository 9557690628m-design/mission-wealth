import type { QuarterlyResult } from "./types";

const ISO_DATE_PATTERN =
  /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

function hasOnlyFiniteNumbers(
  result: QuarterlyResult
): boolean {
  const numericValues = [
    result.revenue,
    result.operatingProfit,
    result.profitBeforeTax,
    result.netProfit,
    result.eps,
    result.totalAssets,
    result.totalDebt,
    result.cashAndEquivalents,
    result.operatingCashFlow,
    result.capitalExpenditure,
    result.freeCashFlow,
  ];

  return numericValues.every(
    (value) =>
      value === undefined ||
      Number.isFinite(value)
  );
}

export function isValidQuarterlyResult(
  result: QuarterlyResult
): boolean {
  if (!result.symbol.trim()) {
    return false;
  }

  if (!isValidIsoDate(result.periodEnd)) {
    return false;
  }

  if (
    result.reportedAt !== undefined &&
    !isValidIsoDate(result.reportedAt)
  ) {
    return false;
  }

  if (!result.source.trim()) {
    return false;
  }

  if (result.currency !== "INR") {
    return false;
  }

  if (!hasOnlyFiniteNumbers(result)) {
    return false;
  }

  return true;
}