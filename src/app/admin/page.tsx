"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";
import { PostData } from "@/lib/types";
import { CreatePostModal } from "@/components/modals/CreatePostModal";
import { ZxLogoLockup, ZxStar } from "@/components/portfolio/ZxStar";
import {
  ShieldCheck,
  Plus,
  Trash2,
  Eye,
  ExternalLink,
  LogOut,
  ArrowLeft,
  RefreshCw,
  MessageSquare,
  Heart,
  Layers,
  Lock,
  UserCheck,
  Sparkles,
} from "lucide-react";

interface AdminStats {
  postsCount: number;
  viewsCount: number;
  commentsCount: number;
  conversationsCount: number;
  totalGiftSum: number;
}

interface RecentGift {
  id: string;
  giftType: string;
  giftValue: number;
  message: string | null;
  createdAt: string;
  sender: {
    fullName: string;
    email: string;
    avatarUrl: string | null;
  };
  post: {
    id: string;
    caption: string | null;
  };
}

export default function AdminPage() {
  const { user, isLoading: isAuthLoading, login, switchUser, logout } = useAuth();
  const { showToast } = useToast();

  const [posts, setPosts] = useState<PostData[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentGifts, setRecentGifts] = useState<RecentGift[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "gifts">("posts");
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  // Login Form State
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const isOwner = user?.role === "owner" || user?.role === "admin";

  // Fetch admin overview and posts
  const loadDashboardData = useCallback(async () => {
    if (!isOwner) return;
    setIsLoadingData(true);
    try {
      const [overviewRes, postsRes] = await Promise.all([
        fetch("/api/admin/overview"),
        fetch("/api/posts"),
      ]);

      if (overviewRes.ok) {
        const overviewData = await overviewRes.json();
        setStats(overviewData.stats);
        setRecentGifts(overviewData.recentGifts || []);
      }

      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData.posts || []);
      }
    } catch {
      showToast("Không thể tải thông tin quản trị", "error");
    } finally {
      setIsLoadingData(false);
    }
  }, [isOwner, showToast]);

  useEffect(() => {
    if (isOwner) {
      loadDashboardData();
    }
  }, [isOwner, loadDashboardData]);

  // Handle Quick Login as Owner
  const handleQuickLoginAsOwner = async () => {
    setIsLoggingIn(true);
    try {
      await switchUser("owner");
      showToast("Đã kích hoạt phiên làm việc quyền OWNER thành công!", "success");
    } catch {
      showToast("Lỗi khi chuyển vai trò", "error");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Normal Login Form
  const handleLoginForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) {
      showToast("Vui lòng nhập email quản trị", "error");
      return;
    }
    setIsLoggingIn(true);
    const success = await login(emailInput, passwordInput || "123456");
    setIsLoggingIn(false);
    if (success) {
      showToast("Đăng nhập quản trị thành công!", "success");
    } else {
      showToast("Tài khoản hoặc mật khẩu không chính xác", "error");
    }
  };

  // Delete Post
  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.")) {
      return;
    }

    setDeletingPostId(postId);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        showToast("Đã xóa bài viết thành công!", "success");
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        loadDashboardData();
      } else {
        const err = await res.json();
        showToast(err.error || "Không thể xóa bài viết", "error");
      }
    } catch {
      showToast("Lỗi kết nối khi xóa bài viết", "error");
    } finally {
      setDeletingPostId(null);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="h-screen w-screen bg-[#07111F] flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#C9AA72] to-[#102A43] flex items-center justify-center text-white text-2xl font-black shadow-2xl animate-pulse">
          Z
        </div>
        <p className="text-sm font-bold text-[#F4F0E8]/80">Đang xác thực quyền truy cập...</p>
      </div>
    );
  }

  // 1. MÀN HÌNH ĐĂNG NHẬP / CỔNG QUẢN TRỊ (Nếu chưa có quyền Owner/Admin)
  if (!isOwner) {
    return (
      <main className="min-h-screen w-screen bg-[#07111F] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[#C9AA72]/10 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md p-6 sm:p-8 rounded-[32px] bg-[#102A43]/50 border border-[#C9AA72]/30 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#C9AA72]/20 border border-[#C9AA72]/40 text-[#C9AA72] mb-1">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
              Cổng Quản Trị ZANGX
            </h1>
            <p className="text-xs text-[#AEBCC5]">
              Khu vực bảo mật dành riêng cho Quản trị viên & Trưởng xưởng số
            </p>
          </div>

          {/* Quick 1-Click Login for Owner */}
          <div className="p-4 rounded-2xl bg-[#07111F]/80 border border-[#C9AA72]/30 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#C9AA72]">
              <Sparkles className="w-4 h-4 text-[#A8F238]" />
              <span>Chế độ Demo / Truy cập nhanh:</span>
            </div>
            <button
              type="button"
              onClick={handleQuickLoginAsOwner}
              disabled={isLoggingIn}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C9AA72] to-[#8B6F3F] text-[#07111F] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:opacity-95 active:scale-95 transition transform"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isLoggingIn ? "Đang xử lý..." : "👑 Đăng Nhập Nhanh Vai Trò OWNER"}</span>
            </button>
            <p className="text-[10px] text-center text-[#AEBCC5]">
              Tự động đăng nhập tài khoản Trưởng xưởng (zang@zeebee.vn)
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-white/10" />
            <span className="text-[10px] uppercase font-bold text-[#AEBCC5]">Hoặc đăng nhập mật khẩu</span>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginForm} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#AEBCC5] mb-1">Email:</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="zang@zeebee.vn"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111F] border border-white/15 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9AA72]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#AEBCC5] mb-1">Mật khẩu:</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111F] border border-white/15 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9AA72]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 rounded-xl bg-[#102A43] hover:bg-[#102A43]/80 border border-white/20 text-white font-bold text-xs transition"
            >
              {isLoggingIn ? "Đang xác thực..." : "Xác Nhận Đăng Nhập"}
            </button>
          </form>

          {/* Back to Home */}
          <div className="text-center pt-2 border-t border-white/10">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#AEBCC5] hover:text-[#C9AA72] transition font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay về trang chủ Showroom</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 2. MÀN HÌNH DASHBOARD QUẢN TRỊ TRUNG TÂM (Đã đăng nhập Owner)
  return (
    <main className="min-h-screen w-screen bg-[#07111F] text-white p-4 sm:p-8 space-y-6">
      {/* TOP HEADER */}
      <header className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-3xl bg-[#102A43]/40 border border-[#C9AA72]/30 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link href="/" title="Về trang chủ">
            <ZxLogoLockup size="sm" showTagline={false} />
          </Link>
          <div className="h-6 w-[1px] bg-white/15" />
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-[#C9AA72]" />
            <h1 className="text-sm sm:text-base font-black tracking-wider text-[#F4F0E8]">
              TRUNG TÂM QUẢN TRỊ ATELIER
            </h1>
          </div>
        </div>

        {/* User profile actions */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center gap-2">
            <img
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
              alt=""
              className="w-7 h-7 rounded-full object-cover border border-[#C9AA72]/50"
            />
            <div className="text-left hidden md:block">
              <p className="text-xs font-black text-white">{user?.fullName}</p>
              <p className="text-[10px] text-[#C9AA72] font-mono">{user?.role?.toUpperCase()}</p>
            </div>
          </div>

          <Link
            href="/"
            className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-bold text-[#AEBCC5] hover:text-white border border-white/10 transition flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Showroom</span>
          </Link>

          <button
            type="button"
            onClick={logout}
            className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition"
            title="Đăng xuất"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* KPI CARDS */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#102A43]/40 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C9AA72]/20 flex items-center justify-center text-[#C9AA72] border border-[#C9AA72]/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-[#AEBCC5] font-semibold uppercase">Tổng bài viết</p>
              <h3 className="text-xl sm:text-2xl font-black text-white">{stats?.postsCount ?? posts.length}</h3>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#102A43]/40 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#A8F238]/20 flex items-center justify-center text-[#A8F238] border border-[#A8F238]/30">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-[#AEBCC5] font-semibold uppercase">Lượt xem tổng</p>
              <h3 className="text-xl sm:text-2xl font-black text-white">{stats?.viewsCount ?? 0}</h3>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#102A43]/40 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C9AA72]/20 flex items-center justify-center text-[#C9AA72] border border-[#C9AA72]/30">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <p className="text-[11px] text-[#AEBCC5] font-semibold uppercase">Donate & Quà</p>
              <h3 className="text-lg sm:text-xl font-black text-[#C9AA72]">
                {formatCurrency(stats?.totalGiftSum ?? 0)}
              </h3>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#102A43]/40 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-[#AEBCC5] font-semibold uppercase">Hội thoại & Chat</p>
              <h3 className="text-xl sm:text-2xl font-black text-white">{stats?.conversationsCount ?? 0}</h3>
            </div>
          </div>
        </section>

        {/* ACTION BAR */}
        <section className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#102A43]/20 border border-white/10">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("posts")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
                activeTab === "posts"
                  ? "bg-[#C9AA72] text-[#07111F] shadow-lg"
                  : "bg-white/5 text-[#AEBCC5] hover:text-white"
              }`}
            >
              Quản Lý Bài Viết ({posts.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("gifts")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
                activeTab === "gifts"
                  ? "bg-[#C9AA72] text-[#07111F] shadow-lg"
                  : "bg-white/5 text-[#AEBCC5] hover:text-white"
              }`}
            >
              Lịch Sử Donate ({recentGifts.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadDashboardData}
              disabled={isLoadingData}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-[#AEBCC5] hover:text-white transition"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingData ? "animate-spin text-[#C9AA72]" : ""}`} />
            </button>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C9AA72] to-[#8B6F3F] text-[#07111F] font-black text-xs flex items-center gap-2 shadow-lg hover:opacity-95 active:scale-95 transition transform"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Bài Viết Mới</span>
            </button>
          </div>
        </section>

        {/* TAB 1: POSTS TABLE */}
        {activeTab === "posts" && (
          <section className="rounded-3xl bg-[#102A43]/30 border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#07111F]/80 text-[#AEBCC5] uppercase text-[10px] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Bài Viết</th>
                    <th className="py-3 px-3">Chuyên mục</th>
                    <th className="py-3 px-3">Số thẻ</th>
                    <th className="py-3 px-3">Lượt xem</th>
                    <th className="py-3 px-3">Donate</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {posts.map((post) => {
                    const firstCard = post.cards?.[0];
                    const isDeleting = deletingPostId === post.id;
                    return (
                      <tr key={post.id} className="hover:bg-white/5 transition">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#07111F] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                            {firstCard?.mediaUrl ? (
                              <img src={firstCard.mediaUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Layers className="w-5 h-5 text-[#C9AA72]" />
                            )}
                          </div>
                          <div className="max-w-[240px] sm:max-w-sm truncate">
                            <p className="font-bold text-white text-xs truncate">
                              {post.caption || "Tác phẩm không tên"}
                            </p>
                            <p className="text-[10px] text-[#AEBCC5] font-mono">
                              {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#C9AA72]/20 text-[#C9AA72] border border-[#C9AA72]/30">
                            {post.category}
                          </span>
                        </td>

                        <td className="py-3 px-3 font-semibold text-[#AEBCC5]">
                          {post.cards?.length || 1} thẻ
                        </td>

                        <td className="py-3 px-3 font-bold text-white">
                          {post._count?.views || 0}
                        </td>

                        <td className="py-3 px-3 font-bold text-[#C9AA72]">
                          {formatCurrency(post.totalGiftValue || 0)}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <Link
                              href={`/?post=${post.id}`}
                              target="_blank"
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-[#AEBCC5] hover:text-white transition"
                              title="Xem chi tiết bài viết"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleDeletePost(post.id)}
                              disabled={isDeleting}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition"
                              title="Xóa bài viết"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 2: GIFTS & DONATIONS TABLE */}
        {activeTab === "gifts" && (
          <section className="rounded-3xl bg-[#102A43]/30 border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#07111F]/80 text-[#AEBCC5] uppercase text-[10px] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Người Gửi</th>
                    <th className="py-3 px-3">Loại Quà / Hình Thức</th>
                    <th className="py-3 px-3">Số Tiền</th>
                    <th className="py-3 px-4">Lời Nhắn</th>
                    <th className="py-3 px-3 text-right">Thời Gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentGifts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[#AEBCC5]">
                        Chưa có lịch sử ủng hộ nào.
                      </td>
                    </tr>
                  ) : (
                    recentGifts.map((gift) => (
                      <tr key={gift.id} className="hover:bg-white/5 transition">
                        <td className="py-3 px-4 flex items-center gap-2.5">
                          <img
                            src={gift.sender?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover border border-[#C9AA72]/40"
                          />
                          <div>
                            <p className="font-bold text-white text-xs">{gift.sender?.fullName || "Ẩn danh"}</p>
                            <p className="text-[10px] text-[#AEBCC5]">{gift.sender?.email}</p>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#C9AA72]/20 text-[#C9AA72] border border-[#C9AA72]/30">
                            {gift.giftType}
                          </span>
                        </td>

                        <td className="py-3 px-3 font-extrabold text-[#C9AA72]">
                          {formatCurrency(Number(gift.giftValue))}
                        </td>

                        <td className="py-3 px-4 text-[#AEBCC5] italic max-w-xs truncate">
                          "{gift.message || "Không có lời nhắn"}"
                        </td>

                        <td className="py-3 px-3 text-right font-mono text-[10px] text-[#AEBCC5]">
                          {new Date(gift.createdAt).toLocaleString("vi-VN")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      {/* CREATE POST MODAL */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={() => {
          loadDashboardData();
          setIsCreateModalOpen(false);
        }}
      />
    </main>
  );
}
