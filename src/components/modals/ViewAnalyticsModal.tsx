"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Eye, Clock, ShieldAlert, Smartphone, Laptop } from "lucide-react";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";

interface ViewAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

export function ViewAnalyticsModal({ isOpen, onClose, postId }: ViewAnalyticsModalProps) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Swipe-down to close gesture
  const touchStartY = useRef<number>(0);
  const touchStartX = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const deltaY = touchEndY.current - touchStartY.current;
    const deltaX = touchEndX.current - touchStartX.current;
    if (deltaY > 50 && deltaY > Math.abs(deltaX)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen && postId) {
      setIsLoading(true);
      fetch(`/api/analytics/${postId}`)
        .then((res) => res.json())
        .then((resData) => {
          setData(resData);
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, postId]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-float-up"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl h-[55vh] max-h-[55vh] rounded-t-[28px] sm:rounded-[28px] glass-panel border border-[#0095CF]/30 p-4 sm:p-5 flex flex-col justify-between shadow-2xl relative bg-[#0B1A2C]/98 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 rounded-full bg-white/30 mx-auto -mt-1 mb-2 shrink-0 sm:hidden cursor-pointer" onClick={onClose} />

        {/* Header */}
        <div className="pb-2 border-b border-[#D4DBF5]/15 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0095CF]/20 text-[#0095CF] flex items-center justify-center border border-[#0095CF]/40">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-white">Owner View Analytics</h3>
              <p className="text-[10px] text-[#0095CF] font-semibold">Báo cáo lượt xem & hành vi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto custom-slim-scroll py-2 space-y-3 pr-1">
          {isLoading ? (
            <div className="text-center py-8 text-xs text-[#D4DBF5]/60">
              Đang tổng hợp dữ liệu thời gian thực...
            </div>
          ) : data?.error ? (
            <div className="p-3 rounded-xl bg-rose-500/20 text-rose-300 text-xs flex items-center gap-2 border border-rose-500/30">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{data.error}</span>
            </div>
          ) : (
            <>
              {/* Metric Summary Tiles */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-xl bg-[#183A60]/80 border border-[#D4DBF5]/15 text-center">
                  <span className="block text-base font-black text-white">{data?.totalViews || 0}</span>
                  <span className="text-[9px] uppercase font-bold text-[#D4DBF5]/70">Lượt Xem</span>
                </div>
                <div className="p-2 rounded-xl bg-[#183A60]/80 border border-[#0095CF]/30 text-center">
                  <span className="block text-base font-black text-[#0095CF]">
                    {data?.avgDuration || 0}s
                  </span>
                  <span className="text-[9px] uppercase font-bold text-[#0095CF]/90">Thời Lượng TB</span>
                </div>
                <div className="p-2 rounded-xl bg-[#183A60]/80 border border-[#FEC401]/30 text-center">
                  <span className="block text-xs font-black text-[#FEC401] truncate mt-0.5">
                    {formatCurrency(data?.totalGiftsValue || 0)}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-[#FEC401]/90">Quà VIP</span>
                </div>
              </div>

              {/* Viewers Detail List */}
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#D4DBF5]/80 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#0095CF]" /> Người Xem & Thời Gian Dừng Thẻ
                </h4>

                {data?.views?.length === 0 ? (
                  <p className="text-xs text-[#D4DBF5]/50 py-3 text-center">Chưa có dữ liệu lượt xem chi tiết.</p>
                ) : (
                  data?.views?.map((v: any) => {
                    const isMember = !!v.user;
                    const isMobile = v.userAgent?.toLowerCase().includes("mobile") || v.userAgent?.toLowerCase().includes("iphone");

                    return (
                      <div
                        key={v.id}
                        className="p-2.5 rounded-xl bg-[#183A60]/50 border border-[#D4DBF5]/10 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <img
                              src={v.user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                              className="w-6 h-6 rounded-full object-cover border border-[#D4DBF5]/20"
                              alt=""
                            />
                            <div>
                              <p className="font-bold text-white text-[11px] flex items-center gap-1">
                                {v.user?.fullName || "Khách Ẩn Danh"}
                                {isMember && (
                                  <span className="px-1 py-0.1 rounded text-[8px] font-bold bg-[#0095CF]/20 text-[#0095CF] border border-[#0095CF]/30">
                                    VIP
                                  </span>
                                )}
                              </p>
                              <p className="text-[9px] text-[#D4DBF5]/60 flex items-center gap-1">
                                {isMobile ? <Smartphone className="w-2.5 h-2.5" /> : <Laptop className="w-2.5 h-2.5" />}
                                <span>{v.ipAddress}</span> · <span>{formatRelativeTime(v.viewedAt)}</span>
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="px-1.5 py-0.5 rounded bg-[#0B1A2C] text-[#FEC401] font-extrabold text-[10px] border border-[#FEC401]/20">
                              ⏱️ {v.watchDurationSeconds || 0}s
                            </span>
                          </div>
                        </div>

                        {/* Cards viewed breakdown */}
                        {v.cardsViewed && v.cardsViewed.length > 0 && (
                          <div className="pt-1 border-t border-[#D4DBF5]/10 flex flex-wrap gap-1">
                            {v.cardsViewed.map((c: any, idx: number) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.2 rounded text-[9px] bg-[#0B1A2C]/80 text-[#D4DBF5]/90 border border-[#D4DBF5]/15"
                              >
                                #{c.cardIndex + 1} ({c.cardType}): <strong>{c.durationSeconds}s</strong>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[#D4DBF5]/15 text-center text-[10px] text-[#D4DBF5]/60 shrink-0">
          Báo cáo thống kê dành riêng cho tài khoản Owner.
        </div>
      </div>
    </div>
  );
}
