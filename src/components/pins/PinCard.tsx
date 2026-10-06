"use client";

import React, { useState, useRef } from "react";
import { PostData } from "@/lib/types";
import { COMMERCE_CARD_META, findCommerceCard, getCtaLabel } from "@/lib/cardTypeMeta";
import {
  Heart,
  Share2,
  Layers,
  Eye,
  Video,
  FileText,
  Sparkles,
} from "lucide-react";

interface PinCardProps {
  post: PostData;
  index: number;
  onOpenDetail: (post: PostData) => void;
  onOpenGift: (postId: string) => void;
  onShare: (post: PostData) => void;
}

export function PinCard({
  post,
  index,
  onOpenDetail,
  onOpenGift,
  onShare,
}: PinCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const firstCard = post.cards?.[0];
  const isVideo = firstCard?.cardType === "video";
  const isDoc = firstCard?.cardType === "doc";
  const commerceCard = findCommerceCard(post.cards);
  const cardCount = post.cards?.length || 1;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (isVideo && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (isVideo && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const catInfo = commerceCard
    ? { label: COMMERCE_CARD_META[commerceCard.cardType]?.label || post.category, color: COMMERCE_CARD_META[commerceCard.cardType]?.color || "text-[#C9AA72] border-[#C9AA72]/30" }
    : { label: "Nội Dung", color: "text-[#F4F0E8] border-white/20" };

  return (
    <article
      onClick={() => onOpenDetail(post)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group break-inside-avoid mb-4 inline-block w-full cursor-pointer transition-all duration-300"
    >
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#102A43]/40 border border-white/10 hover:border-[#C9AA72]/50 hover:shadow-[0_16px_36px_rgba(201,170,114,0.18)] transition-all duration-300 backdrop-blur-md">
        {/* MEDIA CONTAINER */}
        <div className="relative w-full overflow-hidden bg-[#07111F]">
          {firstCard?.mediaUrl ? (
            isVideo ? (
              <div className="relative w-full aspect-[4/5] bg-black/50 overflow-hidden">
                <video
                  ref={videoRef}
                  src={firstCard.mediaUrl}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  muted
                  loop
                  playsInline
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#07111F]/80 border border-[#C9AA72]/50 flex items-center justify-center text-[#C9AA72] shadow-lg group-hover:scale-110 transition-transform">
                    <Video className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={firstCard.mediaUrl}
                alt={post.caption || `Tác phẩm ZANGX #${index + 1}`}
                className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-500 block"
                loading="lazy"
              />
            )
          ) : isDoc ? (
            <div className="p-5 bg-gradient-to-b from-[#102A43] to-[#07111F] min-h-[160px] flex flex-col justify-between border-b border-white/5">
              <div className="flex items-center gap-2 text-[#C9AA72]">
                <FileText className="w-5 h-5" />
                <span className="text-[11px] font-extrabold uppercase tracking-wider">Tài Liệu / SOP</span>
              </div>
              <p className="text-xs text-[#AEBCC5] line-clamp-4 leading-relaxed font-mono mt-2">
                {firstCard?.docContent || "Tài liệu kỹ thuật và quy trình vận hành..."}
              </p>
            </div>
          ) : (
            <div className="p-8 bg-[#102A43]/50 min-h-[160px] flex items-center justify-center text-center">
              <div>
                <Sparkles className="w-8 h-8 text-[#C9AA72] mx-auto mb-2 opacity-80" />
                <p className="text-xs text-[#AEBCC5]">ZANGX Atelier Creation</p>
              </div>
            </div>
          )}

          {/* BADGES PERMANENT (Top) */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            {/* Category tag */}
            <span
              className={`px-2.5 py-1 rounded-full bg-[#07111F]/85 backdrop-blur-md text-[10px] font-black uppercase tracking-wider border shadow-md ${catInfo.color}`}
            >
              {catInfo.label}
            </span>

            {/* Multi-card count badge */}
            {cardCount > 1 && (
              <span className="px-2 py-0.5 rounded-full bg-[#07111F]/85 backdrop-blur-md border border-white/20 text-[10px] font-bold text-[#F4F0E8] flex items-center gap-1 shadow-md">
                <Layers className="w-3 h-3 text-[#A8F238]" />
                <span>{cardCount}</span>
              </span>
            )}
          </div>

          {/* PINTEREST HOVER OVERLAY (Interactive Quick Actions) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07111F]/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none flex flex-col justify-between p-3">
            {/* Top action row */}
            <div className="flex justify-end pointer-events-auto">
              {commerceCard?.cardType === "donate" ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenGift(post.id);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C9AA72] hover:bg-[#dfc48c] text-[#07111F] font-bold text-xs shadow-xl hover:scale-105 active:scale-95 transition-all"
                  title="Ủng hộ tác phẩm (VietQR)"
                >
                  <Heart className="w-3.5 h-3.5 fill-[#07111F]" />
                  <span>Donate</span>
                </button>
              ) : commerceCard ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDetail(post);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C9AA72] hover:bg-[#dfc48c] text-[#07111F] font-bold text-xs shadow-xl hover:scale-105 active:scale-95 transition-all"
                  title={getCtaLabel(commerceCard.cardType, commerceCard.cardMetadata)}
                >
                  <span>{getCtaLabel(commerceCard.cardType, commerceCard.cardMetadata)}</span>
                </button>
              ) : null}
            </div>

            {/* Bottom action row */}
            <div className="flex justify-end pointer-events-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(post);
                }}
                className="w-8 h-8 rounded-full bg-[#07111F]/85 hover:bg-[#C9AA72] text-[#F4F0E8] hover:text-[#07111F] border border-white/20 hover:border-[#C9AA72] flex items-center justify-center shadow-lg transition-colors"
                title="Chia sẻ liên kết Pin"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* PIN CARD FOOTER (Pinterest style: Caption + Author + Metrics) */}
        <div className="p-3 sm:p-3.5">
          {/* Post Caption */}
          {post.caption && (
            <h4 className="text-xs sm:text-sm font-semibold text-[#F4F0E8] group-hover:text-[#C9AA72] transition-colors line-clamp-2 leading-snug mb-2">
              {post.caption}
            </h4>
          )}

          {/* Metrics (không hiện tác giả — Personal Hub mặc định mọi bài đều của 1 người) */}
          <div className="flex items-center justify-end pt-1">
            <div className="flex items-center gap-2 text-[11px] text-[#AEBCC5]/90 shrink-0 font-medium">
              <span className="flex items-center gap-0.5" title="Lượt xem">
                <Eye className="w-3 h-3 text-[#C9AA72]" />
                <span>{post._count?.views || 1}</span>
              </span>
              {(post._count?.gifts || 0) > 0 && (
                <span className="flex items-center gap-0.5 text-[#C9AA72]" title="Lượt ủng hộ">
                  <Heart className="w-3 h-3 fill-[#C9AA72]" />
                  <span>{post._count?.gifts}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
