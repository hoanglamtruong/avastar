"use client";

import Link from "next/link";
import { useState } from "react";
import { PROJECTS, PROJECT_TYPES, type ProjectType } from "@/lib/portfolio-content";
import { ArrowUpRight, FolderKanban, Sparkles } from "lucide-react";

export function ProjectGrid() {
  const [active, setActive] = useState<ProjectType>("Tất cả");
  const shown = active === "Tất cả" ? PROJECTS : PROJECTS.filter((p) => p.type === active);

  return (
    <div className="mt-12">
      {/* FILTER PILLS */}
      <div
        role="group"
        aria-label="Lọc dự án theo loại"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 sm:mx-0 sm:flex-wrap sm:px-0 no-scrollbar"
      >
        {PROJECT_TYPES.map((t) => {
          const on = t === active;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setActive(t)}
              aria-pressed={on}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-black tracking-wide transition-all transform active:scale-95 ${
                on
                  ? "bg-[#C9AA72] text-[#07111F] shadow-[0_0_15px_rgba(201,170,114,0.4)] border border-[#C9AA72]"
                  : "bg-[#102A43]/50 text-[#AEBCC5] border border-white/10 hover:border-[#C9AA72]/40 hover:text-white"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <p className="mt-10 rounded-3xl border border-dashed border-white/15 p-12 text-center text-[#AEBCC5] bg-[#102A43]/30">
          Chưa có dự án thuộc loại này. Nội dung sẽ được cập nhật sớm.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <article
              key={p.title}
              className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#102A43]/50 hover:bg-[#102A43]/75 hover:border-[#C9AA72]/50 p-6 sm:p-7 backdrop-blur-xl shadow-xl hover:shadow-[0_15px_35px_rgba(201,170,114,0.15)] transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#07111F] border border-[#C9AA72]/40 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#C9AA72]">
                    {p.type}
                  </span>
                  {p.href && (
                    <span className="p-1.5 rounded-full bg-[#A8F238]/10 text-[#A8F238] border border-[#A8F238]/30">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <h3 className="zx-serif mt-4 text-xl sm:text-2xl font-bold leading-snug text-[#F4F0E8] group-hover:text-[#C9AA72] transition-colors">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#AEBCC5]">{p.body}</p>
              </div>

              <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between">
                {p.href ? (
                  <Link
                    href={p.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A8F238] hover:text-white transition"
                  >
                    <span>Mở trải nghiệm dự án</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <span className="text-xs font-medium text-[#AEBCC5]/60 italic">Hồ sơ nội bộ</span>
                )}

                {p.sample && (
                  <span className="text-[10px] font-semibold text-[#AEBCC5]/60 uppercase tracking-wider">
                    Demo Concept
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
