"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";
import { PostData } from "@/lib/types";
import { CreatePostModal } from "@/components/modals/CreatePostModal";
import { EditPostModal } from "@/components/modals/EditPostModal";
import { MediaPicker } from "@/components/ui/MediaPicker";
import { CmsItemModal, CmsSectionType } from "@/components/modals/CmsItemModal";
import { ZxLogoLockup } from "@/components/portfolio/ZxStar";
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
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
  Briefcase,
  Package,
  FolderKanban,
  User as UserIcon,
  CreditCard,
  Building,
  Save,
  Check,
} from "lucide-react";

interface AdminStats {
  postsCount: number;
  viewsCount: number;
  commentsCount: number;
  conversationsCount: number;
  totalGiftSum: number;
}

export default function AdminPage() {
  const { user, isLoading: isAuthLoading, login, switchUser, logout } = useAuth();
  const { showToast } = useToast();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<"posts" | "projects" | "products" | "services" | "profile">("posts");

  // Data states
  const [posts, setPosts] = useState<PostData[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Modals state
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PostData | null>(null);

  // CMS modal state
  const [cmsModal, setCmsModal] = useState<{
    isOpen: boolean;
    section: CmsSectionType;
    item: any | null;
  }>({
    isOpen: false,
    section: "projects",
    item: null,
  });

  // Admin Profile & Bank state
  const [adminFullName, setAdminFullName] = useState("");
  const [adminAvatarUrl, setAdminAvatarUrl] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [bankId, setBankId] = useState("MB");
  const [bankName, setBankName] = useState("MBBank (Ngân Hàng Quân Đội)");
  const [accountNo, setAccountNo] = useState("0901234567");
  const [accountName, setAccountName] = useState("TRUONG HOANG LAM");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Login Form State
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const isOwner = user?.role === "owner" || user?.role === "admin";

  // Fetch all dashboard & CMS data
  const loadAllData = useCallback(async () => {
    if (!isOwner) return;
    setIsLoadingData(true);
    try {
      const [overviewRes, postsRes, cmsRes, profileRes] = await Promise.all([
        fetch("/api/admin/overview"),
        fetch("/api/posts"),
        fetch("/api/admin/cms"),
        fetch("/api/admin/profile"),
      ]);

      if (overviewRes.ok) {
        const oData = await overviewRes.json();
        setStats(oData.stats);
      }
      if (postsRes.ok) {
        const pData = await postsRes.json();
        setPosts(pData.posts || []);
      }
      if (cmsRes.ok) {
        const cData = await cmsRes.json();
        if (cData.data) {
          setProjects(cData.data.projects || []);
          setProducts(cData.data.products || []);
          setServices(cData.data.services || []);
        }
      }
      if (profileRes.ok) {
        const profData = await profileRes.json();
        if (profData.profile) {
          setAdminFullName(profData.profile.fullName || "");
          setAdminAvatarUrl(profData.profile.avatarUrl || "");
          setAdminPhone(profData.profile.phoneNumber || "");
        }
        if (profData.bankInfo) {
          setBankId(profData.bankInfo.bankId || "MB");
          setBankName(profData.bankInfo.bankName || "MBBank");
          setAccountNo(profData.bankInfo.accountNo || "0901234567");
          setAccountName(profData.bankInfo.accountName || "TRUONG HOANG LAM");
        }
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

  // Delete CMS Item (Project, Product, Service)
  const handleDeleteCmsItem = async (section: CmsSectionType, id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa "${name}" không?`)) return;
    try {
      const res = await fetch(`/api/admin/cms?section=${section}&id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast(`Đã xóa "${name}" thành công!`, "success");
        loadAllData();
      } else {
        const err = await res.json();
        showToast(err.error || "Không thể xóa mục", "error");
      }
    } catch {
      showToast("Lỗi kết nối khi xóa dữ liệu", "error");
    }
  };

  // Save Admin Profile & Bank settings
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: adminFullName.trim(),
          avatarUrl: adminAvatarUrl.trim(),
          phoneNumber: adminPhone.trim(),
          bankInfo: {
            bankId: bankId.trim(),
            bankName: bankName.trim(),
            accountNo: accountNo.trim(),
            accountName: accountName.trim().toUpperCase(),
          },
        }),
      });

      if (res.ok) {
        showToast("Đã cập nhật thông tin Admin và cấu hình VietQR thành công!", "success");
        loadAllData();
      } else {
        const err = await res.json();
        showToast(err.error || "Không thể lưu hồ sơ", "error");
      }
    } catch {
      showToast("Lỗi kết nối khi lưu hồ sơ", "error");
    } finally {
      setIsSavingProfile(false);
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
              src={adminAvatarUrl || user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
              alt=""
              className="w-8 h-8 rounded-full object-cover border border-[#C9AA72]/50 shadow"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100";
              }}
            />
            <div className="text-left hidden md:block">
              <p className="text-xs font-black text-white">{adminFullName || user?.fullName}</p>
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

      <div className="max-w-7xl mx-auto space-y-6">
        {/* KPI CARDS */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#102A43]/40 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C9AA72]/20 flex items-center justify-center text-[#C9AA72] border border-[#C9AA72]/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-[#AEBCC5] font-semibold uppercase">Tác phẩm / Ảnh</p>
              <h3 className="text-xl sm:text-2xl font-black text-white">{posts.length}</h3>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#102A43]/40 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#A8F238]/20 flex items-center justify-center text-[#A8F238] border border-[#A8F238]/30">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-[#AEBCC5] font-semibold uppercase">Dự án đã làm</p>
              <h3 className="text-xl sm:text-2xl font-black text-white">{projects.length}</h3>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#102A43]/40 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C9AA72]/20 flex items-center justify-center text-[#C9AA72] border border-[#C9AA72]/30">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-[#AEBCC5] font-semibold uppercase">Sản phẩm R&D</p>
              <h3 className="text-xl sm:text-2xl font-black text-[#C9AA72]">{products.length}</h3>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#102A43]/40 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-[#AEBCC5] font-semibold uppercase">Gói dịch vụ</p>
              <h3 className="text-xl sm:text-2xl font-black text-white">{services.length}</h3>
            </div>
          </div>
        </section>

        {/* 5-TAB NAVIGATION BAR */}
        <section className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#102A43]/20 border border-white/10">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
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

            <button
              type="button"
              onClick={() => setActiveTab("projects")}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition ${
                activeTab === "projects"
                  ? "bg-[#C9AA72] text-[#07111F] shadow-lg"
                  : "bg-white/5 text-[#AEBCC5] hover:text-white"
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Dự Án ({projects.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition ${
                activeTab === "products"
                  ? "bg-[#C9AA72] text-[#07111F] shadow-lg"
                  : "bg-white/5 text-[#AEBCC5] hover:text-white"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Sản Phẩm R&D ({products.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("services")}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition ${
                activeTab === "services"
                  ? "bg-[#C9AA72] text-[#07111F] shadow-lg"
                  : "bg-white/5 text-[#AEBCC5] hover:text-white"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Dịch Vụ ({services.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition ${
                activeTab === "profile"
                  ? "bg-[#C9AA72] text-[#07111F] shadow-lg"
                  : "bg-white/5 text-[#AEBCC5] hover:text-white"
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Hồ Sơ & VietQR</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadAllData}
              disabled={isLoadingData}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-[#AEBCC5] hover:text-white transition"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingData ? "animate-spin text-[#C9AA72]" : ""}`} />
            </button>

            {/* Quick Create Buttons based on active tab */}
            {activeTab === "posts" && (
              <button
                type="button"
                onClick={() => setIsCreatePostOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C9AA72] to-[#8B6F3F] text-[#07111F] font-black text-xs flex items-center gap-1.5 shadow-lg hover:opacity-95 transition"
              >
                <Plus className="w-4 h-4" />
                <span>+ Đăng Tác Phẩm Mới</span>
              </button>
            )}

            {activeTab === "projects" && (
              <button
                type="button"
                onClick={() => setCmsModal({ isOpen: true, section: "projects", item: null })}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C9AA72] to-[#8B6F3F] text-[#07111F] font-black text-xs flex items-center gap-1.5 shadow-lg hover:opacity-95 transition"
              >
                <Plus className="w-4 h-4" />
                <span>+ Thêm Dự Án Mới</span>
              </button>
            )}

            {activeTab === "products" && (
              <button
                type="button"
                onClick={() => setCmsModal({ isOpen: true, section: "products", item: null })}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C9AA72] to-[#8B6F3F] text-[#07111F] font-black text-xs flex items-center gap-1.5 shadow-lg hover:opacity-95 transition"
              >
                <Plus className="w-4 h-4" />
                <span>+ Thêm Sản Phẩm Mới</span>
              </button>
            )}

            {activeTab === "services" && (
              <button
                type="button"
                onClick={() => setCmsModal({ isOpen: true, section: "services", item: null })}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C9AA72] to-[#8B6F3F] text-[#07111F] font-black text-xs flex items-center gap-1.5 shadow-lg hover:opacity-95 transition"
              >
                <Plus className="w-4 h-4" />
                <span>+ Thêm Dịch Vụ Mới</span>
              </button>
            )}
          </div>
        </section>

        {/* TAB 1: TÁC PHẨM & ẢNH (POSTS & MEDIA CRUD) */}
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

        {/* TAB 2: DỰ ÁN (PROJECTS CRUD) */}
        {activeTab === "projects" && (
          <section className="rounded-3xl bg-[#102A43]/30 border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#07111F]/80 text-[#AEBCC5] uppercase text-[10px] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Tên Dự Án</th>
                    <th className="py-3 px-3">Phân Loại</th>
                    <th className="py-3 px-3">Loại Thẻ</th>
                    <th className="py-3 px-4">Mô Tả</th>
                    <th className="py-3 px-3">Liên Kết</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {projects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-white/5 transition">
                      <td className="py-3 px-4 font-bold text-white text-xs">
                        {proj.title}
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#A8F238]/20 text-[#A8F238] border border-[#A8F238]/30">
                          {proj.type}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        {proj.sample ? (
                          <span className="text-[10px] text-[#AEBCC5]">Nội dung mẫu</span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#C9AA72]/20 text-[#C9AA72]">
                            Chạy thật
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-[#AEBCC5] max-w-sm truncate">
                        {proj.body}
                      </td>

                      <td className="py-3 px-3 text-[#C9AA72] font-mono text-[10px] max-w-[120px] truncate">
                        {proj.href || "-"}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setCmsModal({ isOpen: true, section: "projects", item: proj })}
                            className="p-2 rounded-lg bg-[#C9AA72]/20 hover:bg-[#C9AA72]/30 text-[#C9AA72] border border-[#C9AA72]/40 transition"
                            title="Sửa dự án"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteCmsItem("projects", proj.id, proj.title)}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition"
                            title="Xóa dự án"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 3: SẢN PHẨM R&D (PRODUCTS CRUD) */}
        {activeTab === "products" && (
          <section className="rounded-3xl bg-[#102A43]/30 border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#07111F]/80 text-[#AEBCC5] uppercase text-[10px] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Mã Code</th>
                    <th className="py-3 px-4">Tên Sản Phẩm</th>
                    <th className="py-3 px-3">Nhóm</th>
                    <th className="py-3 px-3">Trạng Thái</th>
                    <th className="py-3 px-3">Vật Liệu</th>
                    <th className="py-3 px-3">Phiên Bản</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-white/5 transition">
                      <td className="py-3 px-4 font-mono font-black text-[#A8F238] text-xs">
                        {prod.code}
                      </td>

                      <td className="py-3 px-4 font-bold text-white text-xs">
                        {prod.name}
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#C9AA72]/20 text-[#C9AA72] border border-[#C9AA72]/30">
                          {prod.groupKey}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-[#AEBCC5]">
                        {prod.status}
                      </td>

                      <td className="py-3 px-3 text-[#AEBCC5]">
                        {prod.material}
                      </td>

                      <td className="py-3 px-3 font-mono text-[11px] text-white">
                        {prod.version}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setCmsModal({ isOpen: true, section: "products", item: prod })}
                            className="p-2 rounded-lg bg-[#C9AA72]/20 hover:bg-[#C9AA72]/30 text-[#C9AA72] border border-[#C9AA72]/40 transition"
                            title="Sửa sản phẩm"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteCmsItem("products", prod.id, prod.name)}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 4: DỊCH VỤ SỐ (SERVICES CRUD) */}
        {activeTab === "services" && (
          <section className="rounded-3xl bg-[#102A43]/30 border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#07111F]/80 text-[#AEBCC5] uppercase text-[10px] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Tên Dịch Vụ</th>
                    <th className="py-3 px-4">Mô Tả Năng Lực</th>
                    <th className="py-3 px-3">Quy Trình Thực Hiện</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {services.map((srv) => (
                    <tr key={srv.id} className="hover:bg-white/5 transition">
                      <td className="py-3 px-4 font-bold text-white text-xs">
                        {srv.name}
                      </td>

                      <td className="py-3 px-4 text-[#AEBCC5] max-w-sm truncate">
                        {srv.body}
                      </td>

                      <td className="py-3 px-3 text-[#C9AA72]">
                        {srv.steps?.length || 0} bước quy trình
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setCmsModal({ isOpen: true, section: "services", item: srv })}
                            className="p-2 rounded-lg bg-[#C9AA72]/20 hover:bg-[#C9AA72]/30 text-[#C9AA72] border border-[#C9AA72]/40 transition"
                            title="Sửa dịch vụ"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteCmsItem("services", srv.id, srv.name)}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition"
                            title="Xóa dịch vụ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 5: HỒ SƠ ADMIN & CÀI ĐẶT VIETQR */}
        {activeTab === "profile" && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Edit */}
            <form
              onSubmit={handleSaveProfile}
              className="lg:col-span-2 rounded-3xl bg-[#102A43]/40 border border-[#C9AA72]/30 p-6 sm:p-7 backdrop-blur-xl shadow-xl space-y-6 text-xs"
            >
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-[#C9AA72]" />
                  <span>Thông Tin Cá Nhân & Chủ Xưởng</span>
                </h3>
                <p className="text-[#AEBCC5] text-xs mt-0.5">
                  Cập nhật họ tên, ảnh đại diện và số điện thoại liên hệ
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#AEBCC5] mb-1">Họ và tên:</label>
                  <input
                    type="text"
                    value={adminFullName}
                    onChange={(e) => setAdminFullName(e.target.value)}
                    placeholder="Trương Hoàng Lam"
                    className="w-full px-3 py-2 rounded-xl bg-[#07111F] border border-white/15 text-white focus:outline-none focus:border-[#C9AA72]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#AEBCC5] mb-1">Số điện thoại:</label>
                  <input
                    type="text"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    placeholder="0901234567"
                    className="w-full px-3 py-2 rounded-xl bg-[#07111F] border border-white/15 text-white focus:outline-none focus:border-[#C9AA72]"
                  />
                </div>
              </div>

              <MediaPicker
                label="Ảnh Đại Diện (Avatar):"
                value={adminAvatarUrl}
                onChange={(url) => setAdminAvatarUrl(url)}
                placeholder="https://... hoặc tải từ máy / chọn từ kho lưu trữ"
              />

              {/* Bank VietQR Settings */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#A8F238]" />
                    <span>Cấu Hình Nhận Ủng Hộ VietQR 24/7</span>
                  </h3>
                  <p className="text-[#AEBCC5] text-xs mt-0.5">
                    Thông tin tài khoản thụ hưởng sẽ hiển thị tự động trên hộp thoại Donate
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#AEBCC5] mb-1">Mã Ngân Hàng (BIN / Code):</label>
                    <input
                      type="text"
                      value={bankId}
                      onChange={(e) => setBankId(e.target.value)}
                      placeholder="MB, VCB, TCB..."
                      className="w-full px-3 py-2 rounded-xl bg-[#07111F] border border-white/15 text-white uppercase focus:outline-none focus:border-[#C9AA72]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#AEBCC5] mb-1">Tên Ngân Hàng:</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="MBBank (Ngân Hàng Quân Đội)"
                      className="w-full px-3 py-2 rounded-xl bg-[#07111F] border border-white/15 text-white focus:outline-none focus:border-[#C9AA72]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#AEBCC5] mb-1">Số Tài Khoản:</label>
                    <input
                      type="text"
                      value={accountNo}
                      onChange={(e) => setAccountNo(e.target.value)}
                      placeholder="0901234567"
                      className="w-full px-3 py-2 rounded-xl bg-[#07111F] border border-white/15 text-white font-mono tracking-wider focus:outline-none focus:border-[#C9AA72]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#AEBCC5] mb-1">Tên Chủ Tài Khoản:</label>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="TRUONG HOANG LAM"
                      className="w-full px-3 py-2 rounded-xl bg-[#07111F] border border-white/15 text-white uppercase font-bold tracking-wider focus:outline-none focus:border-[#C9AA72]"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9AA72] to-[#8B6F3F] text-[#07111F] font-black text-sm flex items-center gap-2 shadow-lg hover:opacity-95 transition transform active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingProfile ? "Đang lưu cấu hình..." : "Lưu Thông Tin & Cấu Hình"}</span>
                </button>
              </div>
            </form>

            {/* Live Preview Card */}
            <div className="rounded-3xl bg-[#102A43]/30 border border-white/10 p-6 flex flex-col items-center justify-between text-center space-y-4">
              <div className="space-y-3 w-full flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border-2 border-[#C9AA72] overflow-hidden shadow-xl">
                  <img
                    src={adminAvatarUrl || user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200";
                    }}
                  />
                </div>
                <div>
                  <h4 className="font-black text-white text-base">{adminFullName || user?.fullName}</h4>
                  <p className="text-xs text-[#C9AA72]">{adminPhone || "Chưa có SĐT"}</p>
                </div>
              </div>

              {/* Live VietQR Preview */}
              <div className="p-3 rounded-2xl bg-[#07111F] border border-[#C9AA72]/30 w-full flex flex-col items-center">
                <p className="text-[10px] font-bold text-[#A8F238] uppercase tracking-wider mb-2">
                  Xem Trước Mã VietQR Tự Động
                </p>
                <div className="p-2 rounded-xl bg-white shadow-md inline-block">
                  <img
                    src={`https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=100000&addInfo=ZANGX%20TEST&accountName=${encodeURIComponent(accountName)}`}
                    alt="VietQR Preview"
                    className="w-36 h-36 object-contain"
                  />
                </div>
                <div className="mt-2 text-[10px] text-[#AEBCC5]">
                  <p className="font-bold text-white">{bankName}</p>
                  <p className="font-mono text-[#C9AA72]">{accountNo} · {accountName}</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* CREATE POST MODAL */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onCreated={() => {
          loadAllData();
          setIsCreatePostOpen(false);
        }}
      />

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

      {/* CMS ITEM MODAL (PROJECTS, PRODUCTS, SERVICES) */}
      <CmsItemModal
        isOpen={cmsModal.isOpen}
        onClose={() => setCmsModal((prev) => ({ ...prev, isOpen: false }))}
        section={cmsModal.section}
        item={cmsModal.item}
        onSaved={loadAllData}
      />
    </main>
  );
}
