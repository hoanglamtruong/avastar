"use client";

import React, { useState, useEffect } from "react";
import { SERVICES, AI_TOOLS } from "@/lib/portfolio-content";
import { Sparkles, Bot } from "lucide-react";

export function ServicesList() {
  const [services, setServices] = useState<any[]>(SERVICES as any);

  useEffect(() => {
    fetch("/api/admin/cms?section=services")
      .then((r) => r.json())
      .then((d) => {
        if (d.items && d.items.length > 0) {
          setServices(d.items);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* DANH SÁCH DỊCH VỤ DẠNG BENTO CARDS */}
      <section className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Danh sách dịch vụ">
        {services.map((s, index) => (
          <article
            key={s.id || s.name}
            className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#102A43]/50 hover:bg-[#102A43]/75 hover:border-[#C9AA72]/50 p-6 sm:p-7 backdrop-blur-xl shadow-xl hover:shadow-[0_15px_35px_rgba(201,170,114,0.15)] transition-all duration-300 group"
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#A8F238]">
                  Gói #{index + 1}
                </span>
                <span className="p-1.5 rounded-full bg-[#07111F]/80 border border-white/10 text-[#C9AA72]">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
              </div>
              <h2 className="zx-serif mt-3 text-xl sm:text-2xl font-bold text-[#F4F0E8] group-hover:text-[#C9AA72] transition-colors">
                {s.name}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#AEBCC5]">{s.body}</p>
            </div>

            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#C9AA72] mb-3">
                Quy trình thực hiện
              </p>
              <ol className="space-y-2 text-xs text-[#F4F0E8]/90">
                {(s.steps || []).map((step: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#07111F] border border-[#C9AA72]/40 text-[#C9AA72] text-[10px] font-black shrink-0">
                      {i + 1}
                    </span>
                    <span className="leading-tight pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </article>
        ))}
      </section>

      {/* CÔNG CỤ AI ĐANG DÙNG */}
      <section className="mt-24" aria-labelledby="cong-cu-ai">
        <div className="flex items-center gap-2">
          <span className="h-1 w-8 rounded-full bg-[#A8F238]" />
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#A8F238]">AI Tech Stack</p>
        </div>
        <h2 id="cong-cu-ai" className="zx-serif mt-3 text-3xl font-bold sm:text-4xl text-[#F4F0E8]">
          Hệ Thống Công Cụ AI Đang Sử Dụng
        </h2>
        <p className="mt-3 max-w-2xl text-sm sm:text-base text-[#AEBCC5]">
          Mỗi bài toán được điều phối công cụ chuyên biệt tối ưu nhất, không bị phụ thuộc vào một nền tảng duy nhất.
        </p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {AI_TOOLS.map((t) => (
            <li
              key={t.name}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#102A43]/40 hover:border-[#C9AA72]/40 p-5 backdrop-blur shadow-lg transition-transform hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Bot className="w-5 h-5 text-[#A8F238]" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#C9AA72] px-2 py-0.5 rounded-full bg-[#07111F]">
                    Engine
                  </span>
                </div>
                <p className="text-lg font-black text-[#F4F0E8]">{t.name}</p>
                <p className="mt-2 text-xs leading-relaxed text-[#AEBCC5]">{t.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
