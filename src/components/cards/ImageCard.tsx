"use client";

import React, { useState } from "react";
import { PostCardData } from "@/lib/types";
import { Maximize2, X } from "lucide-react";

interface ImageCardProps {
  card: PostCardData;
}

export function ImageCard({ card }: ImageCardProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const title = card.cardMetadata?.title || "Hình ảnh nổi bật";
  const badge = card.cardMetadata?.badge;

  return (
    <>
      <div
        className="relative w-full h-full rounded-[22px] overflow-hidden group cursor-pointer select-none bg-[#0B1A2C]/60 flex items-center justify-center"
        onClick={() => setIsFullscreen(true)}
      >
        <img
          src={card.mediaUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080"}
          alt={title}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient shadow for text */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A2C]/90 via-transparent to-black/30 pointer-events-none" />

        {/* Badge & Title */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
          {badge && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0095CF]/80 text-white backdrop-blur-md border border-[#D4DBF5]/20 shadow-lg">
              {badge}
            </span>
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4 z-10">
          <h3 className="text-lg font-bold text-white drop-shadow-md line-clamp-2">
            {title}
          </h3>
          <p className="text-xs text-[#D4DBF5]/80 mt-1 flex items-center gap-1.5 font-medium">
            <Maximize2 className="w-3.5 h-3.5 text-[#0095CF]" /> Chạm để phóng to ảnh
          </p>
        </div>
      </div>

      {/* Fullscreen Zoom Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md animate-float-up"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition z-50"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={card.mediaUrl || ""}
            alt={title}
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </>
  );
}
