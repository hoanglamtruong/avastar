"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`glass-pill px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 shadow-lg active:scale-95 ${
        theme === "dark"
          ? "hover:border-[#C9AA72] text-[#F4F0E8]"
          : "hover:border-[#9A7B44] text-[#07111F]"
      } ${className}`}
      title={
        theme === "dark"
          ? "Chuyển sang Giao diện Sáng (Ivory Canvas)"
          : "Chuyển sang Giao diện Tối (Cosmic Navy)"
      }
      aria-label="Chuyển đổi giao diện Sáng / Tối"
    >
      {theme === "dark" ? (
        <>
          <Sun className="w-3.5 h-3.5 text-[#C9AA72]" />
          <span className="hidden sm:inline">Sáng</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-[#07111F]" />
          <span className="hidden sm:inline">Tối</span>
        </>
      )}
    </button>
  );
}
