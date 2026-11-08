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
  const match =
    attributes.match(
      new RegExp(
        `${escapeRegExp(
          name
        )}\\s*=\\s*["']([^"']+)["']`,
        "i"
      )
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

  const parsed =
    Number(
      value.replace(
        /,/g,
        ""
      )
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

function parseEps(
  xml: string,
  contextId: string
): number | undefined {
  const tags = [
    "BasicEarningsLossPerShareFromContinuingAndDiscontinuedOperations",
    "BasicEarningsLossPerShareFromContinuingOperations",
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

  const revenue =
    parseMoneyFactInCrores(
      xml,
      "RevenueFromOperations",
      context.id
    );

  const profitBeforeTax =
    parseMoneyFactInCrores(
      xml,
      "ProfitBeforeTax",
      context.id
    );

  /*
   * For consolidated results,
   * profit attributable to owners
   * is the shareholder-relevant PAT.
   *
   * For standalone filings this tag
   * may be absent, so fall back to
   * total ProfitLossForPeriod.
   */
  const ownersProfit =
    parseMoneyFactInCrores(
      xml,
      "ProfitOrLossAttributableToOwnersOfParent",
      context.id
    );

  const totalProfit =
    parseMoneyFactInCrores(
      xml,
      "ProfitLossForPeriod",
      context.id
    );

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

    eps:
      parseEps(
        xml,
        context.id
      ),
  };
}