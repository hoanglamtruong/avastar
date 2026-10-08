"use client";

import React, { useState, useRef } from "react";
import { X, UserPlus, LogIn, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isRegister) {
      if (!fullName || !email || !password) {
        showToast("Vui lòng nhập đầy đủ họ tên, email và mật khẩu", "error");
        setIsLoading(false);
        return;
      }
      const success = await register(fullName, email, password, phone);
      if (success) {
        showToast("Đăng ký thành viên VIP thành công!", "success");
        resetForm();
        onClose();
      } else {
        showToast("Lỗi khi đăng ký — email có thể đã được dùng", "error");
      }
    } else {
      if (!email || !password) {
        showToast("Vui lòng nhập email và mật khẩu", "error");
        setIsLoading(false);
        return;
      }
      const success = await login(email, password);
      if (success) {
        showToast("Đăng nhập thành công!", "success");
        resetForm();
        onClose();
      } else {
        showToast("Email hoặc mật khẩu không đúng", "error");
      }
    }
    setIsLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-float-up"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[55vh] rounded-t-[28px] sm:rounded-[28px] glass-panel border border-[#C9AA72]/30 p-4 sm:p-5 shadow-2xl relative bg-[#07111F]/98 overflow-y-auto custom-slim-scroll space-y-3"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 rounded-full bg-white/30 mx-auto -mt-1 mb-1 shrink-0 sm:hidden cursor-pointer" onClick={onClose} />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-0.5 pt-1">
          <h3 className="text-sm font-extrabold text-white flex items-center justify-center gap-1.5">
            {isRegister ? <UserPlus className="w-4 h-4 text-[#C9AA72]" /> : <LogIn className="w-4 h-4 text-[#C9AA72]" />}
            {isRegister ? "Đăng Ký Thành Viên VIP" : "Đăng Nhập Tài Khoản"}
          </h3>
          <p className="text-[10px] text-[#F4F0E8]/70">
            Tương tác 1-1, gửi quà tặng VIP và mở khóa Box Doc độc quyền.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2 text-xs">
          {isRegister && (
            <div>
              <label className="block text-[#F4F0E8]/80 font-semibold mb-0.5 text-[11px]">Họ và tên *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Hoàng Lâm"
                className="w-full px-3 py-1.5 rounded-xl bg-[#07111F] border border-[#F4F0E8]/20 text-xs text-white focus:outline-none focus:border-[#C9AA72]"
              />
            </div>
          )}

          <div>
            <label className="block text-[#F4F0E8]/80 font-semibold mb-0.5 text-[11px]">Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@zeebee.vn"
              className="w-full px-3 py-1.5 rounded-xl bg-[#07111F] border border-[#F4F0E8]/20 text-xs text-white focus:outline-none focus:border-[#C9AA72]"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-[#F4F0E8]/80 font-semibold mb-0.5 text-[11px]">Số điện thoại</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0901234567"
                className="w-full px-3 py-1.5 rounded-xl bg-[#07111F] border border-[#F4F0E8]/20 text-xs text-white focus:outline-none focus:border-[#C9AA72]"
              />
            </div>
          )}

          <div>
            <label className="block text-[#F4F0E8]/80 font-semibold mb-0.5 text-[11px]">Mật khẩu *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                autoComplete={isRegister ? "new-password" : "current-password"}
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                className="w-full px-3 py-1.5 pr-9 rounded-xl bg-[#07111F] border border-[#F4F0E8]/20 text-xs text-white focus:outline-none focus:border-[#C9AA72]"
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
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#C9AA72] to-[#102A43] hover:opacity-95 shadow-lg shadow-[#C9AA72]/30 transition transform active:scale-95 flex items-center justify-center gap-2 mt-2 border border-[#F4F0E8]/20"
          >
            <span>{isLoading ? "Đang xử lý..." : isRegister ? "Tạo Tài Khoản VIP" : "Đăng Nhập"}</span>
          </button>
        </form>

        <div className="text-center pt-1 border-t border-[#F4F0E8]/10">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-[11px] text-[#C9AA72] hover:underline font-semibold"
          >
            {isRegister ? "Đã có tài khoản? Đăng nhập ngay" : "Chưa có tài khoản? Đăng ký Thành viên VIP"}
          </button>
        </div>
      </div>
    </div>
  );
}
