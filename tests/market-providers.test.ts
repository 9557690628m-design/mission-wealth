import test, {
  afterEach,
  beforeEach,
} from "node:test";
import assert from "node:assert/strict";

import { AlphaVantageProvider } from "../src/lib/market/alphavantage-provider";
import { MarketstackProvider } from "../src/lib/market/marketstack-provider";
import { NullMarketDataProvider } from "../src/lib/market/null-provider";

const originalFetch = globalThis.fetch;

const originalAlphaVantageKey =
  process.env.ALPHAVANTAGE_API_KEY;

const originalMarketstackKey =
  process.env.MARKETSTACK_API_KEY;

function todayIsoDate(): string {
  return new Date()
    .toISOString()
    .slice(0, 10);
}

function mockJsonResponse(
  body: unknown,
  status = 200
): void {
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify(body),
      {
        status,
        headers: {
          "Content-Type":
            "application/json",
        },
      }
    );
}

beforeEach(() => {
  process.env.ALPHAVANTAGE_API_KEY =
    "test-alpha-key";

  process.env.MARKETSTACK_API_KEY =
    "test-marketstack-key";
});

afterEach(() => {
  globalThis.fetch = originalFetch;

  if (
    originalAlphaVantageKey === undefined
  ) {
    delete process.env
      .ALPHAVANTAGE_API_KEY;
  } else {
    process.env.ALPHAVANTAGE_API_KEY =
      originalAlphaVantageKey;
  }

  if (
    originalMarketstackKey === undefined
  ) {
    delete process.env
      .MARKETSTACK_API_KEY;
  } else {
    process.env.MARKETSTACK_API_KEY =
      originalMarketstackKey;
  }
});

test("Alpha Vantage reports missing configuration", async () => {
  delete process.env.ALPHAVANTAGE_API_KEY;

  let fetchCalled = false;

  globalThis.fetch = async () => {
    fetchCalled = true;

    return new Response(null, {
      status: 200,
    });
  };

  const provider =
    new AlphaVantageProvider();

  const result =
    await provider.getQuote("BEL");

  assert.equal(
    result.status,
    "unavailable"
  );

  assert.equal(
    result.reason,
    "missing_configuration"
  );

  assert.equal(result.quote, null);

  assert.equal(fetchCalled, false);
});

test("Alpha Vantage reports provider error for failed HTTP response", async () => {
  mockJsonResponse({}, 500);

  const provider =
    new AlphaVantageProvider();

  const result =
    await provider.getQuote("BEL");

  assert.equal(
    result.status,
    "unavailable"
  );

  assert.equal(
    result.reason,
    "provider_error"
  );

  assert.equal(result.quote, null);
});

test("Alpha Vantage reports provider error when fetch throws", async () => {
  globalThis.fetch = async () => {
    throw new Error(
      "Simulated network failure"
    );
  };

  const provider =
    new AlphaVantageProvider();

  const result =
    await provider.getQuote("BEL");

  assert.equal(
    result.status,
    "unavailable"
  );

  assert.equal(
    result.reason,
    "provider_error"
  );

  assert.equal(result.quote, null);
});

test("Alpha Vantage reports no data for an empty daily series", async () => {
  mockJsonResponse({
    "Time Series (Daily)": {},
  });

  const provider =
    new AlphaVantageProvider();

  const result =
    await provider.getQuote("BEL");

  assert.equal(
    result.status,
    "unavailable"
  );

  assert.equal(
    result.reason,
    "no_data"
  );

  assert.equal(result.quote, null);
});

test("Alpha Vantage reports invalid response for invalid close value", async () => {
  const date = todayIsoDate();

  mockJsonResponse({
    "Time Series (Daily)": {
      [date]: {
        "4. close": "invalid-price",
        "5. volume": "1000",
      },
    },
  });

  const provider =
    new AlphaVantageProvider();

  const result =
    await provider.getQuote("bel");

  assert.equal(
    result.status,
    "unavailable"
  );

  assert.equal(
    result.reason,
    "invalid_response"
  );

  assert.equal(result.quote, null);

  assert.equal(
    result.lastKnownTimestamp,
    date
  );
});

