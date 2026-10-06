"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Save, Image as ImageIcon, Video, FileText } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { PostData, PostCategory, CardType } from "@/lib/types";
import { MediaPicker } from "@/components/ui/MediaPicker";

interface EditPostModalProps {
  post: PostData | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
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

export function EditPostModal({ post, isOpen, onClose, onUpdated }: EditPostModalProps) {
  const { showToast } = useToast();
  const [category, setCategory] = useState<PostCategory>("diary");
  const [caption, setCaption] = useState("");
  const [cards, setCards] = useState<CardDraft[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (post) {
      setCategory(post.category as PostCategory);
      setCaption(post.caption || "");
      if (post.cards && post.cards.length > 0) {
        setCards(
          post.cards.map((c) => ({
            cardType: c.cardType as CardType,
            mediaUrl: c.mediaUrl || "",
            docContent: c.docContent || "",
            metadataText: JSON.stringify(c.cardMetadata || {}, null, 2),
          }))
        );
      } else {
        setCards([{ cardType: "image", mediaUrl: "", docContent: "", metadataText: "{}" }]);
      }
    }
  }, [post]);

  if (!isOpen || !post) return null;

  const handleAddCard = () => {
    setCards((prev) => [...prev, { cardType: "image", mediaUrl: "", docContent: "", metadataText: "{}" }]);
  };

  const handleRemoveCard = (index: number) => {
    if (cards.length <= 1) {
      showToast("Bài viết cần tối thiểu 1 thẻ", "error");
      return;
    }
    setCards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCardChange = (index: number, field: keyof CardDraft, value: string) => {
    setCards((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) {
      showToast("Vui lòng nhập tiêu đề / mô tả bài viết", "error");
      return;
    }

    setIsSaving(true);
    try {
      const payloadCards = cards.map((c) => {
        let meta = {};
        try {
          meta = JSON.parse(c.metadataText || "{}");
        } catch {
          meta = {};
        }
        return {
          cardType: c.cardType,
          mediaUrl: c.mediaUrl.trim() || null,
          docContent: c.docContent.trim() || null,
          cardMetadata: meta,
        };
      });

      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          caption: caption.trim(),
          cards: payloadCards,
        }),
      });

      if (res.ok) {
        showToast("Đã cập nhật bài viết & ảnh thành công!", "success");
        onUpdated();
        onClose();
      } else {
        const err = await res.json();
        showToast(err.error || "Không thể cập nhật bài viết", "error");
      }
    } catch {
      showToast("Lỗi kết nối khi cập nhật bài viết", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1050] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-float-up"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[92vh] rounded-[28px] bg-[#07111F]/98 border border-[#C9AA72]/40 p-5 sm:p-6 shadow-2xl relative overflow-y-auto custom-slim-scroll flex flex-col gap-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span>Chỉnh Sửa Tác Phẩm & Ảnh</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#C9AA72]/20 text-[#C9AA72] border border-[#C9AA72]/40">
              {post.category}
            </span>
          </h2>
          <p className="text-xs text-[#AEBCC5]">Cập nhật nội dung, thay thế ảnh hoặc thêm các thẻ trình chiếu</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Category */}
          <div className="space-y-1">
            <label className="font-bold text-[#AEBCC5]">Chuyên mục:</label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase transition ${
                    category === cat
                      ? "bg-[#C9AA72] text-[#07111F] shadow"
                      : "bg-[#102A43] text-[#AEBCC5] hover:text-white border border-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Caption */}
          <div className="space-y-1">
            <label className="font-bold text-[#AEBCC5]">Mô tả / Tiêu đề tác phẩm:</label>
            <textarea
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Nhập tiêu đề hoặc lời bình..."
              className="w-full px-3 py-2 rounded-xl bg-[#102A43]/50 border border-white/15 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9AA72]"
            />
          </div>

          {/* Cards Manager */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#C9AA72]">
                Danh sách thẻ trình chiếu ({cards.length}):
              </label>
              <button
                type="button"
                onClick={handleAddCard}
                className="px-2.5 py-1 rounded-lg bg-[#C9AA72]/20 hover:bg-[#C9AA72]/30 text-[#C9AA72] border border-[#C9AA72]/40 font-bold flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm thẻ</span>
              </button>
            </div>

            <div className="space-y-3">
              {cards.map((card, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#102A43]/30 border border-white/10 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-[#A8F238]">
                      Thẻ #{idx + 1}
                    </span>
                    {cards.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCard(idx)}
                        className="p-1 rounded-lg text-red-400 hover:bg-red-500/20 transition"
                        title="Xóa thẻ này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] text-[#AEBCC5] mb-1">Loại thẻ:</label>
                      <select
                        value={card.cardType}
                        onChange={(e) => handleCardChange(idx, "cardType", e.target.value as CardType)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#07111F] border border-white/15 text-white"
                      >
                        {CARD_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <MediaPicker
                        label="Hình ảnh / Video:"
                        value={card.mediaUrl}
                        onChange={(url) => handleCardChange(idx, "mediaUrl", url)}
                        placeholder="https://... hoặc tải từ máy / kho lưu trữ"
                      />
                    </div>
                  </div>

                  {/* Image Preview */}
                  {card.mediaUrl && (card.cardType === "image" || !card.cardType) && (
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-[#07111F] border border-white/10">
                      <img
                        src={card.mediaUrl}
                        alt="Preview"
                        className="w-14 h-14 object-cover rounded-lg border border-[#C9AA72]/40"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200";
                        }}
                      />
                      <p className="text-[10px] text-[#AEBCC5] truncate flex-1">
                        Xem trước ảnh: {card.mediaUrl}
                      </p>
                    </div>
                  )}

                  {/* Doc Content if doc */}
                  {card.cardType === "doc" && (
                    <div>
                      <label className="block text-[10px] text-[#AEBCC5] mb-1">Nội dung tài liệu:</label>
                      <textarea
                        rows={2}
                        value={card.docContent}
                        onChange={(e) => handleCardChange(idx, "docContent", e.target.value)}
                        placeholder="Nhập nội dung markdown hoặc tài liệu..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#07111F] border border-white/15 text-white"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#C9AA72] to-[#8B6F3F] text-[#07111F] font-black flex items-center gap-1.5 shadow-lg hover:opacity-95"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Đang lưu..." : "Lưu Thay Đổi"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
