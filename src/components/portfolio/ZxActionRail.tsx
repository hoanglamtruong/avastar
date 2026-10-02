"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { PORTFOLIO_NAV } from "@/lib/portfolio-content";
import { Info, Briefcase, Package, FolderKanban } from "lucide-react";

const NAV_ICONS: Record<string, typeof Info> = {
  "/gioi-thieu": Info,
  "/dich-vu": Briefcase,
  "/san-pham": Package,
  "/du-an": FolderKanban,
};

/**
 * Cột thao tác của khách trên trang portfolio: xem trước, thao tác sau.
 * C2O: nhắn chủ (mở khung chat trên Personal Hub). C2C: chia sẻ trang.
 * Điều hướng: 4 trang Zangx (Giới thiệu/Dịch vụ/Sản phẩm/Dự án), thay cho
 * thanh nav ngang cũ trên header — gộp hết vào 1 cột dọc mép phải.
 * Dọc ở mép phải, kéo sang phải để thu lại, bấm tay nắm để mở ra.
 */
export function ZxActionRail() {
  const [open, setOpen] = useState(true);
  const [note, setNote] = useState("");
  const startX = useRef<number | null>(null);
  const pathname = usePathname();

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setNote("Đã chép liên kết");
    } catch {
      setNote("Không chia sẻ được, hãy chép liên kết trên thanh địa chỉ");
    }
    setTimeout(() => setNote(""), 2500);
  };

  const itemClass =
    "flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-2xl border border-[var(--zx-accent)]/40 bg-[var(--zx-surface)] text-[9px] font-bold text-[var(--zx-text)] transition-colors hover:border-[var(--zx-accent)] hover:text-[var(--zx-accent)] focus-visible:outline-none";
  const activeItemClass =
    "flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-2xl border border-[var(--zx-accent)] bg-[var(--zx-accent)] text-[9px] font-bold text-[var(--zx-bg)] transition-colors focus-visible:outline-none";

  return (
    <div
      data-testid="zx-action-rail"
      data-open={open}
      className={`fixed bottom-6 right-0 z-20 flex items-end transition-transform duration-300 ease-out motion-reduce:transition-none ${
        open ? "translate-x-0" : "translate-x-[calc(100%-1.5rem)]"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? "Thu cột thao tác" : "Mở cột thao tác"}
        className="mb-6 flex h-14 w-6 shrink-0 items-center justify-center rounded-l-xl border border-r-0 border-[var(--zx-accent)]/40 bg-[var(--zx-surface)] text-[var(--zx-accent)]"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={open ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6"} />
        </svg>
      </button>
      <div
        onPointerDown={(e) => (startX.current = e.clientX)}
        onPointerUp={(e) => {
          if (startX.current !== null) {
            const dx = e.clientX - startX.current;
            if (dx > 28) setOpen(false);
            if (dx < -28) setOpen(true);
          }
          startX.current = null;
        }}
        style={{ touchAction: "pan-y" }}
        className="flex flex-col items-center gap-2.5 rounded-l-2xl border border-r-0 border-[var(--zx-accent)]/25 bg-[var(--zx-bg)]/90 py-3 pl-2 pr-3 backdrop-blur max-h-[85dvh] overflow-y-auto no-scrollbar"
      >
        <Link href="/?chat=1" className={itemClass} title="Nhắn trực tiếp cho chủ trên Personal Hub">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
          </svg>
          Nhắn chủ
        </Link>
        <button type="button" onClick={share} className={itemClass} title="Chia sẻ trang này">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="M8.6 10.5l6.8-4M8.6 13.5l6.8 4" />
          </svg>
          Chia sẻ
        </button>

        <div className="w-8 border-t border-[var(--zx-accent)]/20 my-0.5" aria-hidden="true" />

        {PORTFOLIO_NAV.map((item) => {
          const active = pathname === item.href;
          const Icon = NAV_ICONS[item.href] ?? Info;
          return (
            <Link key={item.href} href={item.href} className={active ? activeItemClass : itemClass} title={item.label} aria-current={active ? "page" : undefined}>
              <Icon className="h-4 w-4" />
              <span className="leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
      <p role="status" aria-live="polite" className="sr-only">{note}</p>
      {note && (
        <p className="absolute bottom-full right-2 mb-2 whitespace-nowrap rounded-full bg-[var(--zx-surface)] px-3 py-1 text-[11px] font-semibold text-[var(--zx-text)] border border-[var(--zx-accent)]/30">
          {note}
        </p>
      )}
    </div>
  );
}
