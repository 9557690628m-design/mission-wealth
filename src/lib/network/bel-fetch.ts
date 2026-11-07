import {
  rootCertificates,
} from "node:tls";

import {
  Agent,
  fetch as undiciFetch,
} from "undici";

let cachedBelDispatcher:
  | Agent
  | null
  | undefined;

function isBelHostname(
  hostname: string
): boolean {
  return (
    hostname ===
      "bel-india.in" ||
    hostname.endsWith(
      ".bel-india.in"
    )
  );
}

function getBelDispatcher():
  | Agent
  | null {
  if (
    cachedBelDispatcher !==
    undefined
  ) {
    return cachedBelDispatcher;
  }

  const encodedCertificate =
    process.env
      .BEL_SECTIGO_CA_BASE64;

  if (!encodedCertificate) {
    cachedBelDispatcher = null;

    return cachedBelDispatcher;
  }

  const certificate =
    Buffer.from(
      encodedCertificate,
      "base64"
    ).toString("utf8");

  if (
    !certificate.includes(
      "-----BEGIN CERTIFICATE-----"
    ) ||
    !certificate.includes(
      "-----END CERTIFICATE-----"
    )
  ) {
    throw new Error(
      "BEL_SECTIGO_CA_BASE64 does not contain a valid PEM certificate"
    );
  }

  cachedBelDispatcher =
    new Agent({
      connect: {
        ca: [
          ...rootCertificates,
          certificate,
        ],
      },
    });

  return cachedBelDispatcher;
}

export async function fetchBel(
  input: string | URL,
  init: RequestInit = {}
): Promise<Response> {
  const url =
    input instanceof URL
      ? input
      : new URL(input);

  if (
    !isBelHostname(
      url.hostname
    )
  ) {
    throw new Error(
      `BEL fetch rejected non-BEL host: ${url.hostname}`
    );
  }

  const dispatcher =
    getBelDispatcher();

  if (!dispatcher) {
    return fetch(
      url,
      init
    );
  }

  const response =
    await undiciFetch(
      url,
      {
        ...init,
        dispatcher,
      } as Parameters<
        typeof undiciFetch
      >[1]
    );

  return response as unknown as Response;
}