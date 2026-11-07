import { NextResponse } from "next/server";

import {
  discoverBelFinancialFilings,
} from "../../../../lib/financials/filings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ErrorDetails = {
  name?: string;
  message?: string;
  code?: string;
  causeName?: string;
  causeMessage?: string;
  causeCode?: string;
};

function getErrorDetails(error: unknown): ErrorDetails {
  if (!(error instanceof Error)) {
    return {
      message: String(error),
    };
  }

  const details: ErrorDetails = {
    name: error.name,
    message: error.message,
  };

  const errorWithCode =
    error as Error & {
      code?: string;
      cause?: unknown;
    };

  if (errorWithCode.code) {
    details.code = errorWithCode.code;
  }

  const cause = errorWithCode.cause;

  if (cause instanceof Error) {
    details.causeName = cause.name;
    details.causeMessage = cause.message;

    const causeWithCode =
      cause as Error & {
        code?: string;
      };

    if (causeWithCode.code) {
      details.causeCode =
        causeWithCode.code;
    }
  } else if (
    cause &&
    typeof cause === "object"
  ) {
    const causeRecord =
      cause as Record<string, unknown>;

    if (
      typeof causeRecord.name ===
      "string"
    ) {
      details.causeName =
        causeRecord.name;
    }

    if (
      typeof causeRecord.message ===
      "string"
    ) {
      details.causeMessage =
        causeRecord.message;
    }

    if (
      typeof causeRecord.code ===
      "string"
    ) {
      details.causeCode =
        causeRecord.code;
    }
  }

  return details;
}

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
              title:
                filings[0].title,
              url:
                filings[0].url,
            }
          : null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          getErrorDetails(error),
      },
      {
        status: 500,
      }
    );
  }
}