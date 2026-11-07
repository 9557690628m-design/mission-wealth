import type {
  AnnualDerivedMetrics,
  AnnualFinancialStatement,
  FinancialDerivedMetrics,
  QuarterlyResult,
} from "./types";

export function calculatePercentageChange(
  current?: number,
  previous?: number
): number | null {
  if (
    current === undefined ||
    previous === undefined ||
    previous === 0 ||
    !Number.isFinite(current) ||
    !Number.isFinite(previous)
  ) {
    return null;
  }

  return ((current - previous) / previous) * 100;
}

export function calculateQoQGrowth(
  current?: number,
  previous?: number
): number | null {
  return calculatePercentageChange(
    current,
    previous
  );
}

export function calculateYoYGrowth(
  current?: number,
  previousYear?: number
): number | null {
  return calculatePercentageChange(
    current,
    previousYear
  );
}

export function calculateMargin(
  numerator?: number,
  denominator?: number
): number | null {
  if (
    numerator === undefined ||
    denominator === undefined ||
    denominator === 0 ||
    !Number.isFinite(numerator) ||
    !Number.isFinite(denominator)
  ) {
    return null;
  }

  return (numerator / denominator) * 100;
}

export function calculateOperatingMargin(
  operatingProfit?: number,
  revenue?: number
): number | null {
  return calculateMargin(
    operatingProfit,
    revenue
  );
}

export function calculatePbtMargin(
  profitBeforeTax?: number,
  revenue?: number
): number | null {
  return calculateMargin(
    profitBeforeTax,
    revenue
  );
}

export function calculateNetProfitMargin(
  netProfit?: number,
  revenue?: number
): number | null {
  return calculateMargin(
    netProfit,
    revenue
  );
}

export function calculateAverage(
  current?: number,
  previous?: number
): number | null {
  if (
    current === undefined ||
    previous === undefined ||
    !Number.isFinite(current) ||
    !Number.isFinite(previous)
  ) {
    return null;
  }

  return (current + previous) / 2;
}

export function calculateReturnOnEquity(
  netProfit?: number,
  currentEquity?: number,
  previousEquity?: number
): number | null {
  const averageEquity = calculateAverage(
    currentEquity,
    previousEquity
  );

  if (averageEquity === null) {
    return null;
  }

  return calculateMargin(
    netProfit,
    averageEquity
  );
}

export function calculateCapitalEmployed(
  totalAssets?: number,
  currentLiabilities?: number
): number | null {
  if (
    totalAssets === undefined ||
    currentLiabilities === undefined ||
    !Number.isFinite(totalAssets) ||
    !Number.isFinite(currentLiabilities)
  ) {
    return null;
  }

  const capitalEmployed =
    totalAssets - currentLiabilities;

  if (capitalEmployed <= 0) {
    return null;
  }

  return capitalEmployed;
}

export function calculateReturnOnCapitalEmployed(
  operatingProfit?: number,
  totalAssets?: number,
  currentLiabilities?: number
): number | null {
  const capitalEmployed =
    calculateCapitalEmployed(
      totalAssets,
      currentLiabilities
    );

  if (capitalEmployed === null) {
    return null;
  }

  return calculateMargin(
    operatingProfit,
    capitalEmployed
  );
}

export function calculateDebtToEquity(
  totalDebt?: number,
  totalEquity?: number
): number | null {
  if (
    totalDebt === undefined ||
    totalEquity === undefined ||
    totalEquity === 0 ||
    !Number.isFinite(totalDebt) ||
    !Number.isFinite(totalEquity)
  ) {
    return null;
  }

  return totalDebt / totalEquity;
}

export function calculateNetDebt(
  totalDebt?: number,
  cashAndEquivalents?: number
): number | null {
  if (
    totalDebt === undefined ||
    cashAndEquivalents === undefined ||
    !Number.isFinite(totalDebt) ||
    !Number.isFinite(cashAndEquivalents)
  ) {
    return null;
  }

  return totalDebt - cashAndEquivalents;
}

export function calculateFreeCashFlow(
  operatingCashFlow?: number,
  capitalExpenditure?: number
): number | null {
  if (
    operatingCashFlow === undefined ||
    capitalExpenditure === undefined ||
    !Number.isFinite(operatingCashFlow) ||
    !Number.isFinite(capitalExpenditure)
  ) {
    return null;
  }

  return (
    operatingCashFlow -
    Math.abs(capitalExpenditure)
  );
}

