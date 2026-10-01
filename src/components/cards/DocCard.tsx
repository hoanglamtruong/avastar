"use client";

import React from "react";
import { PostCardData } from "@/lib/types";
import { BookOpen, FileText } from "lucide-react";

interface DocCardProps {
  card: PostCardData;
}

export function DocCard({ card }: DocCardProps) {
  const content = card.docContent || "<p>Chưa có nội dung văn bản.</p>";

  return (
    <div className="relative w-full h-full rounded-[22px] glass-panel p-5 flex flex-col overflow-hidden select-text border border-[#F4F0E8]/20">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F4F0E8]/10 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#C9AA72]/20 flex items-center justify-center text-[#C9AA72] border border-[#C9AA72]/30">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9AA72]">
              Box Doc Chuyên Sâu
            </h4>
            <p className="text-[11px] text-[#F4F0E8]/60 font-medium">Tài liệu đọc độc quyền</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#102A43] text-[#F4F0E8]/80 border border-[#F4F0E8]/20">
          Rich-Text
        </span>
      </div>

      {/* Independent Scroll Container */}
      <div className="flex-1 overflow-y-auto custom-slim-scroll pr-1.5 mt-3 text-[#F4F0E8] text-sm leading-relaxed space-y-3 prose prose-invert max-w-none">
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          className="space-y-3 [&>h1]:text-lg [&>h1]:font-black [&>h1]:text-white [&>h1]:mt-1 [&>h2]:text-base [&>h2]:font-bold [&>h2]:text-[#C9AA72] [&>h2]:mt-2 [&>p]:text-sm [&>p]:leading-relaxed [&>p.lead]:text-sm [&>p.lead]:font-semibold [&>p.lead]:text-white/90 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>blockquote]:border-l-2 [&>blockquote]:border-[#C9AA72] [&>blockquote]:pl-3 [&>blockquote]:italic [&>blockquote]:text-[#C9AA72]/90 [&>pre]:bg-[#07111F] [&>pre]:p-3 [&>pre]:rounded-xl [&>pre]:text-xs [&>pre]:border [&>pre]:border-[#F4F0E8]/10 [&>strong]:text-white"
        />
      </div>

      {/* Bottom Hint */}
      <div className="pt-2 border-t border-[#F4F0E8]/10 flex items-center justify-between text-[11px] text-[#F4F0E8]/50 shrink-0 select-none">
        <span className="flex items-center gap-1">
          <FileText className="w-3 h-3 text-[#C9AA72]" /> Cuộn bên trong để đọc hết
        </span>
        <span className="font-semibold text-[#C9AA72]">100% Độc Quyền</span>
      </div>
    </div>
  );
}
