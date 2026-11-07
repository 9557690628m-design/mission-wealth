import { FINANCIAL_SOURCES } from "@/data/financials/sources";
import type {
  AnnualFinancialStatement,
  FinancialSource,
  QuarterlyResult,
} from "./types";

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

function hasValidSourceDetails(
  details: FinancialSource | undefined
): boolean {
  if (!details) {
    return true;
  }

  if (!details.name.trim()) {
    return false;
  }

  if (!isValidIsoDate(details.filingDate)) {
    return false;
  }

  if (
    details.documentReference !== undefined &&
    !details.documentReference.trim()
  ) {
    return false;
  }

  if (
    details.url !== undefined &&
    !details.url.trim()
  ) {
    return false;
  }

  return true;
}

function hasValidSourceId(
  sourceId: string | undefined
): boolean {
  if (sourceId === undefined) {
    return true;
  }

  const normalizedSourceId =
    sourceId.trim();

  if (!normalizedSourceId) {
    return false;
  }

  return (
    normalizedSourceId in
    FINANCIAL_SOURCES
  );
}

function hasOnlyFiniteQuarterlyNumbers(
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

function hasOnlyFiniteAnnualNumbers(
  result: AnnualFinancialStatement
): boolean {
  const numericValues = [
    result.revenue,
    result.operatingProfit,
    result.profitBeforeTax,
    result.netProfit,
    result.eps,

    result.totalAssets,
    result.totalEquity,
    result.currentLiabilities,

    result.totalDebt,
    result.shortTermDebt,
    result.longTermDebt,

    result.cashAndEquivalents,

    result.operatingCashFlow,
    result.capitalExpenditure,
    result.investingCashFlow,
    result.financingCashFlow,
    result.freeCashFlow,

    result.sharesOutstandingCrores,
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

  if (!hasValidSourceId(result.sourceId)) {
    return false;
  }

  if (
    !hasValidSourceDetails(
      result.sourceDetails
    )
  ) {
    return false;
  }

  if (result.currency !== "INR") {
    return false;
  }

  if (
    !hasOnlyFiniteQuarterlyNumbers(
      result
    )
  ) {
    return false;
  }

  return true;
}

export function isValidAnnualFinancialStatement(
  result: AnnualFinancialStatement
): boolean {
  if (!result.symbol.trim()) {
    return false;
  }

  if (!result.fiscalYear.trim()) {
    return false;
  }

  if (!isValidIsoDate(result.periodEnd)) {
    return false;
  }

  if (
    result.periodStart !== undefined &&
    !isValidIsoDate(result.periodStart)
  ) {
    return false;
  }

  if (
    result.periodStart !== undefined &&
    result.periodStart >
      result.periodEnd
  ) {
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

  if (!hasValidSourceId(result.sourceId)) {
    return false;
  }

  if (
    !hasValidSourceDetails(
      result.sourceDetails
    )
  ) {
    return false;
  }

  if (result.currency !== "INR") {
    return false;
  }

  if (
    !hasOnlyFiniteAnnualNumbers(
      result
    )
  ) {
    return false;
  }

  if (
    result.sharesOutstandingCrores !==
      undefined &&
    result.sharesOutstandingCrores <= 0
  ) {
    return false;
  }

  return true;
}