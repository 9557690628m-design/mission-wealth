export function isFreshMarketData(
  timestamp: string,
  maxAgeDays = 7
): boolean {
  const dataTime = new Date(timestamp).getTime();

  if (Number.isNaN(dataTime)) {
    return false;
  }

  const now = Date.now();
  const maxAgeMs =
    maxAgeDays * 24 * 60 * 60 * 1000;

  return now - dataTime <= maxAgeMs;
}