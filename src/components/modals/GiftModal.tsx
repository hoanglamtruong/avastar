"use client";

import React, { useState, useRef } from "react";
import { X, Sparkles, Send } from "lucide-react";
import confetti from "canvas-confetti";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  onGiftSent?: (giftValue: number) => void;
}

const PRESET_GIFTS = [
  { id: "coffee", name: "Cà Phê", icon: "☕", value: 50000 },
  { id: "rose", name: "Hoa Hồng", icon: "🌹", value: 100000 },
  { id: "wine", name: "Ly Rượu", icon: "🥂", value: 200000 },
  { id: "crown", name: "Vương Miện", icon: "👑", value: 500000 },
  { id: "diamond", name: "Kim Cương", icon: "💎", value: 1000000 },
  { id: "rocket", name: "Tên Lửa VIP", icon: "🚀", value: 2000000 },
];

export function GiftModal({ isOpen, onClose, postId, onGiftSent }: GiftModalProps) {
  const { showToast } = useToast();
  const [selectedGift, setSelectedGift] = useState(PRESET_GIFTS[3]); // Default crown
  const [customValue, setCustomValue] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Swipe-down to close gesture
  const touchStartY = useRef<number>(0);
  const touchStartX = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const deltaY = touchEndY.current - touchStartY.current;
    const deltaX = touchEndX.current - touchStartX.current;
    if (deltaY > 50 && deltaY > Math.abs(deltaX)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const handleSendGift = async () => {
    const giftValue = customValue ? parseInt(customValue) : selectedGift.value;
    if (!giftValue || giftValue <= 0) {
      showToast("Vui lòng chọn hoặc nhập giá trị quà tặng", "error");
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch("/api/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          giftType: selectedGift.id,
          giftValue,
          message: message.trim() || `Tặng ${selectedGift.name} chúc mừng bài viết!`,
        }),
      });

      if (res.ok) {
        // Trigger Fullscreen Confetti Animation
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#C9AA72", "#8B6F3F", "#C9AA72", "#FFFFFF"],
        });

        showToast(
          `Đã gửi tặng ${selectedGift.name} (${formatCurrency(giftValue)}) thành công!`,
          "gold"
        );
        if (onGiftSent) onGiftSent(giftValue);
        setTimeout(onClose, 1000);
      } else {
        const data = await res.json();
        showToast(data.error || "Không thể gửi quà, vui lòng thử lại", "error");
      }
    } catch {
      showToast("Lỗi kết nối khi gửi quà", "error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-float-up"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[55vh] h-auto rounded-t-[26px] sm:rounded-[26px] glass-panel border border-[#C9AA72]/30 p-4 sm:p-5 shadow-2xl relative bg-[#07111F]/98 overflow-y-auto custom-slim-scroll flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 rounded-full bg-white/30 mx-auto -mt-1 mb-2 shrink-0 sm:hidden cursor-pointer" onClick={onClose} />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-[#C9AA72]/20 flex items-center justify-center text-[#C9AA72] border border-[#C9AA72]/40">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-white">Tặng Quà VIP Cho Owner</h3>
            <p className="text-[10px] text-[#C9AA72] font-semibold">100% Doanh thu gửi trực tiếp đến tác giả</p>
          </div>
        </div>

        {/* Gift Grid */}
        <div className="grid grid-cols-3 gap-2 my-2">
          {PRESET_GIFTS.map((g) => {
            const isSelected = selectedGift.id === g.id && !customValue;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => {
                  setSelectedGift(g);
                  setCustomValue("");
                }}
                className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center gap-0.5 ${
                  isSelected
                    ? "bg-[#C9AA72]/20 border-[#C9AA72] text-[#C9AA72] glass-gold-glow scale-102"
                    : "bg-[#102A43]/60 border-[#F4F0E8]/15 text-[#F4F0E8] hover:border-[#C9AA72]/50"
                }`}
              >
                <span className="text-xl">{g.icon}</span>
                <span className="text-[11px] font-bold text-white">{g.name}</span>
                <span className="text-[10px] text-[#C9AA72] font-black">{formatCurrency(g.value)}</span>
              </button>
            );
          })}
        </div>

        {/* Message Input */}
        <div className="space-y-1 mt-1">
          <label className="block text-[11px] font-semibold text-[#F4F0E8]/80">
            Lời nhắn đính kèm:
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Lời chúc hoặc câu hỏi gửi riêng..."
            className="w-full px-3 py-2 rounded-xl bg-[#07111F] border border-[#F4F0E8]/20 text-xs text-white placeholder:text-[#F4F0E8]/40 focus:outline-none focus:border-[#C9AA72]"
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSendGift}
          disabled={isSending}
          className="w-full mt-3 py-2.5 rounded-xl font-extrabold text-xs text-darkBg bg-gradient-to-r from-[#C9AA72] to-[#8B6F3F] hover:opacity-95 shadow-lg shadow-[#C9AA72]/30 transition transform active:scale-95 flex items-center justify-center gap-2"
        >
          <Send className="w-3.5 h-3.5 text-darkBg" />
          <span>
            {isSending ? "Đang gửi..." : `Tặng Ngay ${formatCurrency(customValue ? parseInt(customValue) : selectedGift.value)}`}
          </span>
        </button>
      </div>
    </div>
  );
}
