"use client";

import React, { useState, useRef } from "react";
import { X, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface SubpageActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: string;
  payload: any;
  postId?: string;
}

export function SubpageActionModal({
  isOpen,
  onClose,
  actionType,
  payload,
  postId,
}: SubpageActionModalProps) {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      showToast("Vui lòng nhập họ tên và số điện thoại", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/subpage-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionType,
          postId,
          payload: {
            ...payload,
            name,
            email,
            phone,
            note,
          },
        }),
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

  const getTitle = () => {
    switch (actionType) {
      case "order_product":
        return "Đặt Mua Sản Phẩm / Gói Bản Quyền";
      case "event_ticket":
        return "Đăng Ký Nhận Vé Tham Dự Sự Kiện";
      case "submit_cv":
        return "Nộp Hồ Sơ / Ứng Tuyển Công Việc";
      case "connect_request":
        return "Gửi Lời Mời Kết Nối Trò Chuyện Riêng";
      default:
        return "Xác Nhận Đăng Ký";
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-float-up"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[55vh] rounded-t-[24px] sm:rounded-[24px] glass-panel border border-[#D4DBF5]/20 p-4 sm:p-5 shadow-2xl relative bg-[#0B1A2C]/98 overflow-y-auto custom-slim-scroll"
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

        {isSuccess ? (
          <div className="py-6 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Đã Gửi Thành Công!</h3>
            <p className="text-xs text-[#D4DBF5]/80">
              Owner đã nhận được thông báo tức thì và sẽ phản hồi qua Chatbox 1-1.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <h3 className="text-sm sm:text-base font-extrabold text-white pr-6">
              {getTitle()}
            </h3>

            {payload?.productName && (
              <div className="p-2.5 rounded-xl bg-[#183A60]/60 border border-[#D4DBF5]/10 text-xs text-[#D4DBF5]">
                <span className="text-white/60">Sản phẩm:</span>{" "}
                <strong className="text-white">{payload.productName}</strong>
              </div>
            )}

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[#D4DBF5]/70 font-semibold mb-0.5 text-[11px]">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1A2C] border border-[#D4DBF5]/20 text-xs text-white focus:outline-none focus:border-[#0095CF]"
                />
              </div>

              <div>
                <label className="block text-[#D4DBF5]/70 font-semibold mb-0.5 text-[11px]">
                  Số điện thoại / Zalo *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0901234567"
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1A2C] border border-[#D4DBF5]/20 text-xs text-white focus:outline-none focus:border-[#0095CF]"
                />
              </div>

              <div>
                <label className="block text-[#D4DBF5]/70 font-semibold mb-0.5 text-[11px]">
                  Ghi chú thêm / Portfolio
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Thông điệp thêm..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1A2C] border border-[#D4DBF5]/20 text-xs text-white focus:outline-none focus:border-[#0095CF] resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl font-bold text-xs text-darkBg bg-gradient-to-r from-[#FF7F00] to-[#FEC401] hover:opacity-95 transition shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5 text-darkBg" />
              <span>{isSubmitting ? "Đang xử lý..." : "Xác Nhận Gửi"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
