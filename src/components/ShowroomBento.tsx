"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PostData } from "@/lib/types";
import {
  Sparkles,
  Eye,
  Share2,
  Heart,
  Layers,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  Bot,
  Wrench,
  Palette,
  FileText,
  Video,
  Image as ImageIcon,
} from "lucide-react";
import { ZxStar } from "@/components/portfolio/ZxStar";

interface ShowroomBentoProps {
  posts: PostData[];
  onOpenPostInStory: (postIndex: number) => void;
  onOpenGift: (postId: string) => void;
  onSharePost: (post: PostData) => void;
}

export function ShowroomBento({
  posts,
  onOpenPostInStory,
  onOpenGift,
  onSharePost,
}: ShowroomBentoProps) {
  const [filter, setFilter] = useState<string>("all");

  const categories = [
    { id: "all", label: "Tất cả tác phẩm" },
    { id: "webapp", label: "Webapp & AI" },
    { id: "media", label: "Ảnh & Video" },
    { id: "doc", label: "Tài liệu & SOP" },
  ];

  const filteredPosts = posts.filter((p) => {
    if (filter === "all") return true;
    if (filter === "webapp") return p.category === "work" || p.category === "store";
    if (filter === "media") return p.cards.some((c) => c.cardType === "video" || c.cardType === "image");
    if (filter === "doc") return p.cards.some((c) => c.cardType === "doc" || c.cardType === "sop");
    return true;
  });

  return (
    <div className="relative min-h-screen bg-[#07111F] text-[#F4F0E8] pb-32 pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* 1. CELESTIAL AMBIENT GLOWS */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#C9AA72]/15 via-[#102A43]/30 to-transparent blur-[120px] rounded-full" />
      <div className="pointer-events-none absolute top-1/3 -left-40 w-96 h-96 bg-[#A8F238]/10 blur-[130px] rounded-full" />
      <div className="pointer-events-none absolute top-2/3 -right-40 w-96 h-96 bg-[#C9AA72]/10 blur-[130px] rounded-full" />

      {/* 2. ATELIER HERO SECTION */}
      <section className="relative z-10 text-center max-w-3xl mx-auto pt-6 pb-12">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#102A43]/70 border border-[#C9AA72]/30 text-xs font-extrabold tracking-[0.25em] text-[#C9AA72] uppercase shadow-lg backdrop-blur">
          <Sparkles className="w-3.5 h-3.5 text-[#A8F238]" />
          <span>The Digital Atelier · Showroom</span>
        </div>

        {/* Headline */}
        <h1 className="zx-serif mt-6 text-4xl sm:text-6xl font-extrabold leading-[1.12] text-[#F4F0E8]">
          Ý Tưởng Được Thiết Kế{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9AA72] via-[#F4F0E8] to-[#C9AA72]">
            Thành Hệ Thống
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-sm sm:text-base font-semibold uppercase tracking-[0.25em] text-[#AEBCC5]">
          Creative Thinking · Intelligent Execution · Real Products
        </p>

        <p className="mt-6 text-sm sm:text-base leading-relaxed text-[#AEBCC5]/90 max-w-2xl mx-auto">
          Chào mừng bạn đến với không gian triển lãm số độc bản của Trương Hoàng Lam. Khám phá các sản phẩm webapp,
          giải pháp tự động hóa AI và các mẫu thử nghiệm R&amp;D vật lý được tinh chỉnh kỹ lưỡng.
        </p>

        {/* Quick Stats Pill */}
        <div className="mt-8 inline-grid grid-cols-3 gap-6 sm:gap-10 px-6 py-3 rounded-2xl bg-[#102A43]/60 border border-white/10 backdrop-blur shadow-xl">
          <div>
            <p className="text-xl sm:text-2xl font-black text-[#F4F0E8]">50+</p>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#AEBCC5]">Projects</p>
          </div>
          <div className="border-x border-white/10 px-4 sm:px-6">
            <p className="text-xl sm:text-2xl font-black text-[#C9AA72]">30+</p>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#AEBCC5]">Clients</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black text-[#A8F238]">100%</p>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#AEBCC5]">Real Impact</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setFilter(c.id)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold tracking-wide transition-all transform active:scale-95 ${
                filter === c.id
                  ? "bg-[#C9AA72] text-[#07111F] shadow-[0_0_15px_rgba(201,170,114,0.4)]"
                  : "bg-[#102A43]/60 text-[#AEBCC5] hover:text-white hover:bg-[#102A43]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* 3. BENTO GRID SHOWCASE */}
      <section className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* SPECIAL ATELIER BENTO TILE: Brand Philosophy */}
        <div className="rounded-3xl border border-[#C9AA72]/30 bg-gradient-to-br from-[#102A43]/80 to-[#07111F]/90 p-6 sm:p-7 backdrop-blur-xl flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-44 h-44 bg-[#C9AA72]/10 rounded-full blur-3xl group-hover:bg-[#C9AA72]/20 transition-colors" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#A8F238]">
                Manifesto &amp; Identity
              </span>
              <ZxStar className="w-7 h-7 text-[#C9AA72]" />
            </div>
            <h3 className="zx-serif mt-4 text-2xl font-bold text-[#F4F0E8] leading-snug">
              Xưởng Sáng Tạo Số ZANGX
            </h3>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#AEBCC5]">
              Sự hợp nhất giữa trực giác sáng tạo con người (Enso), kiến trúc hệ thống kỷ luật (Hexagon) và tuệ giác công nghệ (Star).
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <Link
              href="/gioi-thieu"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9AA72] hover:text-white transition"
            >
              <span>Xem hồ sơ &amp; hệ biểu tượng</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* SPECIAL ATELIER BENTO TILE: R&D Lab */}
        <div className="rounded-3xl border border-white/10 bg-[#102A43]/50 hover:border-[#C9AA72]/40 p-6 sm:p-7 backdrop-blur-xl flex flex-col justify-between shadow-xl transition-all group">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#C9AA72]">
                Physical R&amp;D
              </span>
              <Wrench className="w-5 h-5 text-[#AEBCC5] group-hover:text-[#C9AA72] transition" />
            </div>
            <h3 className="zx-serif mt-4 text-2xl font-bold text-[#F4F0E8] leading-snug">
              Phòng Thí Nghiệm Sản Phẩm
            </h3>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#AEBCC5]">
              Nghiên cứu chế tác sản phẩm vật lý: Kệ decor mô-đun, chậu bonsai xoay nhôm gốm, đồ gá cơ khí chính xác.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <Link
              href="/san-pham"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9AA72] hover:text-white transition"
            >
              <span>Xem nhật ký R&amp;D</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* SPECIAL ATELIER BENTO TILE: AI & Digital Services */}
        <div className="rounded-3xl border border-white/10 bg-[#102A43]/50 hover:border-[#C9AA72]/40 p-6 sm:p-7 backdrop-blur-xl flex flex-col justify-between shadow-xl transition-all group">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#A8F238]">
                AI &amp; Automation
              </span>
              <Bot className="w-5 h-5 text-[#AEBCC5] group-hover:text-[#A8F238] transition" />
            </div>
            <h3 className="zx-serif mt-4 text-2xl font-bold text-[#F4F0E8] leading-snug">
              Dịch Vụ Số &amp; AI Agents
            </h3>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#AEBCC5]">
              Xây dựng giải pháp Marketing, thiết kế Webapp/App, tự động hóa quy trình lặp lại với Claude, Gemini, GPT.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <Link
              href="/dich-vu"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9AA72] hover:text-white transition"
            >
              <span>Xem quy trình dịch vụ</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* FEED POSTS AS BENTO CARDS */}
        {filteredPosts.map((post, postIndex) => {
          const firstCard = post.cards?.[0];
          const isVideo = firstCard?.cardType === "video";
          const isDoc = firstCard?.cardType === "doc";
          const cardCount = post.cards?.length || 1;

          return (
            <article
              key={post.id}
              onClick={() => onOpenPostInStory(postIndex)}
              className="group rounded-3xl border border-white/10 bg-[#102A43]/40 hover:bg-[#102A43]/70 hover:border-[#C9AA72]/50 p-5 sm:p-6 backdrop-blur-xl flex flex-col justify-between shadow-xl hover:shadow-[0_15px_35px_rgba(201,170,114,0.15)] transition-all duration-300 cursor-pointer"
            >
              <div>
                {/* Media Preview Box */}
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#07111F] border border-white/10 mb-4 flex items-center justify-center">
                  {firstCard?.mediaUrl ? (
                    isVideo ? (
                      <div className="relative w-full h-full flex items-center justify-center bg-black/40">
                        <video
                          src={firstCard.mediaUrl}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          muted
                          playsInline
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-[#07111F]/80 border border-[#C9AA72]/50 flex items-center justify-center text-[#C9AA72]">
                            <Video className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={firstCard.mediaUrl}
                        alt={post.caption || "Tác phẩm ZANGX"}
                        className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        loading="lazy"
                      />
                    )
                  ) : (
                    <div className="p-4 text-center">
                      <FileText className="w-8 h-8 text-[#C9AA72] mx-auto mb-2 opacity-80" />
                      <p className="text-xs text-[#AEBCC5] line-clamp-2">{firstCard?.docContent || "Tài liệu kỹ thuật"}</p>
                    </div>
                  )}

                  {/* Multi-card count badge */}
                  {cardCount > 1 && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#07111F]/80 border border-white/20 text-[10px] font-bold text-[#F4F0E8] flex items-center gap-1 backdrop-blur">
                      <Layers className="w-3 h-3 text-[#A8F238]" />
                      <span>{cardCount} thẻ</span>
                    </span>
                  )}

                  {/* Category Badge */}
                  <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-[#07111F]/80 border border-[#C9AA72]/30 text-[10px] font-black uppercase text-[#C9AA72] backdrop-blur">
                    {post.category}
                  </span>
                </div>

                {/* Caption / Title */}
                <h4 className="zx-serif text-lg sm:text-xl font-bold text-[#F4F0E8] group-hover:text-[#C9AA72] transition-colors line-clamp-2">
                  {post.caption || `Tác phẩm #${postIndex + 1}`}
                </h4>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-[#AEBCC5]">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-[#C9AA72]" />
                    <span>{post._count?.views || 1}</span>
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenGift(post.id);
                    }}
                    className="flex items-center gap-1 hover:text-[#C9AA72] transition"
                    title="Donate cho tác phẩm"
                  >
                    <Heart className="w-3.5 h-3.5 text-[#C9AA72]" />
                    <span>Donate</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSharePost(post);
                    }}
                    className="flex items-center gap-1 hover:text-[#C9AA72] transition"
                    title="Chia sẻ liên kết"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#C9AA72] group-hover:translate-x-0.5 transition-transform">
                  <span>Mở xem</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
