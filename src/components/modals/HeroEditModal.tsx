"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { MediaPicker } from "@/components/ui/MediaPicker";

interface HeroSlide {
  id: string;
  mediaUrl: string;
  mediaType: "image" | "video";
}

interface HeroEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function HeroEditModal({ isOpen, onClose, onSaved }: HeroEditModalProps) {
  const { showToast } = useToast();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [intro, setIntro] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/hero")
      .then((r) => r.json())
      .then((d) => {
        setSlides(d.slides || []);
        setIntro(d.intro || "");
      })
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  const addSlide = () => setSlides((prev) => [...prev, { id: `slide-${Date.now()}`, mediaUrl: "", mediaType: "image" }]);
  const updateSlide = (id: string, patch: Partial<HeroSlide>) =>
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const removeSlide = (id: string) => setSlides((prev) => prev.filter((s) => s.id !== id));

  const handleSave = async () => {
    const validSlides = slides.filter((s) => s.mediaUrl.trim());
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides: validSlides, intro }),
      });
      if (res.ok) {
        showToast("Đã lưu phần đầu trang!", "success");
        onSaved();
      } else {
        showToast("Không thể lưu", "error");
      }
    } catch {
      showToast("Lỗi kết nối khi lưu", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const inputCls =
    "w-full px-3 py-2 rounded-xl bg-[#07111F] border border-[#F4F0E8]/20 text-sm text-white placeholder:text-[#F4F0E8]/40 focus:outline-none focus:border-[#C9AA72]";

  return (
    <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg max-h-[88vh] rounded-t-[28px] sm:rounded-[28px] glass-panel border border-[#C9AA72]/30 p-5 flex flex-col shadow-2xl bg-[#07111F]/98 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#F4F0E8]/15 shrink-0">
          <h3 className="text-sm font-extrabold text-white">Quản Lý Đầu Trang</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-slim-scroll py-3 space-y-4">
          <p className="text-[11px] text-[#F4F0E8]/50">Đổi ảnh đại diện (avatar) tại trang Quản Trị → tab Hồ Sơ.</p>

          <div>
            <label className="block text-xs font-semibold text-[#F4F0E8]/80 mb-1.5">Giới thiệu ngắn về Personal Hub</label>
            <textarea value={intro} onChange={(e) => setIntro(e.target.value)} rows={3} className={inputCls} placeholder="Personal Hub là..." />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#F4F0E8]/80">Slide ảnh / video đầu trang</label>
              <button
                type="button"
                onClick={addSlide}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#C9AA72]/20 text-[#C9AA72] border border-[#C9AA72]/30 hover:bg-[#C9AA72]/30 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm slide
              </button>
            </div>

            {slides.map((slide) => (
              <div key={slide.id} className="p-3 rounded-xl bg-[#102A43]/60 border border-[#F4F0E8]/15 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <select
                    value={slide.mediaType}
                    onChange={(e) => updateSlide(slide.id, { mediaType: e.target.value as "image" | "video" })}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#07111F] border border-[#F4F0E8]/20 text-xs text-white focus:outline-none focus:border-[#C9AA72]"
                  >
                    <option value="image">Ảnh</option>
                    <option value="video">Video</option>
                  </select>
                  <button type="button" onClick={() => removeSlide(slide.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <MediaPicker label="" value={slide.mediaUrl} onChange={(url) => updateSlide(slide.id, { mediaUrl: url })} placeholder="URL hoặc tải lên..." />
              </div>
            ))}

            {slides.length === 0 && <p className="text-xs text-[#F4F0E8]/50 text-center py-4">Chưa có slide nào.</p>}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full mt-3 py-3.5 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-[#C9AA72] to-[#102A43] hover:opacity-95 shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Đang lưu..." : "Lưu Thay Đổi"}</span>
        </button>
      </div>
    </div>
  );
}
