"use client";

import React, { useState } from "react";
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
      showToast("Metadata JSON không hợp lệ ở một trong các thẻ", "error");
      return;
    }
    setIsSending(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, caption, cards: parsedCards }),
      });

      if (res.ok) {
        showToast("Đã đăng bài viết mới!", "success");
        onCreated();
      } else {
        const data = await res.json();
        showToast(data.error || "Không thể đăng bài", "error");
      }
    } catch {
      showToast("Lỗi kết nối khi đăng bài", "error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-[28px] sm:rounded-[28px] glass-panel border border-[#0095CF]/30 p-5 flex flex-col shadow-2xl bg-[#0B1A2C]/98 overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-[#D4DBF5]/15 shrink-0">
          <h3 className="text-sm font-extrabold text-white">Tạo Bài Viết Mới</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-slim-scroll py-3 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#D4DBF5]/80 mb-1.5">Danh mục</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PostCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#183A60] border border-[#D4DBF5]/20 text-sm text-white focus:outline-none focus:border-[#0095CF]"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D4DBF5]/80 mb-1.5">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={2}
              placeholder="Nội dung mô tả bài viết..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1A2C] border border-[#D4DBF5]/20 text-sm text-white placeholder:text-[#D4DBF5]/40 focus:outline-none focus:border-[#0095CF]"
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#D4DBF5]/80">Thẻ nội dung (Cards)</label>
              <button
                type="button"
                onClick={addCard}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#0095CF]/20 text-[#0095CF] border border-[#0095CF]/30 hover:bg-[#0095CF]/30 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm thẻ
              </button>
            </div>

            {cards.map((card, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#183A60]/60 border border-[#D4DBF5]/15 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <select
                    value={card.cardType}
                    onChange={(e) => updateCard(idx, { cardType: e.target.value as CardType })}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#0B1A2C] border border-[#D4DBF5]/20 text-xs text-white focus:outline-none focus:border-[#0095CF]"
                  >
                    {CARD_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {cards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCard(idx)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {(card.cardType === "image" || card.cardType === "video") && (
                  <input
                    type="text"
                    value={card.mediaUrl}
                    onChange={(e) => updateCard(idx, { mediaUrl: e.target.value })}
                    placeholder="URL ảnh/video..."
                    className="w-full px-2.5 py-2 rounded-lg bg-[#0B1A2C] border border-[#D4DBF5]/20 text-xs text-white placeholder:text-[#D4DBF5]/40 focus:outline-none focus:border-[#0095CF]"
                  />
                )}

                {card.cardType === "doc" && (
                  <textarea
                    value={card.docContent}
                    onChange={(e) => updateCard(idx, { docContent: e.target.value })}
                    rows={3}
                    placeholder="Nội dung HTML thô..."
                    className="w-full px-2.5 py-2 rounded-lg bg-[#0B1A2C] border border-[#D4DBF5]/20 text-xs text-white placeholder:text-[#D4DBF5]/40 focus:outline-none focus:border-[#0095CF] font-mono"
                  />
                )}

                {!["image", "video", "doc"].includes(card.cardType) && (
                  <textarea
                    value={card.metadataText}
                    onChange={(e) => updateCard(idx, { metadataText: e.target.value })}
                    rows={3}
                    placeholder='Metadata JSON, vd: {"title":"..."}'
                    className="w-full px-2.5 py-2 rounded-lg bg-[#0B1A2C] border border-[#D4DBF5]/20 text-xs text-white placeholder:text-[#D4DBF5]/40 focus:outline-none focus:border-[#0095CF] font-mono"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSending}
          className="w-full mt-3 py-3.5 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-[#0095CF] to-[#183A60] hover:opacity-95 shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{isSending ? "Đang đăng..." : "Đăng Bài Viết"}</span>
        </button>
      </div>
    </div>
  );
}
