export interface ParsedNseQuarterlyXbrl {
  periodStart: string;
  periodEnd: string;

  reportingBasis:
    | "consolidated"
    | "standalone"
    | "unknown";

  auditStatus:
    | "audited"
    | "unaudited"
    | "unknown";

  revenue?: number;
  profitBeforeTax?: number;
  netProfit?: number;
  eps?: number;
}

interface XbrlContext {
  id: string;
  startDate: string;
  endDate: string;
}

function escapeRegExp(
  value: string
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}

function extractAttribute(
  attributes: string,
  name: string
): string | null {
  const pattern =
    new RegExp(
      `${escapeRegExp(
        name
      )}\\s*=\\s*["']([^"']+)["']`,
      "i"
    );

  const match =
    attributes.match(
      pattern
    );

  return match?.[1] ?? null;
}

function extractContexts(
  xml: string
): XbrlContext[] {
  const contexts:
    XbrlContext[] = [];

  const pattern =
    /<xbrli:context\b([^>]*)>([\s\S]*?)<\/xbrli:context>/gi;

  let match:
    RegExpExecArray | null;

  while (
    (match =
      pattern.exec(xml)) !==
    null
  ) {
    const id =
      extractAttribute(
        match[1],
        "id"
      );

    if (!id) {
      continue;
    }

    const body =
      match[2];

    /*
     * Dimensional / segment contexts are
     * intentionally ignored. We want the
     * top-level quarter facts only.
     */
    if (
      /<xbrli:scenario\b/i.test(
        body
      )
    ) {
      continue;
    }

    const start =
      body.match(
        /<xbrli:startDate>([^<]+)<\/xbrli:startDate>/i
      );

    const end =
      body.match(
        /<xbrli:endDate>([^<]+)<\/xbrli:endDate>/i
      );

    if (
      !start?.[1] ||
      !end?.[1]
    ) {
      continue;
    }

    contexts.push({
      id,
      startDate:
        start[1].trim(),
      endDate:
        end[1].trim(),
    });
  }

  return contexts;
}

function daysBetween(
  start: string,
  end: string
): number {
  const startTime =
    Date.parse(start);

  const endTime =
    Date.parse(end);

  if (
    !Number.isFinite(
      startTime
    ) ||
    !Number.isFinite(
      endTime
    )
  ) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.round(
    (endTime - startTime) /
      86_400_000
  );
}

function selectQuarterContext(
  contexts:
    XbrlContext[]
): XbrlContext | null {
  if (
    contexts.length === 0
  ) {
    return null;
  }

  /*
   * Prefer the latest period end.
   * If both current-quarter and
   * year-to-date contexts end on the
   * same date, prefer the shortest
   * duration so OneD wins over FourD.
   */
  return [...contexts]
    .sort(
      (a, b) => {
        const endComparison =
          b.endDate.localeCompare(
            a.endDate
          );

        if (
          endComparison !== 0
        ) {
          return endComparison;
        }

        return (
          daysBetween(
            a.startDate,
            a.endDate
          ) -
          daysBetween(
            b.startDate,
            b.endDate
          )
        );
      }
    )[0] ?? null;
}

function extractFact(
  xml: string,
  tagName: string,
  contextId: string
): {
  value: string;
  unitRef: string | null;
} | null {
  const escapedTag =
    escapeRegExp(
      tagName
    );

  const pattern =
    new RegExp(
      `<(?:[\\w.-]+:)?${escapedTag}\\b([^>]*)>([^<]*)<\\/(?:[\\w.-]+:)?${escapedTag}>`,
      "gi"
    );

  let match:
    RegExpExecArray | null;

  while (
    (match =
      pattern.exec(xml)) !==
    null
  ) {
    const contextRef =
      extractAttribute(
        match[1],
        "contextRef"
      );

    if (
      contextRef !==
      contextId
    ) {
      continue;
    }

    return {
      value:
        match[2].trim(),

      unitRef:
        extractAttribute(
          match[1],
          "unitRef"
        ),
    };
  }

  return null;
}

function extractTextFact(
  xml: string,
  tagName: string,
  contextId: string
): string | null {
  return (
    extractFact(
      xml,
      tagName,
      contextId
    )?.value ?? null
  );
}

function parseNumber(
  value: string | null
): number | undefined {
  if (!value) {
    return undefined;
  }

  const normalized =
    value
      .trim()
      .replace(
        /,/g,
        ""
      )
      .replace(
        /^\((.*)\)$/,
        "-$1"
      );

  const parsed =
    Number(
      normalized
    );

  if (
    !Number.isFinite(
      parsed
    )
  ) {
    return undefined;
  }

  return parsed;
}

function parseMoneyFactInCrores(
  xml: string,
  tagName: string,
  contextId: string
): number | undefined {
  const fact =
    extractFact(
      xml,
      tagName,
      contextId
    );

  if (!fact) {
    return undefined;
  }

  const value =
    parseNumber(
      fact.value
    );

  if (
    value === undefined
  ) {
    return undefined;
  }

  /*
   * NSE XBRL monetary facts normally
   * use absolute INR. Convert absolute
   * INR to crores.
   *
   * Some filings may already expose a
   * scaled unit identifier; in that
   * case preserve the filed value.
   */
  if (
    fact.unitRef
      ?.toUpperCase() ===
    "INR"
  ) {
    return value /
      10_000_000;
  }

  return value;
}

