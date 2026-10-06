"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { PostData, FreeActivityTag, ContentCategory, CardType } from "@/lib/types";
import { FREE_ACTIVITY_META, COMMERCE_CARD_META, isCommerceCardType } from "@/lib/cardTypeMeta";
import { MediaPicker } from "@/components/ui/MediaPicker";

interface EditPostModalProps {
  post: PostData | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

type Group = "free" | "commerce";
type CommerceType = "package" | "request" | "reservation" | "membership" | "donate" | "auction";

interface MediaDraft {
  cardType: "image" | "video" | "doc";
  mediaUrl: string;
  docContent: string;
}

const FREE_TAGS: FreeActivityTag[] = ["knowledge", "vblog", "giveaway", "club"];
const CONTENT_CATEGORIES: ContentCategory[] = ["physical", "digital", "service", "knowledge"];
const CONTENT_CATEGORY_LABEL: Record<ContentCategory, string> = {
  physical: "Vật lý",
  digital: "Kỹ thuật số",
  service: "Dịch vụ",
  knowledge: "Kiến thức",
};
const COMMERCE_TYPES: CommerceType[] = ["package", "request", "reservation", "membership", "donate", "auction"];

function emptyMedia(): MediaDraft {
  return { cardType: "image", mediaUrl: "", docContent: "" };
}

export function EditPostModal({ post, isOpen, onClose, onUpdated }: EditPostModalProps) {
  const { showToast } = useToast();

  const [group, setGroup] = useState<Group>("free");
  const [freeTag, setFreeTag] = useState<FreeActivityTag>("knowledge");
  const [commerceType, setCommerceType] = useState<CommerceType>("package");
  const [contentCategory, setContentCategory] = useState<ContentCategory>("physical");

  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState<MediaDraft[]>([emptyMedia()]);

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [stock, setStock] = useState("");
  const [features, setFeatures] = useState("");

  const [reqTitle, setReqTitle] = useState("");
  const [scopeDescription, setScopeDescription] = useState("");
  const [estimatedRange, setEstimatedRange] = useState("");

  const [resTitle, setResTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [slotsTotal, setSlotsTotal] = useState("");
  const [slotsTaken, setSlotsTaken] = useState("");
  const [depositAmount, setDepositAmount] = useState("");

  const [planName, setPlanName] = useState("");
  const [planPrice, setPlanPrice] = useState("");
  const [billingPeriod, setBillingPeriod] = useState<"month" | "year" | "lifetime">("month");
  const [benefits, setBenefits] = useState("");

  const [goalMessage, setGoalMessage] = useState("");

  const [itemName, setItemName] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [minIncrement, setMinIncrement] = useState("");
  const [endsAt, setEndsAt] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!post) return;
    setCaption(post.caption || "");

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

    const commerceCard = (post.cards || []).find((c) => isCommerceCardType(c.cardType));
    if (commerceCard) {
      setGroup("commerce");
      const t = commerceCard.cardType as CommerceType;
      setCommerceType(t);
      const meta = commerceCard.cardMetadata || {};
      setContentCategory(meta.contentCategory || "physical");
      if (t === "package") {
        setProductName(meta.productName || "");
        setPrice(String(meta.price || ""));
        setOriginalPrice(meta.originalPrice ? String(meta.originalPrice) : "");
        setStock(meta.stock !== undefined ? String(meta.stock) : "");
        setFeatures((meta.features || []).join("\n"));
      } else if (t === "request") {
        setReqTitle(meta.title || "");
        setScopeDescription(meta.scopeDescription || "");
        setEstimatedRange(meta.estimatedRange || "");
      } else if (t === "reservation") {
        setResTitle(meta.title || "");
        setDateTime(meta.dateTime ? meta.dateTime.slice(0, 16) : "");
        setLocation(meta.location || "");
        setSlotsTotal(meta.slotsTotal !== undefined ? String(meta.slotsTotal) : "");
        setSlotsTaken(meta.slotsTaken !== undefined ? String(meta.slotsTaken) : "0");
        setDepositAmount(meta.depositAmount !== undefined ? String(meta.depositAmount) : "");
      } else if (t === "membership") {
        setPlanName(meta.planName || "");
        setPlanPrice(String(meta.price || ""));
        setBillingPeriod(meta.billingPeriod || "month");
        setBenefits((meta.benefits || []).join("\n"));
      } else if (t === "donate") {
        setGoalMessage(meta.goalMessage || "");
      } else if (t === "auction") {
        setItemName(meta.itemName || "");
        setStartingPrice(String(meta.startingPrice || ""));
        setMinIncrement(String(meta.minIncrement || ""));
        setEndsAt(meta.endsAt ? meta.endsAt.slice(0, 16) : "");
      }
    } else {
      setGroup("free");
      setFreeTag(FREE_TAGS.includes(post.category as FreeActivityTag) ? (post.category as FreeActivityTag) : "knowledge");
    }
  }, [post]);

  if (!isOpen || !post) return null;

  const updateMedia = (idx: number, patch: Partial<MediaDraft>) => {
    setMedia((prev) => prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  };
  const addMedia = () => setMedia((prev) => [...prev, emptyMedia()]);
  const removeMedia = (idx: number) =>
    setMedia((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev));

  const toNum = (v: string) => Math.max(0, parseInt(v.replace(/\D/g, "") || "0", 10));
  const toList = (v: string) =>
    v
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

  const buildCommerceCard = (): { cardType: CardType; cardMetadata: any } | null => {
    switch (commerceType) {
      case "package":
        if (!productName.trim()) {
          showToast("Nhập tên sản phẩm", "error");
          return null;
        }
        return {
          cardType: "package",
          cardMetadata: {
            productName: productName.trim(),
            price: toNum(price),
            originalPrice: originalPrice ? toNum(originalPrice) : undefined,
            stock: stock ? toNum(stock) : undefined,
            features: toList(features),
            contentCategory,
          },
        };
      case "request":
        if (!reqTitle.trim()) {
          showToast("Nhập tiêu đề yêu cầu", "error");
          return null;
        }
        return {
          cardType: "request",
          cardMetadata: {
            title: reqTitle.trim(),
            scopeDescription: scopeDescription.trim(),
            estimatedRange: estimatedRange.trim() || undefined,
            contentCategory,
          },
        };
      case "reservation":
        if (!resTitle.trim()) {
          showToast("Nhập tên sự kiện/suất giữ chỗ", "error");
          return null;
        }
        return {
          cardType: "reservation",
          cardMetadata: {
            title: resTitle.trim(),
            dateTime: dateTime || undefined,
            location: location.trim() || undefined,
            slotsTotal: slotsTotal ? toNum(slotsTotal) : undefined,
            slotsTaken: slotsTaken ? toNum(slotsTaken) : 0,
            depositAmount: depositAmount ? toNum(depositAmount) : 0,
            contentCategory,
          },
        };
      case "membership":
        if (!planName.trim()) {
          showToast("Nhập tên gói thành viên", "error");
          return null;
        }
        return {
          cardType: "membership",
          cardMetadata: {
            planName: planName.trim(),
            price: toNum(planPrice),
            billingPeriod,
            benefits: toList(benefits),
            contentCategory,
          },
        };
      case "donate":
        return {
          cardType: "donate",
          cardMetadata: { goalMessage: goalMessage.trim() || undefined },
        };
      case "auction":
        if (!itemName.trim() || !endsAt) {
          showToast("Nhập tên vật phẩm và thời gian kết thúc đấu giá", "error");
          return null;
        }
        return {
          cardType: "auction",
          cardMetadata: {
            itemName: itemName.trim(),
            startingPrice: toNum(startingPrice),
            minIncrement: toNum(minIncrement) || 10000,
            endsAt: new Date(endsAt).toISOString(),
            contentCategory,
          },
        };
    }
  };

  const handleSubmit = async () => {
    const mediaCards = media
      .filter((m) => m.mediaUrl.trim() || m.docContent.trim())
      .map((m) => ({
        cardType: m.cardType,
        mediaUrl: m.mediaUrl.trim() || undefined,
        docContent: m.docContent.trim() || undefined,
        cardMetadata: {},
      }));

    let cards: any[] = mediaCards;
    let category: string = freeTag;

    if (group === "commerce") {
      const commerceCard = buildCommerceCard();
      if (!commerceCard) return;
      cards = [...mediaCards, commerceCard];
      category = contentCategory;
    }

    if (cards.length === 0) {
      showToast("Cần ít nhất 1 ảnh/video/tài liệu, hoặc điền đủ thông tin thẻ thương mại", "error");
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
    <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg h-[90vh] sm:h-auto sm:max-h-[88vh] rounded-t-[28px] sm:rounded-[28px] glass-panel border border-[#C9AA72]/30 p-5 flex flex-col shadow-2xl bg-[#07111F]/98 overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-[#F4F0E8]/15 shrink-0">
          <h3 className="text-sm font-extrabold text-white">Sửa Bài Viết</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-slim-scroll py-3 space-y-4">
          <div>
            <label className={labelCls}>Nhóm hoạt động</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGroup("free")}
                className={`py-2.5 rounded-xl text-sm font-bold border transition ${
                  group === "free" ? "bg-[#C9AA72] text-[#07111F] border-[#C9AA72]" : "bg-[#102A43] text-white border-[#F4F0E8]/20"
                }`}
              >
                Miễn phí
              </button>
              <button
                type="button"
                onClick={() => setGroup("commerce")}
                className={`py-2.5 rounded-xl text-sm font-bold border transition ${
                  group === "commerce" ? "bg-[#C9AA72] text-[#07111F] border-[#C9AA72]" : "bg-[#102A43] text-white border-[#F4F0E8]/20"
                }`}
              >
                Thương mại
              </button>
            </div>
          </div>

          {group === "free" ? (
            <div>
              <label className={labelCls}>Hoạt động</label>
              <select value={freeTag} onChange={(e) => setFreeTag(e.target.value as FreeActivityTag)} className={inputCls}>
                {FREE_TAGS.map((t) => (
                  <option key={t} value={t}>
                    {FREE_ACTIVITY_META[t].label}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div>
                <label className={labelCls}>Hình thái giao dịch</label>
                <select value={commerceType} onChange={(e) => setCommerceType(e.target.value as CommerceType)} className={inputCls}>
                  {COMMERCE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {COMMERCE_CARD_META[t]?.label}
                    </option>
                  ))}
                </select>
              </div>

              {commerceType !== "donate" && (
                <div>
                  <label className={labelCls}>Phân loại nội dung</label>
                  <select value={contentCategory} onChange={(e) => setContentCategory(e.target.value as ContentCategory)} className={inputCls}>
                    {CONTENT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {CONTENT_CATEGORY_LABEL[c]}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {commerceType === "package" && (
                <div className="space-y-2 p-3 rounded-xl bg-[#102A43]/60 border border-[#F4F0E8]/15">
                  <div>
                    <label className={labelCls}>Tên sản phẩm *</label>
                    <input value={productName} onChange={(e) => setProductName(e.target.value)} className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelCls}>Giá bán (đ)</label>
                      <input value={price} onChange={(e) => setPrice(e.target.value)} className={inputCls} inputMode="numeric" />
                    </div>
                    <div>
                      <label className={labelCls}>Giá gốc (đ)</label>
                      <input value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className={inputCls} inputMode="numeric" />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Tồn kho</label>
                    <input value={stock} onChange={(e) => setStock(e.target.value)} className={inputCls} inputMode="numeric" />
                  </div>
                  <div>
                    <label className={labelCls}>Tính năng (mỗi dòng 1 ý)</label>
                    <textarea value={features} onChange={(e) => setFeatures(e.target.value)} rows={3} className={inputCls} />
                  </div>
                </div>
              )}

              {commerceType === "request" && (
                <div className="space-y-2 p-3 rounded-xl bg-[#102A43]/60 border border-[#F4F0E8]/15">
                  <div>
                    <label className={labelCls}>Tiêu đề yêu cầu *</label>
                    <input value={reqTitle} onChange={(e) => setReqTitle(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Mô tả phạm vi công việc</label>
                    <textarea value={scopeDescription} onChange={(e) => setScopeDescription(e.target.value)} rows={3} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Khoảng giá tham khảo</label>
                    <input value={estimatedRange} onChange={(e) => setEstimatedRange(e.target.value)} className={inputCls} />
                  </div>
                </div>
              )}

              {commerceType === "reservation" && (
                <div className="space-y-2 p-3 rounded-xl bg-[#102A43]/60 border border-[#F4F0E8]/15">
                  <div>
                    <label className={labelCls}>Tên sự kiện / suất giữ chỗ *</label>
                    <input value={resTitle} onChange={(e) => setResTitle(e.target.value)} className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelCls}>Thời điểm</label>
                      <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Địa điểm</label>
                      <input value={location} onChange={(e) => setLocation(e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className={labelCls}>Tổng số suất</label>
                      <input value={slotsTotal} onChange={(e) => setSlotsTotal(e.target.value)} className={inputCls} inputMode="numeric" />
                    </div>
                    <div>
                      <label className={labelCls}>Đã giữ</label>
                      <input value={slotsTaken} onChange={(e) => setSlotsTaken(e.target.value)} className={inputCls} inputMode="numeric" />
                    </div>
                    <div>
                      <label className={labelCls}>Cọc (đ)</label>
                      <input value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} className={inputCls} inputMode="numeric" />
                    </div>
                  </div>
                </div>
              )}

              {commerceType === "membership" && (
                <div className="space-y-2 p-3 rounded-xl bg-[#102A43]/60 border border-[#F4F0E8]/15">
                  <div>
                    <label className={labelCls}>Tên gói *</label>
                    <input value={planName} onChange={(e) => setPlanName(e.target.value)} className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelCls}>Giá (đ)</label>
                      <input value={planPrice} onChange={(e) => setPlanPrice(e.target.value)} className={inputCls} inputMode="numeric" />
                    </div>
                    <div>
                      <label className={labelCls}>Kỳ hạn</label>
                      <select value={billingPeriod} onChange={(e) => setBillingPeriod(e.target.value as any)} className={inputCls}>
                        <option value="month">Theo tháng</option>
                        <option value="year">Theo năm</option>
                        <option value="lifetime">Trọn đời</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Quyền lợi (mỗi dòng 1 ý)</label>
                    <textarea value={benefits} onChange={(e) => setBenefits(e.target.value)} rows={3} className={inputCls} />
                  </div>
                </div>
              )}

              {commerceType === "donate" && (
                <div className="space-y-2 p-3 rounded-xl bg-[#102A43]/60 border border-[#F4F0E8]/15">
                  <div>
                    <label className={labelCls}>Lời nhắn mục tiêu ủng hộ</label>
                    <textarea value={goalMessage} onChange={(e) => setGoalMessage(e.target.value)} rows={2} className={inputCls} />
                  </div>
                </div>
              )}

              {commerceType === "auction" && (
                <div className="space-y-2 p-3 rounded-xl bg-[#102A43]/60 border border-[#F4F0E8]/15">
                  <div>
                    <label className={labelCls}>Tên vật phẩm đấu giá *</label>
                    <input value={itemName} onChange={(e) => setItemName(e.target.value)} className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelCls}>Giá khởi điểm (đ)</label>
                      <input value={startingPrice} onChange={(e) => setStartingPrice(e.target.value)} className={inputCls} inputMode="numeric" />
                    </div>
                    <div>
                      <label className={labelCls}>Bước giá tối thiểu (đ)</label>
                      <input value={minIncrement} onChange={(e) => setMinIncrement(e.target.value)} className={inputCls} inputMode="numeric" />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Thời điểm kết thúc *</label>
                    <input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} className={inputCls} />
                  </div>
                  <p className="text-[11px] text-amber-400">Lưu ý: sửa lại giá khởi điểm/thời gian sau khi đã có người đặt giá có thể gây nhầm lẫn.</p>
                </div>
              )}
            </>
          )}

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
                    <option value="doc">Tài liệu</option>
                  </select>
                  {media.length > 1 && (
                    <button type="button" onClick={() => removeMedia(idx)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {m.cardType === "doc" ? (
                  <textarea value={m.docContent} onChange={(e) => updateMedia(idx, { docContent: e.target.value })} rows={3} className={inputCls + " font-mono"} />
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
