export interface ListedSecurityRecord {
  symbol: string;
  companyName: string;

  series?: string;
  isin?: string;

  nseSymbol?: string;
  bseCode?: string;

  source:
    | "NSE"
    | "BSE"
    | "NSE_BSE_MASTER";
}

function normalizeText(
  value: string
): string {
  return value
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeKey(
  value: string
): string {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function splitCsvLine(
  line: string
): string[] {
  const values: string[] = [];

  let current = "";
  let insideQuotes = false;

  for (
    let index = 0;
    index < line.length;
    index += 1
  ) {
    const character =
      line[index];

    if (character === '"') {
      const next =
        line[index + 1];

      if (
        insideQuotes &&
        next === '"'
      ) {
        current += '"';
        index += 1;
      } else {
        insideQuotes =
          !insideQuotes;
      }

      continue;
    }

    if (
      character === "," &&
      !insideQuotes
    ) {
      values.push(
        current.trim()
      );

      current = "";
      continue;
    }

    current += character;
  }

  values.push(
    current.trim()
  );

  return values;
}

function findHeaderIndex(
  headers: string[],
  candidates: string[]
): number {
  const normalizedHeaders =
    headers.map(
      normalizeKey
    );

  for (
    const candidate of candidates
  ) {
    const index =
      normalizedHeaders.indexOf(
        normalizeKey(candidate)
      );

    if (index >= 0) {
      return index;
    }
  }

  return -1;
}

export function parseNseEquitySecurityCsv(
  csv: string
): ListedSecurityRecord[] {
  const lines =
    csv
      .split(/\r?\n/)
      .map(
        (line) =>
          line.trim()
      )
      .filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const headers =
    splitCsvLine(
      lines[0]
    );

  const symbolIndex =
    findHeaderIndex(
      headers,
      [
        "SYMBOL",
        "Symbol",
      ]
    );

  const companyNameIndex =
    findHeaderIndex(
      headers,
      [
        "NAME OF COMPANY",
        "NAME OF THE COMPANY",
        "Company Name",
        "NAME",
      ]
    );

  const seriesIndex =
    findHeaderIndex(
      headers,
      [
        "SERIES",
        "Series",
      ]
    );

  const isinIndex =
    findHeaderIndex(
      headers,
      [
        "ISIN NUMBER",
        "ISIN",
      ]
    );

  if (
    symbolIndex < 0 ||
    companyNameIndex < 0
  ) {
    return [];
  }

  const securities:
    ListedSecurityRecord[] = [];

  const seen =
    new Set<string>();

  for (
    const line of lines.slice(1)
  ) {
    const columns =
      splitCsvLine(line);

    const symbol =
      normalizeText(
        columns[
          symbolIndex
        ] ?? ""
      );

    const companyName =
      normalizeText(
        columns[
          companyNameIndex
        ] ?? ""
      );

    if (
      !symbol ||
      !companyName
    ) {
      continue;
    }

    const series =
      seriesIndex >= 0
        ? normalizeText(
            columns[
              seriesIndex
            ] ?? ""
          )
        : "";

    const isin =
      isinIndex >= 0
        ? normalizeText(
            columns[
              isinIndex
            ] ?? ""
          )
        : "";

    const duplicateKey =
      `${symbol.toUpperCase()}|${isin.toUpperCase()}`;

    if (
      seen.has(
        duplicateKey
      )
    ) {
      continue;
    }

    seen.add(
      duplicateKey
    );

    securities.push({
      symbol:
        symbol.toUpperCase(),

      companyName,

      series:
        series ||
        undefined,

      isin:
        isin ||
        undefined,

      nseSymbol:
        symbol.toUpperCase(),

      source: "NSE",
    });
  }

  return securities;
}

export function searchListedSecurities(
  securities:
    ListedSecurityRecord[],
  query: string,
  limit = 20
): ListedSecurityRecord[] {
  const normalizedQuery =
    normalizeKey(query);

  if (!normalizedQuery) {
    return [];
  }

  return securities
    .filter(
      (security) =>
        normalizeKey(
          security.symbol
        ).includes(
          normalizedQuery
        ) ||
        normalizeKey(
          security.companyName
        ).includes(
          normalizedQuery
        ) ||
        normalizeKey(
          security.nseSymbol ?? ""
        ).includes(
          normalizedQuery
        ) ||
        normalizeKey(
          security.bseCode ?? ""
        ).includes(
          normalizedQuery
        ) ||
        normalizeKey(
          security.isin ?? ""
        ).includes(
          normalizedQuery
        )
    )
    .slice(
      0,
      Math.max(
        1,
        limit
      )
    );
}