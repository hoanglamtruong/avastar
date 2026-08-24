"use client";

import React, { useState, useRef } from "react";
import { X, Plus, Trash2, Send } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { PostCategory, CardType } from "@/lib/types";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

interface CardDraft {
  cardType: CardType;
  mediaUrl: string;
  docContent: string;
  metadataText: string;
}

const CATEGORIES: PostCategory[] = [
  "store", "event", "diary", "job", "work", "dating", "training", "sop",
];

const CARD_TYPES: CardType[] = [
  "image", "video", "doc", "store", "event", "job", "work", "dating", "training", "sop",
];

function emptyCard(): CardDraft {
  return { cardType: "image", mediaUrl: "", docContent: "", metadataText: "{}" };
}

export function CreatePostModal({ isOpen, onClose, onCreated }: CreatePostModalProps) {
  const { showToast } = useToast();
  const [category, setCategory] = useState<PostCategory>("diary");
  const [caption, setCaption] = useState("");
  const [cards, setCards] = useState<CardDraft[]>([emptyCard()]);
  const [isSending, setIsSending] = useState(false);

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

  const updateCard = (idx: number, patch: Partial<CardDraft>) => {
    setCards((prev) => prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  };

  const addCard = () => setCards((prev) => [...prev, emptyCard()]);
  const removeCard = (idx: number) =>
    setCards((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev));

  const handleSubmit = async () => {
    let parsedCards;
    try {
      parsedCards = cards.map((c) => ({
        cardType: c.cardType,
        mediaUrl: c.mediaUrl.trim() || undefined,
        docContent: c.docContent.trim() || undefined,
        cardMetadata: c.metadataText.trim() ? JSON.parse(c.metadataText) : {},
      }));
    } catch {
      showToast("JSON Metadata không hợp lệ", "error");
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          caption: caption.trim() || undefined,
          cards: parsedCards,
        }),
      });

      if (res.ok) {
        showToast("Đã tạo bài viết mới thành công!", "success");
        onCreated();
        onClose();
      } else {
        const err = await res.json();
        showToast(err.error || "Không thể tạo bài viết", "error");
      }
    } catch {
      showToast("Lỗi kết nối", "error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-float-up"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[55vh] h-auto rounded-t-[28px] sm:rounded-[28px] glass-panel border border-[#0095CF]/30 p-4 sm:p-5 flex flex-col justify-between shadow-2xl relative bg-[#0B1A2C]/98 overflow-y-auto custom-slim-scroll space-y-3"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 rounded-full bg-white/30 mx-auto -mt-1 mb-1 shrink-0 sm:hidden cursor-pointer" onClick={onClose} />

        <div className="flex items-center justify-between pb-2 border-b border-[#D4DBF5]/15">
          <h3 className="text-sm sm:text-base font-extrabold text-white">Tạo Bài Viết Mới (Owner)</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category selector */}
        <div>
          <label className="block text-[11px] font-semibold text-[#D4DBF5]/80 mb-1">Chuyên mục:</label>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase shrink-0 transition ${
                  category === cat
                    ? "bg-[#0095CF] text-white shadow-md shadow-[#0095CF]/30"
                    : "bg-[#183A60] text-[#D4DBF5]/70 hover:bg-[#183A60]/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Caption */}
        <div>
          <label className="block text-[11px] font-semibold text-[#D4DBF5]/80 mb-1">Mô tả / Caption:</label>
          <textarea
            rows={2}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Nhập thông điệp bài viết..."
            className="w-full px-3 py-2 rounded-xl bg-[#0B1A2C] border border-[#D4DBF5]/20 text-xs text-white placeholder:text-[#D4DBF5]/40 focus:outline-none focus:border-[#0095CF] resize-none"
          />
        </div>

        {/* Cards list */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-[#D4DBF5]/80">Danh sách Card ({cards.length}):</label>
            <button
              type="button"
              onClick={addCard}
              className="px-2 py-1 rounded-lg text-[10px] font-bold bg-[#0095CF]/20 text-[#0095CF] hover:bg-[#0095CF]/30 transition flex items-center gap-1 border border-[#0095CF]/40"
            >
              <Plus className="w-3 h-3" /> Thêm Card
            </button>
          </div>

          {cards.map((c, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-[#183A60]/40 border border-[#D4DBF5]/10 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-[#FEC401]">Thẻ #{idx + 1}</span>
                {cards.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCard(idx)}
                    className="p-1 rounded text-rose-400 hover:bg-rose-500/20 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-[#D4DBF5]/70 mb-0.5">Loại thẻ:</label>
                  <select
                    value={c.cardType}
                    onChange={(e) => updateCard(idx, { cardType: e.target.value as CardType })}
                    className="w-full px-2 py-1.5 rounded-lg bg-[#0B1A2C] border border-[#D4DBF5]/20 text-xs text-white"
                  >
                    {CARD_TYPES.map((t) => (
                      <option key={t} value={t}>{t.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-[#D4DBF5]/70 mb-0.5">Media URL:</label>
                  <input
                    type="text"
                    value={c.mediaUrl}
                    onChange={(e) => updateCard(idx, { mediaUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-2 py-1.5 rounded-lg bg-[#0B1A2C] border border-[#D4DBF5]/20 text-xs text-white"
                  />
                </div>
              </div>

              {c.cardType === "doc" && (
                <div>
                  <label className="block text-[10px] text-[#D4DBF5]/70 mb-0.5">Nội dung văn bản (Markdown):</label>
                  <textarea
                    rows={3}
                    value={c.docContent}
                    onChange={(e) => updateCard(idx, { docContent: e.target.value })}
                    placeholder="# Tiêu đề..."
                    className="w-full px-2 py-1.5 rounded-lg bg-[#0B1A2C] border border-[#D4DBF5]/20 text-xs text-white"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isSending}
          className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#0095CF] to-[#183A60] hover:opacity-95 shadow-lg shadow-[#0095CF]/30 transition transform active:scale-95 flex items-center justify-center gap-2 border border-[#D4DBF5]/20"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSending ? "Đang xuất bản..." : "Đăng Bài Viết Ngay"}</span>
        </button>
      </div>
    </div>
  );
}
