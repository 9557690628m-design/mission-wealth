import type { AnnualFinancialStatement } from "./types";
import { calculateBookValuePerShare } from "./calculations";

export interface ValuationMetrics {
  marketCapitalisationCrores: number | null;
  priceToEarnings: number | null;
  priceToBook: number | null;
  enterpriseValueCrores: number | null;
  evToEbitda: number | null;
}

function isValidPositiveNumber(
  value: number | undefined | null
): value is number {
  return (
    value !== undefined &&
    value !== null &&
    Number.isFinite(value) &&
    value > 0
  );
}

export function calculateMarketCapitalisationCrores(
  sharePrice?: number | null,
  sharesOutstandingCrores?: number | null
): number | null {
  if (
    !isValidPositiveNumber(sharePrice) ||
    !isValidPositiveNumber(
      sharesOutstandingCrores
    )
  ) {
    return null;
  }

  return (
    sharePrice *
    sharesOutstandingCrores
  );
}

export function calculatePriceToEarnings(
  sharePrice?: number | null,
  eps?: number | null
): number | null {
  if (
    !isValidPositiveNumber(sharePrice) ||
    !isValidPositiveNumber(eps)
  ) {
    return null;
  }

  return sharePrice / eps;
}

export function calculatePriceToBook(
  sharePrice?: number | null,
  bookValuePerShare?: number | null
): number | null {
  if (
    !isValidPositiveNumber(sharePrice) ||
    !isValidPositiveNumber(
      bookValuePerShare
    )
  ) {
    return null;
  }

  return sharePrice / bookValuePerShare;
}

export function calculateEnterpriseValueCrores(
  marketCapitalisationCrores?:
    | number
    | null,
  totalDebt?: number | null,
  cashAndEquivalents?: number | null
): number | null {
  if (
    !isValidPositiveNumber(
      marketCapitalisationCrores
    ) ||
    totalDebt === undefined ||
    totalDebt === null ||
    cashAndEquivalents === undefined ||
    cashAndEquivalents === null ||
    !Number.isFinite(totalDebt) ||
    !Number.isFinite(
      cashAndEquivalents
    ) ||
    totalDebt < 0 ||
    cashAndEquivalents < 0
  ) {
    return null;
  }

  return (
    marketCapitalisationCrores +
    totalDebt -
    cashAndEquivalents
  );
}

export function calculateEvToEbitda(
  enterpriseValueCrores?: number | null,
  ebitda?: number | null
): number | null {
  if (
    !isValidPositiveNumber(
      enterpriseValueCrores
    ) ||
    !isValidPositiveNumber(ebitda)
  ) {
    return null;
  }

  return (
    enterpriseValueCrores /
    ebitda
  );
}

export function buildValuationMetrics(
  sharePrice: number | null | undefined,
  annual:
    | AnnualFinancialStatement
    | null
    | undefined
): ValuationMetrics {
  if (!annual) {
    return {
      marketCapitalisationCrores:
        null,
      priceToEarnings: null,
      priceToBook: null,
      enterpriseValueCrores: null,
      evToEbitda: null,
    };
  }

  const marketCapitalisationCrores =
    calculateMarketCapitalisationCrores(
      sharePrice,
      annual.sharesOutstandingCrores
    );

  const bookValuePerShare =
    calculateBookValuePerShare(
      annual.totalEquity,
      annual.sharesOutstandingCrores
    );

  const enterpriseValueCrores =
    calculateEnterpriseValueCrores(
      marketCapitalisationCrores,
      annual.totalDebt,
      annual.cashAndEquivalents
    );

  return {
    marketCapitalisationCrores,

    priceToEarnings:
      calculatePriceToEarnings(
        sharePrice,
        annual.eps
      ),

    priceToBook:
      calculatePriceToBook(
        sharePrice,
        bookValuePerShare
      ),

    enterpriseValueCrores,

    evToEbitda: null,
  };
}