export function calculateCashConversion(
  operatingCashFlow?: number,
  netProfit?: number
): number | null {
  if (
    operatingCashFlow === undefined ||
    netProfit === undefined ||
    netProfit === 0 ||
    !Number.isFinite(operatingCashFlow) ||
    !Number.isFinite(netProfit)
  ) {
    return null;
  }

  return (
    operatingCashFlow / netProfit
  ) * 100;
}

export function calculateBookValuePerShare(
  totalEquity?: number,
  sharesOutstandingCrores?: number
): number | null {
  if (
    totalEquity === undefined ||
    sharesOutstandingCrores === undefined ||
    sharesOutstandingCrores <= 0 ||
    !Number.isFinite(totalEquity) ||
    !Number.isFinite(
      sharesOutstandingCrores
    )
  ) {
    return null;
  }

  return totalEquity /
    sharesOutstandingCrores;
}

export function buildFinancialDerivedMetrics(
  current: QuarterlyResult,
  previousQuarter?: QuarterlyResult | null,
  previousYearQuarter?: QuarterlyResult | null
): FinancialDerivedMetrics {
  return {
    revenueQoQGrowth: calculateQoQGrowth(
      current.revenue,
      previousQuarter?.revenue
    ),

    profitBeforeTaxQoQGrowth:
      calculateQoQGrowth(
        current.profitBeforeTax,
        previousQuarter?.profitBeforeTax
      ),

    netProfitQoQGrowth: calculateQoQGrowth(
      current.netProfit,
      previousQuarter?.netProfit
    ),

    revenueYoYGrowth: calculateYoYGrowth(
      current.revenue,
      previousYearQuarter?.revenue
    ),

    profitBeforeTaxYoYGrowth:
      calculateYoYGrowth(
        current.profitBeforeTax,
        previousYearQuarter?.profitBeforeTax
      ),

    netProfitYoYGrowth: calculateYoYGrowth(
      current.netProfit,
      previousYearQuarter?.netProfit
    ),

    operatingMargin: calculateOperatingMargin(
      current.operatingProfit,
      current.revenue
    ),

    profitBeforeTaxMargin:
      calculatePbtMargin(
        current.profitBeforeTax,
        current.revenue
      ),

    netProfitMargin:
      calculateNetProfitMargin(
        current.netProfit,
        current.revenue
      ),
  };
}

export function buildAnnualDerivedMetrics(
  current: AnnualFinancialStatement,
  previous?: AnnualFinancialStatement | null
): AnnualDerivedMetrics {
  const calculatedFreeCashFlow =
    current.freeCashFlow !== undefined &&
    Number.isFinite(current.freeCashFlow)
      ? current.freeCashFlow
      : calculateFreeCashFlow(
          current.operatingCashFlow,
          current.capitalExpenditure
        );

  return {
    revenueGrowth: calculatePercentageChange(
      current.revenue,
      previous?.revenue
    ),

    operatingProfitGrowth:
      calculatePercentageChange(
        current.operatingProfit,
        previous?.operatingProfit
      ),

    netProfitGrowth:
      calculatePercentageChange(
        current.netProfit,
        previous?.netProfit
      ),

    operatingMargin:
      calculateOperatingMargin(
        current.operatingProfit,
        current.revenue
      ),

    profitBeforeTaxMargin:
      calculatePbtMargin(
        current.profitBeforeTax,
        current.revenue
      ),

    netProfitMargin:
      calculateNetProfitMargin(
        current.netProfit,
        current.revenue
      ),

    returnOnEquity:
      calculateReturnOnEquity(
        current.netProfit,
        current.totalEquity,
        previous?.totalEquity
      ),

    returnOnCapitalEmployed:
      calculateReturnOnCapitalEmployed(
        current.operatingProfit,
        current.totalAssets,
        current.currentLiabilities
      ),

    debtToEquity:
      calculateDebtToEquity(
        current.totalDebt,
        current.totalEquity
      ),

    netDebt:
      calculateNetDebt(
        current.totalDebt,
        current.cashAndEquivalents
      ),

    freeCashFlow:
      calculatedFreeCashFlow,

    cashConversion:
      calculateCashConversion(
        current.operatingCashFlow,
        current.netProfit
      ),

    bookValuePerShare:
      calculateBookValuePerShare(
        current.totalEquity,
        current.sharesOutstandingCrores
      ),
  };
}