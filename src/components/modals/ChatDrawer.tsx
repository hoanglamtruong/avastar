"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Send, MessageSquare, Bell, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { formatRelativeTime } from "@/lib/utils";

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

export function ChatDrawer({ isOpen, onClose, onOpenAuth }: ChatDrawerProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [conversation, setConversation] = useState<any>(null);
  const [allConversations, setAllConversations] = useState<any[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchChat = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      let url = "/api/chat";
      if (selectedMemberId && (user.role === "owner" || user.role === "admin")) {
        url += `?memberId=${selectedMemberId}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setConversation(data.conversation);
        setAllConversations(data.allConversations || []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchChat();
      const interval = setInterval(fetchChat, 4000); // Polling for realtime messages
      return () => clearInterval(interval);
    }
  }, [isOpen, user, selectedMemberId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  if (!isOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    if (!content.trim()) return;

    setIsSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          targetMemberId: selectedMemberId,
        }),
      });

      if (res.ok) {
        setContent("");
        fetchChat();
      } else {
        showToast("Lỗi khi gửi tin nhắn", "error");
      }
    } catch {
      showToast("Lỗi kết nối", "error");
    } finally {
      setIsSending(false);
    }
  };

  const isOwner = user?.role === "owner" || user?.role === "admin";

  return (
    <div className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-float-up">
      <div className="w-full max-w-lg h-[88vh] max-h-[720px] rounded-t-[28px] sm:rounded-[28px] glass-panel border border-[#0095CF]/30 p-5 flex flex-col justify-between shadow-2xl relative bg-[#0B1A2C]/98">
        
        {/* Header */}
        <div className="pb-3 border-b border-[#D4DBF5]/15 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0095CF]/20 text-[#0095CF] flex items-center justify-center border border-[#0095CF]/40">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                Phòng Chat Nội Bộ 1-1
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </h3>
              <p className="text-[11px] text-[#0095CF] font-semibold">
                {isOwner ? "Bảng điều khiển tin nhắn Owner" : "Trò chuyện trực tiếp với Zangx"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Owner Converations List Tab */}
        {isOwner && allConversations.length > 0 && (
          <div className="py-2 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 border-b border-[#D4DBF5]/10">
            <span className="text-[10px] text-[#D4DBF5]/60 uppercase font-bold shrink-0">Hội thoại:</span>
            {allConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedMemberId(conv.memberId)}
                className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition flex items-center gap-1.5 ${
                  selectedMemberId === conv.memberId
                    ? "bg-[#0095CF] text-white"
                    : "bg-[#183A60] text-[#D4DBF5]/80 hover:bg-[#183A60]/80"
                }`}
              >
                <img
                  src={conv.member?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                  className="w-4 h-4 rounded-full"
                  alt=""
                />
                <span>{conv.member?.fullName}</span>
              </button>
            ))}
          </div>
        )}

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto custom-slim-scroll py-3 space-y-3 pr-1">
          {!user ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4 space-y-2">
              <p className="text-xs text-[#D4DBF5]/70">Vui lòng đăng nhập để sử dụng chatbox 1-1.</p>
              <button
                onClick={onOpenAuth}
                className="px-5 py-2 rounded-xl text-xs font-bold text-darkBg bg-[#0095CF]"
              >
                Đăng Nhập
              </button>
            </div>
          ) : conversation?.messages?.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#D4DBF5]/60">
              Bắt đầu trò chuyện trực tiếp với Owner ngay tại đây!
            </div>
          ) : (
            conversation?.messages?.map((msg: any) => {
              if (msg.isSystemEvent) {
                return (
                  <div key={msg.id} className="p-2.5 rounded-xl bg-[#183A60]/80 border border-[#FEC401]/30 text-center text-xs text-[#FEC401]">
                    <span className="font-semibold">{msg.content}</span>
                  </div>
                );
              }

              const isMe = user.id === msg.senderId;

              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-bold text-[#D4DBF5]/80">
                      {isMe ? "Bạn" : msg.sender?.fullName}
                    </span>
                    <span className="text-[9px] text-[#D4DBF5]/50">
                      {formatRelativeTime(msg.createdAt)}
                    </span>
                  </div>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? "bg-[#0095CF] text-white rounded-tr-sm"
                        : "bg-[#183A60] border border-[#D4DBF5]/20 text-white rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        {user && (
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-3 border-t border-[#D4DBF5]/15 shrink-0">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập tin nhắn trực tiếp..."
              className="flex-1 px-4 py-3 rounded-xl bg-[#0B1A2C] border border-[#D4DBF5]/20 text-xs text-white focus:outline-none focus:border-[#0095CF]"
            />
            <button
              type="submit"
              disabled={isSending || !content.trim()}
              className="p-3 rounded-xl bg-[#0095CF] hover:bg-[#0095CF]/90 text-white disabled:opacity-50 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
