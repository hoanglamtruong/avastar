"use client";

import React, { useState, useEffect } from "react";
import { X, QrCode, Copy, Check, Building, CreditCard, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";

interface VietQRPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  itemLabel: string;
  amount: number;
  transferMessageSeed: string;
  requireContact?: boolean; // true: bắt buộc họ tên + SĐT (đơn hàng/giữ chỗ/thành viên)
  onConfirm: (contact: { name: string; phone: string }) => Promise<void> | void;
}

/**
 * Khung thanh toán VietQR dùng chung cho mọi luồng cần chuyển khoản thật:
 * Mua ngay (package), Giữ chỗ có cọc (reservation), Đăng ký thành viên
 * (membership). Donate (GiftModal) có luồng riêng vì gắn trực tiếp vào
 * user đang đăng nhập, không cần thu họ tên/SĐT.
 */
export function VietQRPaymentModal({
  isOpen,
  onClose,
  title,
  itemLabel,
  amount,
  transferMessageSeed,
  requireContact = true,
  onConfirm,
}: VietQRPaymentModalProps) {
  const { showToast } = useToast();

  const [bankInfo, setBankInfo] = useState({
    bankId: "MB",
    bankName: "MBBank (Ngân Hàng Quân Đội)",
    accountNo: "0901234567",
    accountName: "TRUONG HOANG LAM",
  });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/admin/cms?section=all")
        .then((r) => r.json())
        .then((d) => {
          if (d.data?.bankInfo) setBankInfo(d.data.bankInfo);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const qrUrl = `https://img.vietqr.io/image/${bankInfo.bankId}-${bankInfo.accountNo}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(
    transferMessageSeed
  )}&accountName=${encodeURIComponent(bankInfo.accountName)}`;

  const copyToClipboard = (text: string, fieldName: string) => {
    const done = () => {
      setCopiedField(fieldName);
      showToast(`Đã sao chép ${fieldName}!`, "success");
      setTimeout(() => setCopiedField(null), 2000);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => showToast("Không thể sao chép", "error"));
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
        done();
      } catch {
        showToast("Không thể sao chép tự động", "error");
      }
    }
  };

  const handleConfirm = async () => {
    if (requireContact && (!name.trim() || !phone.trim())) {
      showToast("Vui lòng nhập họ tên và số điện thoại", "error");
      return;
    }
    setIsConfirming(true);
    try {
      await onConfirm({ name: name.trim(), phone: phone.trim() });
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#C9AA72", "#A8F238", "#FFFFFF", "#102A43"],
      });
      showToast("Đã ghi nhận! ZANGX sẽ liên hệ xác nhận sớm nhất.", "gold");
      setTimeout(() => {
        setIsConfirming(false);
        onClose();
      }, 1200);
    } catch {
      showToast("Có lỗi khi ghi nhận, vui lòng thử lại", "error");
      setIsConfirming(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] bg-[#030810] backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-float-up"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[92vh] rounded-t-[28px] sm:rounded-[28px] bg-[#07111F]/98 border border-[#C9AA72]/40 p-5 sm:p-6 shadow-2xl relative overflow-y-auto custom-slim-scroll flex flex-col gap-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto -mt-1 mb-1 shrink-0 sm:hidden cursor-pointer" onClick={onClose} />
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition" title="Đóng">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#C9AA72] to-[#8B6F3F] flex items-center justify-center text-[#07111F] shadow-lg shrink-0">
            <QrCode className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black tracking-wide text-white">{title}</h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#C9AA72]/20 text-[#C9AA72] border border-[#C9AA72]/30">VIETQR</span>
            </div>
            <p className="text-xs text-[#AEBCC5]">{itemLabel}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-2 px-3 rounded-2xl bg-[#030914] border border-[#C9AA72]/20">
          <div className="relative p-2.5 rounded-2xl bg-white shadow-[0_0_30px_rgba(201,170,114,0.25)] border-2 border-[#C9AA72]/50">
            <img src={qrUrl} alt="Mã VietQR" className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg" loading="eager" />
          </div>
          <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-[#C9AA72] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A8F238]" />
            <span>Quét bằng app của bất kỳ ngân hàng nào tại Việt Nam</span>
          </div>
          <div className="mt-2 text-lg font-black text-[#C9AA72]">{formatCurrency(amount)}</div>
        </div>

        <div className="space-y-2 p-3 rounded-2xl bg-[#102A43]/30 border border-white/10 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#AEBCC5] flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-[#C9AA72]" />Ngân hàng:</span>
            <span className="font-bold text-white">{bankInfo.bankName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#AEBCC5] flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-[#C9AA72]" />Chủ tài khoản:</span>
            <span className="font-bold text-[#C9AA72] tracking-wider">{bankInfo.accountName}</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <span className="text-[#AEBCC5]">Số tài khoản:</span>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-white tracking-widest">{bankInfo.accountNo}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(bankInfo.accountNo, "Số tài khoản")}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#C9AA72]/20 hover:bg-[#C9AA72]/30 text-[#C9AA72] text-[11px] font-bold border border-[#C9AA72]/40 transition"
              >
                {copiedField === "Số tài khoản" ? (<><Check className="w-3 h-3 text-[#A8F238]" /><span className="text-[#A8F238]">Đã chép</span></>) : (<><Copy className="w-3 h-3" /><span>Sao chép</span></>)}
              </button>
            </div>
          </div>
        </div>

        {requireContact && (
          <div className="space-y-2">
            <div>
              <label className="block text-[11px] font-semibold text-[#AEBCC5] mb-1">Họ và tên *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A" className="w-full px-3 py-2 rounded-xl bg-[#102A43]/60 border border-white/15 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9AA72]" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#AEBCC5] mb-1">Số điện thoại / Zalo *</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0901234567" className="w-full px-3 py-2 rounded-xl bg-[#102A43]/60 border border-white/15 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9AA72]" />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleConfirm}
          disabled={isConfirming}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#C9AA72] to-[#8B6F3F] text-[#07111F] font-black text-sm flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(201,170,114,0.35)] hover:opacity-95 active:scale-98 transition transform disabled:opacity-60"
        >
          <span>{isConfirming ? "Đang ghi nhận..." : `Tôi Đã Chuyển Khoản ${formatCurrency(amount)}`}</span>
        </button>
      </div>
    </div>
  );
}
