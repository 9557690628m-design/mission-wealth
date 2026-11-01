import { FINANCIAL_SOURCES } from "@/data/financials/sources";
import type { FinancialSource } from "@/lib/financials/types";

export function getFinancialSource(
  sourceId: string | undefined
): FinancialSource | null {
  if (!sourceId) {
    return null;
  }

  const normalizedSourceId = sourceId.trim();

  if (!normalizedSourceId) {
    return null;
  }

  return FINANCIAL_SOURCES[normalizedSourceId] ?? null;
}