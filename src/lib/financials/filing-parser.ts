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
    .replace(/\s+/g, " ")
    .trim();
}

function parseFinancialNumber(
  value: string
): number | undefined {
  const cleaned =
    value
      .replace(/,/g, "")
      .replace(/[()]/g, "")
      .trim();

  if (!cleaned) {
    return undefined;
  }

  const number =
    Number(cleaned);

  if (
    !Number.isFinite(number)
  ) {
    return undefined;
  }

  return number;
}

function findAmountAfterLabel(
  text: string,
  patterns: RegExp[]
): number | undefined {
  for (
    const pattern of patterns
  ) {
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

export function parseBelQuarterlyFinancialText(
  rawText: string
): ParsedQuarterlyFinancials {
  const text =
    normalizeText(rawText);

  const revenue =
    findAmountAfterLabel(
      text,
      [
        /Revenue\s+from\s+operations[\s:₹Rs.\-]*([\d,]+(?:\.\d+)?)/i,
      ]
    );

  const profitBeforeTax =
    findAmountAfterLabel(
      text,
      [
        /Profit\s+Before\s+Tax[\s():₹Rs.\-]*([\d,]+(?:\.\d+)?)/i,
        /\bPBT\b[\s:₹Rs.\-]*([\d,]+(?:\.\d+)?)/i,
      ]
    );

  const netProfit =
    findAmountAfterLabel(
      text,
      [
        /Profit\s+After\s+Tax[\s():₹Rs.\-]*([\d,]+(?:\.\d+)?)/i,
        /\bPAT\b[\s:₹Rs.\-]*([\d,]+(?:\.\d+)?)/i,
      ]
    );

  const eps =
    findAmountAfterLabel(
      text,
      [
        /Basic\s+EPS[\s():₹Rs.\-]*([\d,]+(?:\.\d+)?)/i,
        /Basic\s+Earnings\s+Per\s+Share[\s():₹Rs.\-]*([\d,]+(?:\.\d+)?)/i,
        /Earnings\s+Per\s+Share[\s():₹Rs.\-]*([\d,]+(?:\.\d+)?)/i,
      ]
    );

  return {
    revenue,
    profitBeforeTax,
    netProfit,
    eps,
  };
}