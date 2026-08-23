"use client";

import React, { useState } from "react";
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
    <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4 animate-float-up">
      <div className="w-full max-w-md rounded-[24px] glass-panel border border-[#D4DBF5]/20 p-6 shadow-2xl relative bg-[#0B1A2C]/95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Đã Gửi Thành Công!</h3>
            <p className="text-xs text-[#D4DBF5]/80">
              Chủ sở hữu (Owner) đã nhận được thông báo tức thì và sẽ liên hệ lại với bạn.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-extrabold text-white pr-8">
              {getTitle()}
            </h3>

            {payload?.productName && (
              <div className="p-3 rounded-xl bg-[#183A60]/60 border border-[#D4DBF5]/10 text-xs text-[#D4DBF5]">
                <span className="text-white/60">Sản phẩm:</span>{" "}
                <strong className="text-white">{payload.productName}</strong>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#D4DBF5]/70 font-semibold mb-1">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1A2C] border border-[#D4DBF5]/20 text-white focus:outline-none focus:border-[#0095CF]"
                />
              </div>

              <div>
                <label className="block text-[#D4DBF5]/70 font-semibold mb-1">
                  Số điện thoại / Zalo *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0901234567"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1A2C] border border-[#D4DBF5]/20 text-white focus:outline-none focus:border-[#0095CF]"
                />
              </div>

              <div>
                <label className="block text-[#D4DBF5]/70 font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1A2C] border border-[#D4DBF5]/20 text-white focus:outline-none focus:border-[#0095CF]"
                />
              </div>

              <div>
                <label className="block text-[#D4DBF5]/70 font-semibold mb-1">
                  Ghi chú thêm / Portfolio link
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Thông điệp thêm..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1A2C] border border-[#D4DBF5]/20 text-white focus:outline-none focus:border-[#0095CF] resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-darkBg bg-gradient-to-r from-[#FF7F00] to-[#FEC401] hover:opacity-95 transition shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-darkBg" />
              <span>{isSubmitting ? "Đang xử lý..." : "Xác Nhận Gửi"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
