"use client";

import React, { useState } from "react";
import { X, Sparkles, Send } from "lucide-react";
import confetti from "canvas-confetti";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  onGiftSent?: () => void;
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
          colors: ["#FEC401", "#FF7F00", "#0095CF", "#FFFFFF"],
        });

        showToast(
          `Đã gửi tặng ${selectedGift.name} (${formatCurrency(giftValue)}) thành công!`,
          "gold"
        );
        if (onGiftSent) onGiftSent();
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
    <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4 animate-float-up">
      <div className="w-full max-w-md rounded-[26px] glass-panel border border-[#FEC401]/30 p-6 shadow-2xl relative bg-[#0B1A2C]/95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#FEC401]/20 flex items-center justify-center text-[#FEC401] border border-[#FEC401]/40">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Tặng Quà VIP Cho Owner</h3>
            <p className="text-xs text-[#FEC401] font-semibold">100% Doanh thu gửi trực tiếp đến tác giả</p>
          </div>
        </div>

        {/* Gift Grid */}
        <div className="grid grid-cols-3 gap-2.5 my-4">
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
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? "bg-[#FEC401]/20 border-[#FEC401] text-[#FEC401] glass-gold-glow scale-105"
                    : "bg-[#183A60]/60 border-[#D4DBF5]/15 text-[#D4DBF5] hover:border-[#FEC401]/50"
                }`}
              >
                <span className="text-2xl">{g.icon}</span>
                <span className="text-xs font-bold text-white">{g.name}</span>
                <span className="text-[11px] text-[#FEC401] font-black">{formatCurrency(g.value)}</span>
              </button>
            );
          })}
        </div>

        {/* Message Input */}
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold text-[#D4DBF5]/80">
            Lời nhắn đính kèm:
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Lời chúc hoặc câu hỏi gửi riêng..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1A2C] border border-[#D4DBF5]/20 text-xs text-white placeholder:text-[#D4DBF5]/40 focus:outline-none focus:border-[#FEC401]"
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSendGift}
          disabled={isSending}
          className="w-full mt-5 py-3.5 rounded-xl font-extrabold text-sm text-darkBg bg-gradient-to-r from-[#FEC401] to-[#FF7F00] hover:opacity-95 shadow-lg shadow-[#FEC401]/30 transition transform active:scale-95 flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4 text-darkBg" />
          <span>
            {isSending ? "Đang gửi quà..." : `Tặng Ngay ${formatCurrency(customValue ? parseInt(customValue) : selectedGift.value)}`}
          </span>
        </button>
      </div>
    </div>
  );
}
