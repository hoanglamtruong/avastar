"use client";

import React, { useState, useRef } from "react";
import { X, UserPlus, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register, switchUser } = useAuth();
  const { showToast } = useToast();
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isRegister) {
      if (!fullName || !email) {
        showToast("Vui lòng nhập họ tên và email", "error");
        setIsLoading(false);
        return;
      }
      const success = await register(fullName, email, password || "123456", phone);
      if (success) {
        showToast("Đăng ký thành viên VIP thành công!", "success");
        onClose();
      } else {
        showToast("Lỗi khi đăng ký", "error");
      }
    } else {
      if (!email) {
        showToast("Vui lòng nhập email", "error");
        setIsLoading(false);
        return;
      }
      const success = await login(email, password || "123456");
      if (success) {
        showToast("Đăng nhập thành công!", "success");
        onClose();
      } else {
        showToast("Email hoặc mật khẩu không đúng", "error");
      }
    }
    setIsLoading(false);
  };

  const handleQuickSwitch = async (role: "owner" | "member" | "guest") => {
    await switchUser(role);
    showToast(`Đã chuyển sang vai trò: ${role.toUpperCase()}`, "info");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-float-up"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[55vh] rounded-t-[28px] sm:rounded-[28px] glass-panel border border-[#0095CF]/30 p-4 sm:p-5 shadow-2xl relative bg-[#0B1A2C]/98 overflow-y-auto custom-slim-scroll space-y-3"
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
            {isRegister ? <UserPlus className="w-4 h-4 text-[#0095CF]" /> : <LogIn className="w-4 h-4 text-[#0095CF]" />}
            {isRegister ? "Đăng Ký Thành Viên VIP" : "Đăng Nhập Tài Khoản"}
          </h3>
          <p className="text-[10px] text-[#D4DBF5]/70">
            Tương tác 1-1, gửi quà tặng VIP và mở khóa Box Doc độc quyền.
          </p>
        </div>

        {/* Quick Demo Switcher */}
        <div className="p-2 rounded-xl bg-[#183A60]/60 border border-[#D4DBF5]/10 space-y-1.5">
          <p className="text-[9px] uppercase font-bold tracking-wider text-[#D4DBF5]/60 text-center">
            🚀 Chuyển đổi nhanh vai trò:
          </p>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => handleQuickSwitch("owner")}
              className="py-1.5 px-1 rounded-lg text-[10px] font-bold bg-[#FEC401]/20 text-[#FEC401] border border-[#FEC401]/40 hover:bg-[#FEC401]/30 transition"
            >
              👑 Owner
            </button>
            <button
              onClick={() => handleQuickSwitch("member")}
              className="py-1.5 px-1 rounded-lg text-[10px] font-bold bg-[#0095CF]/20 text-[#0095CF] border border-[#0095CF]/40 hover:bg-[#0095CF]/30 transition"
            >
              🌟 Member
            </button>
            <button
              onClick={() => handleQuickSwitch("guest")}
              className="py-1.5 px-1 rounded-lg text-[10px] font-bold bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 transition"
            >
              👤 Guest
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2 text-xs">
          {isRegister && (
            <div>
              <label className="block text-[#D4DBF5]/80 font-semibold mb-0.5 text-[11px]">Họ và tên *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Hoàng Lâm"
                className="w-full px-3 py-1.5 rounded-xl bg-[#0B1A2C] border border-[#D4DBF5]/20 text-xs text-white focus:outline-none focus:border-[#0095CF]"
              />
            </div>
          )}

          <div>
            <label className="block text-[#D4DBF5]/80 font-semibold mb-0.5 text-[11px]">Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@zeebee.vn"
              className="w-full px-3 py-1.5 rounded-xl bg-[#0B1A2C] border border-[#D4DBF5]/20 text-xs text-white focus:outline-none focus:border-[#0095CF]"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-[#D4DBF5]/80 font-semibold mb-0.5 text-[11px]">Số điện thoại</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0901234567"
                className="w-full px-3 py-1.5 rounded-xl bg-[#0B1A2C] border border-[#D4DBF5]/20 text-xs text-white focus:outline-none focus:border-[#0095CF]"
              />
            </div>
          )}

          <div>
            <label className="block text-[#D4DBF5]/80 font-semibold mb-0.5 text-[11px]">Mật khẩu (mặc định: 123456)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full px-3 py-1.5 rounded-xl bg-[#0B1A2C] border border-[#D4DBF5]/20 text-xs text-white focus:outline-none focus:border-[#0095CF]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#0095CF] to-[#183A60] hover:opacity-95 shadow-lg shadow-[#0095CF]/30 transition transform active:scale-95 flex items-center justify-center gap-2 mt-2 border border-[#D4DBF5]/20"
          >
            <span>{isLoading ? "Đang xử lý..." : isRegister ? "Tạo Tài Khoản VIP" : "Đăng Nhập"}</span>
          </button>
        </form>

        <div className="text-center pt-1 border-t border-[#D4DBF5]/10">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-[11px] text-[#0095CF] hover:underline font-semibold"
          >
            {isRegister ? "Đã có tài khoản? Đăng nhập ngay" : "Chưa có tài khoản? Đăng ký Thành viên VIP"}
          </button>
        </div>
      </div>
    </div>
  );
}
