import {
  loadNseEquitySecurities,
  type SecuritiesLoadResult,
} from "./securities-loader";

import type {
  ListedSecurityRecord,
} from "./securities-master";

import type {
  StockIdentity,
} from "./types";

export interface SearchableStockIdentity
  extends StockIdentity {
  aliases?: string[];
}

type SecuritiesLoader =
  () => Promise<SecuritiesLoadResult>;

export interface ResolveStockIdentityOptions {
  loadSecurities?:
    SecuritiesLoader;
}

export const STOCK_MASTER:
  SearchableStockIdentity[] = [
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    slug: "hdfcbank",
    nseSymbol: "HDFCBANK",
    bseCode: "500180",
    sector:
      "Banking & Financial Services",
    industry:
      "Private Sector Bank",
  },
  {
    symbol: "TCS",
    name:
      "Tata Consultancy Services Ltd",
    slug: "tcs",
    nseSymbol: "TCS",
    bseCode: "532540",
    sector:
      "Information Technology",
    industry:
      "IT Services & Consulting",
  },
  {
    symbol: "RELIANCE",
    name:
      "Reliance Industries Ltd",
    slug: "reliance",
    nseSymbol: "RELIANCE",
    bseCode: "500325",
    sector:
      "Energy & Diversified",
    industry: "Diversified",
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd",
    slug: "infosys",
    nseSymbol: "INFY",
    bseCode: "500209",
    sector:
      "Information Technology",
    industry:
      "IT Services & Consulting",
  },
  {
    symbol: "LT",
    name:
      "Larsen & Toubro Ltd",
    slug: "lt",
    nseSymbol: "LT",
    bseCode: "500510",
    sector:
      "Industrials & Infrastructure",
    industry:
      "Engineering & Construction",
  },
  {
    symbol: "BEL",
    name:
      "Bharat Electronics Ltd",
    slug: "bel",
    nseSymbol: "BEL",
    bseCode: "500049",
    sector:
      "Defence & Aerospace",
    industry:
      "Defence Electronics",
    aliases: [
      "Bharat Electronics",
      "Bharat Electronic",
    ],
  },
  {
    symbol: "TITAGARH",
    name:
      "Titagarh Rail Systems Ltd",
    slug: "titagarh",
    nseSymbol: "TITAGARH",
    bseCode: "532966",
    sector:
      "Industrials & Railways",
    industry:
      "Railway Wagons",
    aliases: [
      "Titagarh Rail Systems",
      "Titagarh Rail",
      "Titagarh Wagon",
      "Titagarh Wagons",
      "Titagarh Wagons Ltd",
      "Titagarh Wagons Limited",
    ],
  },
];

function normalizeSearchValue(
  value: string
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(
      /[^a-z0-9]/g,
      ""
    );
}

function matchesAlias(
  stock:
    SearchableStockIdentity,
  query: string
): boolean {
  return (
    stock.aliases?.some(
      (alias) =>
        normalizeSearchValue(
          alias
        ) === query
    ) ?? false
  );
}

export function getStockIdentity(
  value: string
):
  | SearchableStockIdentity
  | undefined {
  const query =
    normalizeSearchValue(
      value
    );

  return STOCK_MASTER.find(
    (stock) =>
      normalizeSearchValue(
        stock.symbol
      ) === query ||
      normalizeSearchValue(
        stock.slug
      ) === query ||
      normalizeSearchValue(
        stock.nseSymbol ?? ""
      ) === query ||
      normalizeSearchValue(
        stock.bseCode ?? ""
      ) === query ||
      normalizeSearchValue(
        stock.name
      ) === query ||
      matchesAlias(
        stock,
        query
      )
  );
}

export function searchStockIdentities(
  query: string
):
  SearchableStockIdentity[] {
  const q =
    normalizeSearchValue(
      query
    );

  if (!q) {
    return STOCK_MASTER.slice(
      0,
      8
    );
  }

  return STOCK_MASTER.filter(
    (stock) => {
      const searchableValues = [
        stock.symbol,
        stock.name,
        stock.slug,
        stock.nseSymbol ?? "",
        stock.bseCode ?? "",
        stock.sector,
        stock.industry ?? "",
        ...(stock.aliases ?? []),
      ];

      return searchableValues.some(
        (value) =>
          normalizeSearchValue(
            value
          ).includes(q)
      );
    }
  );
}

function matchesListedSecurity(
  security:
    ListedSecurityRecord,
  query: string
): boolean {
  return [
    security.symbol,
    security.nseSymbol ?? "",
    security.bseCode ?? "",
    security.companyName,
  ].some(
    (value) =>
      normalizeSearchValue(
        value
      ) === query
  );
}

function buildStockIdentityFromSecurity(
  security:
    ListedSecurityRecord
): SearchableStockIdentity {
  const symbol =
    (
      security.nseSymbol ??
      security.symbol
    )
      .trim()
      .toUpperCase();

  return {
    symbol,

    name:
      security.companyName,

    slug:
      symbol.toLowerCase(),

    nseSymbol:
      security.nseSymbol ??
      undefined,

    bseCode:
      security.bseCode ??
      undefined,

    isin:
      security.isin ??
      undefined,

    sector:
      "Listed Equity",
  };
}

export async function resolveStockIdentity(
  value: string,
  options:
    ResolveStockIdentityOptions = {}
): Promise<
  | SearchableStockIdentity
  | undefined
> {
  const curated =
    getStockIdentity(
      value
    );

  if (curated) {
    return curated;
  }

  const query =
    normalizeSearchValue(
      value
    );

  if (!query) {
    return undefined;
  }

  const loadSecurities =
    options.loadSecurities ??
    loadNseEquitySecurities;

  let result:
    SecuritiesLoadResult;

  try {
    result =
      await loadSecurities();
  } catch {
    return undefined;
  }

  if (
    result.status !==
    "available"
  ) {
    return undefined;
  }

  const security =
    result.securities.find(
      (item) =>
        matchesListedSecurity(
          item,
          query
        )
    );

  if (!security) {
    return undefined;
  }

  return buildStockIdentityFromSecurity(
    security
  );
}