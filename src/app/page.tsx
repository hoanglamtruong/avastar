"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { PostData, PostCardData } from "@/lib/types";
import { ImageCard } from "@/components/cards/ImageCard";
import { VideoCard } from "@/components/cards/VideoCard";
import { DocCard } from "@/components/cards/DocCard";
import { SubpageCard } from "@/components/cards/SubpageCard";
import { GiftModal } from "@/components/modals/GiftModal";
import { CommentDrawer } from "@/components/modals/CommentDrawer";
import { ViewAnalyticsModal } from "@/components/modals/ViewAnalyticsModal";
import { AuthModal } from "@/components/modals/AuthModal";
import { ChatDrawer } from "@/components/modals/ChatDrawer";
import { SubpageActionModal } from "@/components/modals/SubpageActionModal";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import {
  Gift,
  MessageSquare,
  Share2,
  Eye,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Info,
  ExternalLink,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";

export default function FeedPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [posts, setPosts] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePostIndex, setActivePostIndex] = useState(0);
  const [activeCardIndices, setActiveCardIndices] = useState<{ [postId: string]: number }>({});
  
  // Modals & Drawers state
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [actionModal, setActionModal] = useState<{ isOpen: boolean; actionType: string; payload: any }>({
    isOpen: false,
    actionType: "",
    payload: null,
  });

  const [expandedCaptions, setExpandedCaptions] = useState<{ [postId: string]: boolean }>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const postViewStartTime = useRef<number>(Date.now());
  const cardViewStartTime = useRef<number>(Date.now());

  // Fetch Posts
  const fetchPosts = async () => {
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
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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

  // Handle scroll detection for snap Y-axis
  const handleScroll = () => {
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
  };

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

  const scrollToPost = (index: number) => {
    if (!containerRef.current || index < 0 || index >= posts.length) return;
    containerRef.current.scrollTo({
      top: index * window.innerHeight,
      behavior: "smooth",
    });
  };

  const handleShare = () => {
    if (navigator.share && activePost) {
      navigator
        .share({
          title: "Personal Hub - AVASTAR",
          text: activePost.caption || "Khám phá không gian số độc bản trên Personal Hub",
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Đã sao chép liên kết bài viết vào clipboard!", "success");
    }
  };

  const isOwner = user?.role === "owner" || user?.role === "admin";

  if (isLoading) {
    return (
      <div className="h-[100dvh] w-screen bg-[#0B1A2C] flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0095CF] to-[#183A60] flex items-center justify-center text-white text-2xl font-black shadow-2xl animate-pulse">
          Z
        </div>
        <p className="text-sm font-bold text-[#D4DBF5]/80">Đang tải không gian số AVASTAR...</p>
      </div>
    );
  }

  return (
    <main className="relative h-[100dvh] w-screen overflow-hidden bg-[#0B1A2C]">
      
      {/* TOP FLOATING NAVIGATION BAR */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between pointer-events-none">
        {/* Brand Logo */}
        <div className="pointer-events-auto flex items-center gap-2.5 glass-pill px-3.5 py-1.5 rounded-full shadow-lg">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#0095CF] to-[#183A60] flex items-center justify-center font-black text-white text-xs">
            Z
          </div>
          <span className="text-xs font-black text-white tracking-wider">
            PERSONAL <span className="text-[#0095CF]">HUB</span>
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#FEC401]/20 text-[#FEC401] font-extrabold border border-[#FEC401]/30">
            PWA
          </span>
        </div>

        {/* Action Controls & Profile */}
        <div className="pointer-events-auto flex items-center gap-2">
          <Link
            href="/landing"
            className="glass-pill px-3 py-1.5 rounded-full text-xs font-bold text-white hover:text-[#0095CF] transition flex items-center gap-1 shadow-lg"
          >
            <Info className="w-3.5 h-3.5 text-[#0095CF]" />
            <span className="hidden sm:inline">Giới Thiệu</span>
          </Link>

          <button
            onClick={() => setIsChatDrawerOpen(true)}
            className="glass-pill p-2 rounded-full text-white hover:text-[#0095CF] transition shadow-lg relative"
            title="Chat 1-1 với Owner"
          >
            <MessageSquare className="w-4 h-4 text-[#0095CF]" />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#FF7F00] animate-ping" />
          </button>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="glass-pill px-3 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1.5 shadow-lg border hover:border-[#0095CF] transition"
          >
            {user ? (
              <>
                <img
                  src={user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                  className="w-5 h-5 rounded-full object-cover border border-[#D4DBF5]/30"
                  alt=""
                />
                <span className="hidden sm:inline max-w-[80px] truncate">{user.fullName}</span>
                <span className={`text-[9px] px-1 rounded font-black ${isOwner ? "bg-[#FEC401] text-darkBg" : "bg-[#0095CF] text-white"}`}>
                  {user.role.toUpperCase()}
                </span>
              </>
            ) : (
              <>
                <User className="w-4 h-4 text-[#0095CF]" />
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
                className="h-[100dvh] w-full snap-start snap-always relative flex items-center justify-center bg-[#0B1A2C]"
              >
                <div className="w-8 h-8 rounded-full border-2 border-[#0095CF]/20 border-t-[#0095CF] animate-spin" />
              </section>
            );
          }

          return (
            <section
              key={post.id}
              className="h-[100dvh] w-full snap-start snap-always relative flex items-center justify-center overflow-hidden"
            >
              {/* DYNAMIC BLURRED BACKGROUND */}
              <div
                className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-35 scale-125 transition-all duration-700 pointer-events-none"
                style={{
                  backgroundImage: `url(${activeCard?.mediaUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080"})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0B1A2C]/60 via-transparent to-[#0B1A2C]/90 pointer-events-none" />

              {/* MAIN FLOATING CARD CAROUSEL CONTAINER */}
              <div className="relative z-10 w-full max-w-[420px] h-[78dvh] max-h-[640px] px-3 flex flex-col items-center justify-center">
                
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

                  {/* Horizontal Swipe / Navigation Arrows */}
                  {totalCards > 1 && (
                    <>
                      {cardIdx > 0 && (
                        <button
                          onClick={() => handleSwitchCard(post.id, cardIdx - 1, totalCards)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#183A60]/80 text-white backdrop-blur-md border border-[#D4DBF5]/20 hover:bg-[#0095CF] transition z-30 shadow-lg"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      )}
                      {cardIdx < totalCards - 1 && (
                        <button
                          onClick={() => handleSwitchCard(post.id, cardIdx + 1, totalCards)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#183A60]/80 text-white backdrop-blur-md border border-[#D4DBF5]/20 hover:bg-[#0095CF] transition z-30 shadow-lg"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}

                  {/* Multi-Card Indicator Badge */}
                  {totalCards > 1 && (
                    <div className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/20 flex items-center gap-1 shadow-lg pointer-events-none">
                      <Layers className="w-3 h-3 text-[#0095CF]" />
                      <span>{cardIdx + 1} / {totalCards}</span>
                    </div>
                  )}
                </div>

                {/* BOTTOM OVERLAY INFO (Caption & Owner) */}
                <div className="w-full mt-3 px-2 z-20">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.owner?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                        className="w-7 h-7 rounded-full object-cover border border-[#FEC401]/50 shadow-md"
                        alt=""
                      />
                      <span className="text-xs font-black text-white drop-shadow">
                        {post.owner?.fullName || "Zangx"}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-[#0095CF]/20 text-[#0095CF] border border-[#0095CF]/30">
                        {post.category}
                      </span>
                    </div>

                    {/* Owner View Count Button */}
                    <button
                      onClick={() => {
                        if (isOwner) {
                          setIsAnalyticsOpen(true);
                        } else {
                          showToast(`Lượt xem bài viết: ${post._count?.views || 1} lượt`, "info");
                        }
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#183A60]/80 text-[#D4DBF5] border border-[#D4DBF5]/20 hover:border-[#0095CF] transition shadow-md"
                      title={isOwner ? "Bấm để xem thống kê chi tiết" : "Lượt xem"}
                    >
                      <Eye className="w-3.5 h-3.5 text-[#0095CF]" />
                      <span>{post._count?.views || 1}</span>
                    </button>
                  </div>

                  {/* Caption */}
                  {post.caption && (
                    <p className="text-xs text-[#D4DBF5]/90 leading-relaxed drop-shadow line-clamp-2">
                      {post.caption}
                    </p>
                  )}
                </div>
              </div>

              {/* VERTICAL ACTION BAR (Right Side) */}
              <div className="absolute right-3 sm:right-6 bottom-20 z-40 flex flex-col items-center gap-4 select-none">
                
                {/* 1. Tặng Quà VIP Button (#FEC401 GOLD) */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => setIsGiftModalOpen(true)}
                    className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FEC401] to-[#FF7F00] text-darkBg flex items-center justify-center shadow-2xl glass-gold-glow animate-pulse-gold transform active:scale-90 transition"
                    title="Tặng Quà VIP"
                  >
                    <Gift className="w-6 h-6 text-[#0B1A2C]" />
                  </button>
                  <span className="text-[10px] font-black text-[#FEC401] drop-shadow">
                    {post.totalGiftValue ? `${Math.round(post.totalGiftValue / 1000)}k` : "Tặng Quà"}
                  </span>
                </div>

                {/* 2. Bình luận 1-1 Button */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => setIsCommentDrawerOpen(true)}
                    className="w-12 h-12 rounded-full glass-panel text-white flex items-center justify-center hover:text-[#0095CF] hover:border-[#0095CF] shadow-xl transform active:scale-90 transition border border-[#D4DBF5]/20"
                    title="Bình Luận 1-1 Riêng Tư"
                  >
                    <MessageSquare className="w-5 h-5 text-[#0095CF]" />
                  </button>
                  <span className="text-[10px] font-bold text-white drop-shadow">
                    {post._count?.comments || 0}
                  </span>
                </div>

                {/* 3. Chia sẻ Button */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={handleShare}
                    className="w-12 h-12 rounded-full glass-panel text-white flex items-center justify-center hover:text-[#0095CF] hover:border-[#0095CF] shadow-xl transform active:scale-90 transition border border-[#D4DBF5]/20"
                    title="Chia sẻ"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <span className="text-[10px] font-bold text-[#D4DBF5]/80 drop-shadow">
                    Chia sẻ
                  </span>
                </div>
              </div>

              {/* VERTICAL POST NAVIGATION HINTS */}
              <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col gap-3 z-30 pointer-events-auto">
                <button
                  disabled={activePostIndex === 0}
                  onClick={() => scrollToPost(activePostIndex - 1)}
                  className="p-3 rounded-full glass-pill text-white disabled:opacity-30 hover:bg-[#0095CF] transition shadow-xl"
                  title="Bài trước"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                <button
                  disabled={activePostIndex === posts.length - 1}
                  onClick={() => scrollToPost(activePostIndex + 1)}
                  className="p-3 rounded-full glass-pill text-white disabled:opacity-30 hover:bg-[#0095CF] transition shadow-xl"
                  title="Bài tiếp theo"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </section>
          );
        })}
      </div>

      {/* MODALS & DRAWERS */}
      {activePost && (
        <>
          <GiftModal
            isOpen={isGiftModalOpen}
            onClose={() => setIsGiftModalOpen(false)}
            postId={activePost.id}
            onGiftSent={fetchPosts}
          />
          <CommentDrawer
            isOpen={isCommentDrawerOpen}
            onClose={() => setIsCommentDrawerOpen(false)}
            postId={activePost.id}
            onOpenAuth={() => {
              setIsCommentDrawerOpen(false);
              setIsAuthModalOpen(true);
            }}
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
