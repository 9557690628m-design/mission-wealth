import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />

      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#07111f] px-6 text-white">
        <section className="w-full max-w-2xl text-center">
          <div className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-400">
            MISSION WEALTH™
          </div>

          <div className="mt-8 text-7xl font-semibold tracking-tight text-white md:text-9xl">
            404
          </div>

          <h1 className="mt-6 text-3xl font-semibold tracking-tight md:text-4xl">
            Page not found
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-400 md:text-lg">
            The page you are looking for does not exist, may have moved, or is
            no longer available.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Back to Home
            </Link>

            <Link
              href="/research"
              className="rounded-lg border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/5"
            >
              Explore Research
            </Link>
          </div>

          <p className="mt-12 text-xs text-slate-500">
            Data → Evidence → Analysis → Conclusion
          </p>
        </section>
      </main>
    </>
  );
}