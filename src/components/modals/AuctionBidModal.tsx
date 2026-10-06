"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X, Gavel, Clock, TrendingUp } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";
import { AuctionCardMeta } from "@/lib/types";

interface BidRow {
  id?: string;
  bidderName: string;
  amount: number;
  createdAt: string;
}

interface AuctionBidModalProps {
  isOpen: boolean;
  onClose: () => void;
  postCardId: string;
  meta: AuctionCardMeta;
}

export function AuctionBidModal({ isOpen, onClose, postCardId, meta }: AuctionBidModalProps) {
  const { showToast } = useToast();
  const [bids, setBids] = useState<BidRow[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [now, setNow] = useState(Date.now());

  const highest = bids[0];
  const minNext = highest ? Number(highest.amount) + meta.minIncrement : meta.startingPrice;
  const ended = useMemo(() => new Date(meta.endsAt).getTime() < now, [meta.endsAt, now]);

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    fetch(`/api/bids?postCardId=${postCardId}`)
      .then((r) => r.json())
      .then((d) => setBids(d.bids || []))
      .catch(() => {});

    const socket: Socket = io({ path: "/socket.io", transports: ["websocket", "polling"] });
    socket.on("new_bid", (data: any) => {
      if (data?.postCardId !== postCardId) return;
      setBids((prev) => [{ bidderName: data.bidderName, amount: data.amount, createdAt: data.createdAt }, ...prev]);
    });
    return () => {
      socket.disconnect();
    };
  }, [isOpen, postCardId]);

  useEffect(() => {
    if (isOpen) setAmount(String(minNext));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, bids.length]);

  if (!isOpen) return null;

  const timeLeft = Math.max(0, new Date(meta.endsAt).getTime() - now);
  const days = Math.floor(timeLeft / 86400000);
  const hours = Math.floor((timeLeft / 3600000) % 24);
  const minutes = Math.floor((timeLeft / 60000) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      showToast("Vui lòng nhập họ tên và số điện thoại", "error");
      return;
    }
    const amt = parseInt(amount.replace(/\D/g, "") || "0", 10);
    if (amt < minNext) {
      showToast(`Giá đặt phải từ ${formatCurrency(minNext)} trở lên`, "error");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postCardId, bidderName: name.trim(), bidderPhone: phone.trim(), amount: amt }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Đã đặt giá thành công!", "success");
      } else {
        showToast(data.error || "Không thể đặt giá", "error");
      }
    } catch {
      showToast("Lỗi kết nối máy chủ", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-[#030810] backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-float-up" onClick={onClose}>
      <div
        className="w-full max-w-md max-h-[90vh] rounded-t-[28px] sm:rounded-[28px] bg-[#07111F]/98 border border-[#E879F9]/40 p-5 shadow-2xl relative overflow-y-auto custom-slim-scroll flex flex-col gap-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto -mt-1 mb-1 shrink-0 sm:hidden cursor-pointer" onClick={onClose} />
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E879F9] to-[#8B6F3F] flex items-center justify-center text-[#07111F] shadow-lg shrink-0">
            <Gavel className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">{meta.itemName}</h3>
            <p className="text-xs text-[#AEBCC5]">Đấu giá realtime</p>
          </div>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-2 text-xs text-[#AEBCC5]">
          <Clock className="w-3.5 h-3.5 text-[#E879F9]" />
          {ended ? (
            <span className="font-bold text-red-400">Đã kết thúc</span>
          ) : (
            <span>
              Còn lại {days}ng {hours}h {minutes}p {seconds}s
            </span>
          )}
        </div>

        {/* Current price */}
        <div className="p-4 rounded-2xl bg-[#102A43]/50 border border-[#E879F9]/20 text-center">
          <p className="text-[11px] uppercase tracking-wider text-[#AEBCC5] font-bold">
            {ended ? "Giá thắng cuộc" : "Giá hiện tại"}
          </p>
          <p className="text-2xl font-black text-[#E879F9] mt-1">{formatCurrency(highest ? highest.amount : meta.startingPrice)}</p>
          {highest && (
            <p className="text-xs text-[#F4F0E8]/70 mt-1">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              Đang dẫn đầu: <strong>{highest.bidderName}</strong>
            </p>
          )}
        </div>

        {/* Bid form */}
        {!ended ? (
          <form onSubmit={handleBid} className="space-y-2">
            <div>
              <label className="block text-[11px] font-semibold text-[#AEBCC5] mb-0.5">Họ và tên *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A" className="w-full px-3 py-2 rounded-xl bg-[#07111F] border border-[#F4F0E8]/20 text-xs text-white focus:outline-none focus:border-[#E879F9]" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#AEBCC5] mb-0.5">Số điện thoại / Zalo *</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0901234567" className="w-full px-3 py-2 rounded-xl bg-[#07111F] border border-[#F4F0E8]/20 text-xs text-white focus:outline-none focus:border-[#E879F9]" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#AEBCC5] mb-0.5">Giá đặt (tối thiểu {formatCurrency(minNext)})</label>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                inputMode="numeric"
                className="w-full px-3 py-2 rounded-xl bg-[#07111F] border border-[#F4F0E8]/20 text-sm font-bold text-white focus:outline-none focus:border-[#E879F9]"
              />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-xl font-black text-sm text-[#07111F] bg-gradient-to-r from-[#E879F9] to-[#C9AA72] hover:opacity-95 shadow-lg transition transform active:scale-95">
              {isSubmitting ? "Đang gửi..." : "Đặt Giá Ngay"}
            </button>
          </form>
        ) : (
          <p className="text-xs text-center text-[#F4F0E8]/70">
            {highest
              ? `${highest.bidderName} đã thắng với giá ${formatCurrency(highest.amount)}. ZANGX sẽ liên hệ xác nhận thanh toán.`
              : "Không có ai đặt giá."}
          </p>
        )}

        {/* Bid history */}
        {bids.length > 0 && (
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[#AEBCC5] font-bold mb-1.5">Lịch sử trả giá</p>
            <div className="space-y-1 max-h-[140px] overflow-y-auto custom-slim-scroll pr-1">
              {bids.map((b, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#102A43]/40 border border-white/5">
                  <span className="text-[#F4F0E8]/90">{b.bidderName}</span>
                  <span className="font-bold text-[#E879F9]">{formatCurrency(b.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
