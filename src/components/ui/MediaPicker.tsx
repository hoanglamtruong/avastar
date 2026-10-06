"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  FolderOpen,
  Image as ImageIcon,
  Loader2,
  X,
  Check,
  RefreshCw,
} from "lucide-react";

interface MediaItem {
  url: string;
  name: string;
  category: "upload" | "brand";
  size?: number;
  createdAt?: number;
}

interface MediaPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  accept?: string;
}

export function MediaPicker({
  value,
  onChange,
  label = "URL Hình ảnh / Media:",
  placeholder = "https://... hoặc chọn từ kho lưu trữ",
  required = false,
  accept = "image/*",
}: MediaPickerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [libraryItems, setLibraryItems] = useState<MediaItem[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [libraryTab, setLibraryTab] = useState<"all" | "upload" | "brand">("all");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchLibrary = async () => {
    setIsLoadingLibrary(true);
    try {
      const res = await fetch("/api/upload");
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        setLibraryItems(data.items);
      }
    } catch (err) {
      console.error("Failed to load library:", err);
    } finally {
      setIsLoadingLibrary(false);
    }
  };

  const handleOpenLibrary = () => {
    setIsLibraryOpen(true);
    fetchLibrary();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onChange(data.url);
      } else {
        alert(data.error || "Lỗi khi tải ảnh lên");
      }
    } catch (err: any) {
      alert("Không thể tải ảnh: " + (err?.message || "Lỗi mạng"));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const filteredItems = libraryItems.filter((item) => {
    if (libraryTab === "all") return true;
    return item.category === libraryTab;
  });

  return (
    <div className="space-y-2">
      {label && (
        <label className="block font-bold text-[#AEBCC5] text-xs sm:text-sm">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}

      {/* Input Row + Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* URL Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 pr-8 rounded-xl bg-[#07111F] border border-white/15 text-white placeholder:text-white/30 text-xs sm:text-sm focus:outline-none focus:border-[#C9AA72] transition"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              title="Xóa link"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Buttons: Tải lên từ máy & Kho lưu trữ */}
        <div className="flex items-center gap-2 shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-3 py-2 rounded-xl bg-[#102A43] hover:bg-[#102A43]/80 border border-white/20 text-[#F4F0E8] text-xs font-bold flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50 shadow-md"
            title="Tải ảnh trực tiếp từ máy tính hoặc điện thoại"
          >
            {isUploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C9AA72]" />
            ) : (
              <Upload className="w-3.5 h-3.5 text-[#C9AA72]" />
            )}
            <span>{isUploading ? "Đang tải..." : "Tải từ máy"}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenLibrary}
            className="px-3 py-2 rounded-xl bg-[#C9AA72]/15 hover:bg-[#C9AA72]/25 border border-[#C9AA72]/40 text-[#C9AA72] text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-md"
            title="Chọn ảnh từ kho lưu trữ media"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Kho lưu trữ</span>
          </button>
        </div>
      </div>

      {/* Live Thumbnail Preview */}
      {value && (
        <div className="flex items-center gap-3 p-2 rounded-xl bg-[#07111F]/80 border border-white/10 w-fit max-w-full">
          <img
            src={value}
            alt="Preview"
            className="w-10 h-10 rounded-lg object-cover border border-[#C9AA72]/40 bg-[#102A43]"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100";
            }}
          />
          <div className="min-w-0 pr-2">
            <span className="text-[11px] text-[#AEBCC5] block truncate max-w-[240px] sm:max-w-[360px]">
              {value}
            </span>
            <span className="text-[10px] text-[#A8F238] flex items-center gap-1 font-semibold">
              <Check className="w-3 h-3" /> Đã chọn ảnh
            </span>
          </div>
        </div>
      )}

      {/* MEDIA ARCHIVE MODAL */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[#07111F] border border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#C9AA72]/20 border border-[#C9AA72]/40 flex items-center justify-center text-[#C9AA72]">
                  <FolderOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Kho Lưu Trữ Hình Ảnh</h3>
                  <p className="text-xs text-[#AEBCC5]">
                    Chọn ảnh đã tải lên hoặc tài sản thương hiệu ZANGX
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchLibrary}
                  disabled={isLoadingLibrary}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#AEBCC5] transition"
                  title="Làm mới danh sách"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingLibrary ? "animate-spin" : ""}`} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsLibraryOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition"
                  title="Đóng kho lưu trữ"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter Tabs & Quick Upload Inside Modal */}
            <div className="flex items-center justify-between py-3 border-b border-white/5 gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                {[
                  { id: "all", label: "Tất cả" },
                  { id: "upload", label: "Đã tải lên" },
                  { id: "brand", label: "Logo & Brand ZANGX" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setLibraryTab(t.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      libraryTab === t.id
                        ? "bg-[#C9AA72] text-[#07111F]"
                        : "bg-[#102A43] text-[#AEBCC5] hover:text-white"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-3 py-1.5 rounded-lg bg-[#A8F238] hover:bg-[#bcf95c] text-[#07111F] text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Tải ảnh mới</span>
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="flex-1 overflow-y-auto custom-slim-scroll py-4">
              {isLoadingLibrary ? (
                <div className="flex flex-col items-center justify-center py-16 text-[#AEBCC5]">
                  <Loader2 className="w-8 h-8 animate-spin text-[#C9AA72] mb-2" />
                  <span className="text-xs">Đang nạp kho ảnh...</span>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-16 text-[#AEBCC5]">
                  <ImageIcon className="w-10 h-10 text-white/20 mx-auto mb-2" />
                  <p className="text-sm font-semibold">Chưa có ảnh nào trong kho</p>
                  <p className="text-xs text-white/40 mt-1">
                    Hãy bấm "Tải ảnh mới" để thêm ảnh từ thiết bị của bạn.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {filteredItems.map((item, idx) => {
                    const isSelected = value === item.url;
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          onChange(item.url);
                          setIsLibraryOpen(false);
                        }}
                        className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all aspect-square bg-[#102A43]/50 flex flex-col justify-end p-2 ${
                          isSelected
                            ? "border-[#C9AA72] ring-2 ring-[#C9AA72]/50 scale-[1.02]"
                            : "border-white/10 hover:border-[#C9AA72]/50 hover:scale-[1.02]"
                        }`}
                      >
                        <img
                          src={item.url}
                          alt={item.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10 text-[10px] text-white font-medium truncate w-full opacity-90 group-hover:opacity-100">
                          {item.name}
                        </div>

                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#C9AA72] text-[#07111F] flex items-center justify-center shadow">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#AEBCC5]">
              <span>
                Tổng cộng: <strong className="text-white">{filteredItems.length}</strong> tệp
              </span>
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
