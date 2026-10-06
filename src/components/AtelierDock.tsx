"use client";

import React from "react";
import { SlidersHorizontal, Home, User } from "lucide-react";

interface AtelierDockProps {
  onOpenFilter: () => void;
  onGoHome: () => void;
  onOpenAuth: () => void;
  currentUser?: { fullName: string; avatarUrl?: string | null; role: string } | null;
}

/**
 * Thanh điều hướng nổi dưới cùng — chỉ còn đúng 3 nút theo yêu cầu:
 * Lọc (mở khung lọc/tìm kiếm dạng popup), Home (về đầu bảng tin + bỏ lọc),
 * Đăng nhập/Đăng ký. Donate không còn là nút riêng ở đây — mỗi thẻ thương
 * mại tự gắn hành động phù hợp (xem PostDetailModal). 4 lối tắt sang trang
 * con cũ và nút chat chung đã bỏ vì các trang con đã gộp hết vào bảng tin.
 */
export function AtelierDock({ onOpenFilter, onGoHome, onOpenAuth, currentUser }: AtelierDockProps) {
  return (
    <nav
      aria-label="Atelier Dynamic Dock"
      className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 select-none max-w-[96vw]"
    >
      <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#07111F]/85 backdrop-blur-2xl border border-[#C9AA72]/35 shadow-[0_12px_40px_rgba(0,0,0,0.7)] transition-all hover:border-[#C9AA72]/60">
        <button
          type="button"
          onClick={onOpenFilter}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[#AEBCC5] hover:text-white hover:bg-white/5 transition-all transform active:scale-95"
          title="Lọc / Tìm kiếm"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline text-xs font-bold">Lọc</span>
        </button>

        <div className="w-[1px] h-5 bg-white/15" aria-hidden="true" />

        <button
          type="button"
          onClick={onGoHome}
          className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#C9AA72] to-[#8B6F3F] text-[#07111F] shadow-lg transform active:scale-90 hover:scale-105 transition"
          title="Về Trang Chủ"
          aria-label="Về Trang Chủ"
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="w-[1px] h-5 bg-white/15" aria-hidden="true" />

        <button
          type="button"
          onClick={onOpenAuth}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[#AEBCC5] hover:text-white hover:bg-white/5 transition-all transform active:scale-95"
          title={currentUser ? currentUser.fullName : "Đăng Nhập / Đăng Ký"}
        >
          {currentUser ? (
            <img
              src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
              className="w-5 h-5 rounded-full object-cover border border-[#C9AA72]/40"
              alt=""
            />
          ) : (
            <User className="w-4 h-4" />
          )}
          <span className="hidden sm:inline text-xs font-bold">{currentUser ? currentUser.fullName.split(" ").pop() : "Đăng Nhập"}</span>
        </button>
      </div>
    </nav>
  );
}
