import Link from "next/link";
import { ZxNav } from "@/components/portfolio/ZxNav";
import { ZxWordmark } from "@/components/portfolio/ZxStar";
import { ZxActionRail } from "@/components/portfolio/ZxActionRail";
import "./portfolio.css";

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="zx-root fixed inset-0 z-[950] overflow-y-auto overflow-x-hidden">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Playfair+Display:wght@500;600;700&display=swap"
        precedence="default"
      />
      <header className="sticky top-0 z-10 border-b border-[var(--zx-muted)]/15 bg-[var(--zx-bg)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
          <Link href="/gioi-thieu" aria-label="ZANGX, trang giới thiệu">
            <ZxWordmark />
          </Link>
          <Link
            href="/"
            className="order-2 rounded-full border border-[var(--zx-accent)]/50 px-4 py-2 text-xs font-bold text-[var(--zx-accent)] transition-colors hover:bg-[var(--zx-accent)] hover:text-[var(--zx-bg)] sm:order-3"
          >
            Về Personal Hub
          </Link>
          <div className="order-3 w-full sm:order-2 sm:w-auto">
            <ZxNav />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">{children}</main>

      <footer className="border-t border-[var(--zx-muted)]/15">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-8 text-xs text-[var(--zx-muted)] sm:flex-row sm:items-center sm:px-6">
          <p>© {new Date().getFullYear()} ZANGX · Trương Hoàng Lam. Bảo lưu mọi quyền.</p>
          <p className="font-semibold uppercase tracking-[0.25em] text-[var(--zx-text)]">Xưởng Sáng Tạo Số</p>
        </div>
      </footer>
      <ZxActionRail />
    </div>
  );
}
