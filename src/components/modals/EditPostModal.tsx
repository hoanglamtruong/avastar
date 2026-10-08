"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { PostData } from "@/lib/types";
import { isCommerceCardType } from "@/lib/cardTypeMeta";
import { MediaPicker } from "@/components/ui/MediaPicker";
import { CategoryPicker, CategoryOption } from "@/components/ui/CategoryPicker";
import { ActionButtonFields } from "@/components/modals/ActionButtonFields";
import { ActionDraft, MAX_ACTIONS, newActionDraft, buildCardFromAction, actionDraftFromCard } from "@/lib/actionDraft";

interface EditPostModalProps {
  post: PostData | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

interface MediaDraft {
  cardType: "image" | "video" | "doc";
  mediaUrl: string;
  docContent: string;
}

function emptyMedia(): MediaDraft {
  return { cardType: "image", mediaUrl: "", docContent: "" };
}

export function EditPostModal({ post, isOpen, onClose, onUpdated }: EditPostModalProps) {
  const { showToast } = useToast();

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => {});
  }, [isOpen]);

  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState<MediaDraft[]>([emptyMedia()]);
  const [actions, setActions] = useState<ActionDraft[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!post) return;
    setCaption(post.caption || "");
    setSelectedCategory(post.category || "");

    const mediaCards = (post.cards || []).filter((c) => !isCommerceCardType(c.cardType));
    setMedia(
      mediaCards.length > 0
        ? mediaCards.map((c) => ({
            cardType: c.cardType as MediaDraft["cardType"],
            mediaUrl: c.mediaUrl || "",
            docContent: c.docContent || "",
          }))
        : [emptyMedia()]
    );

    const commerceCards = (post.cards || []).filter((c) => isCommerceCardType(c.cardType));
    setActions(commerceCards.slice(0, MAX_ACTIONS).map((c) => actionDraftFromCard(c)));
  }, [post]);

  if (!isOpen || !post) return null;

  const updateMedia = (idx: number, patch: Partial<MediaDraft>) => {
    setMedia((prev) => prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  };
  const addMedia = () => setMedia((prev) => [...prev, emptyMedia()]);
  const removeMedia = (idx: number) =>
    setMedia((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev));

  const addAction = () => {
    if (actions.length >= MAX_ACTIONS) {
      showToast(`Tối đa ${MAX_ACTIONS} nút hành động trên 1 bài viết`, "error");
      return;
    }
    setActions((prev) => [...prev, newActionDraft()]);
  };
  const updateAction = (id: string, patch: Partial<ActionDraft>) =>
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  const removeAction = (id: string) => setActions((prev) => prev.filter((a) => a.id !== id));

  const handleSubmit = async () => {
    const mediaCards = media
      .filter((m) => m.mediaUrl.trim() || m.docContent.trim())
      .map((m) => ({
        cardType: m.cardType,
        mediaUrl: m.mediaUrl.trim() || undefined,
        docContent: m.docContent.trim() || undefined,
        cardMetadata: {},
      }));

    const category: string = selectedCategory || "Chưa phân loại";

    const commerceCards: any[] = [];
    for (const action of actions) {
      const built = buildCardFromAction(action, selectedCategory, showToast);
      if (!built) return;
      commerceCards.push(built);
    }

    const cards = [...mediaCards, ...commerceCards];

    if (cards.length === 0) {
      showToast("Cần ít nhất 1 ảnh/video/tài liệu, hoặc 1 nút hành động", "error");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, caption, cards }),
      });
      if (res.ok) {
        showToast("Đã lưu thay đổi!", "success");
        onUpdated();
        onClose();
      } else {
        const data = await res.json();
        showToast(data.error || "Không thể lưu bài viết", "error");
      }
    } catch {
      showToast("Lỗi kết nối khi lưu bài viết", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const inputCls =
    "w-full px-3 py-2 rounded-xl bg-[#07111F] border border-[#F4F0E8]/20 text-sm text-white placeholder:text-[#F4F0E8]/40 focus:outline-none focus:border-[#C9AA72]";
  const labelCls = "block text-xs font-semibold text-[#F4F0E8]/80 mb-1.5";

  return (
    <div className="fixed inset-0 z-[1000] bg-[#030810] backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg h-[90vh] sm:h-auto sm:max-h-[88vh] rounded-t-[28px] sm:rounded-[28px] glass-panel border border-[#C9AA72]/30 p-5 flex flex-col shadow-2xl bg-[#07111F]/98 overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-[#F4F0E8]/15 shrink-0">
          <h3 className="text-sm font-extrabold text-white">Sửa Bài Viết</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-slim-scroll py-3 space-y-4">
          <div>
            <label className={labelCls}>Danh mục</label>
            <CategoryPicker
              categories={categories}
              value={selectedCategory}
              onChange={setSelectedCategory}
              onCategoryCreated={(cat) => setCategories((prev) => [...prev, cat].sort((a, b) => a.name.localeCompare(b.name)))}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <label className="text-xs font-semibold text-[#F4F0E8]/80">Nút hành động (tối đa {MAX_ACTIONS})</label>
                <p className="text-[11px] text-[#F4F0E8]/50">Không thêm nút nào = bài chia sẻ nội dung thường, không bán gì.</p>
              </div>
              <button
                type="button"
                onClick={addAction}
                disabled={actions.length >= MAX_ACTIONS}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#C9AA72]/20 text-[#C9AA72] border border-[#C9AA72]/30 hover:bg-[#C9AA72]/30 transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm nút
              </button>
            </div>

            {actions.map((action, idx) => (
              <ActionButtonFields
                key={action.id}
                action={action}
                index={idx}
                onChange={(patch) => updateAction(action.id, patch)}
                onRemove={() => removeAction(action.id)}
              />
            ))}
          </div>

          <div>
            <label className={labelCls}>Caption</label>
            <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={2} className={inputCls} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#F4F0E8]/80">Ảnh / Video / Tài liệu minh họa</label>
              <button
                type="button"
                onClick={addMedia}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#C9AA72]/20 text-[#C9AA72] border border-[#C9AA72]/30 hover:bg-[#C9AA72]/30 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm
              </button>
            </div>
            {media.map((m, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#102A43]/60 border border-[#F4F0E8]/15 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <select
                    value={m.cardType}
                    onChange={(e) => updateMedia(idx, { cardType: e.target.value as MediaDraft["cardType"] })}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#07111F] border border-[#F4F0E8]/20 text-xs text-white focus:outline-none focus:border-[#C9AA72]"
                  >
                    <option value="image">Ảnh</option>
                    <option value="video">Video</option>
                    <option value="doc">Tài liệu / Ứng dụng</option>
                  </select>
                  {media.length > 1 && (
                    <button type="button" onClick={() => removeMedia(idx)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {m.cardType === "doc" ? (
                  <>
                    <MediaPicker
                      label="File tài liệu / ứng dụng (khách sẽ bấm Tải Xuống):"
                      value={m.mediaUrl}
                      onChange={(url) => updateMedia(idx, { mediaUrl: url })}
                      placeholder="Tải file lên — PDF, ZIP, APK, DOC, XLS, PPT... (tối đa 30MB)"
                      accept=".pdf,.zip,.apk,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rar,.7z,.exe,.dmg"
                    />
                    <textarea
                      value={m.docContent}
                      onChange={(e) => updateMedia(idx, { docContent: e.target.value })}
                      rows={3}
                      placeholder="Mô tả ngắn về tài liệu/ứng dụng (không bắt buộc)..."
                      className={inputCls}
                    />
                  </>
                ) : (
                  <MediaPicker label="Hình ảnh / Video:" value={m.mediaUrl} onChange={(url) => updateMedia(idx, { mediaUrl: url })} placeholder="URL hoặc tải lên..." />
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
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
