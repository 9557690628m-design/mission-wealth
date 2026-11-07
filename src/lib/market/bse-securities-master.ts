import type {
  ListedSecurityRecord,
} from "./securities-master";

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

export function parseBseEquitySecurityCsv(
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

  const scripCodeIndex =
    findHeaderIndex(
      headers,
      [
        "Scrip Code",
        "Security Code",
        "SC_CODE",
      ]
    );

  const instrumentCodeIndex =
    findHeaderIndex(
      headers,
      [
        "Instrument Code",
        "Security Id",
        "Security ID",
        "SC_ID",
      ]
    );

  const scripNameIndex =
    findHeaderIndex(
      headers,
      [
        "Scrip Name",
        "Security Name",
        "Company Name",
        "SC_NAME",
      ]
    );

  const isinIndex =
    findHeaderIndex(
      headers,
      [
        "ISIN CODE",
        "ISIN",
        "ISIN Code",
      ]
    );

  const securityTypeIndex =
    findHeaderIndex(
      headers,
      [
        "Security Type Flag",
        "Security Type",
      ]
    );

  if (
    scripCodeIndex < 0 ||
    scripNameIndex < 0
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

    const bseCode =
      normalizeText(
        columns[
          scripCodeIndex
        ] ?? ""
      );

    const companyName =
      normalizeText(
        columns[
          scripNameIndex
        ] ?? ""
      );

    if (
      !bseCode ||
      !companyName
    ) {
      continue;
    }

    const securityType =
      securityTypeIndex >= 0
        ? normalizeText(
            columns[
              securityTypeIndex
            ] ?? ""
          )
        : "";

    if (
      securityType &&
      securityType.toUpperCase() !==
        "EQ"
    ) {
      continue;
    }

    const instrumentCode =
      instrumentCodeIndex >= 0
        ? normalizeText(
            columns[
              instrumentCodeIndex
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
      `${bseCode}|${isin.toUpperCase()}`;

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
        instrumentCode ||
        bseCode,

      companyName,

      isin:
        isin ||
        undefined,

      bseCode,

      source: "BSE",
    });
  }

  return securities;
}

export function mergeNseAndBseSecurities(
  nseSecurities:
    ListedSecurityRecord[],

  bseSecurities:
    ListedSecurityRecord[]
): ListedSecurityRecord[] {
  const merged =
    new Map<
      string,
      ListedSecurityRecord
    >();

  function getMergeKey(
    security:
      ListedSecurityRecord
  ): string {
    if (security.isin) {
      return `ISIN:${security.isin.toUpperCase()}`;
    }

    if (
      security.nseSymbol
    ) {
      return `NSE:${security.nseSymbol.toUpperCase()}`;
    }

    if (
      security.bseCode
    ) {
      return `BSE:${security.bseCode}`;
    }

    return `NAME:${normalizeKey(
      security.companyName
    )}`;
  }

  for (
    const security of nseSecurities
  ) {
    merged.set(
      getMergeKey(
        security
      ),
      {
        ...security,
      }
    );
  }

  for (
    const security of bseSecurities
  ) {
    const key =
      getMergeKey(
        security
      );

    const existing =
      merged.get(key);

    if (!existing) {
      merged.set(
        key,
        {
          ...security,
        }
      );

      continue;
    }

    merged.set(
      key,
      {
        ...existing,

        companyName:
          existing.companyName ||
          security.companyName,

        isin:
          existing.isin ||
          security.isin,

        nseSymbol:
          existing.nseSymbol ||
          security.nseSymbol,

        bseCode:
          existing.bseCode ||
          security.bseCode,

        source:
          "NSE_BSE_MASTER",
      }
    );
  }

  return Array.from(
    merged.values()
  );
}