"use client";

import Link from "next/link";
import { useState } from "react";
import { PROJECTS, PROJECT_TYPES, type ProjectType } from "@/lib/portfolio-content";

export function ProjectGrid() {
  const [active, setActive] = useState<ProjectType>("Tất cả");
  const shown = active === "Tất cả" ? PROJECTS : PROJECTS.filter((p) => p.type === active);

  return (
    <div className="mt-10">
      <div role="group" aria-label="Lọc dự án theo loại" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {PROJECT_TYPES.map((t) => {
          const on = t === active;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setActive(t)}
              aria-pressed={on}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                on
                  ? "border-[var(--zx-accent)] bg-[var(--zx-accent)] text-[var(--zx-bg)]"
                  : "border-[var(--zx-muted)]/30 text-[var(--zx-muted)] hover:border-[var(--zx-accent)] hover:text-[var(--zx-text)]"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-[var(--zx-muted)]/30 p-8 text-center text-[var(--zx-muted)]">
          Chưa có dự án thuộc loại này. Nội dung sẽ được bổ sung.
        </p>
      ) : (
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <li key={p.title} className="flex flex-col rounded-2xl border border-[var(--zx-muted)]/15 bg-[var(--zx-surface)] p-6">
              <span className="w-fit rounded-full border border-[var(--zx-accent)]/40 px-3 py-1 text-[11px] font-bold text-[var(--zx-accent)]">
                {p.type}
              </span>
              <h3 className="zx-serif mt-4 text-xl font-bold leading-snug">{p.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--zx-muted)]">{p.body}</p>
              {p.href ? (
                <Link href={p.href} className="mt-5 text-sm font-bold text-[var(--zx-accent)] hover:underline">
                  Mở dự án
                </Link>
              ) : null}
              {p.sample ? (
                <p className="mt-5 border-t border-[var(--zx-muted)]/15 pt-3 text-xs italic text-[var(--zx-muted)]">Nội dung mẫu</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
