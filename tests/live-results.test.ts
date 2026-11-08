import assert from "node:assert/strict";
import test from "node:test";

import {
  getLiveQuarterlyResultsProvider,
  getLiveQuarterlyResultsProviderSymbols,
  registerLiveQuarterlyResultsProvider,
} from "../src/lib/financials/live/provider-registry";

import {
  loadLiveQuarterlyResults,
} from "../src/lib/financials/live/live-results";

test(
  "generic live-results registry exposes BEL provider",
  () => {
    const provider =
      getLiveQuarterlyResultsProvider(
        "BEL"
      );

    assert.ok(provider);

    assert.equal(
      provider.symbol,
      "BEL"
    );
  }
);

test(
  "generic live-results registry normalizes symbol lookup",
  () => {
    const provider =
      getLiveQuarterlyResultsProvider(
        " bel "
      );

    assert.ok(provider);

    assert.equal(
      provider.symbol,
      "BEL"
    );
  }
);

test(
  "generic live-results registry includes BEL coverage",
  () => {
    assert.ok(
      getLiveQuarterlyResultsProviderSymbols()
        .includes("BEL")
    );
  }
);

test(
  "uses universal NSE fallback for symbol without specific provider",
  async () => {
    let requestedSymbol =
      "";

    const result =
      await loadLiveQuarterlyResults(
        " itc ",
        {
          limit: 2,
        },
        {
          async loadUniversalResults(
            symbol
          ) {
            requestedSymbol =
              symbol;

            return {
              results: [],
              discoveredCount: 14,
              parsedCount: 0,
            };
          },
        }
      );

    assert.equal(
      requestedSymbol,
      "ITC"
    );

    assert.equal(
      result.discoveredCount,
      14
    );
  }
);

test(
  "specific provider is preferred when it returns results",
  async () => {
    registerLiveQuarterlyResultsProvider({
      symbol:
        "SPECIFIC",

      async load() {
        return {
          results: [
            {
              symbol:
                "SPECIFIC",

              periodEnd:
                "2026-09-30",

              currency:
                "INR",

              source:
                "Specific Provider",
            },
          ],

          discoveredCount: 1,
          parsedCount: 1,
        };
      },
    });

    let universalCalled =
      false;

    const result =
      await loadLiveQuarterlyResults(
        "SPECIFIC",
        {},
        {
          async loadUniversalResults() {
            universalCalled =
              true;

            return {
              results: [],
              discoveredCount: 0,
              parsedCount: 0,
            };
          },
        }
      );

    assert.equal(
      result.results.length,
      1
    );

    assert.equal(
      result.results[0].source,
      "Specific Provider"
    );

    assert.equal(
      universalCalled,
      false
    );
  }
);

test(
  "falls back to universal provider when specific provider returns no results",
  async () => {
    registerLiveQuarterlyResultsProvider({
      symbol:
        "EMPTY",

      async load() {
        return {
          results: [],
          discoveredCount: 1,
          parsedCount: 0,
        };
      },
    });

    let universalCalled =
      false;

    const result =
      await loadLiveQuarterlyResults(
        "EMPTY",
        {},
        {
          async loadUniversalResults(
            symbol
          ) {
            universalCalled =
              true;

            return {
              results: [
                {
                  symbol,

                  periodEnd:
                    "2026-09-30",

                  currency:
                    "INR",

                  source:
                    "NSE Integrated Filing",
                },
              ],

              discoveredCount: 5,
              parsedCount: 1,
            };
          },
        }
      );

    assert.equal(
      universalCalled,
      true
    );

    assert.equal(
      result.results.length,
      1
    );

    assert.equal(
      result.results[0].source,
      "NSE Integrated Filing"
    );
  }
);

test(
  "falls back to universal provider when specific provider throws",
  async () => {
    registerLiveQuarterlyResultsProvider({
      symbol:
        "BROKEN",

      async load() {
        throw new Error(
          "Provider failed"
        );
      },
    });

    const result =
      await loadLiveQuarterlyResults(
        "BROKEN",
        {},
        {
          async loadUniversalResults(
            symbol
          ) {
            return {
              results: [
                {
                  symbol,

                  periodEnd:
                    "2026-09-30",

                  currency:
                    "INR",

                  source:
                    "NSE Integrated Filing",
                },
              ],

              discoveredCount: 3,
              parsedCount: 1,
            };
          },
        }
      );

    assert.equal(
      result.results.length,
      1
    );

    assert.equal(
      result.results[0].symbol,
      "BROKEN"
    );
  }
);

test(
  "returns empty result when universal provider fails",
  async () => {
    const result =
      await loadLiveQuarterlyResults(
        "UNSUPPORTED",
        {},
        {
          async loadUniversalResults() {
            throw new Error(
              "NSE unavailable"
            );
          },
        }
      );

    assert.deepEqual(
      result,
      {
        results: [],
        discoveredCount: 0,
        parsedCount: 0,
      }
    );
  }
);

test(
  "blank symbol returns empty result without calling universal provider",
  async () => {
    let universalCalled =
      false;

    const result =
      await loadLiveQuarterlyResults(
        "   ",
        {},
        {
          async loadUniversalResults() {
            universalCalled =
              true;

            return {
              results: [],
              discoveredCount: 0,
              parsedCount: 0,
            };
          },
        }
      );

    assert.deepEqual(
      result,
      {
        results: [],
        discoveredCount: 0,
        parsedCount: 0,
      }
    );

    assert.equal(
      universalCalled,
      false
    );
  }
);

test(
  "provider registry accepts additional providers",
  async () => {
    registerLiveQuarterlyResultsProvider({
      symbol: "TEST",

      async load() {
        return {
          results: [],
          discoveredCount: 1,
          parsedCount: 0,
        };
      },
    });

    const provider =
      getLiveQuarterlyResultsProvider(
        "test"
      );

    assert.ok(provider);

    const result =
      await provider.load();

    assert.equal(
      result.discoveredCount,
      1
    );

    assert.equal(
      result.parsedCount,
      0
    );
  }
);