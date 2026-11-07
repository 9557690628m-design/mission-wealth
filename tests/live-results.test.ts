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
  "generic live-results registry lists BEL coverage",
  () => {
    assert.deepEqual(
      getLiveQuarterlyResultsProviderSymbols(),
      ["BEL"]
    );
  }
);

test(
  "generic live-results loader returns empty result for unsupported symbol",
  async () => {
    const result =
      await loadLiveQuarterlyResults(
        "UNSUPPORTED"
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