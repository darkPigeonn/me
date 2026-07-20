import Link from "next/link";

export function SiteHeader({
  active,
}: {
  active?: "tulisan" | "admin";
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-xl font-extrabold text-transparent"
        >
          Atanasiu.dev
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/#about"
            className="text-slate-300 transition hover:text-white"
          >
            Beranda
          </Link>
          <Link
            href="/tulisan"
            className={
              active === "tulisan"
                ? "font-medium text-white"
                : "text-slate-300 transition hover:text-white"
            }
          >
            Tulisan
          </Link>
          {active === "admin" ? (
            <span className="rounded-lg bg-indigo-600 px-3 py-1.5 text-white">
              Admin
            </span>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
