"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Heart, ChevronLeft, ChevronRight, Info, Package, FolderKanban } from "lucide-react";

interface ActionRailProps {
  giftValue?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGift: () => void;
}

const ZANGX_LINKS = [
  { href: "/gioi-thieu", label: "Về Zangx", Icon: Info },
  { href: "/san-pham", label: "Sản phẩm", Icon: Package },
  { href: "/du-an", label: "Dự án", Icon: FolderKanban },
] as const;

/**
 * Cột nút thao tác của khách (C2O: donate; điều hướng sang trang Zangx).
 * Nằm dọc ở mép phải màn hình, kéo sang phải để thu lại, bấm tay nắm để mở ra.
 */
export function ActionRail({ giftValue, open, onOpenChange, onGift }: ActionRailProps) {
  const startX = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
    setDragging(true);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current !== null) {
      const dx = e.clientX - startX.current;
      if (dx > 28) onOpenChange(false);
      if (dx < -28) onOpenChange(true);
    }
    startX.current = null;
    setDragging(false);
  };

  return (
    <div
      className={`fixed right-0 bottom-6 sm:bottom-20 z-40 flex items-end select-none transition-transform duration-300 ease-out motion-reduce:transition-none ${
        open ? "translate-x-0" : "translate-x-[calc(100%-1.5rem)]"
      }`}
      data-testid="hub-action-rail"
      data-open={open}
    >
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-label={open ? "Thu cột thao tác" : "Mở cột thao tác"}
        aria-expanded={open}
        className="mb-8 flex h-14 w-6 shrink-0 items-center justify-center rounded-l-xl glass-pill text-white/80 hover:text-[#C9AA72] transition"
      >
        {open ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <div
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          startX.current = null;
          setDragging(false);
        }}
        style={{ touchAction: "pan-y" }}
        className={`flex flex-col items-center gap-3.5 pl-1 pr-2.5 sm:pr-6 py-3 rounded-l-2xl bg-[#07111F]/70 backdrop-blur-xl border border-r-0 border-[#F4F0E8]/15 shadow-2xl ${
          dragging ? "cursor-grabbing" : ""
        }`}
      >
        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={onGift}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#C9AA72] to-[#8B6F3F] flex items-center justify-center shadow-2xl glass-gold-glow animate-pulse-gold transform active:scale-90 transition"
            title="Donate cho chủ trang"
          >
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[#07111F]" />
          </button>
          <span className="text-[10px] font-black text-[#C9AA72] drop-shadow text-center">
            {giftValue ? `${Math.round(giftValue / 1000)}k` : "Donate"}
          </span>
        </div>

        <div className="w-7 border-t border-[#F4F0E8]/15 my-0.5" aria-hidden="true" />

        {ZANGX_LINKS.map(({ href, label, Icon }) => (
          <div key={href} className="flex flex-col items-center gap-1">
            <Link
              href={href}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full glass-panel text-white flex items-center justify-center hover:text-[#C9AA72] hover:border-[#C9AA72] shadow-xl transform active:scale-90 transition border border-[#F4F0E8]/20"
              title={label}
            >
              <Icon className="w-5 h-5" />
            </Link>
            <span className="text-[9px] font-bold text-[#F4F0E8]/70 drop-shadow text-center leading-tight">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
