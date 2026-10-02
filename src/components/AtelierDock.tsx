"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  MessageCircle,
  Info,
  Briefcase,
  Package,
  FolderKanban,
} from "lucide-react";

interface AtelierDockProps {
  onDonate?: () => void;
  onChat?: () => void;
}

const NAV_ITEMS = [
  { href: "/gioi-thieu", label: "Về Zangx", icon: Info },
  { href: "/dich-vu", label: "Dịch vụ", icon: Briefcase },
  { href: "/san-pham", label: "Sản phẩm", icon: Package },
  { href: "/du-an", label: "Dự án", icon: FolderKanban },
];

export function AtelierDock({
  onDonate,
  onChat,
}: AtelierDockProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Atelier Dynamic Dock"
      className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 select-none max-w-[96vw]"
    >
      <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#07111F]/85 backdrop-blur-2xl border border-[#C9AA72]/35 shadow-[0_12px_40px_rgba(0,0,0,0.7)] transition-all hover:border-[#C9AA72]/60">
        {/* 1. NÚT DONATE (MÃ QR NGÂN HÀNG) */}
        {onDonate ? (
          <button
            type="button"
            onClick={onDonate}
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#C9AA72] to-[#8B6F3F] text-[#07111F] shadow-lg transform active:scale-90 hover:scale-105 transition"
            title="Ủng hộ / QR Ngân hàng"
            aria-label="Ủng hộ / QR Ngân hàng"
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>
        ) : (
          <Link
            href="/?donate=1"
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#C9AA72] to-[#8B6F3F] text-[#07111F] shadow-lg transform active:scale-90 hover:scale-105 transition"
            title="Ủng hộ / QR Ngân hàng"
            aria-label="Ủng hộ / QR Ngân hàng"
          >
            <Heart className="w-4 h-4 fill-current" />
          </Link>
        )}

        {/* 2. NÚT NHẮN CHỦ (CHAT 1-1) */}
        {onChat ? (
          <button
            type="button"
            onClick={onChat}
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#102A43] border border-white/15 text-[#F4F0E8] hover:text-[#C9AA72] hover:border-[#C9AA72]/50 shadow-md transform active:scale-90 transition"
            title="Nhắn tin 1-1 với chủ xưởng"
            aria-label="Nhắn tin 1-1 với chủ xưởng"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        ) : (
          <Link
            href="/?chat=1"
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#102A43] border border-white/15 text-[#F4F0E8] hover:text-[#C9AA72] hover:border-[#C9AA72]/50 shadow-md transform active:scale-90 transition"
            title="Nhắn tin 1-1 với chủ xưởng"
            aria-label="Nhắn tin 1-1 với chủ xưởng"
          >
            <MessageCircle className="w-4 h-4" />
          </Link>
        )}

        <div className="w-[1px] h-5 bg-white/15 mx-0.5" aria-hidden="true" />

        {/* 3. LỐI TẮT SANG 4 CHUYÊN MỤC */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all transform active:scale-95 ${
                  active
                    ? "bg-[#C9AA72]/20 text-[#C9AA72] border border-[#C9AA72]/40"
                    : "text-[#AEBCC5] hover:text-white hover:bg-white/5"
                }`}
                title={item.label}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline text-[11px]">{item.label}</span>
                {active && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#A8F238] shadow-[0_0_6px_#A8F238]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
