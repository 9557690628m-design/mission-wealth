import type { QuarterlyResult } from "./types";

export interface TtmFinancials {
  symbol: string;
  periodStart: string;
  periodEnd: string;

  revenue: number | null;
  profitBeforeTax: number | null;
  netProfit: number | null;
  eps: number | null;

  quarterCount: number;
  complete: boolean;
}

function isFiniteNumber(
  value: number | undefined | null
): value is number {
  return (
    value !== undefined &&
    value !== null &&
    Number.isFinite(value)
  );
}

function parseIsoDate(
  value: string
): Date | null {
  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function getQuarterKey(
  periodEnd: string
): {
  year: number;
  quarter: number;
} | null {
  const date = parseIsoDate(periodEnd);

  if (!date) {
    return null;
  }

  const month =
    date.getUTCMonth() + 1;

  const quarter =
    Math.floor((month - 1) / 3) + 1;

  return {
    year: date.getUTCFullYear(),
    quarter,
  };
}

function previousQuarterKey(
  year: number,
  quarter: number
): {
  year: number;
  quarter: number;
} {
  if (quarter === 1) {
    return {
      year: year - 1,
      quarter: 4,
    };
  }

  return {
    year,
    quarter: quarter - 1,
  };
}

function areConsecutiveQuarters(
  results: QuarterlyResult[]
): boolean {
  if (results.length !== 4) {
    return false;
  }

  for (
    let index = 0;
    index < results.length - 1;
    index += 1
  ) {
    const current =
      getQuarterKey(
        results[index].periodEnd
      );

    const next =
      getQuarterKey(
        results[index + 1].periodEnd
      );

    if (!current || !next) {
      return false;
    }

    const expected =
      previousQuarterKey(
        current.year,
        current.quarter
      );

    if (
      next.year !== expected.year ||
      next.quarter !==
        expected.quarter
    ) {
      return false;
    }
  }

  return true;
}

function sumField(
  results: QuarterlyResult[],
  selector: (
    result: QuarterlyResult
  ) => number | undefined
): number | null {
  const values =
    results.map(selector);

  if (
    !values.every(
      (value): value is number =>
        isFiniteNumber(value)
    )
  ) {
    return null;
  }

  return values.reduce(
    (total, value) =>
      total + value,
    0
  );
}

export function buildTtmFinancials(
  quarterlyResults: QuarterlyResult[]
): TtmFinancials | null {
  const validResults =
    quarterlyResults
      .filter((result) =>
        Boolean(
          parseIsoDate(
            result.periodEnd
          )
        )
      )
      .sort(
        (a, b) =>
          b.periodEnd.localeCompare(
            a.periodEnd
          )
      );

  if (validResults.length < 4) {
    return null;
  }

  const latestFour =
    validResults.slice(0, 4);

  if (
    !areConsecutiveQuarters(
      latestFour
    )
  ) {
    return null;
  }

  const symbol =
    latestFour[0].symbol;

  if (
    latestFour.some(
      (result) =>
        result.symbol !== symbol
    )
  ) {
    return null;
  }

  return {
    symbol,

    periodStart:
      latestFour[3].periodEnd,

    periodEnd:
      latestFour[0].periodEnd,

    revenue: sumField(
      latestFour,
      (result) =>
        result.revenue
    ),

    profitBeforeTax: sumField(
      latestFour,
      (result) =>
        result.profitBeforeTax
    ),

    netProfit: sumField(
      latestFour,
      (result) =>
        result.netProfit
    ),

    eps: sumField(
      latestFour,
      (result) =>
        result.eps
    ),

    quarterCount: 4,
    complete: true,
  };
}