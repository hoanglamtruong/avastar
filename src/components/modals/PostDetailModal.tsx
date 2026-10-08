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
  Link2,
  QrCode,
  Download,
} from "lucide-react";
import { ZxStar } from "@/components/portfolio/ZxStar";
import { formatCurrency } from "@/lib/utils";
import { COMMERCE_CARD_META, getCtaLabel, isFreeCommerceCard } from "@/lib/cardTypeMeta";
import { useToast } from "@/components/ui/Toast";
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
  const { showToast } = useToast();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [auctionModalOpen, setAuctionModalOpen] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);

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

  const handleDownloadQr = async () => {
    setIsShareMenuOpen(false);
    try {
      const link = `${window.location.origin}${window.location.pathname}?post=${post.id}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(link)}`;
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `qr-${post.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
      showToast("Đã tải mã QR về máy!", "success");
    } catch {
      showToast("Không thể tải mã QR", "error");
    }
  };

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
    if (!commerceMeta || currentCard.cardType === "donate" || currentCard.cardType === "link" || currentCard.cardType === "download") return null;
    const Icon = commerceMeta.icon;
    return (
      <div className="p-3 rounded-2xl bg-[#102A43]/60 border border-[#F4F0E8]/10 space-y-1.5 text-xs">
        <div className="flex items-center gap-1.5 text-[#C9AA72] font-extrabold uppercase text-[10px] tracking-wider">
          <Icon className="w-3.5 h-3.5" />
          <span>{commerceMeta.label}</span>
          {meta.contentCategory && (
            <span className="ml-auto px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold text-[#AEBCC5] normal-case tracking-normal">
              {meta.contentCategory}
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
        {(currentCard.cardType === "request" || currentCard.cardType === "apply") && (
          <>
            <p className="text-white font-bold text-sm">{meta.title}</p>
            <p className="text-[#F4F0E8]/80">{meta.scopeDescription}</p>
            {meta.estimatedRange && (
              <p className="text-[#C9AA72]">
                {currentCard.cardType === "apply" ? "Mức lương tham khảo" : "Khoảng giá tham khảo"}: {meta.estimatedRange}
              </p>
            )}
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
        {currentCard.cardType === "claim" && (
          <>
            <p className="text-white font-bold text-sm">{meta.itemName}</p>
            {meta.description && <p className="text-[#F4F0E8]/80">{meta.description}</p>}
            {meta.stock !== undefined && <p className="text-[#F4F0E8]/70">Còn {meta.stock} suất</p>}
          </>
        )}
      </div>
    );
  };

  const isPricedCommerce = currentCard && ["package", "reservation", "membership"].includes(currentCard.cardType);
  const isFree = isPricedCommerce ? isFreeCommerceCard(currentCard.cardType, meta) : false;
  // Nút nào mở form thu lead (name/phone) thay vì thanh toán VietQR hay flow riêng:
  // request/apply luôn qua lead "request"; claim luôn qua lead "free_claim"; còn
  // package/reservation/membership chỉ qua lead khi giá = 0 (free_claim).
  const leadFlow: "request" | "free_claim" | null =
    currentCard?.cardType === "request" || currentCard?.cardType === "apply"
      ? "request"
      : currentCard?.cardType === "claim"
      ? "free_claim"
      : isPricedCommerce && isFree
      ? "free_claim"
      : null;

  const renderActionButton = () => {
    if (!currentCard || !commerceMeta) return null;
    const Icon = commerceMeta.icon;
    const handleClick = () => {
      if (currentCard.cardType === "donate") {
        onOpenGift(post.id);
      } else if (currentCard.cardType === "auction") {
        setAuctionModalOpen(true);
      } else if (currentCard.cardType === "link") {
        window.open(meta.url, "_blank", "noopener,noreferrer");
      } else if (currentCard.cardType === "download") {
        const a = document.createElement("a");
        a.href = meta.url;
        a.download = "";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else if (leadFlow) {
        setLeadModalOpen(true);
      } else if (isPricedCommerce) {
        setPayModalOpen(true);
      }
    };
    return (
      <button
        type="button"
        onClick={handleClick}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#C9AA72] to-[#8B6F3F] text-[#07111F] font-black text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(201,170,114,0.3)] hover:opacity-95 active:scale-98 transition transform"
      >
        <Icon className="w-4 h-4" />
        <span>{getCtaLabel(currentCard.cardType, meta)}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    );
  };

  const payAmount = currentCard?.cardType === "package" ? meta.price || 0 : currentCard?.cardType === "reservation" ? meta.depositAmount || 0 : meta.price || 0;
  const payTitle =
    currentCard?.cardType === "package" ? "Mua Ngay" : currentCard?.cardType === "reservation" ? "Đăng Ký" : "Tham Gia Thành Viên";
  const payItemLabel = meta.productName || meta.title || meta.planName || "";

  // Tiêu đề form thu lead — khác nhau theo đúng ngữ cảnh nút đã bấm
  const leadTitle =
    currentCard?.cardType === "apply"
      ? `Ứng Tuyển: ${meta.title || ""}`
      : currentCard?.cardType === "request"
      ? meta.title || "Gửi Yêu Cầu / Báo Giá"
      : currentCard?.cardType === "claim"
      ? `Nhận Miễn Phí: ${meta.itemName || ""}`
      : currentCard?.cardType === "package"
      ? `Nhận Miễn Phí: ${meta.productName || ""}`
      : currentCard?.cardType === "reservation"
      ? `Đăng Ký Miễn Phí: ${meta.title || ""}`
      : `Tham Gia Miễn Phí: ${meta.planName || ""}`;
  const leadSubtitle =
    currentCard?.cardType === "apply"
      ? "Để lại thông tin, ZANGX sẽ liên hệ trao đổi hồ sơ ứng tuyển của bạn."
      : currentCard?.cardType === "request"
      ? meta.scopeDescription
      : currentCard?.cardType === "claim"
      ? meta.description || "Để lại thông tin, ZANGX sẽ liên hệ gửi quà/ưu đãi cho bạn."
      : "Để lại thông tin, ZANGX sẽ liên hệ xác nhận miễn phí cho bạn.";

  return (
    <div
      className="fixed inset-0 z-[990] bg-[#030810] backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-float-up"
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
                <a
                  href={currentCard.mediaUrl}
                  download
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C9AA72] to-[#8B6F3F] text-[#07111F] font-black text-sm shadow-lg hover:opacity-95 active:scale-95 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải Xuống</span>
                </a>
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

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsShareMenuOpen((v) => !v)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#102A43] hover:bg-[#C9AA72]/20 text-[#F4F0E8] hover:text-[#C9AA72] border border-white/15 transition font-bold"
                  title="Chia sẻ bài viết"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Chia sẻ</span>
                </button>

                {isShareMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsShareMenuOpen(false)} />
                    <div className="absolute right-0 bottom-9 z-50 w-44 rounded-xl bg-[#07111F] border border-[#C9AA72]/30 shadow-2xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          setIsShareMenuOpen(false);
                          onSharePost(post);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-[#F4F0E8] hover:bg-[#C9AA72]/15 transition-colors"
                      >
                        <Link2 className="w-3.5 h-3.5 text-[#C9AA72]" />
                        <span>Chia Sẻ Liên Kết</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadQr}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-[#F4F0E8] hover:bg-[#C9AA72]/15 transition-colors border-t border-white/10"
                      >
                        <QrCode className="w-3.5 h-3.5 text-[#A8F238]" />
                        <span>Tải Mã QR</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {renderActionButton()}
          </div>
        </div>
      </div>

      {leadFlow && currentCard && (
        <RequestLeadModal
          isOpen={leadModalOpen}
          onClose={() => setLeadModalOpen(false)}
          title={leadTitle}
          subtitle={leadSubtitle}
          postId={post.id}
          postCardId={currentCard.id}
          leadType={leadFlow}
        />
      )}

      {isPricedCommerce && !isFree && (
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
