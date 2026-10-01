"use client";

import React, { useRef, useState } from "react";
import { Gift, MessageSquare, Share2, ChevronLeft, ChevronRight } from "lucide-react";

interface ActionRailProps {
  giftValue?: number;
  commentCount?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGift: () => void;
  onComment: () => void;
  onShare: () => void;
}

/**
 * Cột nút thao tác của khách (C2O: tặng quà, bình luận riêng; C2C: chia sẻ).
 * Nằm dọc ở mép phải màn hình, kéo sang phải để thu lại, bấm tay nắm để mở ra.
 */
export function ActionRail({ giftValue, commentCount, open, onOpenChange, onGift, onComment, onShare }: ActionRailProps) {
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
        className="mb-8 flex h-14 w-6 shrink-0 items-center justify-center rounded-l-xl glass-pill text-white/80 hover:text-[#0095CF] transition"
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
        className={`flex flex-col items-center gap-3.5 pl-1 pr-2.5 sm:pr-6 py-3 rounded-l-2xl bg-[#0B1A2C]/70 backdrop-blur-xl border border-r-0 border-[#D4DBF5]/15 shadow-2xl ${
          dragging ? "cursor-grabbing" : ""
        }`}
      >
        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={onGift}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#FEC401] to-[#FF7F00] flex items-center justify-center shadow-2xl glass-gold-glow animate-pulse-gold transform active:scale-90 transition"
            title="Tặng Quà VIP"
          >
            <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B1A2C]" />
          </button>
          <span className="text-[10px] font-black text-[#FEC401] drop-shadow text-center">
            {giftValue ? `${Math.round(giftValue / 1000)}k` : "Tặng Quà"}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={onComment}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full glass-panel text-white flex items-center justify-center hover:text-[#0095CF] hover:border-[#0095CF] shadow-xl transform active:scale-90 transition border border-[#D4DBF5]/20"
            title="Bình Luận 1-1 Riêng Tư"
          >
            <MessageSquare className="w-5 h-5 text-[#0095CF]" />
          </button>
          <span className="text-[10px] font-bold text-white drop-shadow text-center">{commentCount || "Bình luận"}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={onShare}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full glass-panel text-white flex items-center justify-center hover:text-[#0095CF] hover:border-[#0095CF] shadow-xl transform active:scale-90 transition border border-[#D4DBF5]/20"
            title="Chia sẻ"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <span className="text-[10px] font-bold text-[#D4DBF5]/80 drop-shadow text-center">Chia sẻ</span>
        </div>
      </div>
    </div>
  );
}
