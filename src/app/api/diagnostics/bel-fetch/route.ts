import { NextResponse } from "next/server";

import {
  discoverBelFinancialFilings,
} from "../../../../lib/financials/filings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const filings =
      await discoverBelFinancialFilings();

    return NextResponse.json({
      ok: true,
      filingCount: filings.length,
      firstFiling:
        filings.length > 0
          ? {
              title: filings[0].title,
              url: filings[0].url,
            }
          : null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown BEL fetch error",
      },
      {
        status: 500,
      }
    );
  }
}