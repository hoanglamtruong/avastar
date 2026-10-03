"use client";

import React, { useState, useEffect } from "react";
import { PRODUCT_GROUPS } from "@/lib/portfolio-content";
import { Wrench, Layers, Tag, CheckCircle2, Clock } from "lucide-react";

export function ProductsList() {
  const [productGroups, setProductGroups] = useState<any[]>(PRODUCT_GROUPS as any);

  useEffect(() => {
    fetch("/api/admin/cms?section=products")
      .then((r) => r.json())
      .then((d) => {
        if (d.items && d.groups) {
          // Re-assemble groups with items
          const assembled = d.groups.map((g: any) => ({
            ...g,
            items: d.items.filter((it: any) => it.groupKey === g.key),
          }));
          setProductGroups(assembled);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="mt-14 space-y-16">
      {productGroups.map((g) => (
        <section key={g.key} aria-labelledby={`nhom-${g.key}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1 w-6 rounded-full bg-[#C9AA72]" />
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#C9AA72]">Mảng R&amp;D</p>
          </div>
          <h2 id={`nhom-${g.key}`} className="zx-serif text-2xl sm:text-3xl font-bold text-[#F4F0E8]">
            {g.name}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#AEBCC5] max-w-2xl">{g.intro}</p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(g.items || []).map((it: any) => (
              <article
                key={it.id || it.code}
                className="rounded-3xl border border-white/10 bg-[#102A43]/50 hover:bg-[#102A43]/75 hover:border-[#C9AA72]/50 p-6 sm:p-7 backdrop-blur-xl shadow-xl hover:shadow-[0_15px_35px_rgba(201,170,114,0.15)] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-black uppercase tracking-[0.25em] text-[#A8F238]">
                      {it.code}
                    </span>
                    <span className="rounded-full bg-[#07111F] border border-[#C9AA72]/40 px-3 py-1 text-[11px] font-black text-[#C9AA72]">
                      {it.version}
                    </span>
                  </div>

                  <h3 className="zx-serif mt-4 text-xl sm:text-2xl font-bold leading-snug text-[#F4F0E8] group-hover:text-[#C9AA72] transition-colors">
                    {it.name}
                  </h3>
                </div>

                <div className="mt-6 border-t border-white/10 pt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#AEBCC5] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#C9AA72]" />
                      Trạng thái:
                    </span>
                    <span className="font-bold text-[#F4F0E8]">{it.status}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#AEBCC5] flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-[#A8F238]" />
                      Vật liệu:
                    </span>
                    <span className="font-medium text-[#AEBCC5] text-right truncate max-w-[160px]">
                      {it.material}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
