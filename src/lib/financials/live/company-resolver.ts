import {
  resolveStockIdentity,
} from "../../market/stocks";

export interface ResolvedExchangeCompany {
  symbol: string;

  companyName: string;

  isin:
    | string
    | null;

  bseCode:
    | string
    | null;
}

export async function resolveExchangeCompany(
  query: string
): Promise<
  ResolvedExchangeCompany | null
> {
  const normalizedQuery =
    query.trim();

  if (!normalizedQuery) {
    return null;
  }

  const stock =
    await resolveStockIdentity(
      normalizedQuery
    );

  if (!stock) {
    return null;
  }

  const symbol =
    stock.nseSymbol?.trim() ||
    stock.symbol.trim();

  if (!symbol) {
    return null;
  }

  return {
    symbol:
      symbol.toUpperCase(),

    companyName:
      stock.name.trim(),

    isin:
      stock.isin?.trim() ||
      null,

    bseCode:
      stock.bseCode?.trim() ||
      null,
  };
}