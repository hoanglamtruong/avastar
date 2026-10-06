"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PostData } from "@/lib/types";
import { PinCard } from "@/components/pins/PinCard";
import {
  Sparkles,
  Search,
  X,
  ArrowUpRight,
  Bot,
  Wrench,
  Palette,
  Briefcase,
  Layers,
  Filter,
} from "lucide-react";
import { ZxStar } from "@/components/portfolio/ZxStar";

interface ShowroomPinterestProps {
  posts: PostData[];
  onOpenPostDetail: (post: PostData) => void;
  onOpenGift: (postId: string) => void;
  onSharePost: (post: PostData) => void;
}

export function ShowroomPinterest({
  posts,
  onOpenPostDetail,
  onOpenGift,
  onSharePost,
}: ShowroomPinterestProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filterTabs = [
    { id: "all", label: "Tất cả ý tưởng" },
    { id: "free", label: "Miễn Phí" },
    { id: "package", label: "Mua Ngay" },
    { id: "reservation", label: "Giữ Chỗ" },
    { id: "membership", label: "Thành Viên" },
    { id: "auction", label: "Đấu Giá" },
    { id: "media", label: "Ảnh & Video" },
  ];

  const FREE_TAGS = ["knowledge", "vblog", "giveaway", "club"];

  // Lọc tác phẩm dựa trên tab và từ khóa tìm kiếm
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // 1. Lọc theo chuyên mục / tab
      if (selectedFilter === "free" && !FREE_TAGS.includes(post.category)) return false;
      if (
        ["package", "reservation", "membership", "auction"].includes(selectedFilter) &&
        !post.cards.some((c) => c.cardType === selectedFilter)
      )
        return false;
      if (
        selectedFilter === "media" &&
        !post.cards.some((c) => c.cardType === "video" || c.cardType === "image")
      )
        return false;

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

      {/* 2. ATELIER HERO & INSPIRATION BANNER */}
      <section className="relative z-10 text-center max-w-3xl mx-auto pt-6 pb-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#102A43]/70 border border-[#C9AA72]/30 text-xs font-extrabold tracking-[0.25em] text-[#C9AA72] uppercase shadow-lg backdrop-blur">
          <Sparkles className="w-3.5 h-3.5 text-[#A8F238]" />
          <span>The Digital Atelier · Creative Canvas</span>
        </div>

        {/* Headline */}
        <h1 className="zx-serif mt-5 text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.14] text-[#F4F0E8]">
          Ý Tưởng Sáng Tạo{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9AA72] via-[#F4F0E8] to-[#C9AA72]">
            Hội Tụ &amp; Phát Triển
          </span>
        </h1>

        <p className="mt-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-[#AEBCC5]">
          Creative Thinking · Intelligent Execution · Real Products
        </p>
      </section>

      {/* 3. PINTEREST SEARCH & TOPIC BAR (STICKY/FLOATING) */}
      <section className="relative z-20 max-w-4xl mx-auto mb-8 space-y-4">
        {/* Search Input Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#AEBCC5] group-focus-within:text-[#C9AA72] transition-colors">
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm ý tưởng, dự án, phong cách, hashtag..."
            className="w-full pl-11 pr-11 py-3 sm:py-3.5 rounded-full bg-[#102A43]/60 hover:bg-[#102A43]/80 focus:bg-[#102A43]/90 border border-white/15 focus:border-[#C9AA72] text-sm sm:text-base text-[#F4F0E8] placeholder:text-[#AEBCC5]/60 outline-none backdrop-blur-xl shadow-xl transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#AEBCC5] hover:text-[#F4F0E8] transition-colors"
              title="Xóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills (Horizontal Scroll) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {filterTabs.map((tab) => {
            const isActive = selectedFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 border ${
                  isActive
                    ? "bg-[#C9AA72] text-[#07111F] border-[#C9AA72] shadow-[0_0_15px_rgba(201,170,114,0.4)] scale-105"
                    : "bg-[#102A43]/50 text-[#AEBCC5] hover:text-[#F4F0E8] hover:bg-[#102A43]/80 border-white/10"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Results indicator */}
        <div className="flex items-center justify-between px-2 text-xs text-[#AEBCC5]">
          <span>
            Hiển thị{" "}
            <strong className="text-[#C9AA72] font-bold">
              {filteredPosts.length}
            </strong>{" "}
            ý tưởng sáng tạo
          </span>
          {(searchQuery || selectedFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedFilter("all");
              }}
              className="text-[#C9AA72] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Xóa bộ lọc</span>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </section>

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
          {/* EDITORIAL PIN 1: ZANGX Atelier Philosophy */}
          {selectedFilter === "all" && (
            <article className="break-inside-avoid mb-4 inline-block w-full">
              <div className="rounded-2xl sm:rounded-3xl border border-[#C9AA72]/40 bg-gradient-to-b from-[#102A43] via-[#07111F] to-[#102A43] p-5 sm:p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between group hover:border-[#C9AA72] transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#C9AA72]/20 border border-[#C9AA72]/40 text-[10px] font-black uppercase tracking-wider text-[#C9AA72]">
                      Manifesto
                    </span>
                    <ZxStar className="w-5 h-5 text-[#C9AA72]" />
                  </div>
                  <h3 className="zx-serif text-lg sm:text-xl font-bold text-[#F4F0E8] group-hover:text-[#C9AA72] transition-colors leading-snug">
                    Thiết Kế Định Hình Giá Trị
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-[#AEBCC5]">
                    Mỗi tác phẩm là sự kết hợp giữa tư duy cơ khí chính xác, mã nguồn hệ thống và mỹ cảm độc bản.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href="/gioi-thieu"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#C9AA72] hover:text-white transition"
                  >
                    <span>Về ZANGX</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          )}

          {/* EDITORIAL PIN 2: Physical R&D Showcase */}
          {(selectedFilter === "all" || selectedFilter === "rnd") && (
            <article className="break-inside-avoid mb-4 inline-block w-full">
              <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-[#102A43]/50 hover:border-[#C9AA72]/40 p-5 sm:p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between group transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#C9AA72]/20 border border-[#C9AA72]/40 text-[10px] font-black uppercase tracking-wider text-[#C9AA72]">
                      Physical R&amp;D
                    </span>
                    <Wrench className="w-5 h-5 text-[#AEBCC5] group-hover:text-[#C9AA72] transition" />
                  </div>
                  <h3 className="zx-serif text-lg sm:text-xl font-bold text-[#F4F0E8] leading-snug group-hover:text-[#C9AA72] transition-colors">
                    Phòng Thí Nghiệm Vật Lý
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-[#AEBCC5]">
                    Kệ decor mô-đun, chậu bonsai xoay nhôm gốm, đồ gá cơ khí chính xác kết hợp gia công CNC.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href="/san-pham"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#C9AA72] hover:text-white transition"
                  >
                    <span>Xem sản phẩm</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          )}

          {/* FEED POSTS AS PINTEREST PINS */}
          {filteredPosts.map((post, postIndex) => (
            <PinCard
              key={post.id}
              post={post}
              index={postIndex}
              onOpenDetail={onOpenPostDetail}
              onOpenGift={onOpenGift}
              onShare={onSharePost}
            />
          ))}

          {/* EDITORIAL PIN 3: AI & Digital Services */}
          {(selectedFilter === "all" || selectedFilter === "ai") && (
            <article className="break-inside-avoid mb-4 inline-block w-full">
              <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-[#102A43]/50 hover:border-[#A8F238]/40 p-5 sm:p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between group transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#A8F238]/20 border border-[#A8F238]/40 text-[10px] font-black uppercase tracking-wider text-[#A8F238]">
                      AI &amp; Automation
                    </span>
                    <Bot className="w-5 h-5 text-[#AEBCC5] group-hover:text-[#A8F238] transition" />
                  </div>
                  <h3 className="zx-serif text-lg sm:text-xl font-bold text-[#F4F0E8] leading-snug group-hover:text-[#A8F238] transition-colors">
                    Dịch Vụ Số &amp; AI Agents
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-[#AEBCC5]">
                    Tự động hóa tiếp thị, xây dựng trợ lý AI độc bản, kiến tạo giải pháp số thông minh cho doanh nghiệp.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href="/dich-vu"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#A8F238] hover:text-white transition"
                  >
                    <span>Xem quy trình</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          )}

          {/* EDITORIAL PIN 4: Client Projects Showcase */}
          {(selectedFilter === "all" || selectedFilter === "job") && (
            <article className="break-inside-avoid mb-4 inline-block w-full">
              <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-[#102A43]/50 hover:border-[#38BDF8]/40 p-5 sm:p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between group transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#38BDF8]/20 border border-[#38BDF8]/40 text-[10px] font-black uppercase tracking-wider text-[#38BDF8]">
                      Client Work
                    </span>
                    <Briefcase className="w-5 h-5 text-[#AEBCC5] group-hover:text-[#38BDF8] transition" />
                  </div>
                  <h3 className="zx-serif text-lg sm:text-xl font-bold text-[#F4F0E8] leading-snug group-hover:text-[#38BDF8] transition-colors">
                    Dự Án Đã Thực Thi
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-[#AEBCC5]">
                    Khám phá các dự án phần mềm, kiến trúc giải pháp và chuyển đổi số đã bàn giao cho đối tác.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href="/du-an"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#38BDF8] hover:text-white transition"
                  >
                    <span>Xem portfolio</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          )}
        </section>
      )}
    </div>
  );
}
