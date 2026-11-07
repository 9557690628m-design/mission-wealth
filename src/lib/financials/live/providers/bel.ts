import {
  loadBelLiveQuarterlyResults,
} from "../../bel-live-results";

import type {
  LiveQuarterlyResultsProvider,
} from "../types";

export const belLiveQuarterlyResultsProvider:
  LiveQuarterlyResultsProvider = {
    symbol: "BEL",

    async load(options) {
      return loadBelLiveQuarterlyResults(
        options?.limit
      );
    },
  };