function parseFirstMoneyFactInCrores(
  xml: string,
  tagNames: string[],
  contextId: string
): number | undefined {
  for (
    const tagName of
    tagNames
  ) {
    const value =
      parseMoneyFactInCrores(
        xml,
        tagName,
        contextId
      );

    if (
      value !== undefined
    ) {
      return value;
    }
  }

  return undefined;
}

function parseEps(
  xml: string,
  contextId: string
): number | undefined {
  /*
   * General-company Ind-AS concepts
   * come first. Banking concepts are
   * included as generic fallbacks.
   */
  const tags = [
    "BasicEarningsLossPerShareFromContinuingAndDiscontinuedOperations",
    "BasicEarningsLossPerShareFromContinuingOperations",
    "BasicEarningsPerShareAfterExtraordinaryItems",
    "BasicEarningsPerShareBeforeExtraordinaryItems",
    "BasicEarningsPerShare",
  ];

  for (
    const tag of tags
  ) {
    const value =
      parseNumber(
        extractFact(
          xml,
          tag,
          contextId
        )?.value ??
          null
      );

    if (
      value !== undefined
    ) {
      return value;
    }
  }

  return undefined;
}

function normalizeReportingBasis(
  value: string | null
):
  | "consolidated"
  | "standalone"
  | "unknown" {
  const normalized =
    value
      ?.trim()
      .toLowerCase();

  if (
    normalized ===
    "consolidated"
  ) {
    return "consolidated";
  }

  if (
    normalized ===
    "standalone"
  ) {
    return "standalone";
  }

  return "unknown";
}

function normalizeAuditStatus(
  value: string | null
):
  | "audited"
  | "unaudited"
  | "unknown" {
  const normalized =
    value
      ?.trim()
      .toLowerCase()
      .replace(
        /[\s-]+/g,
        ""
      );

  if (
    normalized ===
    "audited"
  ) {
    return "audited";
  }

  if (
    normalized ===
    "unaudited"
  ) {
    return "unaudited";
  }

  return "unknown";
}

function hasMeaningfulFinancialValue(
  values: {
    revenue?: number;
    profitBeforeTax?: number;
    netProfit?: number;
    eps?: number;
  }
): boolean {
  return (
    values.revenue !==
      undefined ||
    values.profitBeforeTax !==
      undefined ||
    values.netProfit !==
      undefined ||
    values.eps !==
      undefined
  );
}

export function parseNseQuarterlyXbrl(
  xml: string
):
  | ParsedNseQuarterlyXbrl
  | null {
  const context =
    selectQuarterContext(
      extractContexts(
        xml
      )
    );

  if (!context) {
    return null;
  }

  /*
   * GENERAL / IND-AS:
   *   RevenueFromOperations
   *
   * BANKING:
   *   Income is the banking taxonomy's
   *   total-income line.
   *
   * Keep InterestEarned and TotalIncome
   * as defensive banking fallbacks for
   * older / alternate taxonomy versions.
   */
  const revenue =
    parseFirstMoneyFactInCrores(
      xml,
      [
        "RevenueFromOperations",
        "Income",
        "TotalIncome",
        "InterestEarned",
        "TotalInterestEarned",
      ],
      context.id
    );

  /*
   * General companies normally use
   * ProfitBeforeTax.
   *
   * Banks use
   * ProfitLossFromOrdinaryActivitiesBeforeTax.
   */
  const profitBeforeTax =
    parseFirstMoneyFactInCrores(
      xml,
      [
        "ProfitBeforeTax",
        "ProfitLossFromOrdinaryActivitiesBeforeTax",
        "TotalProfitBeforeTax",
        "ProfitLossBeforeTax",
      ],
      context.id
    );

  /*
   * For consolidated general-company
   * results, profit attributable to
   * owners is shareholder-relevant PAT.
   *
   * Banking filings generally expose
   * ProfitLossForThePeriod and may also
   * expose a post-minority-interest
   * concept.
   */
  const ownersProfit =
    parseFirstMoneyFactInCrores(
      xml,
      [
        "ProfitOrLossAttributableToOwnersOfParent",
        "ProfitLossAfterTaxesMinorityInterestAndShareOfProfitLossOfAssociates",
      ],
      context.id
    );

  const totalProfit =
    parseFirstMoneyFactInCrores(
      xml,
      [
        "ProfitLossForPeriod",
        "ProfitLossForThePeriod",
        "ProfitLossFromOrdinaryActivitiesAfterTax",
        "NetProfitForThePeriod",
      ],
      context.id
    );

  const eps =
    parseEps(
      xml,
      context.id
    );

  /*
   * Critical validation:
   * a filing with correct metadata but
   * no parsed financial facts must NOT
   * count as verified quarterly coverage.
   */
  if (
    !hasMeaningfulFinancialValue({
      revenue,
      profitBeforeTax,
      netProfit:
        ownersProfit ??
        totalProfit,
      eps,
    })
  ) {
    return null;
  }

  const reportingBasis =
    normalizeReportingBasis(
      extractTextFact(
        xml,
        "NatureOfReportStandaloneConsolidated",
        context.id
      )
    );

  const auditStatus =
    normalizeAuditStatus(
      extractTextFact(
        xml,
        "WhetherResultsAreAuditedOrUnaudited",
        context.id
      )
    );

  return {
    periodStart:
      context.startDate,

    periodEnd:
      context.endDate,

    reportingBasis,

    auditStatus,

    revenue,

    profitBeforeTax,

    netProfit:
      ownersProfit ??
      totalProfit,

    eps,
  };
}
