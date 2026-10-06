"use client";

import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export interface CategoryOption {
  id: string;
  name: string;
  postCount?: number;
}

interface CategoryPickerProps {
  categories: CategoryOption[];
  value: string;
  onChange: (name: string) => void;
  onCategoryCreated: (category: CategoryOption) => void;
}

const inputCls =
  "w-full px-3 py-2 rounded-xl bg-[#07111F] border border-[#F4F0E8]/20 text-sm text-white placeholder:text-[#F4F0E8]/40 focus:outline-none focus:border-[#C9AA72]";

// Danh mục lấy động từ /api/categories (Owner tự tạo/sửa/xóa) — thay cho
// enum cứng physical/digital/service/knowledge trước đây. Chọn "+ Danh mục
// mới..." để gõ tên và tạo ngay tại chỗ, không cần rời màn tạo bài.
export function CategoryPicker({ categories, value, onChange, onCategoryCreated }: CategoryPickerProps) {
  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSelect = (v: string) => {
    if (v === "__new__") {
      setIsAdding(true);
      return;
    }
    onChange(v);
  };

  const handleCreate = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json();
      if (res.ok && data.category) {
        onCategoryCreated(data.category);
        onChange(data.category.name);
        setIsAdding(false);
        setNewName("");
      } else {
        showToast(data.error || "Không thể tạo danh mục", "error");
      }
    } catch {
      showToast("Lỗi kết nối khi tạo danh mục", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isAdding) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          placeholder="Tên danh mục mới..."
          autoFocus
          className={inputCls}
        />
        <button
          type="button"
          onClick={handleCreate}
          disabled={isSaving || !newName.trim()}
          className="shrink-0 w-9 h-9 rounded-xl bg-[#A8F238] text-[#07111F] flex items-center justify-center disabled:opacity-50"
          title="Tạo danh mục"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            setIsAdding(false);
            setNewName("");
          }}
          className="shrink-0 w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center"
          title="Hủy"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <select value={value} onChange={(e) => handleSelect(e.target.value)} className={inputCls}>
      {categories.length === 0 && <option value="">Chưa có danh mục nào</option>}
      {categories.map((c) => (
        <option key={c.id} value={c.name}>
          {c.name}
        </option>
      ))}
      <option value="__new__">+ Danh mục mới...</option>
    </select>
  );
}
