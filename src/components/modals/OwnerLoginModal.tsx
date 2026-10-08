"use client";

import React, { useState } from "react";
import { X, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";

const OWNER_EMAIL = "zang@zeebee.vn";

interface OwnerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Cổng đăng nhập Owner ẩn — mở bằng cách nhấn giữ avatar đầu trang (xem
 * HeroProfile.tsx), không hiện nút công khai như member. Email cố định về
 * tài khoản Trưởng xưởng, chỉ cần nhập đúng mật khẩu.
 */
export function OwnerLoginModal({ isOpen, onClose }: OwnerLoginModalProps) {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setIsLoading(true);
    const success = await login(OWNER_EMAIL, password);
    setIsLoading(false);
    if (success) {
      showToast("Đã đăng nhập Trưởng xưởng!", "success");
      setPassword("");
      onClose();
    } else {
      showToast("Mật khẩu không chính xác", "error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-float-up"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs rounded-[24px] glass-panel border border-[#C9AA72]/30 p-5 shadow-2xl relative bg-[#07111F]/98"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-1 pt-1 mb-4">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-[#C9AA72]/20 border border-[#C9AA72]/40 text-[#C9AA72] mb-1">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-white">Đăng Nhập Trưởng Xưởng</h3>
          <p className="text-[10px] text-[#F4F0E8]/60">Khu vực riêng — chỉ Owner</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3" autoComplete="on">
          {/* Input email ẩn để trình duyệt mobile ghép đúng mật khẩu đã lưu cho
              CHÍNH tài khoản Owner — tránh tự gợi ý/điền nhầm mật khẩu của tài
              khoản khác khi form chỉ có mỗi 1 ô password. */}
          <input type="email" value={OWNER_EMAIL} readOnly autoComplete="username" className="hidden" tabIndex={-1} aria-hidden="true" />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              autoFocus
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              name="owner-password"
              autoComplete="current-password"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              className="w-full px-3 py-2 pr-9 rounded-xl bg-[#102A43]/60 border border-[#F4F0E8]/20 text-sm text-white text-center tracking-widest focus:outline-none focus:border-[#C9AA72]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#F4F0E8]/50 hover:text-[#C9AA72] transition"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl font-bold text-xs text-[#07111F] bg-gradient-to-r from-[#C9AA72] to-[#8B6F3F] hover:opacity-95 shadow-lg transition transform active:scale-95"
          >
            {isLoading ? "Đang xác thực..." : "Xác Nhận"}
          </button>
        </form>
      </div>
    </div>
  );
}
