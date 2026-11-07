"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";

interface StockSearchResult {
  symbol: string;
  companyName: string;

  nseSymbol?: string;
  bseCode?: string;
  isin?: string;

  sector?: string;
  industry?: string;

  slug: string;
  source: string;
}

interface StockSearchResponse {
  results: StockSearchResult[];
  source: string;
  totalNseSecurities?: number;
}

export default function StockSearch() {
  const [query, setQuery] =
    useState("");

  const [results, setResults] =
    useState<
      StockSearchResult[]
    >([]);

  const [isOpen, setIsOpen] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [hasSearched, setHasSearched] =
    useState(false);

  const containerRef =
    useRef<HTMLDivElement>(
      null
    );

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  useEffect(() => {
    const trimmedQuery =
      query.trim();

    if (!trimmedQuery) {
      setResults([]);
      setIsLoading(false);
      setHasSearched(false);
      return;
    }

    const controller =
      new AbortController();

    const timer =
      window.setTimeout(
        async () => {
          setIsLoading(true);

          try {
            const response =
              await fetch(
                `/api/stocks/search?q=${encodeURIComponent(
                  trimmedQuery
                )}`,
                {
                  signal:
                    controller.signal,

                  headers: {
                    Accept:
                      "application/json",
                  },
                }
              );

            if (!response.ok) {
              throw new Error(
                `Search request failed with HTTP ${response.status}`
              );
            }

            const data =
              (await response.json()) as StockSearchResponse;

            setResults(
              Array.isArray(
                data.results
              )
                ? data.results
                : []
            );

            setHasSearched(true);
          } catch (error) {
            if (
              error instanceof DOMException &&
              error.name ===
                "AbortError"
            ) {
              return;
            }

            setResults([]);
            setHasSearched(true);
          } finally {
            if (
              !controller
                .signal
                .aborted
            ) {
              setIsLoading(false);
            }
          }
        },
        300
      );

    return () => {
      window.clearTimeout(
        timer
      );

      controller.abort();
    };
  }, [query]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-xl"
    >
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(
              event.target.value
            );

            setIsOpen(true);
          }}
          onFocus={() =>
            setIsOpen(true)
          }
          placeholder="Search NSE/BSE symbol, scrip code, or company..."
          autoComplete="off"
          className="w-full rounded-xl border border-white/10 bg-[#06101d] px-4 py-3 pl-11 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
        />

        <svg
          className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {isOpen &&
        query.trim().length >
          0 && (
          <div className="absolute left-0 right-0 z-50 mt-2 max-h-96 overflow-y-auto rounded-xl border border-white/10 bg-[#06101d] p-2 shadow-2xl backdrop-blur-md">
            {isLoading ? (
              <div className="p-4 text-center text-xs text-slate-400">
                Searching listed
                companies...
              </div>
            ) : results.length >
              0 ? (
              results.map(
                (stock) => {
                  const exchangeLabel =
                    stock.nseSymbol &&
                    stock.bseCode
                      ? "NSE / BSE"
                      : stock.nseSymbol
                        ? "NSE"
                        : stock.bseCode
                          ? "BSE"
                          : "Listed";

                  return (
                    <Link
                      key={
                        stock.isin ??
                        `${stock.symbol}-${stock.bseCode ?? ""}`
                      }
                      href={`/stocks/${stock.slug}`}
                      onClick={() =>
                        setIsOpen(
                          false
                        )
                      }
                      className="flex items-center justify-between gap-4 rounded-lg p-2.5 transition hover:bg-white/5"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-emerald-400">
                            {
                              stock.symbol
                            }
                          </span>

                          <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                            {
                              exchangeLabel
                            }
                          </span>

                          {stock.bseCode && (
                            <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
                              BSE:{" "}
                              {
                                stock.bseCode
                              }
                            </span>
                          )}
                        </div>

                        <div className="mt-1 truncate text-xs text-slate-400">
                          {
                            stock.companyName
                          }
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {stock.industry && (
                          <div className="text-[10px] text-slate-500">
                            {
                              stock.industry
                            }
                          </div>
                        )}

                        {stock.sector && (
                          <div className="text-[10px] text-slate-600">
                            {
                              stock.sector
                            }
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                }
              )
            ) : hasSearched ? (
              <div className="p-4 text-center">
                <p className="text-xs text-slate-400">
                  No listed match
                  found for
                  &quot;{query}
                  &quot;.
                </p>
              </div>
            ) : null}
          </div>
        )}
    </div>
  );
}