"use client";

import React, { useState, useEffect } from "react";
import { X, Info } from "lucide-react";
import { ZxStar } from "@/components/portfolio/ZxStar";

interface IntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Popup "Giới thiệu" — thay cho việc điều hướng sang trang /landing riêng,
 * đúng nguyên tắc mọi thao tác đều trong popup, không rời trang.
 */
export function IntroModal({ isOpen, onClose }: IntroModalProps) {
  const [intro, setIntro] = useState("");
  const [fullName, setFullName] = useState("ZANGX");

  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/hero")
      .then((r) => r.json())
      .then((d) => {
        setIntro(d.intro || "");
        setFullName(d.fullName || "ZANGX");
      })
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-[24px] sm:rounded-[24px] bg-[#07111F]/98 border border-[#C9AA72]/40 p-5 sm:p-6 shadow-2xl relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#C9AA72] to-[#8B6F3F] flex items-center justify-center text-[#07111F] shadow-lg shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">Giới Thiệu</h3>
            <p className="text-xs text-[#AEBCC5]">Về Personal Hub của {fullName}</p>
          </div>
        </div>

        <p className="text-sm text-[#F4F0E8]/90 leading-relaxed whitespace-pre-line">{intro}</p>

        <div className="flex items-center gap-1.5 mt-5 pt-4 border-t border-white/10 text-[11px] text-[#AEBCC5]">
          <ZxStar className="w-3.5 h-3.5 text-[#C9AA72]" />
          <span>ZANGX · The Digital Atelier</span>
        </div>
      </div>
    </div>
  );
}
