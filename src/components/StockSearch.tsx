// src/components/StockSearch.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const stockData = [
  {
    symbol: "hdfcbank",
    company: "HDFC Bank",
    price: "₹1,720",
    pe: "18.4",
    roe: "16.8%",
    signal: "Strong",
  },
  {
    symbol: "tcs",
    company: "TCS",
    price: "₹3,980",
    pe: "29.2",
    roe: "51.4%",
    signal: "Strong",
  },
  {
    symbol: "reliance",
    company: "Reliance Industries",
    price: "₹2,850",
    pe: "24.6",
    roe: "9.8%",
    signal: "Positive",
  },
  {
    symbol: "lt",
    company: "Larsen & Toubro",
    price: "₹3,650",
    pe: "31.5",
    roe: "14.2%",
    signal: "Positive",
  },
  {
    symbol: "infosys",
    company: "Infosys",
    price: "₹1,620",
    pe: "25.8",
    roe: "29.6%",
    signal: "Neutral",
  },
];

export default function StockSearch() {
  const [stockSearch, setStockSearch] = useState("");
  const router = useRouter();

  // Search by either company name or ticker symbol
  const filteredStocks = stockData.filter(
    (stock) =>
      stock.company.toLowerCase().includes(stockSearch.toLowerCase()) ||
      stock.symbol.toLowerCase().includes(stockSearch.toLowerCase())
  );

  // Allow pressing Enter to analyze any ticker directly
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && stockSearch.trim()) {
      e.preventDefault();
      router.push(`/stocks/${encodeURIComponent(stockSearch.trim().toLowerCase())}`);
    }
  };

  return (
    <>
      {/* Search Box */}
      <div className="w-full md:w-80">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
          <div className="text-xs uppercase tracking-wider text-slate-500">
            Search Stock
          </div>

          <div className="mt-1 flex items-center justify-between">
            <input
              id="stock-search"
              type="text"
              value={stockSearch}
              onChange={(e) => setStockSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search or type ticker + Enter"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
            {stockSearch.trim() && (
              <button
                onClick={() =>
                  router.push(`/stocks/${encodeURIComponent(stockSearch.trim().toLowerCase())}`)
                }
                className="ml-2 rounded bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-300 hover:bg-white/20 hover:text-white"
              >
                Go
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
        {/* Table Header */}
        <div className="hidden grid-cols-6 border-b border-white/10 bg-white/[0.04] px-6 py-4 text-xs uppercase tracking-wider text-slate-500 md:grid">
          <div className="col-span-2">Company</div>
          <div>Price</div>
          <div>P/E</div>
          <div>ROE</div>
          <div>TECH-FUNDA</div>
        </div>

        {/* Stock Rows */}
        {filteredStocks.length > 0 ? (
          filteredStocks.map(({ symbol, company, price, pe, roe, signal }) => (
            <div
              key={company}
              className="grid gap-4 border-b border-white/10 px-6 py-5 transition last:border-b-0 hover:bg-white/[0.05] md:grid-cols-6 md:items-center"
            >
              <div className="md:col-span-2">
                <div className="font-semibold text-white">{company}</div>
                <div className="mt-1 text-xs text-slate-500">NSE • Equity</div>
              </div>

              <div>
                <div className="text-sm font-medium text-white">{price}</div>
                <div className="mt-1 text-xs text-emerald-400">+1.24%</div>
              </div>

              <div className="text-sm text-slate-300">{pe}</div>

              <div className="text-sm text-slate-300">{roe}</div>

              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-xs font-medium text-emerald-300">
                  {signal}
                </span>

                <Link
                  href={`/stocks/${symbol}`}
                  className="text-xs font-medium text-slate-400 transition hover:text-white"
                >
                  Research →
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-400">
              No preset found for &ldquo;{stockSearch}&rdquo;.
            </p>
            <button
              onClick={() =>
                router.push(`/stocks/${encodeURIComponent(stockSearch.trim().toLowerCase())}`)
              }
              className="mt-3 inline-flex items-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20"
            >
              Run Deep Analysis on &ldquo;{stockSearch.toUpperCase()}&rdquo; →
            </button>
          </div>
        )}
      </div>
    </>
  );
}