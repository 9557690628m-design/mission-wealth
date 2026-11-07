export interface FinancialFiling {
  title: string;
  url: string;
  source: "company_investor_page";
  company: string;
  symbol: string;
}

const BEL_INVESTOR_PAGE =
  "https://bel-india.in/investors/";

function decodeHtmlEntities(
  value: string
): string {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function stripHtml(
  value: string
): string {
  return decodeHtmlEntities(
    value.replace(/<[^>]*>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeUrl(
  href: string,
  baseUrl: string
): string | null {
  try {
    return new URL(
      decodeHtmlEntities(href),
      baseUrl
    ).toString();
  } catch {
    return null;
  }
}

export function extractBelFinancialFilings(
  html: string,
  baseUrl = BEL_INVESTOR_PAGE
): FinancialFiling[] {
  const filings: FinancialFiling[] = [];

  const anchorPattern =
    /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

  const seenUrls =
    new Set<string>();

  let match:
    | RegExpExecArray
    | null;

  while (
    (match =
      anchorPattern.exec(html)) !==
    null
  ) {
    const href = match[1];
    const title =
      stripHtml(match[2]);

    if (
      !/financial\s+results/i.test(
        title
      )
    ) {
      continue;
    }

    if (
      !/\bBEL\b/i.test(title)
    ) {
      continue;
    }

    const url =
      normalizeUrl(
        href,
        baseUrl
      );

    if (
      !url ||
      seenUrls.has(url)
    ) {
      continue;
    }

    seenUrls.add(url);

    filings.push({
      title,
      url,
      source:
        "company_investor_page",
      company:
        "Bharat Electronics Limited",
      symbol: "BEL",
    });
  }

  return filings;
}

export async function discoverBelFinancialFilings(): Promise<
  FinancialFiling[]
> {
  const response =
    await fetch(
      BEL_INVESTOR_PAGE,
      {
        headers: {
          Accept:
            "text/html,application/xhtml+xml",
          "User-Agent":
            "Mission-Wealth-Research/1.0",
        },

        cache: "no-store",
      }
    );

  if (!response.ok) {
    throw new Error(
      `BEL investor page request failed with status ${response.status}`
    );
  }

  const contentType =
    response.headers.get(
      "content-type"
    );

  if (
    contentType &&
    !contentType
      .toLowerCase()
      .includes("text/html")
  ) {
    throw new Error(
      "BEL investor page returned an unexpected content type"
    );
  }

  const html =
    await response.text();

  return extractBelFinancialFilings(
    html
  );
}

export async function getLatestBelFinancialFiling(): Promise<
  FinancialFiling | null
> {
  const filings =
    await discoverBelFinancialFilings();

  return filings[0] ?? null;
}