import type { Metadata } from "next";
import { AI_TOOLS, SERVICES } from "@/lib/portfolio-content";
import { ZxCta, ZxPageTitle } from "@/components/portfolio/ZxCta";

export const metadata: Metadata = {
  title: "Dịch vụ · ZANGX",
  description:
    "Marketing Facebook, ảnh, video, landing page, webapp và app, vận hành tự động, R&D sản phẩm. Làm bằng công cụ AI, đi từ thiết kế tới vận hành.",
};

export default function DichVuPage() {
  return (
    <>
      <ZxPageTitle
        eyebrow="Dịch vụ"
        title="Những việc tôi làm được cho bạn"
        intro="Bảy nhóm dịch vụ, đều đi từ thiết kế, thi công tới chỉnh sửa và vận hành. Mỗi việc làm theo từng bước rõ ràng để bạn luôn biết đang ở đâu."
      />

      <section className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Danh sách dịch vụ">
        {SERVICES.map((s) => (
          <article key={s.name} className="flex flex-col rounded-2xl border border-[var(--zx-muted)]/15 bg-[var(--zx-surface)] p-6">
            <h2 className="zx-serif text-xl font-bold">{s.name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--zx-muted)]">{s.body}</p>
            <ol className="mt-5 space-y-2 border-t border-[var(--zx-muted)]/15 pt-4 text-sm">
              {s.steps.map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="font-bold text-[var(--zx-accent)]">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </section>

      <section className="mt-20" aria-labelledby="cong-cu-ai">
        <h2 id="cong-cu-ai" className="zx-serif text-2xl font-bold sm:text-3xl">
          Công cụ AI đang dùng
        </h2>
        <p className="mt-3 max-w-2xl text-[var(--zx-muted)]">
          Mỗi việc dùng công cụ hợp nhất với việc đó, không phụ thuộc vào một nơi duy nhất.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {AI_TOOLS.map((t) => (
            <li key={t.name} className="rounded-2xl border border-[var(--zx-accent)]/25 p-5">
              <p className="text-lg font-extrabold text-[var(--zx-accent)]">{t.name}</p>
              <p className="mt-2 text-sm text-[var(--zx-muted)]">{t.role}</p>
            </li>
          ))}
        </ul>
      </section>

      <ZxCta title="Bạn cần một việc cụ thể?" body="Kênh nhận yêu cầu đang được chuẩn bị. Bạn có thể xem trước các dự án để hình dung cách làm việc." />
    </>
  );
}
