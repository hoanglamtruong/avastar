"use client";

import React, { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushNotificationPrompt() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const isOwner = user?.role === "owner" || user?.role === "admin";

  useEffect(() => {
    if (!isOwner || typeof window === "undefined") return;

    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      return;
    }

    if (Notification.permission === "default") {
      const dismissed = sessionStorage.getItem("push_prompt_dismissed");
      if (!dismissed) {
        // Show subtle prompt after 2 seconds
        const timer = setTimeout(() => setShowPrompt(true), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [isOwner]);

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        showToast("Bạn đã từ chối quyền thông báo", "info");
        setShowPrompt(false);
        return;
      }

      // Fetch VAPID key
      const keyRes = await fetch("/api/push/subscribe");
      const keyData = await keyRes.json();
      const publicKey = keyData.publicKey;

      if (!publicKey) {
        throw new Error("Không lấy được VAPID public key");
      }

      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        const convertedKey = urlBase64ToUint8Array(publicKey);
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedKey,
        });
      }

      // Send to server
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });

      if (res.ok) {
        showToast("Đã kích hoạt Web Push thông báo cho Owner!", "success");
        setShowPrompt(false);
      } else {
        showToast("Lỗi lưu đăng ký thông báo", "error");
      }
    } catch (err: any) {
      console.error("[push] subscription error:", err);
      showToast("Không thể đăng ký nhận thông báo", "error");
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem("push_prompt_dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 animate-float-up pointer-events-none">
      <div className="pointer-events-auto bg-[#183A60]/95 backdrop-blur-xl border border-[#0095CF]/40 rounded-2xl p-3.5 shadow-2xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0095CF]/20 text-[#0095CF] flex items-center justify-center shrink-0 border border-[#0095CF]/30">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <p className="font-extrabold text-white">Bật Thông Báo Web Push</p>
            <p className="text-[11px] text-[#D4DBF5]/80">Nhận thông báo đơn hàng & tin nhắn khi tắt màn hình</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleSubscribe}
            disabled={isSubscribing}
            className="px-3 py-1.5 rounded-xl bg-[#0095CF] hover:bg-[#0095CF]/90 text-white font-bold text-[11px] transition shadow-md disabled:opacity-50"
          >
            {isSubscribing ? "..." : "Bật"}
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition"
            title="Bỏ qua"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
