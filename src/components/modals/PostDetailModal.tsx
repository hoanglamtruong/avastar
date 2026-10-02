"use client";

import React, { useState, useEffect } from "react";
import { PostData } from "@/lib/types";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Eye,
  FileText,
  Layers,
} from "lucide-react";
import { ZxStar } from "@/components/portfolio/ZxStar";

interface PostDetailModalProps {
  post: PostData | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenGift: (postId: string) => void;
  onSharePost: (post: PostData) => void;
}

export function PostDetailModal({
  post,
  isOpen,
  onClose,
  onOpenGift,
  onSharePost,
}: PostDetailModalProps) {
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  useEffect(() => {
    setActiveCardIndex(0);
  }, [post?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (!post) return;
      const total = post.cards?.length || 0;
      if (e.key === "ArrowLeft" && activeCardIndex > 0) {
        setActiveCardIndex((prev) => prev - 1);
      }
      if (e.key === "ArrowRight" && activeCardIndex < total - 1) {
        setActiveCardIndex((prev) => prev + 1);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeCardIndex, post, onClose]);

  if (!isOpen || !post) return null;

  const cards = post.cards || [];
  const currentCard = cards[activeCardIndex] || cards[0];
  const isVideo = currentCard?.cardType === "video";
  const isDoc = currentCard?.cardType === "doc";

  return (
    <div
      className="fixed inset-0 z-[990] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-float-up"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#07111F]/95 rounded-3xl border border-[#C9AA72]/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-[#07111F]/80 text-[#F4F0E8]/70 hover:text-white hover:bg-white/10 border border-white/10 transition backdrop-blur-md"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* MEDIA SECTION (LEFT / TOP) */}
        <div className="relative w-full md:w-3/5 bg-black/60 flex items-center justify-center min-h-[260px] md:min-h-[500px] overflow-hidden">
          {currentCard?.mediaUrl ? (
            isVideo ? (
              <video
                src={currentCard.mediaUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full max-h-[70vh] object-contain"
              />
            ) : isDoc ? (
              <div className="p-8 text-left max-w-md">
                <FileText className="w-12 h-12 text-[#C9AA72] mb-4" />
                <h4 className="text-xl font-bold text-white mb-2">{post.caption}</h4>
                <p className="text-sm text-[#AEBCC5] leading-relaxed whitespace-pre-line">
                  {currentCard.docContent || "Tài liệu kỹ thuật số ZANGX"}
                </p>
              </div>
            ) : (
              <img
                src={currentCard.mediaUrl}
                alt={post.caption || "Tác phẩm ZANGX"}
                className="w-full h-full max-h-[70vh] object-contain select-none"
              />
            )
          ) : (
            <div className="p-8 text-center text-[#AEBCC5]">
              <FileText className="w-12 h-12 text-[#C9AA72] mx-auto mb-3 opacity-80" />
              <p className="text-sm">{currentCard?.docContent || "Không có phương tiện hiển thị"}</p>
            </div>
          )}

          {/* Carousel Arrows */}
          {cards.length > 1 && (
            <>
              {activeCardIndex > 0 && (
                <button
                  onClick={() => setActiveCardIndex((prev) => prev - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#07111F]/80 text-white hover:bg-[#C9AA72] hover:text-[#07111F] transition border border-white/20 shadow-lg z-20"
                  title="Thẻ trước"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {activeCardIndex < cards.length - 1 && (
                <button
                  onClick={() => setActiveCardIndex((prev) => prev + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#07111F]/80 text-white hover:bg-[#C9AA72] hover:text-[#07111F] transition border border-white/20 shadow-lg z-20"
                  title="Thẻ tiếp theo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* Card Indicator Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 z-20">
                {cards.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveCardIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === activeCardIndex
                        ? "w-6 bg-[#C9AA72] shadow-[0_0_8px_#C9AA72]"
                        : "bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Category Badge */}
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#07111F]/85 border border-[#C9AA72]/40 text-xs font-black uppercase text-[#C9AA72] backdrop-blur-md z-20">
            {post.category}
          </span>
        </div>

        {/* INFO & ACTIONS SECTION (RIGHT / BOTTOM) */}
        <div className="w-full md:w-2/5 p-5 sm:p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 bg-[#07111F]/60">
          <div>
            {/* Author Lockup */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4">
              <img
                src={post.owner?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                alt=""
                className="w-10 h-10 rounded-full object-cover border border-[#C9AA72]/60 shadow-md"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-black text-white">
                    {post.owner?.fullName || "Trương Hoàng Lam"}
                  </h4>
                  <ZxStar className="w-3.5 h-3.5 text-[#C9AA72]" />
                </div>
                <p className="text-[11px] text-[#AEBCC5]">Sáng lập & Trưởng xưởng ZANGX</p>
              </div>
            </div>

            {/* Caption */}
            <div className="space-y-2 mb-6">
              <h3 className="zx-serif text-lg sm:text-xl font-bold text-[#F4F0E8] leading-snug">
                {post.caption || "Tác phẩm sáng tạo số"}
              </h3>
              {cards.length > 1 && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#AEBCC5]">
                  <Layers className="w-3.5 h-3.5 text-[#A8F238]" />
                  <span>
                    Thẻ {activeCardIndex + 1} / {cards.length}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs text-[#AEBCC5]">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#C9AA72]" />
                <span className="font-bold">{post._count?.views || 1} lượt xem</span>
              </span>
              <button
                type="button"
                onClick={() => onSharePost(post)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#102A43] hover:bg-[#C9AA72]/20 text-[#F4F0E8] hover:text-[#C9AA72] border border-white/15 transition font-bold"
                title="Sao chép liên kết chia sẻ"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Chia sẻ</span>
              </button>
            </div>

            {/* Donate QR Button */}
            <button
              type="button"
              onClick={() => {
                onOpenGift(post.id);
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#C9AA72] to-[#8B6F3F] text-[#07111F] font-black text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(201,170,114,0.3)] hover:opacity-95 active:scale-98 transition transform"
            >
              <Heart className="w-4 h-4 fill-current text-[#07111F]" />
              <span>Ủng Hộ Qua QR Ngân Hàng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
