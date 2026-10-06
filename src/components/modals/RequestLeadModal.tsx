"use client";

import React, { useState } from "react";
import { X, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface RequestLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  postId: string;
  postCardId?: string;
  leadType: "request" | "free_claim";
}

/**
 * Form thu lead: Yêu cầu/Báo giá (request) và nhận MIỄN PHÍ cho thẻ
 * package/reservation/membership có giá 0 (free_claim). Ghi bền vững qua
 * /api/leads — khác /api/subpage-actions cũ chỉ bắn thông báo realtime, mất
 * lead nếu Owner không online lúc đó.
 */
export function RequestLeadModal({ isOpen, onClose, title, subtitle, postId, postCardId, leadType }: RequestLeadModalProps) {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      showToast("Vui lòng nhập họ tên và số điện thoại", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, postCardId, leadType, name, phone, email, note }),
      });
      if (res.ok) {
        setIsSuccess(true);
        showToast("Đã gửi thông tin thành công!", "success");
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 1800);
      } else {
        showToast("Có lỗi xảy ra khi gửi thông tin", "error");
      }
    } catch {
      showToast("Lỗi kết nối máy chủ", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-float-up" onClick={onClose}>
      <div
        className="w-full max-w-md max-h-[70vh] rounded-t-[24px] sm:rounded-[24px] glass-panel border border-[#F4F0E8]/20 p-4 sm:p-5 shadow-2xl relative bg-[#07111F]/98 overflow-y-auto custom-slim-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-white/30 mx-auto -mt-1 mb-2 shrink-0 sm:hidden cursor-pointer" onClick={onClose} />
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition">
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="py-6 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Đã Gửi Thành Công!</h3>
            <p className="text-xs text-[#F4F0E8]/80">ZANGX đã nhận được thông tin và sẽ liên hệ lại sớm nhất.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <h3 className="text-sm sm:text-base font-extrabold text-white pr-6">{title}</h3>
            {subtitle && <p className="text-xs text-[#F4F0E8]/70">{subtitle}</p>}

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[#F4F0E8]/70 font-semibold mb-0.5 text-[11px]">Họ và tên *</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A" className="w-full px-3 py-2 rounded-xl bg-[#07111F] border border-[#F4F0E8]/20 text-xs text-white focus:outline-none focus:border-[#C9AA72]" />
              </div>
              <div>
                <label className="block text-[#F4F0E8]/70 font-semibold mb-0.5 text-[11px]">Số điện thoại / Zalo *</label>
                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0901234567" className="w-full px-3 py-2 rounded-xl bg-[#07111F] border border-[#F4F0E8]/20 text-xs text-white focus:outline-none focus:border-[#C9AA72]" />
              </div>
              <div>
                <label className="block text-[#F4F0E8]/70 font-semibold mb-0.5 text-[11px]">Email (không bắt buộc)</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ban@email.com" className="w-full px-3 py-2 rounded-xl bg-[#07111F] border border-[#F4F0E8]/20 text-xs text-white focus:outline-none focus:border-[#C9AA72]" />
              </div>
              <div>
                <label className="block text-[#F4F0E8]/70 font-semibold mb-0.5 text-[11px]">Mô tả yêu cầu / ghi chú</label>
                <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Chi tiết yêu cầu của bạn..." className="w-full px-3 py-2 rounded-xl bg-[#07111F] border border-[#F4F0E8]/20 text-xs text-white focus:outline-none focus:border-[#C9AA72] resize-none" />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full py-2.5 rounded-xl font-bold text-xs text-darkBg bg-gradient-to-r from-[#8B6F3F] to-[#C9AA72] hover:opacity-95 transition shadow-lg flex items-center justify-center gap-2">
              <Send className="w-3.5 h-3.5 text-darkBg" />
              <span>{isSubmitting ? "Đang xử lý..." : "Gửi Yêu Cầu"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
