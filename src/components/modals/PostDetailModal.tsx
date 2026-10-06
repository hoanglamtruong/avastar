"use client";

import React, { useState, useEffect } from "react";
import { PostData } from "@/lib/types";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Share2,
  Eye,
  FileText,
  Layers,
  ArrowRight,
  ExternalLink,
  QrCode,
} from "lucide-react";
import { ZxStar } from "@/components/portfolio/ZxStar";
import { formatCurrency } from "@/lib/utils";
import { COMMERCE_CARD_META, CONTENT_CATEGORY_LABEL } from "@/lib/cardTypeMeta";
import { VietQRPaymentModal } from "@/components/modals/VietQRPaymentModal";
import { RequestLeadModal } from "@/components/modals/RequestLeadModal";
import { AuctionBidModal } from "@/components/modals/AuctionBidModal";

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
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [auctionModalOpen, setAuctionModalOpen] = useState(false);
  const [showCardQr, setShowCardQr] = useState(false);

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
  const commerceMeta = COMMERCE_CARD_META[currentCard?.cardType];
  const meta = currentCard?.cardMetadata || {};

  const handlePackageOrConfirm = async (contact: { name: string; phone: string }) => {
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId: post.id,
        postCardId: currentCard.id,
        orderKind: currentCard.cardType === "package" ? "package" : currentCard.cardType === "reservation" ? "reservation" : "membership",
        itemName: meta.productName || meta.title || meta.planName || "Sản phẩm",
        amount: meta.price ?? meta.depositAmount ?? 0,
        customerName: contact.name,
        customerPhone: contact.phone,
      }),
    });
  };

  const renderCommerceSummary = () => {
    if (!commerceMeta || currentCard.cardType === "donate") return null;
    const Icon = commerceMeta.icon;
    return (
      <div className="p-3 rounded-2xl bg-[#102A43]/60 border border-[#F4F0E8]/10 space-y-1.5 text-xs">
        <div className="flex items-center gap-1.5 text-[#C9AA72] font-extrabold uppercase text-[10px] tracking-wider">
          <Icon className="w-3.5 h-3.5" />
          <span>{commerceMeta.label}</span>
          {meta.contentCategory && (
            <span className="ml-auto px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold text-[#AEBCC5] normal-case tracking-normal">
              {CONTENT_CATEGORY_LABEL[meta.contentCategory as keyof typeof CONTENT_CATEGORY_LABEL]}
            </span>
          )}
        </div>

        {currentCard.cardType === "package" && (
          <>
            <p className="text-white font-bold text-sm">{meta.productName}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-[#C9AA72] font-black">{formatCurrency(meta.price || 0)}</span>
              {meta.originalPrice && <span className="text-[#F4F0E8]/50 line-through text-[11px]">{formatCurrency(meta.originalPrice)}</span>}
            </div>
            {meta.stock !== undefined && <p className="text-[#F4F0E8]/70">Còn {meta.stock} suất</p>}
          </>
        )}
        {currentCard.cardType === "request" && (
          <>
            <p className="text-white font-bold text-sm">{meta.title}</p>
            <p className="text-[#F4F0E8]/80">{meta.scopeDescription}</p>
            {meta.estimatedRange && <p className="text-[#C9AA72]">Khoảng giá tham khảo: {meta.estimatedRange}</p>}
          </>
        )}
        {currentCard.cardType === "reservation" && (
          <>
            <p className="text-white font-bold text-sm">{meta.title}</p>
            {meta.dateTime && <p className="text-[#F4F0E8]/80">🗓️ {new Date(meta.dateTime).toLocaleString("vi-VN")}</p>}
            {meta.location && <p className="text-[#F4F0E8]/80">📍 {meta.location}</p>}
            {meta.slotsTotal !== undefined && (
              <p className="text-[#F4F0E8]/80">
                Còn {Math.max(0, (meta.slotsTotal || 0) - (meta.slotsTaken || 0))}/{meta.slotsTotal} suất
              </p>
            )}
            <p className="text-[#C9AA72] font-bold">{meta.depositAmount ? `Cọc trước: ${formatCurrency(meta.depositAmount)}` : "Không cần đặt cọc"}</p>
          </>
        )}
        {currentCard.cardType === "membership" && (
          <>
            <p className="text-white font-bold text-sm">{meta.planName}</p>
            <p className="text-[#C9AA72] font-black">
              {formatCurrency(meta.price || 0)} / {meta.billingPeriod === "month" ? "tháng" : meta.billingPeriod === "year" ? "năm" : "trọn đời"}
            </p>
            {meta.benefits?.length > 0 && (
              <ul className="space-y-0.5 pt-1">
                {meta.benefits.map((b: string, i: number) => (
                  <li key={i} className="text-[#F4F0E8]/80">• {b}</li>
                ))}
              </ul>
            )}
          </>
        )}
        {currentCard.cardType === "auction" && (
          <>
            <p className="text-white font-bold text-sm">{meta.itemName}</p>
            <p className="text-[#F4F0E8]/80">Giá khởi điểm: {formatCurrency(meta.startingPrice || 0)}</p>
            <p className="text-[#F4F0E8]/80">Kết thúc: {meta.endsAt ? new Date(meta.endsAt).toLocaleString("vi-VN") : ""}</p>
          </>
        )}
      </div>
    );
  };

  const renderActionButton = () => {
    if (post.category === "club" && !commerceMeta) {
      return (
        <button
          type="button"
          onClick={() => setLeadModalOpen(true)}
          className="w-full py-3 rounded-2xl bg-[#102A43] border border-[#C9AA72]/40 text-[#C9AA72] font-black text-sm flex items-center justify-center gap-2 hover:bg-[#C9AA72]/10 transition transform active:scale-98"
        >
          <span>Tham Gia Câu Lạc Bộ</span>
        </button>
      );
    }
    if (!currentCard || !commerceMeta) return null;
    const Icon = commerceMeta.icon;
    const handleClick = () => {
      if (currentCard.cardType === "donate") {
        onOpenGift(post.id);
      } else if (currentCard.cardType === "package" || currentCard.cardType === "reservation" || currentCard.cardType === "membership") {
        setPayModalOpen(true);
      } else if (currentCard.cardType === "request") {
        setLeadModalOpen(true);
      } else if (currentCard.cardType === "auction") {
        setAuctionModalOpen(true);
      }
    };
    return (
      <button
        type="button"
        onClick={handleClick}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#C9AA72] to-[#8B6F3F] text-[#07111F] font-black text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(201,170,114,0.3)] hover:opacity-95 active:scale-98 transition transform"
      >
        <Icon className="w-4 h-4" />
        <span>{commerceMeta.ctaLabel}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    );
  };

  const payAmount = currentCard?.cardType === "package" ? meta.price || 0 : currentCard?.cardType === "reservation" ? meta.depositAmount || 0 : meta.price || 0;
  const payTitle =
    currentCard?.cardType === "package" ? "Mua Ngay" : currentCard?.cardType === "reservation" ? "Giữ Chỗ" : "Đăng Ký Thành Viên";
  const payItemLabel = meta.productName || meta.title || meta.planName || "";

  return (
    <div
      className="fixed inset-0 z-[990] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-float-up"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#07111F]/95 rounded-3xl border border-[#C9AA72]/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-[#07111F]/80 text-[#F4F0E8]/70 hover:text-white hover:bg-white/10 border border-white/10 transition backdrop-blur-md"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative w-full md:w-3/5 bg-black/60 flex items-center justify-center min-h-[260px] md:min-h-[500px] overflow-hidden">
          {currentCard?.mediaUrl ? (
            isVideo ? (
              <video src={currentCard.mediaUrl} controls autoPlay playsInline className="w-full h-full max-h-[70vh] object-contain" />
            ) : isDoc ? (
              <div className="p-8 text-left max-w-md">
                <FileText className="w-12 h-12 text-[#C9AA72] mb-4" />
                <h4 className="text-xl font-bold text-white mb-2">{post.caption}</h4>
                <p className="text-sm text-[#AEBCC5] leading-relaxed whitespace-pre-line">{currentCard.docContent || "Tài liệu kỹ thuật số ZANGX"}</p>
              </div>
            ) : (
              <img src={currentCard.mediaUrl} alt={post.caption || "Tác phẩm ZANGX"} className="w-full h-full max-h-[70vh] object-contain select-none" />
            )
          ) : commerceMeta ? (
            <div className="p-8 text-center text-[#AEBCC5]">
              <commerceMeta.icon className="w-14 h-14 text-[#C9AA72] mx-auto mb-3 opacity-80" />
              <p className="text-sm">{commerceMeta.label}</p>
            </div>
          ) : (
            <div className="p-8 text-center text-[#AEBCC5]">
              <FileText className="w-12 h-12 text-[#C9AA72] mx-auto mb-3 opacity-80" />
              <p className="text-sm">{currentCard?.docContent || "Không có phương tiện hiển thị"}</p>
            </div>
          )}

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
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 z-20">
                {cards.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveCardIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${idx === activeCardIndex ? "w-6 bg-[#C9AA72] shadow-[0_0_8px_#C9AA72]" : "bg-white/40 hover:bg-white/70"}`}
                  />
                ))}
              </div>
            </>
          )}

          <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#07111F]/85 border border-[#C9AA72]/40 text-xs font-black uppercase text-[#C9AA72] backdrop-blur-md z-20">
            {post.category}
          </span>
        </div>

        <div className="w-full md:w-2/5 p-5 sm:p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 bg-[#07111F]/60">
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4">
              <img
                src={post.owner?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                alt=""
                className="w-10 h-10 rounded-full object-cover border border-[#C9AA72]/60 shadow-md"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-black text-white">{post.owner?.fullName || "Trương Hoàng Lam"}</h4>
                  <ZxStar className="w-3.5 h-3.5 text-[#C9AA72]" />
                </div>
                <p className="text-[11px] text-[#AEBCC5]">Sáng lập & Trưởng xưởng ZANGX</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <h3 className="zx-serif text-lg sm:text-xl font-bold text-[#F4F0E8] leading-snug">{post.caption || "Tác phẩm sáng tạo số"}</h3>
              {cards.length > 1 && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#AEBCC5]">
                  <Layers className="w-3.5 h-3.5 text-[#A8F238]" />
                  <span>
                    Thẻ {activeCardIndex + 1} / {cards.length}
                  </span>
                </div>
              )}
            </div>

            {renderCommerceSummary()}
          </div>

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

            {renderActionButton()}

            {meta.externalLink?.url && (
              <a
                href={meta.externalLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-2xl bg-[#102A43] border border-[#F4F0E8]/20 text-[#F4F0E8] hover:border-[#C9AA72] hover:text-[#C9AA72] font-bold text-sm flex items-center justify-center gap-2 transition"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{meta.externalLink.label}</span>
              </a>
            )}

            {meta.qrEnabled && currentCard && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowCardQr((v) => !v)}
                  className="w-full py-2 rounded-2xl bg-transparent border border-white/10 text-[#AEBCC5] hover:text-[#C9AA72] hover:border-[#C9AA72]/40 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>{showCardQr ? "Ẩn mã QR" : "Xem mã QR cho thẻ này"}</span>
                </button>
                {showCardQr && (
                  <div className="flex flex-col items-center gap-1.5 p-3 mt-2 rounded-2xl bg-white">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                        `${typeof window !== "undefined" ? window.location.origin : ""}/?post=${post.id}`
                      )}`}
                      alt="Mã QR tới bài viết này"
                      className="w-32 h-32"
                    />
                    <p className="text-[10px] text-[#07111F]/70 text-center">Quét để mở đúng bài viết này</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {currentCard?.cardType === "request" && (
        <RequestLeadModal
          isOpen={leadModalOpen}
          onClose={() => setLeadModalOpen(false)}
          title={meta.title || "Gửi Yêu Cầu / Báo Giá"}
          subtitle={meta.scopeDescription}
          postId={post.id}
          postCardId={currentCard.id}
          leadType="request"
        />
      )}

      {post.category === "club" && (
        <RequestLeadModal
          isOpen={leadModalOpen}
          onClose={() => setLeadModalOpen(false)}
          title="Tham Gia Câu Lạc Bộ"
          subtitle={post.caption || undefined}
          postId={post.id}
          leadType="club_join"
        />
      )}

      {(currentCard?.cardType === "package" || currentCard?.cardType === "reservation" || currentCard?.cardType === "membership") && (
        <VietQRPaymentModal
          isOpen={payModalOpen}
          onClose={() => setPayModalOpen(false)}
          title={payTitle}
          itemLabel={payItemLabel}
          amount={payAmount}
          transferMessageSeed={`ZANGX ${payItemLabel}`.slice(0, 40)}
          onConfirm={handlePackageOrConfirm}
        />
      )}

      {currentCard?.cardType === "auction" && (
        <AuctionBidModal isOpen={auctionModalOpen} onClose={() => setAuctionModalOpen(false)} postCardId={currentCard.id} meta={meta} />
      )}
    </div>
  );
}
