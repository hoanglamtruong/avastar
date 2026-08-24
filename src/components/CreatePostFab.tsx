"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { CreatePostModal } from "@/components/modals/CreatePostModal";

export function CreatePostFab() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const isOwner = user?.role === "owner" || user?.role === "admin";

  if (!isOwner) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-4 z-[900] w-14 h-14 rounded-full bg-gradient-to-tr from-[#0095CF] to-[#183A60] text-white flex items-center justify-center shadow-2xl border border-[#D4DBF5]/20 hover:scale-105 active:scale-95 transition"
        title="Tạo bài viết mới"
      >
        <Plus className="w-7 h-7" />
      </button>
      <CreatePostModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCreated={() => {
          window.location.reload();
        }}
      />
    </>
  );
}
