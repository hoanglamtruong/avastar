"use client";

import React, { useState, useEffect } from "react";
import { PostCardData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingBag,
  Calendar,
  Clock,
  MapPin,
  Briefcase,
  CheckCircle2,
  ListTodo,
  Sparkles,
  GraduationCap,
  FileCheck2,
  ArrowRight,
  UserCheck,
} from "lucide-react";

interface SubpageCardProps {
  card: PostCardData;
  onOpenAction: (actionType: string, payload: any) => void;
}

export function SubpageCard({ card, onOpenAction }: SubpageCardProps) {
  const meta = card.cardMetadata || {};
  const type = card.cardType;

  // Countdown timer state for Event card
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (type === "event" && meta.eventDate) {
      const target = new Date(meta.eventDate).getTime();
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const difference = target - now;
        if (difference > 0) {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          });
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [type, meta.eventDate]);

  // 1. STORE CARD
  if (type === "store") {
    return (
      <div className="relative w-full h-full rounded-[22px] glass-panel p-5 flex flex-col justify-between select-none border border-[#FF7F00]/30 shadow-2xl">
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#D4DBF5]/10">
            <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#FF7F00]">
              <ShoppingBag className="w-4 h-4" /> Cửa Hàng Độc Quyền
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF7F00]/20 text-[#FF7F00] border border-[#FF7F00]/40">
              Còn {meta.stock || 20} suất
            </span>
          </div>

          <h3 className="text-base font-extrabold text-white leading-snug">
            {meta.productName || "Sản Phẩm Độc Bản"}
          </h3>

          <div className="flex items-baseline gap-2 py-1">
            <span className="text-xl font-black text-[#FEC401]">
              {formatCurrency(meta.price || 1990000)}
            </span>
            {meta.originalPrice && (
              <span className="text-xs text-[#D4DBF5]/50 line-through">
                {formatCurrency(meta.originalPrice)}
              </span>
            )}
          </div>

          {meta.features && (
            <div className="space-y-1.5 pt-1">
              {meta.features.map((feat: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#D4DBF5]/90 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0095CF] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => onOpenAction("order_product", meta)}
          className="w-full py-3 px-4 rounded-xl font-extrabold text-sm text-darkBg bg-gradient-to-r from-[#FF7F00] to-[#FEC401] hover:opacity-95 shadow-lg shadow-[#FF7F00]/30 transition transform active:scale-95 flex items-center justify-center gap-2 mt-4"
        >
          <span>Đặt Mua / Thanh Toán Ngay</span>
          <ArrowRight className="w-4 h-4 text-darkBg" />
        </button>
      </div>
    );
  }

  // 2. EVENT CARD
  if (type === "event") {
    return (
      <div className="relative w-full h-full rounded-[22px] glass-panel p-5 flex flex-col justify-between select-none border border-[#0095CF]/30 shadow-2xl">
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#D4DBF5]/10">
            <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#0095CF]">
              <Calendar className="w-4 h-4" /> Sự Kiện Trực Tuyến & Offline
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0095CF]/20 text-[#0095CF] border border-[#0095CF]/40">
              Chỉ còn {meta.seatsLeft || 15} vé
            </span>
          </div>

          <h3 className="text-base font-extrabold text-white leading-snug">
            {meta.eventName || "Hội Thảo Công Nghệ Độc Bản"}
          </h3>

          {/* Countdown Clock */}
          <div className="grid grid-cols-4 gap-1.5 py-2">
            {[
              { label: "Ngày", val: timeLeft.days },
              { label: "Giờ", val: timeLeft.hours },
              { label: "Phút", val: timeLeft.minutes },
              { label: "Giây", val: timeLeft.seconds },
            ].map((item, idx) => (
              <div key={idx} className="bg-[#0B1A2C]/80 rounded-xl p-2 text-center border border-[#D4DBF5]/10">
                <span className="block text-base font-black text-[#FEC401]">
                  {String(item.val).padStart(2, "0")}
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-[#D4DBF5]/60 font-bold">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 text-xs text-[#D4DBF5]/80">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#FF7F00] shrink-0" />
              <span className="line-clamp-1">{meta.location || "TP. Hồ Chí Minh"}</span>
            </div>
            {meta.speakers && (
              <div className="flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5 text-[#0095CF] shrink-0" />
                <span>Diễn giả: {meta.speakers.join(", ")}</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => onOpenAction("event_ticket", meta)}
          className="w-full py-3 px-4 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-[#0095CF] to-[#183A60] hover:opacity-95 shadow-lg shadow-[#0095CF]/30 transition transform active:scale-95 flex items-center justify-center gap-2 mt-3 border border-[#D4DBF5]/20"
        >
          <span>Đăng Ký Nhận Vé Miễn Phí</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // 3. JOB CARD
  if (type === "job") {
    return (
      <div className="relative w-full h-full rounded-[22px] glass-panel p-5 flex flex-col justify-between select-none border border-[#0095CF]/30">
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#D4DBF5]/10">
            <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#0095CF]">
              <Briefcase className="w-4 h-4" /> Cơ Hội Nghề Nghiệp
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Đang Tuyển Gấp
            </span>
          </div>

          <h3 className="text-base font-extrabold text-white">
            {meta.jobTitle || "Senior AI Full-Stack Engineer"}
          </h3>

          <div className="p-2.5 rounded-xl bg-[#0B1A2C]/60 border border-[#D4DBF5]/10 space-y-1">
            <p className="text-xs text-[#FEC401] font-bold">💰 Lương: {meta.salary || "$2,000 - $3,500"}</p>
            <p className="text-xs text-[#D4DBF5]/80">📍 Địa điểm: {meta.location || "Hybrid / Remote"}</p>
            <p className="text-xs text-[#D4DBF5]/80">⏳ Kinh nghiệm: {meta.experience || "2+ năm"}</p>
          </div>

          {meta.tags && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {meta.tags.map((tag: string, idx: number) => (
                <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#183A60] text-[#D4DBF5] border border-[#D4DBF5]/15">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => onOpenAction("submit_cv", meta)}
          className="w-full py-3 px-4 rounded-xl font-extrabold text-sm text-darkBg bg-gradient-to-r from-[#0095CF] to-[#D4DBF5] hover:opacity-95 shadow-lg shadow-[#0095CF]/30 transition transform active:scale-95 flex items-center justify-center gap-2 mt-3"
        >
          <span>Nộp CV & Portfolio Một Chạm</span>
          <ArrowRight className="w-4 h-4 text-darkBg" />
        </button>
      </div>
    );
  }

  // 4. WORK TRACKING CARD
  if (type === "work") {
    return (
      <div className="relative w-full h-full rounded-[22px] glass-panel p-5 flex flex-col justify-between select-none border border-[#0095CF]/30">
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#D4DBF5]/10">
            <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#0095CF]">
              <ListTodo className="w-4 h-4" /> Quản Lý Tiến Độ Dự Án
            </span>
            <span className="text-xs font-black text-[#FEC401]">
              {meta.progress || 88}% Hoàn Thành
            </span>
          </div>

          <h3 className="text-base font-extrabold text-white">
            {meta.projectName || "Hệ Thống AVASTAR Engine"}
          </h3>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-[#0B1A2C] overflow-hidden border border-[#D4DBF5]/10">
            <div
              className="h-full bg-gradient-to-r from-[#0095CF] to-[#FF7F00] transition-all duration-500"
              style={{ width: `${meta.progress || 88}%` }}
            />
          </div>

          {meta.milestones && (
            <div className="space-y-2 pt-1 max-h-[140px] overflow-y-auto custom-slim-scroll pr-1">
              {meta.milestones.map((m: any, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-xs">
                  {m.status === "completed" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Clock className="w-4 h-4 text-[#FF7F00] shrink-0 mt-0.5" />
                  )}
                  <span className={m.status === "completed" ? "text-[#D4DBF5]/90" : "text-[#FF7F00] font-semibold"}>
                    {m.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-2.5 rounded-xl bg-[#0B1A2C]/60 text-center text-xs font-bold text-[#D4DBF5]/70 border border-[#D4DBF5]/10">
          Cập nhật thời gian thực từ Zteam Workspace
        </div>
      </div>
    );
  }

  // 5. DATING / CONNECT CARD
  if (type === "dating") {
    return (
      <div className="relative w-full h-full rounded-[22px] glass-panel p-5 flex flex-col justify-between select-none border border-[#FEC401]/30">
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#D4DBF5]/10">
            <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#FEC401]">
              <Sparkles className="w-4 h-4 text-[#FEC401]" /> Kết Nối 1-1 Độc Quyền
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEC401]/20 text-[#FEC401] border border-[#FEC401]/40">
              VIP Only
            </span>
          </div>

          <h3 className="text-base font-extrabold text-white">
            Cố Vấn Khởi Nghiệp & Kết Nối Đầu Tư
          </h3>

          <div className="p-3 rounded-xl bg-[#0B1A2C]/60 border border-[#D4DBF5]/10 space-y-1.5 text-xs">
            <p className="text-[#D4DBF5]/90 font-medium">🎯 Đối tượng: {meta.targetAudience || "Doanh chủ, Founder"}</p>
            <p className="text-[#D4DBF5]/90 font-medium">🗓️ Lịch hẹn: {meta.availability || "Thứ Ba & Thứ Bảy"}</p>
          </div>

          {meta.topics && (
            <div className="space-y-1 pt-1">
              <p className="text-[11px] uppercase tracking-wider text-[#D4DBF5]/60 font-bold">Chủ đề thảo luận:</p>
              {meta.topics.map((t: string, idx: number) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-[#D4DBF5]/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FEC401]" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => onOpenAction("connect_request", meta)}
          className="w-full py-3 px-4 rounded-xl font-extrabold text-sm text-darkBg bg-gradient-to-r from-[#FEC401] to-[#FF7F00] hover:opacity-95 shadow-lg shadow-[#FEC401]/30 transition transform active:scale-95 flex items-center justify-center gap-2 mt-3"
        >
          <span>Gửi Lời Mời Trò Chuyện Riêng</span>
          <ArrowRight className="w-4 h-4 text-darkBg" />
        </button>
      </div>
    );
  }

  // 6. TRAINING CARD
  if (type === "training") {
    return (
      <div className="relative w-full h-full rounded-[22px] glass-panel p-5 flex flex-col justify-between select-none border border-[#0095CF]/30">
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#D4DBF5]/10">
            <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#0095CF]">
              <GraduationCap className="w-4 h-4" /> Chương Trình Đào Tạo
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0095CF]/20 text-[#0095CF] border border-[#0095CF]/40">
              {meta.duration || "4 Tuần"}
            </span>
          </div>

          <h3 className="text-base font-extrabold text-white">
            {meta.courseTitle || "PWA & Self-Hosted Masterclass"}
          </h3>

          {meta.modules && (
            <div className="space-y-1.5 max-h-[140px] overflow-y-auto custom-slim-scroll pr-1">
              {meta.modules.map((mod: string, idx: number) => (
                <div key={idx} className="p-2 rounded-lg bg-[#0B1A2C]/60 text-xs text-[#D4DBF5]/90 border border-[#D4DBF5]/10 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0095CF] shrink-0" />
                  <span className="line-clamp-1">{mod}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => onOpenAction("order_product", { productName: meta.courseTitle, price: 1990000 })}
          className="w-full py-3 px-4 rounded-xl font-extrabold text-sm text-darkBg bg-gradient-to-r from-[#0095CF] to-[#D4DBF5] hover:opacity-95 shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2 mt-3"
        >
          <span>Đăng Ký Nhận Giáo Trình Đào Tạo</span>
          <ArrowRight className="w-4 h-4 text-darkBg" />
        </button>
      </div>
    );
  }

  // 7. SOP GUIDES CARD
  if (type === "sop") {
    return (
      <div className="relative w-full h-full rounded-[22px] glass-panel p-5 flex flex-col justify-between select-none border border-[#0095CF]/30">
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#D4DBF5]/10">
            <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#0095CF]">
              <FileCheck2 className="w-4 h-4" /> Quy Trình Chuẩn SOP
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#183A60] text-[#D4DBF5] border border-[#D4DBF5]/20">
              {meta.sopCode || "SOP-0823"}
            </span>
          </div>

          <h3 className="text-base font-extrabold text-white">
            {meta.sopTitle || "Zero-Downtime Deployment SOP"}
          </h3>

          {meta.steps && (
            <div className="space-y-1.5 max-h-[140px] overflow-y-auto custom-slim-scroll pr-1">
              {meta.steps.map((step: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[#D4DBF5]/90">
                  <span className="w-4 h-4 rounded-full bg-[#0095CF]/20 text-[#0095CF] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => onOpenAction("connect_request", { message: `Yêu cầu hướng dẫn triển khai SOP: ${meta.sopTitle}` })}
          className="w-full py-3 px-4 rounded-xl font-extrabold text-sm text-white bg-[#183A60] hover:bg-[#0095CF]/20 border border-[#0095CF]/50 transition transform active:scale-95 flex items-center justify-center gap-2 mt-3"
        >
          <span>Tải Script & Hướng Dẫn Vận Hành</span>
          <ArrowRight className="w-4 h-4 text-[#0095CF]" />
        </button>
      </div>
    );
  }

  // DEFAULT FALLBACK
  return (
    <div className="w-full h-full rounded-[22px] glass-panel p-5 flex items-center justify-center text-center text-sm text-[#D4DBF5]/70">
      Thẻ nội dung mở rộng ({type})
    </div>
  );
}
