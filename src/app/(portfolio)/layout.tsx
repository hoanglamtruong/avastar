import Link from "next/link";
import { ZxLogoLockup } from "@/components/portfolio/ZxStar";
import { AtelierDock } from "@/components/AtelierDock";
import "./portfolio.css";

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="zx-root fixed inset-0 z-[950] overflow-y-auto overflow-x-hidden pb-24">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Playfair+Display:wght@500;600;700&display=swap"
        precedence="default"
      />
      <header className="sticky top-0 z-10 border-b border-[var(--zx-muted)]/15 bg-[var(--zx-bg)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-x-6 px-4 py-3 sm:px-6">
          <Link href="/gioi-thieu" aria-label="ZANGX, The Digital Atelier">
            <ZxLogoLockup size="sm" />
          </Link>
          <Link
            href="/"
            className="rounded-full border border-[var(--zx-accent)]/50 px-4 py-2 text-xs font-bold text-[var(--zx-accent)] transition-colors hover:bg-[var(--zx-accent)] hover:text-[var(--zx-bg)] shadow-[0_0_15px_rgba(201,170,114,0.2)]"
          >
            Về Showroom
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">{children}</main>

      <footer className="border-t border-[var(--zx-muted)]/15">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-8 text-xs text-[var(--zx-muted)] sm:flex-row sm:items-center sm:px-6">
          <p>© {new Date().getFullYear()} ZANGX · Trương Hoàng Lam. Bảo lưu mọi quyền.</p>
          <p className="font-semibold uppercase tracking-[0.25em] text-[var(--zx-text)]">THE DIGITAL ATELIER</p>
        </div>
      </footer>
      <AtelierDock />
    </div>
  );
}
