"use client";

import React, { useState, useMemo, useEffect } from "react";
import { PostData } from "@/lib/types";
import { PinCard } from "@/components/pins/PinCard";
import { Search, X } from "lucide-react";
import { HeroProfile } from "@/components/HeroProfile";

interface ShowroomPinterestProps {
  posts: PostData[];
  onOpenPostDetail: (post: PostData) => void;
  onOpenGift: (postId: string) => void;
  onSharePost: (post: PostData) => void;
  onDeletePost: (postId: string) => void;
  filterSheetOpen: boolean;
  onCloseFilterSheet: () => void;
  resetSignal: number;
  isOwner: boolean;
}

export function ShowroomPinterest({
  posts,
  onOpenPostDetail,
  onOpenGift,
  onSharePost,
  onDeletePost,
  filterSheetOpen,
  onCloseFilterSheet,
  resetSignal,
  isOwner,
}: ShowroomPinterestProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [categories, setCategories] = useState<{ id: string; name: string; postCount?: number }[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => {});
  }, []);

  // Nút "Home" trên AtelierDock bắn tín hiệu reset bộ lọc + cuộn lên đầu
  React.useEffect(() => {
    if (resetSignal === 0) return;
    setSearchQuery("");
    setSelectedFilter("all");
    window.scrollTo({ top: 0, behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal]);

  // Lọc tác phẩm theo danh mục động (Owner tự quản lý) + từ khóa tìm kiếm
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // 1. Lọc theo danh mục
      if (selectedFilter !== "all" && post.category !== selectedFilter) return false;

      // 2. Lọc theo từ khóa tìm kiếm
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inCaption = post.caption?.toLowerCase().includes(q) || false;
        const inCategory = post.category.toLowerCase().includes(q);
        const inOwner = post.owner?.fullName?.toLowerCase().includes(q) || false;
        const inCardContent = post.cards?.some((c) =>
          c.docContent?.toLowerCase().includes(q)
        ) || false;

        if (!inCaption && !inCategory && !inOwner && !inCardContent) {
          return false;
        }
      }

      return true;
    });
  }, [posts, selectedFilter, searchQuery]);

  return (
    <div className="relative min-h-screen bg-[#07111F] text-[#F4F0E8] pb-32 pt-20 px-3 sm:px-6 lg:px-8 max-w-[1560px] mx-auto overflow-hidden">
      {/* 1. CELESTIAL AMBIENT GLOWS */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#C9AA72]/15 via-[#102A43]/30 to-transparent blur-[120px] rounded-full" />
      <div className="pointer-events-none absolute top-1/3 -left-40 w-96 h-96 bg-[#A8F238]/10 blur-[130px] rounded-full" />
      <div className="pointer-events-none absolute top-2/3 -right-40 w-96 h-96 bg-[#C9AA72]/10 blur-[130px] rounded-full" />

      {/* 2. HERO HỒ SƠ CÁ NHÂN: avatar + slide ảnh/video — thay tiêu đề marketing chung,
          vì Personal Hub mặc định chỉ có 1 chủ */}
      <HeroProfile isOwner={isOwner} />

      {/* 3. KẾT QUẢ (gọn, luôn hiện) + KHUNG LỌC DẠNG POPUP (mở từ nút "Lọc" trên AtelierDock) */}
      <section className="relative z-20 max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-center px-2 text-xs text-[#AEBCC5]">
          <span>
            Hiển thị <strong className="text-[#C9AA72] font-bold">{filteredPosts.length}</strong> ý tưởng sáng tạo
            {(searchQuery || selectedFilter !== "all") && (
              <>
                {" "}
                ·{" "}
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedFilter("all");
                  }}
                  className="text-[#C9AA72] hover:underline font-semibold"
                >
                  Xóa bộ lọc
                </button>
              </>
            )}
          </span>
        </div>
      </section>

      {filterSheetOpen && (
        <div className="fixed inset-0 z-[1000] bg-[#030810] backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onCloseFilterSheet}>
          <div
            className="w-full sm:max-w-lg max-h-[80vh] rounded-t-[24px] sm:rounded-[24px] bg-[#07111F]/98 border border-[#C9AA72]/30 p-5 shadow-2xl overflow-y-auto custom-slim-scroll"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-white">Lọc & Tìm Kiếm</h3>
              <button onClick={onCloseFilterSheet} className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative group mb-4">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#AEBCC5] group-focus-within:text-[#C9AA72] transition-colors">
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm ý tưởng, dự án, phong cách, hashtag..."
                className="w-full pl-11 pr-11 py-3 rounded-full bg-[#102A43]/60 focus:bg-[#102A43]/90 border border-white/15 focus:border-[#C9AA72] text-sm text-[#F4F0E8] placeholder:text-[#AEBCC5]/60 outline-none transition-all"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#AEBCC5] hover:text-[#F4F0E8] transition-colors" title="Xóa tìm kiếm">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedFilter("all")}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 border ${
                  selectedFilter === "all"
                    ? "bg-[#C9AA72] text-[#07111F] border-[#C9AA72] shadow-[0_0_15px_rgba(201,170,114,0.4)]"
                    : "bg-[#102A43]/50 text-[#AEBCC5] hover:text-[#F4F0E8] hover:bg-[#102A43]/80 border-white/10"
                }`}
              >
                Tất cả ý tưởng
              </button>
              {categories.map((cat) => {
                const isActive = selectedFilter === cat.name;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedFilter(cat.name)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 border ${
                      isActive
                        ? "bg-[#C9AA72] text-[#07111F] border-[#C9AA72] shadow-[0_0_15px_rgba(201,170,114,0.4)]"
                        : "bg-[#102A43]/50 text-[#AEBCC5] hover:text-[#F4F0E8] hover:bg-[#102A43]/80 border-white/10"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            <button
              onClick={onCloseFilterSheet}
              className="w-full mt-5 py-3 rounded-xl font-extrabold text-sm text-[#07111F] bg-gradient-to-r from-[#C9AA72] to-[#8B6F3F] hover:opacity-95 shadow-lg transition transform active:scale-95"
            >
              Xem {filteredPosts.length} Kết Quả
            </button>
          </div>
        </div>
      )}

      {/* 4. PINTEREST MASONRY GRID FEED */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-20 bg-[#102A43]/30 rounded-3xl border border-white/10 backdrop-blur-md max-w-lg mx-auto">
          <Search className="w-12 h-12 text-[#C9AA72]/60 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#F4F0E8]">Không tìm thấy ý tưởng phù hợp</h3>
          <p className="text-sm text-[#AEBCC5] mt-2 mb-6">
            Thử tìm kiếm với từ khóa khác hoặc chuyển sang chuyên mục &quot;Tất cả ý tưởng&quot;.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedFilter("all");
            }}
            className="px-5 py-2.5 rounded-full bg-[#C9AA72] text-[#07111F] font-bold text-sm shadow-lg hover:bg-[#dfc48c] transition-all"
          >
            Xem tất cả ý tưởng
          </button>
        </div>
      ) : (
        <section className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
          {/* FEED POSTS AS PINTEREST PINS */}
          {filteredPosts.map((post, postIndex) => (
            <PinCard
              key={post.id}
              post={post}
              index={postIndex}
              onOpenDetail={onOpenPostDetail}
              onOpenGift={onOpenGift}
              onShare={onSharePost}
              onDelete={onDeletePost}
              isOwner={isOwner}
            />
          ))}

        </section>
      )}
    </div>
  );
}
