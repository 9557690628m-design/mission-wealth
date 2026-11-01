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