test("Alpha Vantage reports stale data without exposing stale quote", async () => {
  const staleDate = "2020-01-01";

  mockJsonResponse({
    "Time Series (Daily)": {
      [staleDate]: {
        "4. close": "350.25",
        "5. volume": "1000",
      },
    },
  });

  const provider =
    new AlphaVantageProvider();

  const result =
    await provider.getQuote("BEL");

  assert.equal(
    result.status,
    "stale"
  );

  assert.equal(
    result.reason,
    "stale_data"
  );

  assert.equal(result.quote, null);

  assert.equal(
    result.lastKnownTimestamp,
    staleDate
  );
});

test("Alpha Vantage returns a valid available quote", async () => {
  const date = todayIsoDate();

  mockJsonResponse({
    "Time Series (Daily)": {
      [date]: {
        "1. open": "340.10",
        "2. high": "355.50",
        "3. low": "338.25",
        "4. close": "350.25",
        "5. volume": "123456",
      },
    },
  });

  const provider =
    new AlphaVantageProvider();

  const result =
    await provider.getQuote("bel");

  assert.equal(
    result.status,
    "available"
  );

  assert.equal(
    result.reason,
    undefined
  );

  assert.ok(result.quote);

  assert.equal(
    result.quote.symbol,
    "BEL"
  );

  assert.equal(
    result.quote.exchange,
    "BSE"
  );

  assert.equal(
    result.quote.price,
    350.25
  );

  assert.equal(
    result.quote.volume,
    123456
  );

  assert.equal(
    result.quote.timestamp,
    date
  );

  assert.equal(
    result.quote.source,
    "Alpha Vantage"
  );

  assert.equal(
    result.quote.isDelayed,
    true
  );
});

test("Alpha Vantage history filters range, skips invalid closes, and sorts ascending", async () => {
  mockJsonResponse({
    "Time Series (Daily)": {
      "2026-06-03": {
        "1. open": "103",
        "2. high": "106",
        "3. low": "102",
        "4. close": "105",
        "5. volume": "3000",
      },
      "2026-06-01": {
        "1. open": "100",
        "2. high": "103",
        "3. low": "99",
        "4. close": "102",
        "5. volume": "1000",
      },
      "2026-06-02": {
        "4. close": "invalid",
      },
      "2026-05-31": {
        "4. close": "95",
      },
    },
  });

  const provider =
    new AlphaVantageProvider();

  const result =
    await provider.getHistoricalPrices(
      "BEL",
      "2026-06-01",
      "2026-06-03"
    );

  assert.equal(result.length, 2);

  assert.equal(
    result[0].date,
    "2026-06-01"
  );

  assert.equal(
    result[0].close,
    102
  );

  assert.equal(
    result[1].date,
    "2026-06-03"
  );

  assert.equal(
    result[1].close,
    105
  );
});

test("Marketstack reports missing configuration", async () => {
  delete process.env.MARKETSTACK_API_KEY;

  let fetchCalled = false;

  globalThis.fetch = async () => {
    fetchCalled = true;

    return new Response(null, {
      status: 200,
    });
  };

  const provider =
    new MarketstackProvider();

  const result =
    await provider.getQuote("BEL");

  assert.equal(
    result.status,
    "unavailable"
  );

  assert.equal(
    result.reason,
    "missing_configuration"
  );

  assert.equal(result.quote, null);

  assert.equal(fetchCalled, false);
});

test("Marketstack reports provider error for failed HTTP response", async () => {
  mockJsonResponse({}, 500);

  const provider =
    new MarketstackProvider();

  const result =
    await provider.getQuote("BEL");

  assert.equal(
    result.status,
    "unavailable"
  );

  assert.equal(
    result.reason,
    "provider_error"
  );

  assert.equal(result.quote, null);
});

