import type {
  Exchange,
} from "../types";

export type MarketInterval =
  | "1m"
  | "5m"
  | "15m"
  | "30m"
  | "1h"
  | "1d"
  | "1w"
  | "1M";

export interface MarketCandle {
  symbol: string;
  exchange: Exchange;
  interval: MarketInterval;
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number | null;
  source: string;
  adjusted: boolean;
}

export interface MarketCandleSeries {
  symbol: string;
  exchange: Exchange;
  interval: MarketInterval;
  source: string;
  adjusted: boolean;
  from: string;
  to: string;
  candles: MarketCandle[];
}

export interface MarketCandleQuery {
  symbol: string;
  exchange: Exchange;
  interval: MarketInterval;
  from: string;
  to: string;
  limit?: number;
}
