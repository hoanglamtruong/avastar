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
    <div className="relative w-full h-full rounded-[22px] glass-panel p-5 flex flex-col overflow-hidden select-text border border-[#D4DBF5]/20">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#D4DBF5]/10 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0095CF]/20 flex items-center justify-center text-[#0095CF] border border-[#0095CF]/30">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0095CF]">
              Box Doc Chuyên Sâu
            </h4>
            <p className="text-[11px] text-[#D4DBF5]/60 font-medium">Tài liệu đọc độc quyền</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#183A60] text-[#D4DBF5]/80 border border-[#D4DBF5]/20">
          Rich-Text
        </span>
      </div>

      {/* Independent Scroll Container */}
      <div className="flex-1 overflow-y-auto custom-slim-scroll pr-1.5 mt-3 text-[#D4DBF5] text-sm leading-relaxed space-y-3 prose prose-invert max-w-none">
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          className="space-y-3 [&>h1]:text-lg [&>h1]:font-black [&>h1]:text-white [&>h1]:mt-1 [&>h2]:text-base [&>h2]:font-bold [&>h2]:text-[#0095CF] [&>h2]:mt-2 [&>p]:text-sm [&>p]:leading-relaxed [&>p.lead]:text-sm [&>p.lead]:font-semibold [&>p.lead]:text-white/90 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>blockquote]:border-l-2 [&>blockquote]:border-[#FEC401] [&>blockquote]:pl-3 [&>blockquote]:italic [&>blockquote]:text-[#FEC401]/90 [&>pre]:bg-[#0B1A2C] [&>pre]:p-3 [&>pre]:rounded-xl [&>pre]:text-xs [&>pre]:border [&>pre]:border-[#D4DBF5]/10 [&>strong]:text-white"
        />
      </div>

      {/* Bottom Hint */}
      <div className="pt-2 border-t border-[#D4DBF5]/10 flex items-center justify-between text-[11px] text-[#D4DBF5]/50 shrink-0 select-none">
        <span className="flex items-center gap-1">
          <FileText className="w-3 h-3 text-[#0095CF]" /> Cuộn bên trong để đọc hết
        </span>
        <span className="font-semibold text-[#0095CF]">100% Độc Quyền</span>
      </div>
    </div>
  );
}