test("Marketstack reports provider error when fetch throws", async () => {
  globalThis.fetch = async () => {
    throw new Error(
      "Simulated network failure"
    );
  };

  const provider =
    new MarketstackProvider();

  const result =
    await provider.getQuote("BEL");

  assert.equal(
    result.status,
    "unavailable"
  );

  assert.equal(
    result.reason,
    "provider_error"
  );

  assert.equal(result.quote, null);
});

test("Marketstack reports no data when provider returns no record", async () => {
  mockJsonResponse({
    data: [],
  });

  const provider =
    new MarketstackProvider();

  const result =
    await provider.getQuote("BEL");

  assert.equal(
    result.status,
    "unavailable"
  );

  assert.equal(
    result.reason,
    "no_data"
  );

  assert.equal(result.quote, null);
});

test("Marketstack reports invalid response for invalid close value", async () => {
  const date =
    `${todayIsoDate()}T00:00:00+0000`;

  mockJsonResponse({
    data: [
      {
        symbol: "BEL.BO",
        date,
        close: null,
      },
    ],
  });

  const provider =
    new MarketstackProvider();

  const result =
    await provider.getQuote("BEL");

  assert.equal(
    result.status,
    "unavailable"
  );

  assert.equal(
    result.reason,
    "invalid_response"
  );

  assert.equal(result.quote, null);

  assert.equal(
    result.lastKnownTimestamp,
    date
  );
});

test("Marketstack reports stale data without exposing stale quote", async () => {
  const staleDate =
    "2020-01-01T00:00:00+0000";

  mockJsonResponse({
    data: [
      {
        symbol: "BEL.BO",
        date: staleDate,
        close: 350.25,
        volume: 1000,
      },
    ],
  });

  const provider =
    new MarketstackProvider();

  const result =
    await provider.getQuote("BEL");

  assert.equal(
    result.status,
    "stale"
  );

  assert.equal(
    result.reason,
    "stale_data"
  );

  assert.equal(result.quote, null);

  assert.equal(
    result.lastKnownTimestamp,
    staleDate
  );
});

test("Marketstack returns a valid available quote", async () => {
  const date =
    `${todayIsoDate()}T00:00:00+0000`;

  mockJsonResponse({
    data: [
      {
        symbol: "BEL.BO",
        exchange: "XBOM",
        date,
        close: 350.25,
        volume: 123456,
      },
    ],
  });

  const provider =
    new MarketstackProvider();

  const result =
    await provider.getQuote("bel");

  assert.equal(
    result.status,
    "available"
  );

  assert.equal(
    result.reason,
    undefined
  );

  assert.ok(result.quote);

  assert.equal(
    result.quote.symbol,
    "BEL"
  );

  assert.equal(
    result.quote.exchange,
    "BSE"
  );

  assert.equal(
    result.quote.price,
    350.25
  );

  assert.equal(
    result.quote.volume,
    123456
  );

  assert.equal(
    result.quote.timestamp,
    date
  );

  assert.equal(
    result.quote.source,
    "Marketstack"
  );

  assert.equal(
    result.quote.isDelayed,
    true
  );
});

test("Null provider always reports missing configuration", async () => {
  const provider =
    new NullMarketDataProvider();

  const result =
    await provider.getQuote("BEL");

  assert.deepEqual(result, {
    status: "unavailable",
    quote: null,
    reason: "missing_configuration",
  });
});

test("Null provider returns empty history and no fundamentals", async () => {
  const provider =
    new NullMarketDataProvider();

  const history =
    await provider.getHistoricalPrices(
      "BEL",
      "2026-01-01",
      "2026-12-31"
    );

  const fundamentals =
    await provider.getFundamentals(
      "BEL"
    );

  assert.deepEqual(history, []);
  assert.equal(fundamentals, null);
});