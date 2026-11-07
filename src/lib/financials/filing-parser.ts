export interface ParsedQuarterlyFinancials {
  revenue?: number;
  profitBeforeTax?: number;
  netProfit?: number;
  eps?: number;
}

function normalizeText(
  value: string
): string {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/\r/g, " ")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseFinancialNumber(
  value: string
): number | undefined {
  const cleaned =
    value
      .replace(/\s+/g, "")
      .replace(/,/g, "")
      .replace(/[()]/g, "")
      .trim();

  if (!cleaned) {
    return undefined;
  }

  const number =
    Number(cleaned);

  if (!Number.isFinite(number)) {
    return undefined;
  }

  return number;
}

function findAmountAfterLabel(
  text: string,
  patterns: RegExp[]
): number | undefined {
  for (const pattern of patterns) {
    const match =
      pattern.exec(text);

    if (!match) {
      continue;
    }

    const parsed =
      parseFinancialNumber(
        match[1]
      );

    if (
      parsed !== undefined
    ) {
      return parsed;
    }
  }

  return undefined;
}

function findNarrativeRupeeAmount(
  text: string,
  patterns: RegExp[]
): number | undefined {
  for (const pattern of patterns) {
    const match =
      pattern.exec(text);

    if (
      !match ||
      !match[1]
    ) {
      continue;
    }

    const parsed =
      parseFinancialNumber(
        match[1]
      );

    if (
      parsed !== undefined
    ) {
      return parsed;
    }
  }

  return undefined;
}

function findFirstDecimalNearLabel(
  text: string,
  labelPatterns: RegExp[],
  maxDistance = 180
): number | undefined {
  for (
    const labelPattern of labelPatterns
  ) {
    const labelMatch =
      labelPattern.exec(text);

    if (!labelMatch) {
      continue;
    }

    const start =
      labelMatch.index +
      labelMatch[0].length;

    const nearbyText =
      text.slice(
        start,
        start + maxDistance
      );

    const decimalMatches =
      nearbyText.matchAll(
        /(?:^|[^\d])(\d{1,3}\.\d+)(?!\d)/g
      );

    for (
      const match of decimalMatches
    ) {
      const parsed =
        parseFinancialNumber(
          match[1]
        );

      if (
        parsed !== undefined
      ) {
        return parsed;
      }
    }
  }

  return undefined;
}

export function parseBelQuarterlyFinancialText(
  rawText: string
): ParsedQuarterlyFinancials {
  const text =
    normalizeText(
      rawText
    );

  const currencyPattern =
    "(?:₹|Rs\\s*\\.?|INR)";

  const numberPattern =
    "([\\d]+(?:\\s*,\\s*\\d{2,3})*(?:\\.\\d+)?)";

  const revenueNarrative =
    findNarrativeRupeeAmount(
      text,
      [
        new RegExp(
          `achieved\\s+Revenue\\s+from\\s+operations\\s+of\\s+${currencyPattern}\\s*${numberPattern}`,
          "i"
        ),

        new RegExp(
          `Revenue\\s+from\\s+operations\\s+of\\s+${currencyPattern}\\s*${numberPattern}`,
          "i"
        ),
      ]
    );

  const revenueFallback =
    findAmountAfterLabel(
      text,
      [
        /Revenue\s+from\s+operations[\s:₹Rs.\-]*([\d]+(?:\s*,\s*\d{2,3})*(?:\.\d+)?)/i,
      ]
    );

  const revenue =
    revenueNarrative ??
    revenueFallback;

  const profitBeforeTaxNarrative =
    findNarrativeRupeeAmount(
      text,
      [
        new RegExp(
          `Profit\\s+Before\\s+Tax\\s*\\(\\s*PBT\\s*\\)[\\s\\S]{0,260}?stood\\s+at\\s+${currencyPattern}\\s*${numberPattern}`,
          "i"
        ),

        new RegExp(
          `\\bPBT\\b[\\s\\S]{0,260}?stood\\s+at\\s+${currencyPattern}\\s*${numberPattern}`,
          "i"
        ),
      ]
    );

  const profitBeforeTaxFallback =
    findAmountAfterLabel(
      text,
      [
        /Profit\s+Before\s+Tax[\s():₹Rs.\-]*([\d]+(?:\s*,\s*\d{2,3})*(?:\.\d+)?)/i,
        /\bPBT\b[\s:₹Rs.\-]*([\d]+(?:\s*,\s*\d{2,3})*(?:\.\d+)?)/i,
      ]
    );

  const profitBeforeTax =
    profitBeforeTaxNarrative ??
    profitBeforeTaxFallback;

  const netProfitNarrative =
    findNarrativeRupeeAmount(
      text,
      [
        new RegExp(
          `Profit\\s+After\\s+Tax\\s*\\(\\s*PAT\\s*\\)[\\s\\S]{0,260}?stood\\s+at\\s+${currencyPattern}\\s*${numberPattern}`,
          "i"
        ),

        new RegExp(
          `\\bPAT\\b[\\s\\S]{0,260}?stood\\s+at\\s+${currencyPattern}\\s*${numberPattern}`,
          "i"
        ),
      ]
    );

  const netProfitFallback =
    findAmountAfterLabel(
      text,
      [
        /Profit\s+After\s+Tax[\s():₹Rs.\-]*([\d]+(?:\s*,\s*\d{2,3})*(?:\.\d+)?)/i,
        /\bPAT\b[\s:₹Rs.\-]*([\d]+(?:\s*,\s*\d{2,3})*(?:\.\d+)?)/i,
      ]
    );

  const netProfit =
    netProfitNarrative ??
    netProfitFallback;

  const epsDirect =
    findAmountAfterLabel(
      text,
      [
        /Basic\s+EPS[\s():₹Rs.\-]*([\d]+(?:\.\d+)?)/i,
        /Basic\s+Earnings\s+Per\s+Share[\s():₹Rs.\-]*([\d]+(?:\.\d+)?)/i,
      ]
    );

  const epsFromTable =
    findFirstDecimalNearLabel(
      text,
      [
        /Earnings\s+per\s+share\s*\(\s*Basic\s*&\s*Diluted\s*\)/i,
        /Earnings\s+Per\s+Share/i,
      ],
      180
    );

  const eps =
    epsDirect ??
    epsFromTable;

  return {
    revenue,
    profitBeforeTax,
    netProfit,
    eps,
  };
}