import {
  loadNseEquitySecurities,
} from "@/lib/market/securities-loader";

import {
  searchListedSecurities,
} from "@/lib/market/securities-master";

import {
  searchStockIdentities,
} from "@/lib/market/stocks";

export const runtime = "nodejs";

export async function GET(
  request: Request
) {
  const url =
    new URL(request.url);

  const query =
    url.searchParams
      .get("q")
      ?.trim() ?? "";

  if (!query) {
    return Response.json({
      results: [],
      source: "none",
    });
  }

  /*
   * Keep the manually curated Mission Wealth
   * identities first because they contain richer
   * aliases, sector and industry information.
   */
  const curated =
    searchStockIdentities(
      query
    );

  const nseResult =
    await loadNseEquitySecurities();

  if (
    nseResult.status !==
    "available"
  ) {
    return Response.json({
      results:
        curated.map(
          (stock) => ({
            symbol:
              stock.symbol,

            companyName:
              stock.name,

            nseSymbol:
              stock.nseSymbol,

            bseCode:
              stock.bseCode,

            isin:
              stock.isin,

            sector:
              stock.sector,

            industry:
              stock.industry,

            slug:
              stock.slug,

            source:
              "MISSION_WEALTH_MASTER",
          })
        ),

      source:
        "curated_fallback",

      upstreamStatus:
        nseResult.status,
    });
  }

  const liveMatches =
    searchListedSecurities(
      nseResult.securities,
      query,
      20
    );

  const combined =
    new Map<
      string,
      {
        symbol: string;
        companyName: string;
        nseSymbol?: string;
        bseCode?: string;
        isin?: string;
        sector?: string;
        industry?: string;
        slug: string;
        source: string;
      }
    >();

  for (
    const stock of curated
  ) {
    const key =
      stock.isin
        ? `ISIN:${stock.isin.toUpperCase()}`
        : `SYMBOL:${stock.symbol.toUpperCase()}`;

    combined.set(
      key,
      {
        symbol:
          stock.symbol,

        companyName:
          stock.name,

        nseSymbol:
          stock.nseSymbol,

        bseCode:
          stock.bseCode,

        isin:
          stock.isin,

        sector:
          stock.sector,

        industry:
          stock.industry,

        slug:
          stock.slug,

        source:
          "MISSION_WEALTH_MASTER",
      }
    );
  }

  for (
    const security of liveMatches
  ) {
    const key =
      security.isin
        ? `ISIN:${security.isin.toUpperCase()}`
        : `SYMBOL:${security.symbol.toUpperCase()}`;

    if (
      combined.has(key)
    ) {
      continue;
    }

    combined.set(
      key,
      {
        symbol:
          security.symbol,

        companyName:
          security.companyName,

        nseSymbol:
          security.nseSymbol,

        bseCode:
          security.bseCode,

        isin:
          security.isin,

        slug:
          security.nseSymbol
            ? security.nseSymbol.toLowerCase()
            : security.symbol.toLowerCase(),

        source:
          security.source,
      }
    );
  }

  return Response.json({
    results:
      Array.from(
        combined.values()
      ).slice(0, 20),

    source:
      "mission_wealth_plus_live_nse",

    totalNseSecurities:
      nseResult.securities.length,
  });
}