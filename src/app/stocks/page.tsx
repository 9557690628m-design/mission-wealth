"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function StocksPage() {
  const [stockSearch, setStockSearch] = useState("");

  const stockData = [
    ["HDFC Bank", "₹1,720", "18.4", "16.8%", "Strong", "hdfcbank"],
    ["TCS", "₹3,980", "29.2", "51.4%", "Strong", "tcs"],
    ["Reliance Industries", "₹2,850", "24.6", "9.8%", "Positive", "reliance"],
    ["Larsen & Toubro", "₹3,650", "31.5", "14.2%", "Positive", "lt"],
    ["Infosys", "₹1,620", "25.8", "29.6%", "Neutral", "infosys"],
  ];

  const filteredStocks = stockData.filter((stock) =>
    stock[0].toLowerCase().includes(stockSearch.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#07111f] text-white">
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-4 text-sm uppercase tracking-[0.2em] text-emerald-400">
            Stocks
          </div>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            Understand the businesses you own.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            Explore companies through business quality, financial performance,
            valuation, risk, and market behaviour.
          </p>

          <div className="mt-10 max-w-xl">
            <input
              type="text"
              placeholder="Search company..."
              value={stockSearch}
              onChange={(e) => setStockSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400/40"
            />
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="text-xs uppercase tracking-wider text-slate-500">
                Market
              </div>
              <div className="mt-3 text-2xl font-semibold">NSE / BSE</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="text-xs uppercase tracking-wider text-slate-500">
                Companies
              </div>
              <div className="mt-3 text-2xl font-semibold">Demo Universe</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="text-xs uppercase tracking-wider text-slate-500">
                Framework
              </div>
              <div className="mt-3 text-2xl font-semibold">TECH-FUNDA™</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="text-xs uppercase tracking-wider text-slate-500">
                Data
              </div>
              <div className="mt-3 text-2xl font-semibold">Illustrative</div>
            </div>
          </div>

          <div className="mt-12 overflow-hidden rounded-2xl border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead className="border-b border-white/10 bg-white/[0.03]">
                  <tr>
                    <th className="px-6 py-4 text-sm font-medium text-slate-400">
                      Company
                    </th>
                    <th className="px-6 py-4 text-sm font-medium text-slate-400">
                      Price
                    </th>
                    <th className="px-6 py-4 text-sm font-medium text-slate-400">
                      P/E
                    </th>
                    <th className="px-6 py-4 text-sm font-medium text-slate-400">
                      ROE
                    </th>
                    <th className="px-6 py-4 text-sm font-medium text-slate-400">
                      Signal
                    </th>
                    <th className="px-6 py-4 text-sm font-medium text-slate-400">
                      Research
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStocks.map((stock) => {
                    const [company, price, pe, roe, signal, slug] = stock;

                    return (
                      <tr
                        key={company}
                        className="border-b border-white/10 transition hover:bg-white/[0.05]"
                      >
                        <td className="px-6 py-5 font-medium">{company}</td>

                        <td className="px-6 py-5 text-slate-300">
                          {price}
                        </td>

                        <td className="px-6 py-5 text-slate-300">{pe}</td>

                        <td className="px-6 py-5 text-slate-300">{roe}</td>

                        <td className="px-6 py-5">
                          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                            {signal}
                          </span>
                        </td>

                        <td className="px-6 py-5">
  <Link
    href={`/stocks/${slug}`}
    className="text-xs font-medium text-slate-400 transition hover:text-white"
  >
    Research →
  </Link>
</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-6 text-xs leading-6 text-slate-500">
            Note: The figures displayed on this page are illustrative/demo
            values for website development and do not represent live market
            data or investment recommendations.
          </p>
        </section>

        <footer className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-slate-500">
            © 2026 MISSION WEALTH™. Investment Research & Advisory.
          </div>
        </footer>
      </main>
    </>
  );
}