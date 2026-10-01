import type { Metadata } from "next";
import Link from "next/link";
import { PILLARS } from "@/lib/portfolio-content";
import { ZxWordmark } from "@/components/portfolio/ZxStar";
import { ZxCta } from "@/components/portfolio/ZxCta";

export const metadata: Metadata = {
  title: "ZANGX · Trương Hoàng Lam | Xưởng Sáng Tạo Số",
  description:
    "Trương Hoàng Lam: sáng tạo nội dung, quản lý sản phẩm và nghiên cứu phát triển sản phẩm decor, cây cảnh, cơ khí. Thương hiệu ZANGX.",
};

export default function GioiThieuPage() {
  return (
    <>
      <section className="pt-14 sm:pt-24">
        <ZxWordmark size="lg" />
        <p className="mt-10 text-xs font-bold uppercase tracking-[0.28em] text-[var(--zx-accent)]">
          Creator · Product Manager · R&amp;D
        </p>
        <h1 className="zx-serif mt-4 max-w-4xl text-4xl font-bold leading-[1.12] sm:text-6xl">Trương Hoàng Lam</h1>
        <span className="mt-6 block h-1 w-12 rounded-full bg-[var(--zx-lime)]" aria-hidden="true" />
        <p className="zx-serif mt-6 text-2xl italic text-[var(--zx-accent)] sm:text-3xl">
          &ldquo;Ideas, designed into systems.&rdquo;
        </p>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--zx-muted)] sm:text-lg">
          Tôi biến ý tưởng thành ảnh, video, landing page, webapp, app và cả sản phẩm vật lý. Công cụ AI giúp làm nhanh,
          nền tảng sinh viên Cao đẳng ngành Cơ khí giúp làm chắc.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/dich-vu"
            className="rounded-full bg-[var(--zx-accent)] px-7 py-3 text-sm font-bold text-[var(--zx-bg)] transition-opacity hover:opacity-90"
          >
            Xem dịch vụ
          </Link>
          <Link
            href="/du-an"
            className="rounded-full border border-[var(--zx-muted)]/40 px-7 py-3 text-sm font-bold text-[var(--zx-text)] transition-colors hover:border-[var(--zx-accent)] hover:text-[var(--zx-accent)]"
          >
            Xem dự án
          </Link>
        </div>
      </section>

      <section className="mt-20" aria-labelledby="ba-vai-tro">
        <h2 id="ba-vai-tro" className="zx-serif text-2xl font-bold sm:text-3xl">
          Ba vai trò, một xưởng
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {PILLARS.map((p) => (
            <article key={p.key} className="rounded-2xl border border-[var(--zx-muted)]/15 bg-[var(--zx-surface)] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--zx-accent)]">{p.name}</p>
              <h3 className="zx-serif mt-3 text-xl font-bold leading-snug">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--zx-muted)]">{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      <ZxCta
        title="Có việc cần làm cùng nhau?"
        body="Kênh liên hệ trực tiếp đang được chuẩn bị. Trong lúc chờ, bạn có thể xem dịch vụ và các dự án đã làm."
      />
    </>
  );
}
