"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { searchStockIdentities } from "@/lib/market/stocks";
import type { StockIdentity } from "@/lib/market/types";

export default function StockSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const results: StockIdentity[] = searchStockIdentities(query);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search NSE/BSE symbol, scrip code, or company..."
          className="w-full rounded-xl border border-white/10 bg-[#06101d] px-4 py-3 pl-11 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
        />
        <svg
          className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border border-white/10 bg-[#06101d] p-2 shadow-2xl backdrop-blur-md">
          {results.length > 0 ? (
            results.map((stock) => (
              <Link
                key={stock.symbol}
               href={`/stocks/${stock.slug}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between rounded-lg p-2.5 transition hover:bg-white/5"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-emerald-400">
                      {stock.symbol}
                    </span>
                    <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                    {stock.nseSymbol ? "NSE" : "BSE"}
                    </span>
                    {stock.bseCode && (
                      <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
                        BSE: {stock.bseCode}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">{stock.name}</div>
                </div>
<div className="text-right">
  <div className="text-[10px] text-slate-500">
    {stock.industry || stock.sector}
  </div>
  <div className="text-[10px] text-slate-600">
    {stock.sector}
  </div>
</div>
              </Link>
            ))
          ) : (
            <div className="p-4 text-center">
              <p className="text-xs text-slate-400">
                No indexed match for &quot;{query}&quot;.
              </p>
              {query.trim().length > 0 && (
                <Link
                  href={`/stocks/${query.trim().toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="mt-2 inline-block rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300 hover:bg-emerald-400/20"
                >
                  Analyze &quot;{query.toUpperCase()}&quot; via Dynamic Engine →
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
