/**
 * Logo mark ZANGX: vòng Enso (nét cọ) + lục giác (hệ thống/cấu trúc) +
 * ngôi sao 4 cánh (insight/tiềm năng), đúng theo brand sheet ZANGX.
 * 1 màu duy nhất qua currentColor, dùng chung cho header, favicon, CTA.
 */
export function ZxStar({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Vòng Enso: nét tròn không khép kín, gợi ý nét cọ vẽ tay */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="250 40"
        transform="rotate(-95 50 50)"
        opacity="0.9"
      />
      {/* Lục giác: hệ thống, cấu trúc, agent */}
      <path
        d="M50 18 L77.7 34 L77.7 66 L50 82 L22.3 66 L22.3 34 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Ngôi sao 4 cánh: insight, tiềm năng, thế giới mới */}
      <g transform="translate(50 50) scale(0.36) translate(-50 -50)">
        <g transform="rotate(45 50 50)">
          <path
            d="M50 0 C50 28, 72 50, 100 50 C72 50, 50 72, 50 100 C50 72, 28 50, 0 50 C28 50, 50 28, 50 0 Z"
            fill="currentColor"
          />
        </g>
      </g>
    </svg>
  );
}

export function ZxWordmark({ size = "md" }: { size?: "md" | "lg" }) {
  const big = size === "lg";
  return (
    <span className="inline-flex flex-col leading-none" aria-label="ZANGX, Xưởng Sáng Tạo Số">
      <span className={`inline-flex items-center font-extrabold tracking-[0.12em] text-[var(--zx-text)] ${big ? "text-4xl sm:text-5xl" : "text-xl"}`}>
        ZANG
        <ZxStar className={`text-[var(--zx-accent)] ${big ? "h-10 w-10 sm:h-12 sm:w-12 -ml-1" : "h-6 w-6 -ml-0.5"}`} />
      </span>
      <span className={`mt-1.5 font-semibold uppercase text-[var(--zx-muted)] ${big ? "text-xs sm:text-sm tracking-[0.3em]" : "text-[9px] tracking-[0.28em]"}`}>
        Xưởng Sáng Tạo Số
      </span>
    </span>
  );
}
