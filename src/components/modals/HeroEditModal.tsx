"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Plus, Trash2, Save, Upload, Loader2, UserIcon, CreditCard } from "lucide-react";
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

function inferMediaType(url: string): "image" | "video" {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase() || "";
  if (["mp4", "webm", "mov", "ogg", "ogv"].includes(ext)) return "video";
  return "image";
}

export function HeroEditModal({ isOpen, onClose, onSaved }: HeroEditModalProps) {
  const { showToast } = useToast();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [intro, setIntro] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const bulkInputRef = useRef<HTMLInputElement | null>(null);

  // Hồ sơ cá nhân & VietQR — chuyển vào đây từ trang Quản Trị để Quản Trị chỉ còn thuần dashboard
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [bankId, setBankId] = useState("MB");
  const [bankName, setBankName] = useState("MBBank (Ngân Hàng Quân Đội)");
  const [accountNo, setAccountNo] = useState("");
  const [accountName, setAccountName] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/hero")
      .then((r) => r.json())
      .then((d) => {
        setSlides(d.slides || []);
        setIntro(d.intro || "");
      })
      .catch(() => {});

    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.profile) {
          setFullName(d.profile.fullName || "");
          setAvatarUrl(d.profile.avatarUrl || "");
          setPhone(d.profile.phoneNumber || "");
        }
        if (d.bankInfo) {
          setBankId(d.bankInfo.bankId || "MB");
          setBankName(d.bankInfo.bankName || "MBBank");
          setAccountNo(d.bankInfo.accountNo || "");
          setAccountName(d.bankInfo.accountName || "");
        }
      })
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  const addSlide = () =>
    setSlides((prev) => [...prev, { id: `slide-${Date.now()}-${prev.length}`, mediaUrl: "", mediaType: "image" }]);
  const updateSlide = (id: string, patch: Partial<HeroSlide>) =>
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const removeSlide = (id: string) => setSlides((prev) => prev.filter((s) => s.id !== id));

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setIsBulkUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (res.ok && data.success) {
          setSlides((prev) => [
            ...prev,
            { id: `slide-${Date.now()}-${prev.length}`, mediaUrl: data.url, mediaType: inferMediaType(data.url) },
          ]);
        } else {
          showToast(data.error || `Lỗi khi tải ${file.name}`, "error");
        }
      }
      showToast("Đã tải lên xong!", "success");
    } catch {
      showToast("Lỗi kết nối khi tải lên hàng loạt", "error");
    } finally {
      setIsBulkUploading(false);
      if (bulkInputRef.current) bulkInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    const validSlides = slides.filter((s) => s.mediaUrl.trim());
    setIsSaving(true);
    try {
      const [profileRes, heroRes] = await Promise.all([
        fetch("/api/admin/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: fullName.trim(),
            avatarUrl: avatarUrl.trim(),
            phoneNumber: phone.trim(),
            bankInfo: {
              bankId: bankId.trim(),
              bankName: bankName.trim(),
              accountNo: accountNo.trim(),
              accountName: accountName.trim().toUpperCase(),
            },
          }),
        }),
        fetch("/api/admin/hero", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slides: validSlides, intro }),
        }),
      ]);
      if (profileRes.ok && heroRes.ok) {
        showToast("Đã lưu cài đặt cá nhân & đầu trang!", "success");
        onSaved();
      } else {
        showToast("Không thể lưu một số thay đổi", "error");
      }
    } catch {
      showToast("Lỗi kết nối khi lưu", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const inputCls =
    "w-full px-3 py-2 rounded-xl bg-[#07111F] border border-[#F4F0E8]/20 text-sm text-white placeholder:text-[#F4F0E8]/40 focus:outline-none focus:border-[#C9AA72]";
  const labelCls = "block text-xs font-semibold text-[#F4F0E8]/80 mb-1.5";

  return (
    <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg max-h-[88vh] rounded-t-[28px] sm:rounded-[28px] glass-panel border border-[#C9AA72]/30 p-5 flex flex-col shadow-2xl bg-[#07111F]/98 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#F4F0E8]/15 shrink-0">
          <h3 className="text-sm font-extrabold text-white">Cài Đặt Cá Nhân & Đầu Trang</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-slim-scroll py-3 space-y-5">
          {/* HỒ SƠ CÁ NHÂN */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#C9AA72]">
              <UserIcon className="w-3.5 h-3.5" />
              <span>Hồ Sơ Cá Nhân</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className={labelCls}>Họ và tên</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} placeholder="Trương Hoàng Lam" />
              </div>
              <div>
                <label className={labelCls}>Số điện thoại</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="0901234567" />
              </div>
            </div>
            <MediaPicker label="Ảnh đại diện (Avatar)" value={avatarUrl} onChange={setAvatarUrl} placeholder="https://... hoặc tải từ máy" />
          </div>

          {/* NGÂN HÀNG / VIETQR */}
          <div className="space-y-3 pt-3 border-t border-[#F4F0E8]/10">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#A8F238]">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Nhận Ủng Hộ VietQR</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className={labelCls}>Mã Ngân Hàng (BIN)</label>
                <input type="text" value={bankId} onChange={(e) => setBankId(e.target.value)} className={`${inputCls} uppercase`} placeholder="MB, VCB..." />
              </div>
              <div>
                <label className={labelCls}>Tên Ngân Hàng</label>
                <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} className={inputCls} placeholder="MBBank" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className={labelCls}>Số Tài Khoản</label>
                <input type="text" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} className={`${inputCls} font-mono`} placeholder="0901234567" />
              </div>
              <div>
                <label className={labelCls}>Tên Chủ Tài Khoản</label>
                <input type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} className={`${inputCls} uppercase font-bold`} placeholder="TRUONG HOANG LAM" />
              </div>
            </div>
          </div>

          {/* GIỚI THIỆU */}
          <div className="pt-3 border-t border-[#F4F0E8]/10">
            <label className={labelCls}>Giới thiệu ngắn về Personal Hub</label>
            <textarea value={intro} onChange={(e) => setIntro(e.target.value)} rows={3} className={inputCls} placeholder="Personal Hub là..." />
          </div>

          {/* SLIDE ẢNH / VIDEO */}
          <div className="space-y-3 pt-3 border-t border-[#F4F0E8]/10">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-xs font-semibold text-[#F4F0E8]/80">Slide ảnh / video đầu trang</label>
              <div className="flex items-center gap-2">
                <input ref={bulkInputRef} type="file" accept="image/*,video/*" multiple onChange={handleBulkUpload} className="hidden" />
                <button
                  type="button"
                  onClick={() => bulkInputRef.current?.click()}
                  disabled={isBulkUploading}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#A8F238]/20 text-[#A8F238] border border-[#A8F238]/30 hover:bg-[#A8F238]/30 transition disabled:opacity-50"
                >
                  {isBulkUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{isBulkUploading ? "Đang tải..." : "Tải nhiều cùng lúc"}</span>
                </button>
                <button
                  type="button"
                  onClick={addSlide}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#C9AA72]/20 text-[#C9AA72] border border-[#C9AA72]/30 hover:bg-[#C9AA72]/30 transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm 1 slide
                </button>
              </div>
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
                <MediaPicker
                  label=""
                  value={slide.mediaUrl}
                  onChange={(url) => updateSlide(slide.id, { mediaUrl: url, mediaType: url ? inferMediaType(url) : slide.mediaType })}
                  placeholder="URL hoặc tải lên..."
                  accept="image/*,video/*"
                />
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
          <span>{isSaving ? "Đang lưu..." : "Lưu Tất Cả Thay Đổi"}</span>
        </button>
      </div>
    </div>
  );
}
