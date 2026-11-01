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