import type { Metadata } from "next";
import Link from "next/link";
import { PILLARS } from "@/lib/portfolio-content";
import { ZxLogoLockup, ZxStar } from "@/components/portfolio/ZxStar";
import { ZxCta } from "@/components/portfolio/ZxCta";

export const metadata: Metadata = {
  title: "Về ZANGX · The Digital Atelier | Trương Hoàng Lam",
  description:
    "Xưởng Sáng Tạo Số ZANGX do Trương Hoàng Lam sáng lập: Ideas Designed Into Systems. Creative Thinking. Intelligent Execution. Real Products.",
};

const SYMBOLS = [
  {
    name: "ENSO",
    keywords: "IDEA · FLOW · CREATIVE · HUMAN",
    desc: "Vòng tròn nét cọ thư pháp Zen biểu trưng cho dòng chảy ý tưởng bất tận, trực giác sáng tạo tự do và chiều sâu cảm xúc con người. Nét cọ mở gợi ý sự học hỏi và tiến hóa liên tục.",
    svg: (
      <svg viewBox="0 0 100 100" className="w-16 h-16 text-[#C9AA72]" fill="none">
        <path
          d="M 50 10 A 40 40 0 1 1 14 46"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="240 18"
        />
        <path
          d="M 54 13 A 37 37 0 1 1 18 42"
          stroke="currentColor"
          strokeWidth="2.5"
          opacity="0.6"
        />
      </svg>
    ),
  },
  {
    name: "HEXAGON",
    keywords: "SYSTEM · STRUCTURE · AGENT · PROCESS",
    desc: "Khối lục giác cấu trúc cân bằng hoàn mỹ, đại diện cho tính kỷ luật hệ thống, kiến trúc giải pháp chặt chẽ và quy trình vận hành tự động của mạng lưới AI Agent.",
    svg: (
      <svg viewBox="0 0 100 100" className="w-16 h-16 text-[#C9AA72]" fill="none">
        <polygon
          points="50,15 80,32 80,68 50,85 20,68 20,32"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: "STAR",
    keywords: "INSIGHT · POTENTIAL · GROWTH · NEW WORLD",
    desc: "Ngôi sao 4 cánh tỏa sáng đại diện cho tuệ giác dẫn đường, đánh thức tiềm năng bứt phá, thúc đẩy tăng trưởng và mở ra thế giới công nghệ tương lai.",
    svg: (
      <svg viewBox="0 0 100 100" className="w-16 h-16 text-[#C9AA72]" fill="currentColor">
        <path d="M 50 18 C 50 40 40 50 18 50 C 40 50 50 60 50 82 C 50 60 60 50 82 50 C 60 50 50 40 50 18 Z" />
      </svg>
    ),
  },
];

const COLORS = [
  {
    hex: "#07111F",
    name: "COSMIC NAVY",
    role: "Nền chính",
    desc: "Sang trọng · Chiều sâu vũ trụ",
    border: "border-white/10",
  },
  {
    hex: "#102A43",
    name: "DEEP BLUE",
    role: "Nền phụ (Surface)",
    desc: "Ổn định · Chuyên nghiệp",
    border: "border-white/15",
  },
  {
    hex: "#F4F0E8",
    name: "IVORY",
    role: "Nền sáng / Chữ",
    desc: "Tinh tế · Hiện đại",
    textColor: "text-[#07111F]",
    border: "border-white/20",
  },
  {
    hex: "#C9AA72",
    name: "CHAMPAGNE",
    role: "Nhấn cao cấp",
    desc: "Ấm áp · Giá trị thời gian",
    textColor: "text-[#07111F]",
    border: "border-[#C9AA72]/30",
  },
  {
    hex: "#AEBCC5",
    name: "MIST",
    role: "Phụ trợ trung tính",
    desc: "Cân bằng · Nhã nhặn",
    textColor: "text-[#07111F]",
    border: "border-white/20",
  },
  {
    hex: "#A8F238",
    name: "ZANGX GREEN",
    role: "Điểm nhấn đột phá",
    desc: "Tăng trưởng · Công nghệ AI",
    textColor: "text-[#07111F]",
    border: "border-[#A8F238]/40",
  },
];

const KEYWORDS = [
  "CREATIVE",
  "STRATEGY",
  "DIGITAL",
  "AI AGENTS",
  "SYSTEMS",
  "PRODUCTS",
];

export default function GioiThieuPage() {
  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="pt-12 sm:pt-20">
        <div className="flex flex-col items-start gap-4">
          <ZxLogoLockup size="lg" />
          
          <div className="flex items-center gap-2 mt-4">
            <span className="h-1 w-10 rounded-full bg-[#A8F238] shadow-[0_0_10px_rgba(168,242,56,0.8)]" />
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#A8F238]">
              MARKETING · CREATIVE · DIGITAL · AI AGENTS
            </p>
          </div>
        </div>

        <h1 className="zx-serif mt-6 max-w-4xl text-4xl font-bold leading-[1.15] sm:text-6xl text-[#F4F0E8]">
          Trương Hoàng Lam
        </h1>
        
        <p className="zx-serif mt-5 text-2xl sm:text-3xl italic text-[#C9AA72]">
          &ldquo;Ideas designed into systems.&rdquo;
        </p>
        <p className="mt-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.28em] text-[#AEBCC5]">
          Creative Thinking. Intelligent Execution. Real Products.
        </p>

        <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#AEBCC5] sm:text-lg">
          Tôi là nhà sáng tạo nội dung, quản lý sản phẩm và chuyên viên R&amp;D. Với nền tảng kỹ thuật cơ khí vững chắc
          kết hợp cùng các hệ thống AI Agent hiện đại, tôi đồng hành cùng các doanh chủ và cá nhân để biến các ý tưởng
          đột phá thành những sản phẩm số, dịch vụ và sản phẩm vật lý mang lại giá trị thực tế.
        </p>

        {/* STATS ROW (Từ mockup brand sheet) */}
        <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-6 max-w-xl p-4 sm:p-6 rounded-2xl border border-[#C9AA72]/20 bg-[#102A43]/50 backdrop-blur">
          <div className="text-center border-r border-[#C9AA72]/20 pr-2">
            <p className="text-2xl sm:text-4xl font-extrabold text-[#F4F0E8] font-sans">50+</p>
            <p className="mt-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#AEBCC5]">Projects</p>
          </div>
          <div className="text-center border-r border-[#C9AA72]/20 pr-2">
            <p className="text-2xl sm:text-4xl font-extrabold text-[#C9AA72] font-sans">30+</p>
            <p className="mt-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#AEBCC5]">Clients</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-4xl font-extrabold text-[#A8F238] font-sans">100%</p>
            <p className="mt-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#AEBCC5]">Real Impact</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/dich-vu"
            className="rounded-full bg-[#C9AA72] px-7 py-3 text-sm font-bold text-[#07111F] transition-opacity hover:opacity-90 shadow-[0_0_20px_rgba(201,170,114,0.3)]"
          >
            Xem dịch vụ
          </Link>
          <Link
            href="/san-pham"
            className="rounded-full border border-[#A8F238]/60 px-7 py-3 text-sm font-bold text-[#A8F238] transition-colors hover:bg-[#A8F238] hover:text-[#07111F]"
          >
            Xem sản phẩm
          </Link>
          <Link
            href="/du-an"
            className="rounded-full border border-[#AEBCC5]/40 px-7 py-3 text-sm font-bold text-[#F4F0E8] transition-colors hover:border-[#C9AA72] hover:text-[#C9AA72]"
          >
            Xem dự án
          </Link>
        </div>
      </section>

      {/* 2. SYMBOL SYSTEM (HỆ THỐNG BIỂU TƯỢNG) */}
      <section className="mt-24" aria-labelledby="symbol-system">
        <div className="flex items-center gap-2">
          <span className="h-1 w-8 rounded-full bg-[#C9AA72]" />
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#C9AA72]">Symbol System</p>
        </div>
        <h2 id="symbol-system" className="zx-serif mt-3 text-3xl font-bold sm:text-4xl text-[#F4F0E8]">
          Hệ Thống Biểu Tượng Nhận Diện
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#AEBCC5] sm:text-base">
          Mỗi đường nét trong Logo Mark của ZANGX đều mang một tầng ý nghĩa triết lý, giao thoa giữa nghệ thuật tự do và kỷ luật công nghệ.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {SYMBOLS.map((s) => (
            <div
              key={s.name}
              className="flex flex-col justify-between rounded-2xl border border-[#AEBCC5]/15 bg-[#102A43]/60 p-6 backdrop-blur transition-transform hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-[#07111F]/80 border border-[#C9AA72]/20">
                    {s.svg}
                  </div>
                  <span className="text-xs font-black text-[#C9AA72] tracking-[0.2em]">{s.name}</span>
                </div>
                <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#A8F238]">
                  {s.keywords}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#AEBCC5]">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tổng hợp Logo Mark */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-6 rounded-2xl border border-[#C9AA72]/30 bg-gradient-to-r from-[#102A43] to-[#07111F] p-6 sm:p-8">
          <ZxStar className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 text-[#C9AA72] drop-shadow-[0_0_20px_rgba(201,170,114,0.4)]" />
          <div>
            <h3 className="zx-serif text-xl sm:text-2xl font-bold text-[#F4F0E8]">
              Biểu Tượng Thống Nhất — The Digital Atelier
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#AEBCC5]">
              Sự hội tụ của <strong className="text-[#F4F0E8]">Enso</strong> (trực giác con người), <strong className="text-[#F4F0E8]">Hexagon</strong> (hệ thống cấu trúc AI) và <strong className="text-[#F4F0E8]">Star</strong> (tuệ giác dẫn đường) tạo nên linh hồn của ZANGX: Nơi ý tưởng trừu tượng được hiện thực hóa thành những hệ thống số hoạt động chính xác và bền bỉ.
            </p>
          </div>
        </div>
      </section>

      {/* 3. BRAND COLOR PALETTE (BẢNG MÀU CHUẨN) */}
      <section className="mt-24" aria-labelledby="brand-colors">
        <div className="flex items-center gap-2">
          <span className="h-1 w-8 rounded-full bg-[#A8F238]" />
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#A8F238]">Brand Color Palette</p>
        </div>
        <h2 id="brand-colors" className="zx-serif mt-3 text-3xl font-bold sm:text-4xl text-[#F4F0E8]">
          Bảng Màu Thương Hiệu
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#AEBCC5] sm:text-base">
          6 gam màu được tuyển chọn chuẩn xác để mang lại cảm giác sang trọng, chiều sâu huyền bí của vũ trụ và sức sống công nghệ mạnh mẽ.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {COLORS.map((c) => (
            <div
              key={c.hex}
              className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#102A43]/40 shadow-lg"
            >
              <div
                style={{ backgroundColor: c.hex }}
                className={`h-24 w-full flex items-end p-3 ${c.border} border-b`}
              >
                <span className={`text-xs font-black font-mono tracking-wider ${c.textColor || "text-white"}`}>
                  {c.hex}
                </span>
              </div>
              <div className="p-3.5 flex flex-col justify-between flex-1">
                <p className="text-xs font-extrabold text-[#F4F0E8]">{c.name}</p>
                <p className="text-[10px] font-bold text-[#A8F238] mt-1">{c.role}</p>
                <p className="text-[11px] text-[#AEBCC5] mt-1.5 leading-snug">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. KEYWORDS NĂNG LỰC */}
      <section className="mt-20">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#AEBCC5]">Key Focus</p>
        <div className="mt-4 flex flex-wrap gap-2.5 sm:gap-3">
          {KEYWORDS.map((k) => (
            <span
              key={k}
              className="px-4 py-2 rounded-full text-xs font-extrabold tracking-widest text-[#F4F0E8] bg-[#102A43] border border-[#C9AA72]/30 shadow-sm"
            >
              {k}
            </span>
          ))}
        </div>
      </section>

      {/* 5. BA VAI TRÒ, MỘT XƯỞNG */}
      <section className="mt-24" aria-labelledby="ba-vai-tro">
        <div className="flex items-center gap-2">
          <span className="h-1 w-8 rounded-full bg-[#C9AA72]" />
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#C9AA72]">Core Pillars</p>
        </div>
        <h2 id="ba-vai-tro" className="zx-serif mt-3 text-3xl font-bold sm:text-4xl text-[#F4F0E8]">
          Ba Vai Trò, Một Xưởng
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {PILLARS.map((p) => (
            <article key={p.key} className="rounded-2xl border border-[#AEBCC5]/15 bg-[#102A43]/70 p-6 backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#C9AA72]">{p.name}</p>
              <h3 className="zx-serif mt-3 text-xl font-bold leading-snug text-[#F4F0E8]">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#AEBCC5]">{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <ZxCta
        title="Đồng hành cùng ZANGX kiến tạo hệ thống của bạn"
        body="Từ xây dựng nhận diện thương hiệu, phát triển sản phẩm số, tự động hóa quy trình với AI đến chế tác sản phẩm vật lý. Hãy kết nối để biến ý tưởng thành hiện thực."
      />
    </>
  );
}
