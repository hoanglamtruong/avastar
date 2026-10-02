"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { PostData, PostCardData } from "@/lib/types";
import { ImageCard } from "@/components/cards/ImageCard";
import { VideoCard } from "@/components/cards/VideoCard";
import { DocCard } from "@/components/cards/DocCard";
import { SubpageCard } from "@/components/cards/SubpageCard";
import { GiftModal } from "@/components/modals/GiftModal";
import { ViewAnalyticsModal } from "@/components/modals/ViewAnalyticsModal";
import { AuthModal } from "@/components/modals/AuthModal";
import { ActionRail } from "@/components/ActionRail";
import { ZxStar } from "@/components/portfolio/ZxStar";
import { ChatDrawer } from "@/components/modals/ChatDrawer";
import { SubpageActionModal } from "@/components/modals/SubpageActionModal";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import {
  Share2,
  Eye,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Layers,
  Info,
  User,
} from "lucide-react";
import Link from "next/link";
import { io, Socket } from "socket.io-client";
import { PushNotificationPrompt } from "@/components/PushNotificationPrompt";

export default function FeedPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [posts, setPosts] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePostIndex, setActivePostIndex] = useState(0);
  const [activeCardIndices, setActiveCardIndices] = useState<{ [postId: string]: number }>({});
  
  // Modals & Drawers state
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [isRailOpen, setIsRailOpen] = useState(true);
  const [actionModal, setActionModal] = useState<{ isOpen: boolean; actionType: string; payload: any }>({
    isOpen: false,
    actionType: "",
    payload: null,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const postViewStartTime = useRef<number>(Date.now());
  const cardViewStartTime = useRef<number>(Date.now());
  const scrollRafRef = useRef<number | null>(null);

  // Touch gesture refs for horizontal card swipe
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  // Fetch Posts
  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch {
      showToast("Không thể tải danh sách bài viết", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // WebSocket Client Listener - strictly for Owner/Admin
  useEffect(() => {
    if (!user || (user.role !== "owner" && user.role !== "admin")) {
      return;
    }

    const socket: Socket = io({
      path: "/socket.io",
      transports: ["websocket", "polling"],
    });

    socket.on("new_comment", (data: any) => {
      const senderName = data?.comment?.member?.fullName || "Thành viên";
      const snippet = data?.comment?.content ? `"${data.comment.content.substring(0, 35)}..."` : "";
      showToast(`💬 Bình luận mới từ ${senderName} ${snippet}`, "info");
      fetchPosts();
    });

    socket.on("new_gift", (data: any) => {
      const senderName = data?.gift?.sender?.fullName || "Thành viên";
      const giftName = data?.gift?.giftType || "quà tặng";
      showToast(`👑 ${senderName} đã gửi tặng "${giftName}" VIP!`, "gold");
      fetchPosts();
    });

    socket.on("new_subpage_action", (data: any) => {
      showToast(data?.notificationText || "🔔 Tương tác mới trên trang phụ!", "info");
    });

    socket.on("new_chat_message", (data: any) => {
      if (data?.message?.senderId !== user.id) {
        const senderName = data?.message?.sender?.fullName || "Thành viên";
        const snippet = data?.message?.content ? `"${data.message.content.substring(0, 30)}..."` : "";
        showToast(`💬 Tin nhắn từ ${senderName}: ${snippet}`, "info");
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user, showToast, fetchPosts]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("chat") === "1") {
      setIsChatDrawerOpen(true);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  // Mở đúng bài viết được chia sẻ qua ?post=<id> (chờ posts tải xong, chỉ chạy 1 lần)
  const didDeepLinkToPost = useRef(false);
  useEffect(() => {
    if (didDeepLinkToPost.current || posts.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("post");
    if (postId) {
      const idx = posts.findIndex((p) => p.id === postId);
      if (idx !== -1) {
        setActivePostIndex(idx);
        requestAnimationFrame(() => scrollToPost(idx));
      }
      window.history.replaceState(null, "", window.location.pathname);
    }
    didDeepLinkToPost.current = true;
  }, [posts]);

  // Mở GiftModal khi vào Hub từ nút Donate trên trang khác (?donate=1)
  const didDeepLinkToDonate = useRef(false);
  useEffect(() => {
    if (didDeepLinkToDonate.current || posts.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("donate") === "1") {
      setIsGiftModalOpen(true);
      window.history.replaceState(null, "", window.location.pathname);
    }
    didDeepLinkToDonate.current = true;
  }, [posts]);

  const activePost = posts[activePostIndex];
  const currentCardIndex = activePost ? (activeCardIndices[activePost.id] || 0) : 0;
  const currentCard = activePost?.cards?.[currentCardIndex];

  // Log View duration on active post/card change
  const logViewMetrics = useCallback((postId: string, durationSec: number, cardIdx: number, cardType: string) => {
    if (durationSec < 1) return;
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId,
        watchDurationSeconds: durationSec,
        cardsViewed: [{ cardIndex: cardIdx, cardType, durationSeconds: durationSec }],
      }),
    }).catch(() => {});
  }, []);

  // Handle scroll detection for snap Y-axis (rAF-throttled to keep scroll buttery smooth)
  const handleScroll = () => {
    if (scrollRafRef.current !== null) return;
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null;
      if (!containerRef.current) return;
      const scrollTop = containerRef.current.scrollTop;
      const viewportHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / viewportHeight);

      if (newIndex !== activePostIndex && newIndex >= 0 && newIndex < posts.length) {
        // Log previous post duration
        const prevPost = posts[activePostIndex];
        if (prevPost) {
          const duration = Math.round((Date.now() - postViewStartTime.current) / 1000);
          const cardIdx = activeCardIndices[prevPost.id] || 0;
          const cardType = prevPost.cards[cardIdx]?.cardType || "image";
          logViewMetrics(prevPost.id, duration, cardIdx, cardType);
        }

        setActivePostIndex(newIndex);
        postViewStartTime.current = Date.now();
        cardViewStartTime.current = Date.now();
      }
    });
  };

  useEffect(() => {
    return () => {
      if (scrollRafRef.current !== null) cancelAnimationFrame(scrollRafRef.current);
    };
  }, []);

  // Switch card within current post
  const handleSwitchCard = (postId: string, newIdx: number, totalCards: number) => {
    if (newIdx < 0 || newIdx >= totalCards) return;
    
    // Log previous card duration
    const currentIdx = activeCardIndices[postId] || 0;
    const duration = Math.round((Date.now() - cardViewStartTime.current) / 1000);
    const cardType = activePost?.cards[currentIdx]?.cardType || "image";
    logViewMetrics(postId, duration, currentIdx, cardType);

    setActiveCardIndices((prev) => ({ ...prev, [postId]: newIdx }));
    cardViewStartTime.current = Date.now();
  };

  // Touch event handlers for Horizontal Card Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (postId: string, currentIdx: number, totalCards: number) => {
    const deltaX = touchEndX.current - touchStartX.current;
    const deltaY = touchEndY.current - touchStartY.current;

    // Threshold: |deltaX| > 50px and horizontal movement exceeds vertical movement to prevent conflict with vertical snap-scroll
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0 && currentIdx < totalCards - 1) {
        // Swiped Left -> Next Card
        handleSwitchCard(postId, currentIdx + 1, totalCards);
      } else if (deltaX > 0 && currentIdx > 0) {
        // Swiped Right -> Prev Card
        handleSwitchCard(postId, currentIdx - 1, totalCards);
      }
    }
  };

  const scrollToPost = (index: number) => {
    if (!containerRef.current || index < 0 || index >= posts.length) return;
    containerRef.current.scrollTo({
      top: index * window.innerHeight,
      behavior: "smooth",
    });
  };

  // Sao chép liên kết vào clipboard, có phương án dự phòng khi Clipboard API
  // không khả dụng (HTTP không bảo mật, trình duyệt chặn quyền, v.v.)
  const copyLink = (url: string) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => showToast("Đã sao chép liên kết bài viết vào clipboard!", "success"))
        .catch(() => showToast("Không sao chép được, hãy chép liên kết trên thanh địa chỉ", "error"));
      return;
    }
    try {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      showToast("Đã sao chép liên kết bài viết vào clipboard!", "success");
    } catch {
      showToast("Không sao chép được, hãy chép liên kết trên thanh địa chỉ", "error");
    }
  };

  // Chia sẻ đúng 1 bài viết cụ thể trong feed (không cần bài đó đang active)
  const handleSharePost = (post: PostData) => {
    const url = `${window.location.origin}${window.location.pathname}?post=${post.id}`;
    if (navigator.share) {
      navigator
        .share({
          title: "Personal Hub - AVASTAR",
          text: post.caption || "Khám phá không gian số độc bản trên Personal Hub",
          url,
        })
        .catch(() => {});
    } else {
      copyLink(url);
    }
  };

  const handleGiftSent = useCallback((giftValue: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === activePost?.id
          ? {
              ...p,
              totalGiftValue: (p.totalGiftValue || 0) + giftValue,
              _count: p._count ? { ...p._count, gifts: p._count.gifts + 1 } : p._count,
            }
          : p
      )
    );
  }, [activePost?.id]);

  const isOwner = user?.role === "owner" || user?.role === "admin";

  if (isLoading) {
    return (
      <div className="h-[100dvh] w-screen bg-[#07111F] flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#C9AA72] to-[#102A43] flex items-center justify-center text-white text-2xl font-black shadow-2xl animate-pulse">
          Z
        </div>
        <p className="text-sm font-bold text-[#F4F0E8]/80">Đang tải không gian số AVASTAR...</p>
      </div>
    );
  }

  return (
    <main className="relative h-[100dvh] w-screen overflow-hidden bg-[#07111F]">
      <PushNotificationPrompt />
      
      {/* TOP FLOATING NAVIGATION BAR */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between pointer-events-none">
        {/* Brand Logo */}
        <div className="pointer-events-auto flex items-center gap-2 glass-pill px-3.5 py-1.5 rounded-full shadow-lg">
          <ZxStar className="w-5 h-5 text-[#C9AA72]" />
          <span className="text-xs font-black text-white tracking-[0.12em]">
            ZANG<span className="text-[#C9AA72]">X</span>
          </span>
          <span className="max-[440px]:hidden text-[10px] px-1.5 py-0.2 rounded bg-[#C9AA72]/20 text-[#C9AA72] font-extrabold border border-[#C9AA72]/30">
            PWA
          </span>
        </div>

        {/* Action Controls & Profile */}
        <div className="pointer-events-auto flex items-center gap-2">
          <Link
            href="/landing"
            className="glass-pill px-3 py-1.5 rounded-full text-xs font-bold text-white hover:text-[#C9AA72] transition flex items-center gap-1 shadow-lg"
          >
            <Info className="w-3.5 h-3.5 text-[#C9AA72]" />
            <span className="hidden sm:inline">Giới Thiệu</span>
          </Link>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="glass-pill px-3 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1.5 shadow-lg border hover:border-[#C9AA72] transition"
          >
            {user ? (
              <>
                <img
                  src={user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                  className="w-5 h-5 rounded-full object-cover border border-[#F4F0E8]/30"
                  alt=""
                />
                <span className="hidden sm:inline max-w-[80px] truncate">{user.fullName}</span>
                <span className={`text-[9px] px-1 rounded font-black ${isOwner ? "bg-[#C9AA72] text-darkBg" : "bg-[#C9AA72] text-white"}`}>
                  {user.role.toUpperCase()}
                </span>
              </>
            ) : (
              <>
                <User className="w-4 h-4 text-[#C9AA72]" />
                <span>Đăng Nhập</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* TIKTOK SNAP-SCROLL VIEWPORT CONTAINER (DOM VIRTUALIZATION ENGINE) */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-scroll snap-y-mandatory no-scrollbar relative"
      >
        {posts.map((post, postIndex) => {
          // Virtualization 3 Viewport Rule: Render ONLY [i-1, i, i+1]
          const isNearActive = Math.abs(postIndex - activePostIndex) <= 1;
          const isCurrent = postIndex === activePostIndex;
          const cardIdx = activeCardIndices[post.id] || 0;
          const totalCards = post.cards?.length || 0;
          const activeCard = post.cards?.[cardIdx];

          if (!isNearActive) {
            // Unmount from DOM to conserve RAM and guarantee 60 FPS
            return (
              <section
                key={post.id}
                className="h-[100dvh] w-full snap-start snap-always relative flex items-center justify-center bg-[#07111F]"
              >
                <div className="w-8 h-8 rounded-full border-2 border-[#C9AA72]/20 border-t-[#C9AA72] animate-spin" />
              </section>
            );
          }

          return (
            <section
              key={post.id}
              className={`h-[100dvh] w-full snap-start snap-always relative flex flex-col items-center justify-center pt-12 pb-4 sm:pt-0 sm:pb-0 overflow-hidden transition-[padding] duration-300 ${isRailOpen ? "pr-[4.25rem]" : "pr-6"} sm:pr-0`}
            >
              {/* DYNAMIC BLURRED BACKGROUND */}
              <div
                className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-35 scale-125 transition-all duration-700 pointer-events-none"
                style={{
                  backgroundImage: `url(${activeCard?.mediaUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080"})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#07111F]/60 via-transparent to-[#07111F]/90 pointer-events-none" />

              {/* MAIN FLOATING CARD CAROUSEL CONTAINER (Fix B: Centered layout on mobile with balanced height) */}
              <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => handleTouchEnd(post.id, cardIdx, totalCards)}
                className="relative z-10 w-full max-w-[390px] sm:max-w-[420px] h-[65dvh] sm:h-[78dvh] max-h-[520px] sm:max-h-[640px] px-3.5 sm:px-3 flex flex-col items-center justify-center mx-auto select-none"
              >
                {/* CARD CONTAINER WITH X-AXIS CAROUSEL */}
                <div className="relative w-full h-full rounded-[24px] shadow-2xl transition-all duration-300">
                  {activeCard && (
                    <>
                      {activeCard.cardType === "image" && <ImageCard card={activeCard} />}
                      {activeCard.cardType === "video" && (
                        <VideoCard card={activeCard} isActive={isCurrent} />
                      )}
                      {activeCard.cardType === "doc" && <DocCard card={activeCard} />}
                      {["store", "event", "job", "work", "dating", "training", "sop"].includes(
                        activeCard.cardType
                      ) && (
                        <SubpageCard
                          card={activeCard}
                          onOpenAction={(actionType, payload) =>
                            setActionModal({ isOpen: true, actionType, payload })
                          }
                        />
                      )}
                    </>
                  )}

                  {/* Fix A: Horizontal Swipe / Navigation Arrows (HIDDEN ON MOBILE, VISIBLE ON DESKTOP) */}
                  {totalCards > 1 && (
                    <>
                      {cardIdx > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSwitchCard(post.id, cardIdx - 1, totalCards);
                          }}
                          className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#102A43]/80 text-white backdrop-blur-md border border-[#F4F0E8]/20 hover:bg-[#C9AA72] transition z-30 shadow-lg items-center justify-center"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      )}
                      {cardIdx < totalCards - 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSwitchCard(post.id, cardIdx + 1, totalCards);
                          }}
                          className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#102A43]/80 text-white backdrop-blur-md border border-[#F4F0E8]/20 hover:bg-[#C9AA72] transition z-30 shadow-lg items-center justify-center"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}

                  {/* Multi-Card Indicator Badge */}
                  {totalCards > 1 && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/20 flex items-center gap-1 shadow-lg pointer-events-none">
                      <Layers className="w-3 h-3 text-[#C9AA72]" />
                      <span>{cardIdx + 1}/{totalCards}</span>
                    </div>
                  )}
                </div>

                {/* BOTTOM OVERLAY INFO (Caption & Owner) */}
                <div className="w-full mt-2.5 px-1 sm:px-2 z-20">
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <div className="flex items-center gap-1.5">
                      <img
                        src={post.owner?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-[#C9AA72]/50 shadow-md"
                        alt=""
                      />
                      <span className="text-[11px] sm:text-xs font-black text-white drop-shadow truncate max-w-[110px] sm:max-w-none">
                        {post.owner?.fullName || "Zangx"}
                      </span>
                      <span className="px-1.5 py-0.2 rounded-full text-[8px] sm:text-[9px] font-extrabold uppercase bg-[#C9AA72]/20 text-[#C9AA72] border border-[#C9AA72]/30">
                        {post.category}
                      </span>
                    </div>

                    {/* Owner View Count Button */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          if (isOwner) {
                            setIsAnalyticsOpen(true);
                          } else {
                            showToast(`Lượt xem bài viết: ${post._count?.views || 1} lượt`, "info");
                          }
                        }}
                        className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#102A43]/80 text-[#F4F0E8] border border-[#F4F0E8]/20 hover:border-[#C9AA72] transition shadow-md"
                        title={isOwner ? "Bấm để xem thống kê chi tiết" : "Lượt xem"}
                      >
                        <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C9AA72]" />
                        <span>{post._count?.views || 1}</span>
                      </button>

                      {/* Chia sẻ đúng bài viết này (không cần bài đang active) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSharePost(post);
                        }}
                        className="flex items-center justify-center p-1 sm:p-1.5 rounded-full bg-[#102A43]/80 text-[#F4F0E8] border border-[#F4F0E8]/20 hover:border-[#C9AA72] hover:text-[#C9AA72] transition shadow-md"
                        title="Chia sẻ bài viết này"
                      >
                        <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Caption */}
                  {post.caption && (
                    <p className="text-[11px] sm:text-xs text-[#F4F0E8]/90 leading-tight sm:leading-relaxed drop-shadow line-clamp-2">
                      {post.caption}
                    </p>
                  )}
                </div>
              </div>

              {/* VERTICAL POST NAVIGATION HINTS (Desktop) */}
              <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col gap-3 z-30 pointer-events-auto">
                <button
                  disabled={activePostIndex === 0}
                  onClick={() => scrollToPost(activePostIndex - 1)}
                  className="p-3 rounded-full glass-pill text-white disabled:opacity-30 hover:bg-[#C9AA72] transition shadow-xl"
                  title="Bài trước"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                <button
                  disabled={activePostIndex === posts.length - 1}
                  onClick={() => scrollToPost(activePostIndex + 1)}
                  className="p-3 rounded-full glass-pill text-white disabled:opacity-30 hover:bg-[#C9AA72] transition shadow-xl"
                  title="Bài tiếp theo"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </section>
          );
        })}
      </div>

      {/* CỘT THAO TÁC DỌC BÊN PHẢI (C2O/C2C): xem trước, thao tác sau; kéo trượt vào/ra mép phải */}
      {activePost && (
        <ActionRail
          giftValue={activePost.totalGiftValue}
          open={isRailOpen}
          onOpenChange={setIsRailOpen}
          gift={{ onClick: () => setIsGiftModalOpen(true) }}
          chat={{ onClick: () => setIsChatDrawerOpen(true) }}
        />
      )}

      {/* MODALS & DRAWERS */}
      {activePost && (
        <>
          <GiftModal
            isOpen={isGiftModalOpen}
            onClose={() => setIsGiftModalOpen(false)}
            postId={activePost.id}
            onGiftSent={handleGiftSent}
          />
          <ViewAnalyticsModal
            isOpen={isAnalyticsOpen}
            onClose={() => setIsAnalyticsOpen(false)}
            postId={activePost.id}
          />
        </>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <ChatDrawer
        isOpen={isChatDrawerOpen}
        onClose={() => setIsChatDrawerOpen(false)}
        onOpenAuth={() => {
          setIsChatDrawerOpen(false);
          setIsAuthModalOpen(true);
        }}
      />

      <SubpageActionModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ isOpen: false, actionType: "", payload: null })}
        actionType={actionModal.actionType}
        payload={actionModal.payload}
        postId={activePost?.id}
      />
    </main>
  );
}
