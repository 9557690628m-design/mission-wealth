"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
      const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
  href="/"
  onClick={() => setMenuOpen(false)}
  className="group"
>
          <div className="text-lg font-semibold tracking-tight text-white">
            MISSION WEALTH™
          </div>

          <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
            Investment Research & Advisory
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <Link href="/research" className="text-sm text-slate-300 transition hover:text-white">
            Research
          </Link>

          <Link href="/stocks" className="text-sm text-slate-300 transition hover:text-white">
            Stocks
          </Link>

          <Link href="/results" className="text-sm text-slate-300 transition hover:text-white">
            Results
          </Link>

          <Link href="/sectors" className="text-sm text-slate-300 transition hover:text-white">
            Sectors
          </Link>

          <Link href="/methodology" className="text-sm text-slate-300 transition hover:text-white">
            TECH-FUNDA™
          </Link>

          <Link href="/learn" className="text-sm text-slate-300 transition hover:text-white">
            Learn
          </Link>

          <Link href="/about" className="text-sm text-slate-300 transition hover:text-white">
            About
          </Link>

          <Link href="/disclosures" className="text-sm text-slate-300 transition hover:text-white">
  Disclosures
</Link>

          <Link href="/contact" className="text-sm text-slate-300 transition hover:text-white">
  Contact
</Link>
        </nav>

                {menuOpen && (
          <div className="absolute left-0 top-full w-full border-b border-white/10 bg-[#07111f] px-6 py-5 lg:hidden">
            <div className="flex flex-col gap-4">
              <Link
                href="/research"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-slate-300 hover:text-white"
              >
                Research
              </Link>

              <Link
                href="/stocks"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-slate-300 hover:text-white"
              >
                Stocks
              </Link>

              <Link
                href="/results"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-slate-300 hover:text-white"
              >
                Results
              </Link>

              <Link
                href="/sectors"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-slate-300 hover:text-white"
              >
                Sectors
              </Link>

              <Link
                href="/methodology"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-slate-300 hover:text-white"
              >
                TECH-FUNDA™
              </Link>

              <Link
                href="/learn"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-slate-300 hover:text-white"
              >
                Learn
              </Link>

              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-slate-300 hover:text-white"
              >
                About
              </Link>

              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-slate-300 hover:text-white"
              >
                Contact
              </Link>

              <Link
                href="/disclosures"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-slate-300 hover:text-white"
              >
                Disclosures
              </Link>
            </div>
          </div>
        )}

        <Link
          href="/research"
          className="hidden rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-400/15 md:block"
        >
          Explore Research
        </Link>
               <button
  type="button"
  onClick={() => setMenuOpen(!menuOpen)}
  aria-label={menuOpen ? "Close menu" : "Open menu"}
  className="rounded-lg border border-white/10 px-3 py-2 text-lg leading-none text-slate-300 hover:text-white md:hidden"
>
  {menuOpen ? "✕" : "☰"}
</button>
      </div>
    </header>
  );
}