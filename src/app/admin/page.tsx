"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";
import { PostData } from "@/lib/types";
import { CARD_KIND_META } from "@/lib/cardTypeMeta";
import { EditPostModal } from "@/components/modals/EditPostModal";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ZxLogoLockup } from "@/components/portfolio/ZxStar";
import {
  ShieldCheck,
  Trash2,
  Edit3,
  ExternalLink,
  LogOut,
  ArrowLeft,
  RefreshCw,
  Layers,
  Lock,
  ShoppingCart,
  Inbox,
  Gavel,
  Gift,
  LayoutDashboard,
} from "lucide-react";

interface AdminStats {
  postsCount: number;
  viewsCount: number;
  commentsCount: number;
  conversationsCount: number;
  totalGiftSum: number;
  ordersCount: number;
  leadsCount: number;
  bidsCount: number;
  totalOrderSum: number;
}

interface CardTypeBreakdownRow {
  cardType: string;
  count: number;
}

interface AdminOverview {
  stats: AdminStats;
  cardTypeBreakdown: CardTypeBreakdownRow[];
  recentGifts: any[];
  recentOrders: any[];
  recentLeads: any[];
  recentBids: any[];
}

const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  cancelled: "Đã hủy",
};

const LEAD_STATUS_LABEL: Record<string, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  done: "Hoàn tất",
};

