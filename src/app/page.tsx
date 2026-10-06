"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { PostData } from "@/lib/types";
import { GiftModal } from "@/components/modals/GiftModal";
import { PostDetailModal } from "@/components/modals/PostDetailModal";
import { ViewAnalyticsModal } from "@/components/modals/ViewAnalyticsModal";
import { AuthModal } from "@/components/modals/AuthModal";
import { AtelierDock } from "@/components/AtelierDock";
import { ShowroomPinterest } from "@/components/ShowroomPinterest";
import { ZxLogoLockup } from "@/components/portfolio/ZxStar";
import { ChatDrawer } from "@/components/modals/ChatDrawer";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { User, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { io, Socket } from "socket.io-client";
import { PushNotificationPrompt } from "@/components/PushNotificationPrompt";

export default function FeedPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [posts, setPosts] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Drawers state
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [selectedPostIdForGift, setSelectedPostIdForGift] = useState<string | null>(null);
  const [selectedPostForDetail, setSelectedPostForDetail] = useState<PostData | null>(null);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);

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

  // Query params listener for direct links (?chat=1, ?donate=1, ?post=<id>)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("chat") === "1") {
      setIsChatDrawerOpen(true);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  // Mở bài viết chi tiết qua ?post=<id>
  const didDeepLinkToPost = useRef(false);
  useEffect(() => {
    if (didDeepLinkToPost.current || posts.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("post");
    if (postId) {
      const found = posts.find((p) => p.id === postId);
      if (found) {
        setSelectedPostForDetail(found);
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

  // Sao chép liên kết vào clipboard
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

  // Chia sẻ 1 bài viết cụ thể
  const handleSharePost = (post: PostData) => {
    const url = `${window.location.origin}${window.location.pathname}?post=${post.id}`;
    if (navigator.share) {
      navigator
        .share({
          title: "Personal Hub - ZANGX Atelier",
          text: post.caption || "Khám phá không gian số độc bản trên ZANGX",
          url,
        })
        .catch(() => {});
    } else {
      copyLink(url);
    }
  };

  // Xóa bài demo/test ngay trên lưới Hub (Owner) — không cần qua trang Quản Trị
  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này không? Không thể hoàn tác.")) return;
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Đã xóa bài viết thành công!", "success");
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      } else {
        const err = await res.json();
        showToast(err.error || "Không thể xóa bài viết", "error");
      }
    } catch {
      showToast("Lỗi kết nối khi xóa bài viết", "error");
    }
  };

  const handleGiftSent = useCallback((giftValue: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === selectedPostIdForGift
          ? {
              ...p,
              totalGiftValue: (p.totalGiftValue || 0) + giftValue,
              _count: p._count ? { ...p._count, gifts: p._count.gifts + 1 } : p._count,
            }
          : p
      )
    );
  }, [selectedPostIdForGift]);

  const isOwner = user?.role === "owner" || user?.role === "admin";

  if (isLoading) {
    return (
      <div className="h-[100dvh] w-screen bg-[#07111F] flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#C9AA72] to-[#102A43] flex items-center justify-center text-white text-2xl font-black shadow-2xl animate-pulse">
          Z
        </div>
        <p className="text-sm font-bold text-[#F4F0E8]/80">Đang tải không gian số ZANGX...</p>
      </div>
    );
  }

  return (
    <main className="relative w-screen bg-[#07111F] min-h-[100dvh] overflow-x-hidden">
      {/* SHOWROOM PINTEREST MASONRY VIEW */}
      <ShowroomPinterest
        posts={posts}
        onOpenPostDetail={(post) => setSelectedPostForDetail(post)}
        onOpenGift={(id) => {
          setSelectedPostIdForGift(id);
          setIsGiftModalOpen(true);
        }}
        onSharePost={handleSharePost}
        onDeletePost={handleDeletePost}
        filterSheetOpen={isFilterSheetOpen}
        onCloseFilterSheet={() => setIsFilterSheetOpen(false)}
        resetSignal={resetSignal}
        isOwner={isOwner}
      />

      <PushNotificationPrompt />

      {/* TOP FLOATING NAVIGATION BAR */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between pointer-events-none">
        {/* Brand Logo */}
        <div
          className="pointer-events-auto flex items-center gap-2.5 glass-pill px-3 py-1.5 rounded-full shadow-lg"
          title="ZANGX · The Digital Atelier"
        >
          <ZxLogoLockup size="sm" showTagline={false} />
          <span className="max-[440px]:hidden text-[9px] px-1.5 py-0.5 rounded bg-[#C9AA72]/20 text-[#C9AA72] font-extrabold border border-[#C9AA72]/30">
            ATELIER
          </span>
        </div>

        {/* Action Controls & Profile */}
        <div className="pointer-events-auto flex items-center gap-2">
          {isOwner && (
            <Link
              href="/admin"
              className="glass-pill px-3 py-1.5 rounded-full text-xs font-bold text-[#C9AA72] hover:bg-[#C9AA72]/20 border border-[#C9AA72]/40 transition flex items-center gap-1.5 shadow-lg"
              title="Vào Trang Quản Trị Atelier"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9AA72]" />
              <span>Quản Trị</span>
            </Link>
          )}

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
                <span className={`text-[9px] px-1 rounded font-black ${isOwner ? "bg-[#C9AA72] text-[#07111F]" : "bg-[#C9AA72] text-white"}`}>
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

      {/* FLOATING ATELIER DYNAMIC DOCK: Lọc · Home · Đăng nhập/Đăng ký */}
      <AtelierDock
        onOpenFilter={() => setIsFilterSheetOpen(true)}
        onGoHome={() => setResetSignal((n) => n + 1)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        currentUser={user}
      />

      {/* POST DETAIL LIGHTBOX MODAL */}
      <PostDetailModal
        post={selectedPostForDetail}
        isOpen={!!selectedPostForDetail}
        onClose={() => setSelectedPostForDetail(null)}
        onOpenGift={(postId) => {
          setSelectedPostIdForGift(postId);
          setIsGiftModalOpen(true);
        }}
        onSharePost={handleSharePost}
      />

      {/* BANK QR DONATE MODAL */}
      <GiftModal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        postId={selectedPostIdForGift || posts[0]?.id || ""}
        onGiftSent={handleGiftSent}
      />

      {/* VIEW ANALYTICS MODAL */}
      {selectedPostForDetail && (
        <ViewAnalyticsModal
          isOpen={isAnalyticsOpen}
          onClose={() => setIsAnalyticsOpen(false)}
          postId={selectedPostForDetail.id}
        />
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

    </main>
  );
}
