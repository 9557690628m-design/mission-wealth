import type {
  MarketCandle,
  MarketCandleSeries,
} from "./types";

function isFiniteNumber(
  value: unknown
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

function isValidIsoTimestamp(
  value: string
): boolean {
  const timestamp =
    Date.parse(value);

  return !Number.isNaN(
    timestamp
  );
}

export function isValidMarketCandle(
  candle: MarketCandle
): boolean {
  if (
    !candle.symbol ||
    !candle.symbol.trim()
  ) {
    return false;
  }

  if (
    !candle.source ||
    !candle.source.trim()
  ) {
    return false;
  }

  if (
    !isValidIsoTimestamp(
      candle.timestamp
    )
  ) {
    return false;
  }

  if (
    !isFiniteNumber(
      candle.open
    ) ||
    !isFiniteNumber(
      candle.high
    ) ||
    !isFiniteNumber(
      candle.low
    ) ||
    !isFiniteNumber(
      candle.close
    )
  ) {
    return false;
  }

  if (
    candle.open <= 0 ||
    candle.high <= 0 ||
    candle.low <= 0 ||
    candle.close <= 0
  ) {
    return false;
  }

  if (
    candle.high <
      candle.low
  ) {
    return false;
  }

  if (
    candle.high <
      candle.open ||
    candle.high <
      candle.close
  ) {
    return false;
  }

  if (
    candle.low >
      candle.open ||
    candle.low >
      candle.close
  ) {
    return false;
  }

  if (
    candle.volume !== null &&
    (
      !isFiniteNumber(
        candle.volume
      ) ||
      candle.volume < 0
    )
  ) {
    return false;
  }

  return true;
}

export function isValidMarketCandleSeries(
  series: MarketCandleSeries
): boolean {
  if (
    !series.symbol ||
    !series.symbol.trim()
  ) {
    return false;
  }

  if (
    !series.source ||
    !series.source.trim()
  ) {
    return false;
  }

  if (
    !isValidIsoTimestamp(
      series.from
    ) ||
    !isValidIsoTimestamp(
      series.to
    )
  ) {
    return false;
  }

  if (
    Date.parse(
      series.from
    ) >
    Date.parse(
      series.to
    )
  ) {
    return false;
  }

  for (
    const candle of
    series.candles
  ) {
    if (
      !isValidMarketCandle(
        candle
      )
    ) {
      return false;
    }

    if (
      candle.symbol
        .trim()
        .toUpperCase() !==
      series.symbol
        .trim()
        .toUpperCase()
    ) {
      return false;
    }

    if (
      candle.exchange !==
      series.exchange
    ) {
      return false;
    }

    if (
      candle.interval !==
      series.interval
    ) {
      return false;
    }

    if (
      candle.source !==
      series.source
    ) {
      return false;
    }

    if (
      candle.adjusted !==
      series.adjusted
    ) {
      return false;
    }
  }

  return true;
}