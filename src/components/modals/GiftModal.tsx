"use client";

import React, { useState, useEffect } from "react";
import { X, QrCode, Copy, Check, Heart, Sparkles, Building, CreditCard, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  onGiftSent?: (giftValue: number) => void;
}

const PRESET_AMOUNTS = [
  { label: "50k", value: 50000, desc: "☕ Cà phê sáng" },
  { label: "100k", value: 100000, desc: "⚡ Sáng tạo" },
  { label: "200k", value: 200000, desc: "🍽️ Tiếp sức" },
  { label: "500k", value: 500000, desc: "👑 Bảo trợ VIP" },
];

export function GiftModal({ isOpen, onClose, postId, onGiftSent }: GiftModalProps) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [bankInfo, setBankInfo] = useState({
    bankId: "MB",
    bankName: "MBBank (Ngân Hàng Quân Đội)",
    accountNo: "0901234567",
    accountName: "TRUONG HOANG LAM",
  });

  const [selectedAmount, setSelectedAmount] = useState<number>(100000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [transferMessage, setTransferMessage] = useState<string>("ZANGX UNG HO");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/admin/cms?section=all")
        .then((r) => r.json())
        .then((d) => {
          if (d.data?.bankInfo) {
            setBankInfo(d.data.bankInfo);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentAmount = customAmount
    ? Math.max(0, parseInt(customAmount.replace(/\D/g, "") || "0", 10))
    : selectedAmount;

  // VietQR Dynamic Image URL
  const qrUrl = `https://img.vietqr.io/image/${bankInfo.bankId}-${bankInfo.accountNo}-compact2.png?amount=${currentAmount}&addInfo=${encodeURIComponent(transferMessage.trim() || "ZANGX UNG HO")}&accountName=${encodeURIComponent(bankInfo.accountName)}`;

  const copyToClipboard = (text: string, fieldName: string) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedField(fieldName);
        showToast(`Đã sao chép ${fieldName}!`, "success");
        setTimeout(() => setCopiedField(null), 2000);
      });
    } else {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopiedField(fieldName);
        showToast(`Đã sao chép ${fieldName}!`, "success");
        setTimeout(() => setCopiedField(null), 2000);
      } catch {
        showToast("Không thể sao chép tự động", "error");
      }
    }
  };

  const handleConfirmTransfer = async () => {
    if (currentAmount <= 0) {
      showToast("Vui lòng chọn hoặc nhập số tiền ủng hộ", "error");
      return;
    }

    setIsConfirming(true);

    try {
      if (user) {
        await fetch("/api/gifts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId: postId || "zangx-hub-atelier",
            giftType: "Mã QR Ngân Hàng",
            giftValue: currentAmount,
            message: transferMessage.trim() || "Ủng hộ xưởng sáng tạo số ZANGX",
          }),
        }).catch(() => {});
      }

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#C9AA72", "#A8F238", "#FFFFFF", "#102A43"],
      });

      showToast(`Cảm ơn bạn đã đồng hành & ủng hộ ${formatCurrency(currentAmount)} cho ZANGX!`, "gold");
      if (onGiftSent) onGiftSent(currentAmount);
      setTimeout(() => {
        setIsConfirming(false);
        onClose();
      }, 1200);
    } catch {
      showToast("Cảm ơn bạn đã ủng hộ xưởng ZANGX!", "gold");
      setIsConfirming(false);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-float-up"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[92vh] rounded-t-[28px] sm:rounded-[28px] bg-[#07111F]/98 border border-[#C9AA72]/40 p-5 sm:p-6 shadow-2xl relative overflow-y-auto custom-slim-scroll flex flex-col gap-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag bar */}
        <div
          className="w-10 h-1 rounded-full bg-white/20 mx-auto -mt-1 mb-1 shrink-0 sm:hidden cursor-pointer"
          onClick={onClose}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
          title="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#C9AA72] to-[#8B6F3F] flex items-center justify-center text-[#07111F] shadow-lg shrink-0">
            <QrCode className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black tracking-wide text-white">Ủng Hộ & Đồng Hành Cùng ZANGX</h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#C9AA72]/20 text-[#C9AA72] border border-[#C9AA72]/30">
                VIETQR
              </span>
            </div>
            <p className="text-xs text-[#AEBCC5]">Tiếp sức cho xưởng sáng tạo số & các dự án độc bản</p>
          </div>
        </div>

        {/* VietQR Showcase Box */}
        <div className="flex flex-col items-center justify-center py-2 px-3 rounded-2xl bg-[#030914] border border-[#C9AA72]/20">
          <div className="relative p-2.5 rounded-2xl bg-white shadow-[0_0_30px_rgba(201,170,114,0.25)] border-2 border-[#C9AA72]/50">
            <img
              src={qrUrl}
              alt="Mã VietQR Ngân Hàng MBBank"
              className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg"
              loading="eager"
            />
          </div>
          <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-[#C9AA72] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A8F238]" />
            <span>Quét bằng app của bất kỳ ngân hàng nào tại Việt Nam</span>
          </div>
        </div>

        {/* Quick Amount Selector */}
        <div>
          <label className="block text-xs font-bold text-[#AEBCC5] mb-1.5">
            Chọn mức ủng hộ:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_AMOUNTS.map((item) => {
              const isSelected = selectedAmount === item.value && !customAmount;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(item.value);
                    setCustomAmount("");
                  }}
                  className={`py-2 px-1 rounded-xl text-center border transition-all transform active:scale-95 ${
                    isSelected
                      ? "bg-[#C9AA72] border-[#C9AA72] text-[#07111F] font-black shadow-[0_0_15px_rgba(201,170,114,0.4)]"
                      : "bg-[#102A43]/50 border-white/10 text-white hover:border-[#C9AA72]/40"
                  }`}
                >
                  <div className="text-xs font-extrabold">{item.label}</div>
                  <div className={`text-[9px] truncate ${isSelected ? "text-[#07111F]/90 font-bold" : "text-[#AEBCC5]"}`}>
                    {item.desc}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Amount Input */}
          <div className="mt-2 flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={customAmount}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setCustomAmount(val ? Number(val).toLocaleString("vi-VN") : "");
                }}
                placeholder="Nhập số tiền khác (VNĐ)..."
                className="w-full px-3 py-2 rounded-xl bg-[#102A43]/60 border border-white/15 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9AA72]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#AEBCC5] font-bold">
                đ
              </span>
            </div>
            {customAmount && (
              <button
                type="button"
                onClick={() => setCustomAmount("")}
                className="px-2.5 py-2 text-xs text-[#AEBCC5] hover:text-white"
              >
                Hủy
              </button>
            )}
          </div>
        </div>

        {/* Bank Details Card with One-Click Copy */}
        <div className="space-y-2 p-3 rounded-2xl bg-[#102A43]/30 border border-white/10 text-xs">
          {/* Ngân hàng */}
          <div className="flex items-center justify-between">
            <span className="text-[#AEBCC5] flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#C9AA72]" />
              Ngân hàng:
            </span>
            <span className="font-bold text-white">{bankInfo.bankName}</span>
          </div>

          {/* Chủ tài khoản */}
          <div className="flex items-center justify-between">
            <span className="text-[#AEBCC5] flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#C9AA72]" />
              Chủ tài khoản:
            </span>
            <span className="font-bold text-[#C9AA72] tracking-wider">{bankInfo.accountName}</span>
          </div>

          {/* Số tài khoản */}
          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <span className="text-[#AEBCC5]">Số tài khoản:</span>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-white tracking-widest">{bankInfo.accountNo}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(bankInfo.accountNo, "Số tài khoản")}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#C9AA72]/20 hover:bg-[#C9AA72]/30 text-[#C9AA72] text-[11px] font-bold border border-[#C9AA72]/40 transition"
              >
                {copiedField === "Số tài khoản" ? (
                  <>
                    <Check className="w-3 h-3 text-[#A8F238]" />
                    <span className="text-[#A8F238]">Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Sao chép</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Lời nhắn / Nội dung CK */}
          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <span className="text-[#AEBCC5]">Nội dung:</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={transferMessage}
                onChange={(e) => setTransferMessage(e.target.value)}
                className="w-32 sm:w-40 px-2 py-0.5 rounded bg-[#07111F] border border-white/20 text-white font-mono text-[11px] focus:outline-none focus:border-[#C9AA72]"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(transferMessage, "Nội dung chuyển khoản")}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#C9AA72]/20 hover:bg-[#C9AA72]/30 text-[#C9AA72] text-[11px] font-bold border border-[#C9AA72]/40 transition"
              >
                {copiedField === "Nội dung chuyển khoản" ? (
                  <>
                    <Check className="w-3 h-3 text-[#A8F238]" />
                    <span className="text-[#A8F238]">Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Sao chép</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleConfirmTransfer}
          disabled={isConfirming}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#C9AA72] to-[#8B6F3F] text-[#07111F] font-black text-sm flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(201,170,114,0.35)] hover:opacity-95 active:scale-98 transition transform"
        >
          <Heart className="w-4 h-4 fill-current" />
          <span>
            {isConfirming
              ? "Đang ghi nhận..."
              : `Tôi Đã Chuyển Khoản ${formatCurrency(currentAmount)}`}
          </span>
        </button>
      </div>
    </div>
  );
}
