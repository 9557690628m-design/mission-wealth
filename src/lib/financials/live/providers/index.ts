import {
  registerLiveQuarterlyResultsProvider,
} from "../provider-registry";

import {
  belLiveQuarterlyResultsProvider,
} from "./bel";

let registered = false;

export function registerLiveQuarterlyResultsProviders(): void {
  if (registered) {
    return;
  }

  registerLiveQuarterlyResultsProvider(
    belLiveQuarterlyResultsProvider
  );

  registered = true;
}