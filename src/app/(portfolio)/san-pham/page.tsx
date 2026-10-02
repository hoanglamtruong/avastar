import type { Metadata } from "next";
import { PRODUCT_GROUPS } from "@/lib/portfolio-content";
import { ZxCta, ZxPageTitle } from "@/components/portfolio/ZxCta";
import { Wrench, Layers, Tag, CheckCircle2, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Sản Phẩm R&D · ZANGX",
  description: "Nhật ký nghiên cứu và chế tác sản phẩm vật lý (Decor, Cây cảnh, Cơ khí) của Xưởng Sáng Tạo Số ZANGX.",
};

export default function SanPhamPage() {
  return (
    <>
      <ZxPageTitle
        eyebrow="Physical R&D Lab"
        title="Nhật Ký Chế Tác & Phát Triển Sản Phẩm"
        intro="Ba lĩnh vực R&amp;D trọng tâm: Đồ Decor mô-đun, Phụ kiện cây cảnh thông minh và Cơ cấu cơ khí chính xác. Mỗi thiết kế đều có mã định danh, vật liệu chế tạo và ghi lại nhật ký thử nghiệm từ bản vẽ CAD tới nguyên mẫu vật lý."
      />

      <div className="mt-14 space-y-16">
        {PRODUCT_GROUPS.map((g) => (
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
              {g.items.map((it) => (
                <article
                  key={it.code}
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

                    <h3 className="zx-serif mt-4 text-xl sm:text-2xl font-bold text-[#F4F0E8] group-hover:text-[#C9AA72] transition-colors">
                      {it.name}
                    </h3>

                    <dl className="mt-5 space-y-2.5 text-xs sm:text-sm">
                      <div className="flex items-center gap-3">
                        <dt className="w-20 shrink-0 text-[#AEBCC5]">Trạng thái</dt>
                        <dd className="flex items-center gap-2 font-bold text-[#F4F0E8]">
                          <span className="h-2 w-2 rounded-full bg-[#A8F238] shadow-[0_0_8px_#A8F238] animate-pulse" />
                          <span>{it.status}</span>
                        </dd>
                      </div>
                      <div className="flex items-start gap-3">
                        <dt className="w-20 shrink-0 text-[#AEBCC5]">Vật liệu</dt>
                        <dd className="text-[#F4F0E8]/90 font-medium">{it.material}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between text-xs text-[#AEBCC5]">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#C9AA72]" />
                      <span>Nguyên mẫu thực nghiệm</span>
                    </span>
                    <span className="text-[10px] font-bold text-[#C9AA72] uppercase tracking-wider">
                      ZANGX R&amp;D
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <ZxCta
        title="Quan tâm hoặc muốn đặt hàng mẫu thử?"
        body="Hồ sơ chi tiết và bản vẽ kỹ thuật của từng nguyên mẫu sẽ được cập nhật liên tục khi hoàn tất quy trình kiểm nghiệm chất lượng."
      />
    </>
  );
}
