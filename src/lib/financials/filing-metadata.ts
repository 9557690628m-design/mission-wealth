export interface BelFilingPeriodMetadata {
  fiscalYear: string;
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  periodEnd: string;
}

function normalizeTitle(
  title: string
): string {
  return title
    .replace(/\s+/g, " ")
    .trim();
}

function buildPeriodEnd(
  fiscalYearStart: number,
  quarter:
    | "Q1"
    | "Q2"
    | "Q3"
    | "Q4"
): string {
  switch (quarter) {
    case "Q1":
      return `${fiscalYearStart}-06-30`;

    case "Q2":
      return `${fiscalYearStart}-09-30`;

    case "Q3":
      return `${fiscalYearStart}-12-31`;

    case "Q4":
      return `${fiscalYearStart + 1}-03-31`;
  }
}

export function parseBelFilingPeriodMetadata(
  title: string
): BelFilingPeriodMetadata | null {
  const normalizedTitle =
    normalizeTitle(title);

  const match =
    normalizedTitle.match(
      /\b(20\d{2})\s*-\s*(\d{2})\s*(?:-\s*)?(Q[1-4])\b/i
    );

  if (!match) {
    return null;
  }

  const fiscalYearStart =
    Number(match[1]);

  const fiscalYearEnd =
    Number(match[2]);

  const expectedFiscalYearEnd =
    (fiscalYearStart + 1) %
    100;

  if (
    fiscalYearEnd !==
    expectedFiscalYearEnd
  ) {
    return null;
  }

  const quarter =
    match[3].toUpperCase() as
      | "Q1"
      | "Q2"
      | "Q3"
      | "Q4";

  return {
    fiscalYear:
      `FY${fiscalYearStart}-${String(
        fiscalYearEnd
      ).padStart(2, "0")}`,

    quarter,

    periodEnd:
      buildPeriodEnd(
        fiscalYearStart,
        quarter
      ),
  };
}