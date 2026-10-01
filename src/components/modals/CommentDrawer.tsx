"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Send, Lock, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { formatRelativeTime } from "@/lib/utils";

interface CommentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  onOpenAuth: () => void;
}

export function CommentDrawer({ isOpen, onClose, postId, onOpenAuth }: CommentDrawerProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [comments, setComments] = useState<any[]>([]);
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const fetchComments = async () => {
    if (!postId) return;
    setIsLoading(true);
    try {
      let url = `/api/comments?postId=${postId}`;
      if (selectedMemberId && (user?.role === "owner" || user?.role === "admin")) {
        url += `&memberId=${selectedMemberId}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
        setThreads(data.threads || []);
        if (data.threads && data.threads.length > 0 && !selectedMemberId) {
          setSelectedMemberId(data.threads[0].id);
        }
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, postId, selectedMemberId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    if (!content.trim()) return;

    setIsSending(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          content: content.trim(),
          targetMemberId: selectedMemberId,
        }),
      });

      if (res.ok) {
        setContent("");
        fetchComments();
        showToast("Đã gửi bình luận 1-1 bảo mật", "success");
      } else {
        const data = await res.json();
        showToast(data.error || "Lỗi khi gửi bình luận", "error");
      }
    } catch {
      showToast("Lỗi kết nối", "error");
    } finally {
      setIsSending(false);
    }
  };

  const isOwner = user?.role === "owner" || user?.role === "admin";

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-end justify-center animate-float-up"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg h-[55vh] max-h-[55vh] rounded-t-[28px] glass-panel border border-[#D4DBF5]/20 p-4 sm:p-5 flex flex-col justify-between shadow-2xl relative bg-[#0B1A2C]/98"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top Drag Indicator for Swipe Down */}
        <div className="w-10 h-1 rounded-full bg-white/30 mx-auto -mt-1 mb-2 shrink-0 cursor-pointer" onClick={onClose} />
        
        {/* Header */}
        <div className="pb-2 border-b border-[#D4DBF5]/15 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0095CF]/20 text-[#0095CF] flex items-center justify-center border border-[#0095CF]/30">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-1">
                Bình Luận Riêng Tư 1-1
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </h3>
              <p className="text-[10px] text-[#D4DBF5]/70">
                {isOwner ? "Chế độ Chủ sở hữu" : "Chỉ bạn và Owner nhìn thấy"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Owner thread selector */}
        {isOwner && threads.length > 0 && (
          <div className="py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 border-b border-[#D4DBF5]/10">
            <span className="text-[9px] text-[#D4DBF5]/60 uppercase font-bold shrink-0">Thành viên:</span>
            {threads.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedMemberId(t.id)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0 transition flex items-center gap-1 ${
                  selectedMemberId === t.id
                    ? "bg-[#0095CF] text-white"
                    : "bg-[#183A60] text-[#D4DBF5]/80 hover:bg-[#183A60]/80"
                }`}
              >
                <img
                  src={t.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                  className="w-3.5 h-3.5 rounded-full"
                  alt=""
                />
                <span>{t.fullName}</span>
              </button>
            ))}
          </div>
        )}

        {/* Comments Message List */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto custom-slim-scroll py-2 space-y-2.5 pr-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-xs text-[#D4DBF5]/60">
              Đang tải hội thoại...
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-3 space-y-1.5">
              <div className="w-9 h-9 rounded-full bg-[#183A60] text-[#0095CF] flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <p className="text-xs text-[#D4DBF5]/80 font-medium">
                Chưa có trao đổi nào. Hãy gửi câu hỏi đầu tiên tới Owner!
              </p>
            </div>
          ) : (
            comments.map((c) => {
              const isMe = user?.id === c.memberId && c.senderRole === "member";
              const fromOwner = c.senderRole === "owner";

              return (
                <div
                  key={c.id}
                  className={`flex flex-col ${fromOwner ? "items-start" : isMe ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-1 mb-0.5 px-1">
                    <span className={`text-[9px] font-bold ${fromOwner ? "text-[#FEC401]" : "text-[#0095CF]"}`}>
                      {fromOwner ? "👑 Owner" : c.member?.fullName || "Thành viên"}
                    </span>
                    <span className="text-[8px] text-[#D4DBF5]/50">
                      {formatRelativeTime(c.createdAt)}
                    </span>
                  </div>
                  <div
                    className={`max-w-[85%] p-2.5 rounded-xl text-xs leading-relaxed ${
                      fromOwner
                        ? "bg-[#183A60] border border-[#FEC401]/30 text-white rounded-tl-sm"
                        : isMe
                        ? "bg-[#0095CF] text-white rounded-tr-sm"
                        : "bg-[#0B1A2C] border border-[#D4DBF5]/15 text-[#D4DBF5] rounded-tl-sm"
                    }`}
                  >
                    {c.content}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Bar */}
        {!user || user.role === "guest" ? (
          <div className="p-2 rounded-xl bg-[#183A60]/80 border border-[#FEC401]/30 text-center space-y-1.5 mt-1 shrink-0">
            <p className="text-[11px] text-[#D4DBF5]">
              Khách vãng lai chỉ có quyền đọc. Vui lòng đăng ký Thành viên VIP để bình luận 1-1.
            </p>
            <button
              onClick={onOpenAuth}
              className="px-4 py-1.5 rounded-lg text-xs font-bold text-darkBg bg-[#FEC401] hover:bg-[#FEC401]/90 transition"
            >
              Đăng Ký / Đăng Nhập
            </button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex items-center gap-2 pt-2 border-t border-[#D4DBF5]/15 shrink-0">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung trao đổi riêng..."
              className="flex-1 px-3 py-2 rounded-xl bg-[#0B1A2C] border border-[#D4DBF5]/20 text-xs text-white focus:outline-none focus:border-[#0095CF]"
            />
            <button
              type="submit"
              disabled={isSending || !content.trim()}
              className="p-2.5 rounded-xl bg-[#0095CF] hover:bg-[#0095CF]/90 text-white disabled:opacity-50 transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
