import {
  FINANCIAL_SOURCES,
} from "@/data/financials/sources";

import {
  parseBelFilingPeriodMetadata,
} from "./filing-metadata";

import type {
  FilingIngestionResult,
} from "./filing-ingestion";

import type {
  QuarterlyResult,
} from "./types";

import {
  isValidQuarterlyResult,
} from "./validation";

function hasAnyFinancialValue(
  result: FilingIngestionResult
): boolean {
  const financials =
    result.financials;

  if (!financials) {
    return false;
  }

  return [
    financials.revenue,
    financials.profitBeforeTax,
    financials.netProfit,
    financials.eps,
  ].some(
    (value) =>
      value !== undefined
  );
}

function buildBelSourceId(
  quarter: string,
  fiscalYear: string
): string {
  return `BEL-${quarter}-${fiscalYear}`;
}

export function buildBelQuarterlyResultFromIngestion(
  ingestion:
    FilingIngestionResult
): QuarterlyResult | null {
  if (
    ingestion.status !==
      "parsed" ||
    !ingestion.financials ||
    !hasAnyFinancialValue(
      ingestion
    )
  ) {
    return null;
  }

  const metadata =
    parseBelFilingPeriodMetadata(
      ingestion.filing.title
    );

  if (!metadata) {
    return null;
  }

  const sourceId =
    buildBelSourceId(
      metadata.quarter,
      metadata.fiscalYear
    );

  const registeredSource =
    FINANCIAL_SOURCES[
      sourceId
    ];

  const result:
    QuarterlyResult = {
      symbol: "BEL",

      periodEnd:
        metadata.periodEnd,

      fiscalYear:
        metadata.fiscalYear,

      quarter:
        metadata.quarter,

      revenue:
        ingestion.financials
          .revenue,

      profitBeforeTax:
        ingestion.financials
          .profitBeforeTax,

      netProfit:
        ingestion.financials
          .netProfit,

      eps:
        ingestion.financials
          .eps,

      currency: "INR",
      unit: "crores",

      source:
        `${ingestion.filing.company} - ${ingestion.filing.title}`,
    };

  if (registeredSource) {
    result.sourceId =
      sourceId;

    result.reportedAt =
      registeredSource
        .filingDate;

    result.sourceDetails = {
      ...registeredSource,
      url:
        ingestion.filing.url,
    };
  }

  if (
    !isValidQuarterlyResult(
      result
    )
  ) {
    return null;
  }

  return result;
}