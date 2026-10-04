import type { StockIdentity } from "./types";

export const STOCK_MASTER: StockIdentity[] = [
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    slug: "hdfcbank",
    nseSymbol: "HDFCBANK",
    bseCode: "500180",
    sector: "Banking & Financial Services",
    industry: "Private Sector Bank",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services Ltd",
    slug: "tcs",
    nseSymbol: "TCS",
    bseCode: "532540",
    sector: "Information Technology",
    industry: "IT Services & Consulting",
  },
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    slug: "reliance",
    nseSymbol: "RELIANCE",
    bseCode: "500325",
    sector: "Energy & Diversified",
    industry: "Diversified",
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd",
    slug: "infosys",
    nseSymbol: "INFY",
    bseCode: "500209",
    sector: "Information Technology",
    industry: "IT Services & Consulting",
  },
  {
    symbol: "LT",
    name: "Larsen & Toubro Ltd",
    slug: "lt",
    nseSymbol: "LT",
    bseCode: "500510",
    sector: "Industrials & Infrastructure",
    industry: "Engineering & Construction",
  },
  {
    symbol: "BEL",
    name: "Bharat Electronics Ltd",
    slug: "bel",
    nseSymbol: "BEL",
    bseCode: "500049",
    sector: "Defence & Aerospace",
    industry: "Defence Electronics",
  },
];

export function getStockIdentity(
  value: string
): StockIdentity | undefined {
  const query = value.trim().toLowerCase();

  return STOCK_MASTER.find(
    (stock) =>
      stock.symbol.toLowerCase() === query ||
      stock.slug.toLowerCase() === query ||
      stock.nseSymbol?.toLowerCase() === query ||
      stock.bseCode === query
  );
}