export default function AdminPage() {
  const { user, isLoading: isAuthLoading, login, logout } = useAuth();
  const { showToast } = useToast();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<"dashboard" | "posts">("dashboard");

  // Data states
  const [posts, setPosts] = useState<PostData[]>([]);
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Dashboard filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>("all");

  // Modals state
  const [editingPost, setEditingPost] = useState<PostData | null>(null);

  // Login Form State
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const isOwner = user?.role === "owner" || user?.role === "admin";

  // Fetch all dashboard data
  const loadAllData = useCallback(async () => {
    if (!isOwner) return;
    setIsLoadingData(true);
    try {
      const [overviewRes, postsRes] = await Promise.all([
        fetch("/api/admin/overview"),
        fetch("/api/posts"),
      ]);

      if (overviewRes.ok) {
        const oData = await overviewRes.json();
        setOverview(oData);
      }
      if (postsRes.ok) {
        const pData = await postsRes.json();
        setPosts(pData.posts || []);
      }
    } catch {
      showToast("Không thể tải thông tin quản trị", "error");
    } finally {
      setIsLoadingData(false);
    }
  }, [isOwner, showToast]);

  useEffect(() => {
    if (isOwner) {
      loadAllData();
    }
  }, [isOwner, loadAllData]);

  const filteredOrders = useMemo(() => {
    const rows = overview?.recentOrders || [];
    if (orderStatusFilter === "all") return rows;
    return rows.filter((o) => o.status === orderStatusFilter);
  }, [overview, orderStatusFilter]);

  const filteredLeads = useMemo(() => {
    const rows = overview?.recentLeads || [];
    if (leadStatusFilter === "all") return rows;
    return rows.filter((l) => l.status === leadStatusFilter);
  }, [overview, leadStatusFilter]);

  const maxCardTypeCount = useMemo(() => {
    const rows = overview?.cardTypeBreakdown || [];
    return Math.max(1, ...rows.map((r) => r.count));
  }, [overview]);

  // Handle Normal Login Form
  const handleLoginForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) {
      showToast("Vui lòng nhập email và mật khẩu quản trị", "error");
      return;
    }
    setIsLoggingIn(true);
    const success = await login(emailInput, passwordInput);
    setIsLoggingIn(false);
    if (success) {
      showToast("Đăng nhập quản trị thành công!", "success");
    } else {
      showToast("Tài khoản hoặc mật khẩu không chính xác", "error");
    }
  };

  // Delete Post
  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này không? Không thể hoàn tác.")) return;
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Đã xóa bài viết thành công!", "success");
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        loadAllData();
      } else {
        const err = await res.json();
        showToast(err.error || "Không thể xóa bài viết", "error");
      }
    } catch {
      showToast("Lỗi kết nối khi xóa bài viết", "error");
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

          <div className="flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-white/10" />
            <span className="text-[10px] uppercase font-bold text-[#AEBCC5]">Hoặc đăng nhập mật khẩu</span>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>

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

  const stats = overview?.stats;

  // 2. DASHBOARD QUẢN TRỊ TRUNG TÂM (Đã đăng nhập Owner)
  return (
    <main className="min-h-screen w-screen bg-[#07111F] text-white p-4 sm:p-8 space-y-6">
      {/* TOP HEADER */}
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-3xl bg-[#102A43]/40 border border-[#C9AA72]/30 backdrop-blur-xl">
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

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center gap-2">
            <img
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
              alt=""
              className="w-8 h-8 rounded-full object-cover border border-[#C9AA72]/50 shadow"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100";
              }}
            />
            <div className="text-left hidden md:block">
              <p className="text-xs font-black text-white">{user?.fullName}</p>
              <p className="text-[10px] text-[#C9AA72] font-mono">{user?.role?.toUpperCase()}</p>
            </div>
          </div>

          <ThemeToggle />
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

      <div className="max-w-7xl mx-auto space-y-6">
        {/* TAB NAVIGATION BAR */}
        <section className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#102A43]/20 border border-white/10">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("dashboard")}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition ${
                activeTab === "dashboard"
                  ? "bg-[#C9AA72] text-[#07111F] shadow-lg"
                  : "bg-white/5 text-[#AEBCC5] hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Tổng Quan</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("posts")}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition ${
                activeTab === "posts"
                  ? "bg-[#C9AA72] text-[#07111F] shadow-lg"
                  : "bg-white/5 text-[#AEBCC5] hover:text-white"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Tác Phẩm & Ảnh ({posts.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={loadAllData}
            disabled={isLoadingData}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-[#AEBCC5] hover:text-white transition"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingData ? "animate-spin text-[#C9AA72]" : ""}`} />
          </button>
        </section>

        {/* TAB: TỔNG QUAN (DASHBOARD) */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* KPI CARDS */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#102A43]/40 border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C9AA72]/20 flex items-center justify-center text-[#C9AA72] border border-[#C9AA72]/30">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-[#AEBCC5] font-semibold uppercase">Tác phẩm / Lượt xem</p>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {stats?.postsCount ?? 0} <span className="text-xs text-[#AEBCC5] font-bold">/ {stats?.viewsCount ?? 0}</span>
                  </h3>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#102A43]/40 border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8] border border-[#38BDF8]/30">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-[#AEBCC5] font-semibold uppercase">Đơn hàng</p>
                  <h3 className="text-xl sm:text-2xl font-black text-white">{stats?.ordersCount ?? 0}</h3>
                  <p className="text-[10px] text-[#38BDF8] font-bold">{formatCurrency(stats?.totalOrderSum || 0)}</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#102A43]/40 border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#A8F238]/20 flex items-center justify-center text-[#A8F238] border border-[#A8F238]/30">
                  <Inbox className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-[#AEBCC5] font-semibold uppercase">Yêu cầu / Lead</p>
                  <h3 className="text-xl sm:text-2xl font-black text-white">{stats?.leadsCount ?? 0}</h3>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#102A43]/40 border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E879F9]/20 flex items-center justify-center text-[#E879F9] border border-[#E879F9]/30">
                  <Gavel className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-[#AEBCC5] font-semibold uppercase">Lượt đặt giá</p>
                  <h3 className="text-xl sm:text-2xl font-black text-white">{stats?.bidsCount ?? 0}</h3>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#102A43]/40 border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C9AA72]/20 flex items-center justify-center text-[#C9AA72] border border-[#C9AA72]/30">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-[#AEBCC5] font-semibold uppercase">Tổng Donate</p>
                  <h3 className="text-lg sm:text-xl font-black text-[#C9AA72]">{formatCurrency(stats?.totalGiftSum || 0)}</h3>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#102A43]/40 border border-white/10 flex items-center gap-3 col-span-2 lg:col-span-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                  <Inbox className="w-5 h-5" />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] text-[#AEBCC5] font-semibold uppercase">Bình luận</p>
                    <h3 className="text-base sm:text-lg font-black text-white">{stats?.commentsCount ?? 0}</h3>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#AEBCC5] font-semibold uppercase">Hội thoại 1-1</p>
                    <h3 className="text-base sm:text-lg font-black text-white">{stats?.conversationsCount ?? 0}</h3>
                  </div>
                </div>
              </div>
            </section>

            {/* CHART: PHÂN LOẠI THEO HÌNH THÁI */}
            <section className="rounded-3xl bg-[#102A43]/30 border border-white/10 p-5 sm:p-6 space-y-4">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-[#C9AA72]" />
                <span>Phân Bố Thẻ Theo Hình Thái</span>
              </h3>
              {(overview?.cardTypeBreakdown?.length ?? 0) === 0 ? (
                <p className="text-xs text-[#AEBCC5]">Chưa có thẻ nghiệp vụ nào.</p>
              ) : (
                <div className="space-y-2.5">
                  {overview!.cardTypeBreakdown.map((row) => {
                    const label = (CARD_KIND_META as any)[row.cardType]?.label || row.cardType;
                    const pct = Math.round((row.count / maxCardTypeCount) * 100);
                    return (
                      <div key={row.cardType} className="flex items-center gap-3">
                        <div className="w-32 sm:w-40 shrink-0 text-xs font-bold text-[#AEBCC5] truncate">{label}</div>
                        <div className="flex-1 h-5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#C9AA72] to-[#8B6F3F] flex items-center justify-end px-2"
                            style={{ width: `${Math.max(pct, 6)}%` }}
                          >
                            <span className="text-[10px] font-black text-[#07111F]">{row.count}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* ĐƠN HÀNG GẦN ĐÂY */}
            <section className="rounded-3xl bg-[#102A43]/30 border border-white/10 overflow-hidden shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 p-4 border-b border-white/10">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-[#38BDF8]" />
                  <span>Đơn Hàng Gần Đây</span>
                </h3>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#07111F] border border-white/15 text-xs text-white focus:outline-none focus:border-[#C9AA72]"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#07111F]/80 text-[#AEBCC5] uppercase text-[10px] tracking-wider border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">Sản phẩm</th>
                      <th className="py-3 px-3">Khách</th>
                      <th className="py-3 px-3">Giá trị</th>
                      <th className="py-3 px-3">Trạng thái</th>
                      <th className="py-3 px-4">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 px-4 text-center text-[#AEBCC5]">
                          Chưa có đơn hàng nào.
                        </td>
                      </tr>
                    )}
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-white/5 transition">
                        <td className="py-3 px-4 font-bold text-white">{o.itemName}</td>
                        <td className="py-3 px-3 text-[#AEBCC5]">{o.customerName} · {o.customerPhone}</td>
                        <td className="py-3 px-3 font-bold text-[#C9AA72]">{formatCurrency(Number(o.amount) || 0)}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-white/10 text-white">
                            {ORDER_STATUS_LABEL[o.status] || o.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#AEBCC5] font-mono text-[10px]">
                          {new Date(o.createdAt).toLocaleString("vi-VN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* YÊU CẦU / LEAD GẦN ĐÂY */}
            <section className="rounded-3xl bg-[#102A43]/30 border border-white/10 overflow-hidden shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 p-4 border-b border-white/10">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-[#A8F238]" />
                  <span>Yêu Cầu / Đăng Ký Gần Đây</span>
                </h3>
                <select
                  value={leadStatusFilter}
                  onChange={(e) => setLeadStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#07111F] border border-white/15 text-xs text-white focus:outline-none focus:border-[#C9AA72]"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="new">Mới</option>
                  <option value="contacted">Đã liên hệ</option>
                  <option value="done">Hoàn tất</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#07111F]/80 text-[#AEBCC5] uppercase text-[10px] tracking-wider border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">Khách</th>
                      <th className="py-3 px-3">Liên hệ</th>
                      <th className="py-3 px-3">Loại</th>
                      <th className="py-3 px-3">Trạng thái</th>
                      <th className="py-3 px-4">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredLeads.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 px-4 text-center text-[#AEBCC5]">
                          Chưa có yêu cầu nào.
                        </td>
                      </tr>
                    )}
                    {filteredLeads.map((l) => (
                      <tr key={l.id} className="hover:bg-white/5 transition">
                        <td className="py-3 px-4 font-bold text-white">{l.name}</td>
                        <td className="py-3 px-3 text-[#AEBCC5]">{l.phone}{l.email ? ` · ${l.email}` : ""}</td>
                        <td className="py-3 px-3 text-[#AEBCC5]">{l.leadType === "free_claim" ? "Nhận miễn phí" : "Yêu cầu"}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-white/10 text-white">
                            {LEAD_STATUS_LABEL[l.status] || l.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#AEBCC5] font-mono text-[10px]">
                          {new Date(l.createdAt).toLocaleString("vi-VN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ĐẤU GIÁ GẦN ĐÂY */}
            <section className="rounded-3xl bg-[#102A43]/30 border border-white/10 overflow-hidden shadow-xl">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Gavel className="w-4 h-4 text-[#E879F9]" />
                  <span>Đặt Giá Gần Đây</span>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#07111F]/80 text-[#AEBCC5] uppercase text-[10px] tracking-wider border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">Người đặt giá</th>
                      <th className="py-3 px-3">Giá đặt</th>
                      <th className="py-3 px-4">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(overview?.recentBids?.length ?? 0) === 0 && (
                      <tr>
                        <td colSpan={3} className="py-6 px-4 text-center text-[#AEBCC5]">
                          Chưa có lượt đặt giá nào.
                        </td>
                      </tr>
                    )}
                    {overview?.recentBids.map((b) => (
                      <tr key={b.id} className="hover:bg-white/5 transition">
                        <td className="py-3 px-4 font-bold text-white">{b.bidderName} · {b.bidderPhone}</td>
                        <td className="py-3 px-3 font-bold text-[#E879F9]">{formatCurrency(Number(b.amount) || 0)}</td>
                        <td className="py-3 px-4 text-[#AEBCC5] font-mono text-[10px]">
                          {new Date(b.createdAt).toLocaleString("vi-VN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* TAB: TÁC PHẨM & ẢNH (POSTS) */}
        {activeTab === "posts" && (
          <section className="rounded-3xl bg-[#102A43]/30 border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#07111F]/80 text-[#AEBCC5] uppercase text-[10px] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Ảnh & Tác Phẩm</th>
                    <th className="py-3 px-3">Chuyên mục</th>
                    <th className="py-3 px-3">Số thẻ ảnh</th>
                    <th className="py-3 px-3">Lượt xem</th>
                    <th className="py-3 px-3">Donate</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {posts.map((post) => {
                    const firstCard = post.cards?.[0];
                    return (
                      <tr key={post.id} className="hover:bg-white/5 transition">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <div className="w-14 h-14 rounded-xl bg-[#07111F] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
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
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-[#AEBCC5] hover:text-white transition"
                              title="Xem chi tiết"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => setEditingPost(post)}
                              className="p-2 rounded-lg bg-[#C9AA72]/20 hover:bg-[#C9AA72]/30 text-[#C9AA72] border border-[#C9AA72]/40 transition"
                              title="Chỉnh sửa bài viết & ảnh"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeletePost(post.id)}
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition"
                              title="Xóa bài viết"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

      </div>

      {/* EDIT POST MODAL */}
      <EditPostModal
        post={editingPost}
        isOpen={!!editingPost}
        onClose={() => setEditingPost(null)}
        onUpdated={() => {
          loadAllData();
          setEditingPost(null);
        }}
      />
    </main>
  );
}
