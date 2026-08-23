"use client";

import React from "react";
import Link from "next/link";
import {
  Smartphone,
  ShieldCheck,
  Gift,
  Layers,
  ShoppingBag,
  Calendar,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Server,
  Zap,
  BookOpen,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="bg-[#0B1A2C] text-[#D4DBF5] min-h-screen relative overflow-x-hidden select-none selection:bg-[#FF7F00] selection:text-white">
      
      {/* Glowing background orbs */}
      <div className="fixed top-[-150px] left-[-100px] w-[500px] h-[500px] rounded-full bg-[#0095CF]/15 blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-100px] right-[-100px] w-[550px] h-[550px] rounded-full bg-[#FF7F00]/10 blur-[150px] pointer-events-none z-0" />
      <div className="fixed top-[40%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#183A60]/30 blur-[180px] pointer-events-none z-0" />

      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0B1A2C]/80 border-b border-[#D4DBF5]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0095CF] to-[#183A60] flex items-center justify-center font-extrabold text-white text-xl shadow-lg shadow-[#0095CF]/30 border border-[#D4DBF5]/30">
              Z
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-wider">
                PERSONAL <span className="text-[#0095CF]">HUB</span>
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-[#D4DBF5]/60 font-semibold">
                A Product of Zangx · Built by Zteam
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#D4DBF5]/80">
            <a href="#features" className="hover:text-[#0095CF] transition-colors">Tính Năng Độc Quyền</a>
            <a href="#usp" className="hover:text-[#0095CF] transition-colors">Định Vị Sản Phẩm</a>
            <a href="#subpages" className="hover:text-[#0095CF] transition-colors">8 Sub-pages</a>
            <a href="#pricing" className="hover:text-[#0095CF] transition-colors">Báo Giá Gói</a>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-bold text-[#0B1A2C] bg-gradient-to-r from-[#FEC401] to-[#FF7F00] hover:opacity-90 transition-all shadow-lg shadow-[#FF7F00]/25 transform hover:scale-105"
            >
              Vào Feed Ứng Dụng 🚀
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-16 pb-20 lg:pt-24 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-panel border-[#0095CF]/30 text-xs font-semibold text-[#0095CF]">
              <span className="w-2 h-2 rounded-full bg-[#FF7F00] animate-ping" />
              <span>Giải Pháp Độc Bản Cho Chuyên Gia, KOLs & Doanh Chủ</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Sở Hữu Không Gian Số <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0095CF] via-[#D4DBF5] to-[#FEC401]">
                Tên Miền & Server Riêng 100%
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#D4DBF5]/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Xóa bỏ sự phụ thuộc vào thuật toán mạng xã hội. <strong>Personal Hub (AVASTAR)</strong> mang đến trải nghiệm lướt TikTok cuộn dọc snap scroll kết hợp Carousel Đa Thẻ nổi (Ảnh, Video, Box Doc không giới hạn), bình luận bảo mật 1-1 và hệ thống tặng quà thương mại độc quyền.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-extrabold text-base text-[#0B1A2C] bg-gradient-to-r from-[#FF7F00] to-[#FEC401] hover:shadow-[#FF7F00]/40 hover:shadow-2xl transition transform hover:-translate-y-1 text-center flex items-center justify-center gap-2"
              >
                <span>Trải Nghiệm Live Demo</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#pricing"
                className="w-full sm:w-auto px-7 py-4 rounded-xl font-bold text-base text-white glass-panel hover:bg-[#183A60]/80 transition border-[#D4DBF5]/20 text-center"
              >
                Xem Báo Giá Triển Khai
              </a>
            </div>
          </div>

          {/* Hero Mockup Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-[300px] h-[580px] rounded-[36px] bg-[#0B1A2C] border-4 border-[#183A60] p-2 shadow-2xl glass-blue-glow overflow-hidden">
              <div className="w-full h-full rounded-[28px] bg-gradient-to-b from-[#183A60] to-[#0B1A2C] p-4 flex flex-col justify-between relative">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> AVASTAR Feed
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#FEC401]/20 text-[#FEC401]">60 FPS</span>
                </div>

                <div className="my-auto p-4 rounded-2xl glass-panel text-center space-y-3">
                  <div className="text-3xl">🎁</div>
                  <h4 className="text-sm font-extrabold text-white">Tặng Quà VIP & 1-1 Comment</h4>
                  <p className="text-[11px] text-[#D4DBF5]/70">
                    Bảo mật tuyệt đối, không nút like công cộng, giữ trọn vẹn giá trị riêng tư.
                  </p>
                </div>

                <Link
                  href="/"
                  className="w-full py-2.5 rounded-xl bg-[#0095CF] text-white text-xs font-bold text-center block"
                >
                  Chạm để mở Live App
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE USP SECTION */}
      <section id="usp" className="py-20 bg-[#183A60]/30 border-y border-[#D4DBF5]/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#0095CF]">
              Giá Trị Cốt Lõi (Core USP)
            </h2>
            <p className="text-3xl font-extrabold text-white">
              Tại Sao Bạn Phải Có Personal Hub Riêng?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[24px] glass-panel border-[#D4DBF5]/15 space-y-4 hover:border-[#0095CF]/50 transition">
              <div className="w-12 h-12 rounded-xl bg-[#0095CF]/20 text-[#0095CF] flex items-center justify-center">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">100% Sở Hữu Khách Hàng</h3>
              <p className="text-sm text-[#D4DBF5]/80 leading-relaxed">
                Chuyển đổi toàn bộ danh thiếp, Zalo, mối quan hệ thành tệp khách hàng vĩnh viễn trên domain và database riêng của bạn.
              </p>
            </div>

            <div className="p-8 rounded-[24px] glass-panel border-[#D4DBF5]/15 space-y-4 hover:border-[#FEC401]/50 transition">
              <div className="w-12 h-12 rounded-xl bg-[#FEC401]/20 text-[#FEC401] flex items-center justify-center">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Doanh Thu Trực Tiếp 100%</h3>
              <p className="text-sm text-[#D4DBF5]/80 leading-relaxed">
                Bán tài liệu chuyên sâu, khóa đào tạo, nhận quà tặng VIP trực tiếp mà không bị các chợ ứng dụng chiết khấu 30%.
              </p>
            </div>

            <div className="p-8 rounded-[24px] glass-panel border-[#D4DBF5]/15 space-y-4 hover:border-emerald-400/50 transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Tương Tác 1-1 Riêng Tư Tuyệt Đối</h3>
              <p className="text-sm text-[#D4DBF5]/80 leading-relaxed">
                Không nút like công cộng, bình luận cách ly giữa các thành viên, dữ liệu bất biến không thể sửa/xóa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8 SUBPAGES SHOWCASE */}
      <section id="subpages" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#FF7F00]">
            Hệ Sinh Thái 8 Trang Con
          </h2>
          <p className="text-3xl font-extrabold text-white">
            Đa Dạng Hóa Công Cụ Thương Mại Số
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { title: "Store", desc: "Bán sản phẩm & khóa học", icon: "🛒", tag: "E-Commerce" },
            { title: "Event", desc: "Đếm ngược & đăng ký vé", icon: "🎟️", tag: "Countdown" },
            { title: "Diary", desc: "Bài viết chuyên sâu", icon: "📖", tag: "Reflection" },
            { title: "Job", desc: "Tuyển dụng nộp CV 1 chạm", icon: "💼", tag: "Recruitment" },
            { title: "Work", desc: "Quản lý tiến độ dự án", icon: "📊", tag: "Kanban" },
            { title: "Connect", desc: "Hẹn hò & kết nối 1-1", icon: "✨", tag: "Networking" },
            { title: "Training", desc: "Giáo trình đào tạo", icon: "🎓", tag: "Syllabus" },
            { title: "SOP", desc: "Quy trình chuẩn từng bước", icon: "📋", tag: "Workflow" },
          ].map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl glass-panel border-[#D4DBF5]/10 hover:border-[#0095CF]/40 transition space-y-2">
              <span className="text-2xl">{item.icon}</span>
              <h4 className="text-sm font-extrabold text-white">{item.title}</h4>
              <p className="text-xs text-[#D4DBF5]/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-20 bg-[#183A60]/20 border-t border-[#D4DBF5]/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#FEC401]">
              Báo Giá Triển Khai
            </h2>
            <p className="text-3xl font-extrabold text-white">
              Lựa Chọn Gói Triển Khai Phù Hợp
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Starter */}
            <div className="p-8 rounded-[28px] glass-panel border-[#D4DBF5]/15 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#183A60] text-[#D4DBF5]">Gói Cá Nhân</span>
                <h3 className="text-2xl font-black text-white">Starter Hub</h3>
                <p className="text-2xl font-extrabold text-[#0095CF]">4.900.000 đ</p>
                <ul className="space-y-2 text-xs text-[#D4DBF5]/80 pt-4 border-t border-[#D4DBF5]/10">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#0095CF]" /> Cài đặt trọn gói PWA</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#0095CF]" /> Tên miền & Cloudflare SSL</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#0095CF]" /> 4 Subpage cards cơ bản</li>
                </ul>
              </div>
              <Link href="/" className="w-full mt-8 py-3 rounded-xl bg-[#183A60] text-white text-xs font-bold text-center block hover:bg-[#0095CF] transition">
                Chọn Gói Starter
              </Link>
            </div>

            {/* VIP Pro */}
            <div className="p-8 rounded-[28px] glass-panel border-[#FEC401]/50 relative flex flex-col justify-between glass-gold-glow scale-105 bg-[#183A60]/90">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black bg-[#FEC401] text-darkBg shadow-lg">
                KHUYÊN DÙNG (VIP)
              </span>
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FEC401]/20 text-[#FEC401]">Gói Chuyên Gia</span>
                <h3 className="text-2xl font-black text-white">Professional Hub</h3>
                <p className="text-2xl font-extrabold text-[#FEC401]">9.900.000 đ</p>
                <ul className="space-y-2 text-xs text-white pt-4 border-t border-white/10">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#FEC401]" /> Toàn bộ 8 loại Subpage Cards</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#FEC401]" /> Hệ thống Tặng Quà VIP & Realtime Ping</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#FEC401]" /> Dashboard Owner View Analytics chi tiết</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#FEC401]" /> Hỗ trợ vận hành 1-1 từ Zteam</li>
                </ul>
              </div>
              <Link href="/" className="w-full mt-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FEC401] to-[#FF7F00] text-darkBg text-xs font-black text-center block shadow-lg">
                Sở Hữu Gói VIP Ngay
              </Link>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-[28px] glass-panel border-[#D4DBF5]/15 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#183A60] text-[#D4DBF5]">Gói Doanh Nghiệp</span>
                <h3 className="text-2xl font-black text-white">Enterprise Self-Hosted</h3>
                <p className="text-2xl font-extrabold text-[#FF7F00]">19.900.000 đ</p>
                <ul className="space-y-2 text-xs text-[#D4DBF5]/80 pt-4 border-t border-[#D4DBF5]/10">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#FF7F00]" /> Cụm máy chủ Dell riêng biệt</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#FF7F00]" /> Bàn giao 100% mã nguồn sạch</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#FF7F00]" /> Tùy biến toàn bộ thiết kế thương hiệu</li>
                </ul>
              </div>
              <Link href="/" className="w-full mt-8 py-3 rounded-xl bg-[#183A60] text-white text-xs font-bold text-center block hover:bg-[#FF7F00] transition">
                Liên Hệ Doanh Nghiệp
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-[#D4DBF5]/10 text-center text-xs text-[#D4DBF5]/60 space-y-3">
        <p className="font-bold text-white">
          PERSONAL HUB · HỆ THỐNG ĐIỀU HÀNH THƯƠNG MẠI AVASTAR
        </p>
        <p>Đơn vị chủ quản: Công ty Cổ phần Zangx · Đơn vị phát triển: Zteam</p>
        <p>Mã nguồn: <a href="https://github.com/hoanglamtruong/avastar" target="_blank" className="text-[#0095CF] underline">https://github.com/hoanglamtruong/avastar</a></p>
      </footer>
    </div>
  );
}
