"use client";

import React, { useState, useEffect } from "react";
import { X, Eye, Clock, Gift, ShieldAlert, Smartphone, Laptop } from "lucide-react";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";

interface ViewAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

export function ViewAnalyticsModal({ isOpen, onClose, postId }: ViewAnalyticsModalProps) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-float-up">
      <div className="w-full max-w-xl max-h-[85vh] rounded-[28px] glass-panel border border-[#0095CF]/30 p-6 flex flex-col justify-between shadow-2xl relative bg-[#0B1A2C]/98">
        
        {/* Header */}
        <div className="pb-4 border-b border-[#D4DBF5]/15 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#0095CF]/20 text-[#0095CF] flex items-center justify-center border border-[#0095CF]/40">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Owner View Analytics</h3>
              <p className="text-xs text-[#0095CF] font-semibold">Báo cáo chi tiết lượt xem & hành vi độc quyền</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto custom-slim-scroll py-4 space-y-4 pr-1">
          {isLoading ? (
            <div className="text-center py-12 text-xs text-[#D4DBF5]/60">
              Đang tổng hợp dữ liệu thời gian thực...
            </div>
          ) : data?.error ? (
            <div className="p-4 rounded-xl bg-rose-500/20 text-rose-300 text-xs flex items-center gap-2 border border-rose-500/30">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{data.error}</span>
            </div>
          ) : (
            <>
              {/* Metric Summary Tiles */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-2xl bg-[#183A60]/80 border border-[#D4DBF5]/15 text-center">
                  <span className="block text-xl font-black text-white">{data?.totalViews || 0}</span>
                  <span className="text-[10px] uppercase font-bold text-[#D4DBF5]/70">Lượt Xem</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#183A60]/80 border border-[#0095CF]/30 text-center">
                  <span className="block text-xl font-black text-[#0095CF]">
                    {data?.avgDuration || 0}s
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#0095CF]/90">Thời Lượng TB</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#183A60]/80 border border-[#FEC401]/30 text-center">
                  <span className="block text-sm font-black text-[#FEC401] truncate mt-1">
                    {formatCurrency(data?.totalGiftsValue || 0)}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#FEC401]/90">Quà VIP</span>
                </div>
              </div>

              {/* Viewers Detail List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4DBF5]/80 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#0095CF]" /> Danh Sách Người Xem & Thời Gian Dừng Thẻ
                </h4>

                {data?.views?.length === 0 ? (
                  <p className="text-xs text-[#D4DBF5]/50 py-4 text-center">Chưa có dữ liệu lượt xem chi tiết.</p>
                ) : (
                  data?.views?.map((v: any) => {
                    const isMember = !!v.user;
                    const isMobile = v.userAgent?.toLowerCase().includes("mobile") || v.userAgent?.toLowerCase().includes("iphone");

                    return (
                      <div
                        key={v.id}
                        className="p-3 rounded-2xl bg-[#183A60]/50 border border-[#D4DBF5]/10 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={v.user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                              className="w-7 h-7 rounded-full object-cover border border-[#D4DBF5]/20"
                              alt=""
                            />
                            <div>
                              <p className="font-bold text-white flex items-center gap-1.5">
                                {v.user?.fullName || "Khách Ẩn Danh"}
                                {isMember && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#0095CF]/20 text-[#0095CF] border border-[#0095CF]/30">
                                    VIP
                                  </span>
                                )}
                              </p>
                              <p className="text-[10px] text-[#D4DBF5]/60 flex items-center gap-1">
                                {isMobile ? <Smartphone className="w-3 h-3" /> : <Laptop className="w-3 h-3" />}
                                <span>{v.ipAddress}</span> · <span>{formatRelativeTime(v.viewedAt)}</span>
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-1 rounded-lg bg-[#0B1A2C] text-[#FEC401] font-extrabold text-[11px] border border-[#FEC401]/20">
                              ⏱️ {v.watchDurationSeconds || 0}s
                            </span>
                          </div>
                        </div>

                        {/* Cards viewed breakdown */}
                        {v.cardsViewed && v.cardsViewed.length > 0 && (
                          <div className="pt-2 border-t border-[#D4DBF5]/10 flex flex-wrap gap-1.5">
                            {v.cardsViewed.map((c: any, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md text-[10px] bg-[#0B1A2C]/80 text-[#D4DBF5]/90 border border-[#D4DBF5]/15"
                              >
                                Thẻ #{c.cardIndex + 1} ({c.cardType}): <strong>{c.durationSeconds}s</strong>
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
        <div className="pt-3 border-t border-[#D4DBF5]/15 text-center text-[11px] text-[#D4DBF5]/60 shrink-0">
          Chỉ tài khoản Owner mới truy cập được báo cáo hành vi này.
        </div>
      </div>
    </div>
  );
}
