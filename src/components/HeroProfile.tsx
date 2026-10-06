"use client";

import React, { useState, useEffect, useRef } from "react";
import { Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { HeroEditModal } from "@/components/modals/HeroEditModal";

interface HeroSlide {
  id: string;
  mediaUrl: string;
  mediaType: "image" | "video";
}

interface HeroProfileProps {
  isOwner: boolean;
}

/**
 * Đầu trang Hub: avatar + 1 slide ảnh/video bên dưới — thay cho tiêu đề
 * marketing chung chung, vì Personal Hub mặc định chỉ có 1 chủ. Owner quản
 * lý (thêm/sửa/xóa slide) qua nút "Quản lý".
 */
export function HeroProfile({ isOwner }: HeroProfileProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState("ZANGX");
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [intro, setIntro] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = () => {
    fetch("/api/hero")
      .then((r) => r.json())
      .then((d) => {
        setAvatarUrl(d.avatarUrl);
        setFullName(d.fullName || "ZANGX");
        setSlides(d.slides || []);
        setIntro(d.intro || "");
      })
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length]);

  const current = slides[activeSlide];

  return (
    <section className="relative z-10 max-w-3xl mx-auto pt-6 pb-6 px-2">
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <img
            src={avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"}
            alt={fullName}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-[#C9AA72] shadow-[0_0_30px_rgba(201,170,114,0.3)]"
          />
          {isOwner && (
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#C9AA72] text-[#07111F] flex items-center justify-center shadow-lg hover:scale-110 transition"
              title="Quản lý ảnh đầu trang"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <h1 className="zx-serif mt-3 text-xl sm:text-2xl font-extrabold text-[#F4F0E8]">{fullName}</h1>
        {intro && <p className="mt-2 max-w-xl text-xs sm:text-sm text-[#AEBCC5] leading-relaxed">{intro}</p>}
      </div>

      {slides.length > 0 && (
        <div className="relative mt-5 rounded-2xl overflow-hidden border border-[#C9AA72]/25 bg-black/40 aspect-[16/7] max-h-[220px] sm:max-h-[260px]">
          {current.mediaType === "video" ? (
            <video src={current.mediaUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
          ) : (
            <img src={current.mediaUrl} alt="" className="w-full h-full object-cover" />
          )}
          {slides.length > 1 && (
            <>
              <button
                onClick={() => setActiveSlide((p) => (p - 1 + slides.length) % slides.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white hover:bg-[#C9AA72] hover:text-[#07111F] transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveSlide((p) => (p + 1) % slides.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white hover:bg-[#C9AA72] hover:text-[#07111F] transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {slides.map((_, i) => (
                  <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === activeSlide ? "bg-[#C9AA72]" : "bg-white/40"}`} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <HeroEditModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSaved={() => {
          load();
          setEditOpen(false);
        }}
      />
    </section>
  );
}
