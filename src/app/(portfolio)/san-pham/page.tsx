import type { Metadata } from "next";
import { PRODUCT_GROUPS } from "@/lib/portfolio-content";
import { ZxCta, ZxPageTitle } from "@/components/portfolio/ZxCta";

export const metadata: Metadata = {
  title: "Sản phẩm · ZANGX",
  description: "Nhật ký nghiên cứu và phát triển sản phẩm decor, cây cảnh, cơ khí của ZANGX: mã, vật liệu, trạng thái từng phiên bản.",
};

export default function SanPhamPage() {
  return (
    <>
      <ZxPageTitle
        eyebrow="Sản phẩm · R&D"
        title="Nhật ký phát triển sản phẩm"
        intro="Ba mảng đang nghiên cứu: decor, cây cảnh, cơ khí. Mỗi mẫu có mã riêng, ghi rõ vật liệu và phiên bản để theo dõi từ bản vẽ tới bản thử."
      />

      <div className="mt-12 space-y-14">
        {PRODUCT_GROUPS.map((g) => (
          <section key={g.key} aria-labelledby={`nhom-${g.key}`}>
            <h2 id={`nhom-${g.key}`} className="zx-serif text-2xl font-bold sm:text-3xl">
              {g.name}
            </h2>
            <p className="mt-2 text-[var(--zx-muted)]">{g.intro}</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((it) => (
                <article key={it.code} className="rounded-2xl border border-[var(--zx-muted)]/15 bg-[var(--zx-surface)] p-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--zx-accent)]">{it.code}</p>
                    <span className="rounded-full border border-[var(--zx-accent)]/40 px-3 py-1 text-[11px] font-bold text-[var(--zx-accent)]">
                      {it.version}
                    </span>
                  </div>
                  <h3 className="zx-serif mt-3 text-xl font-bold">{it.name}</h3>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex gap-3">
                      <dt className="w-20 shrink-0 text-[var(--zx-muted)]">Trạng thái</dt>
                      <dd className="flex items-center gap-2 font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--zx-lime)]" aria-hidden="true" />
                        {it.status}
                      </dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="w-20 shrink-0 text-[var(--zx-muted)]">Vật liệu</dt>
                      <dd>{it.material}</dd>
                    </div>
                  </dl>
                  <p className="mt-5 border-t border-[var(--zx-muted)]/15 pt-3 text-xs italic text-[var(--zx-muted)]">Nội dung mẫu</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <ZxCta title="Quan tâm một sản phẩm?" body="Kênh trao đổi trực tiếp đang được chuẩn bị. Hồ sơ từng mẫu sẽ được bổ sung khi có bản chính thức." />
    </>
  );
}
