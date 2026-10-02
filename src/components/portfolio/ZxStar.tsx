import React from "react";

/**
 * Biểu tượng Logo Mark ZANGX hoàn chỉnh theo Brand Sheet:
 * 1. ENSO (Vòng tròn nét cọ thư pháp): IDEA · FLOW · CREATIVE · HUMAN
 * 2. HEXAGON (Lục giác cân): SYSTEM · STRUCTURE · AGENT · PROCESS
 * 3. STAR (Ngôi sao 4 cánh tỏa sáng): INSIGHT · POTENTIAL · GROWTH · NEW WORLD
 */
export function ZxStar({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        {/* Dải gradient ánh kim Champagne Gold */}
        <linearGradient id="zx-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DFCA9F" />
          <stop offset="50%" stopColor="#C9AA72" />
          <stop offset="100%" stopColor="#9E7E45" />
        </linearGradient>
        {/* Glow nhẹ cho tâm điểm ngôi sao */}
        <radialGradient id="zx-star-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF4D9" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#C9AA72" stopOpacity="1" />
        </radialGradient>
      </defs>

      {/* 1. VÒNG ENSO: Nét cọ thư pháp hữu cơ, uyển chuyển bao quanh */}
      <g stroke="url(#zx-gold-grad)" fill="none" strokeLinecap="round">
        {/* Vòng chính dày dặn */}
        <path
          d="M 50 6 A 44 44 0 1 1 8 46"
          strokeWidth="6"
          strokeDasharray="260 20"
        />
        {/* Nét vuốt phụ tạo hiệu ứng vệt mực thư pháp (brush texture) */}
        <path
          d="M 54 8 A 41 41 0 1 1 14 42"
          strokeWidth="2.5"
          opacity="0.65"
        />
        <path
          d="M 46 4 A 46 46 0 0 1 92 58"
          strokeWidth="1.8"
          opacity="0.45"
        />
      </g>

      {/* 2. LỤC GIÁC (HEXAGON): Cấu trúc hệ thống vững chắc */}
      <polygon
        points="50,18 78,34 78,66 50,82 22,66 22,34"
        stroke="url(#zx-gold-grad)"
        strokeWidth="3.2"
        strokeLinejoin="round"
        fill="none"
        opacity="0.95"
      />

      {/* 3. NGÔI SAO 4 CÁNH (STAR): Tuệ giác và tiềm năng phát triển */}
      <path
        d="M 50 24 C 50 42 42 50 24 50 C 42 50 50 58 50 76 C 50 58 58 50 76 50 C 58 50 50 42 50 24 Z"
        fill="url(#zx-star-glow)"
      />
    </svg>
  );
}

/**
 * ZxWordmark: Chữ ZANGX theo đúng chuẩn Brand Construction
 * - "ZANG": Chữ A có thanh ngang điểm nhấn ZANGX GREEN (#A8F238)
 * - "X": Chữ X cách điệu góc 45° màu Champagne Gold (#C9AA72)
 * - Tagline: "THE DIGITAL ATELIER"
 */
export function ZxWordmark({
  size = "md",
  showTagline = true,
}: {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}) {
  const isLg = size === "lg";
  const isSm = size === "sm";

  return (
    <span className="inline-flex flex-col leading-none select-none" aria-label="ZANGX - THE DIGITAL ATELIER">
      <span className={`inline-flex items-center font-extrabold tracking-[0.08em] ${isLg ? "text-4xl sm:text-5xl" : isSm ? "text-base" : "text-xl sm:text-2xl"}`}>
        <span className="text-[#F4F0E8]">Z</span>
        {/* Chữ A với thanh ngang màu xanh Zangx Green #A8F238 */}
        <span className="relative inline-block text-[#F4F0E8]">
          A
          <span
            className="absolute bottom-[28%] left-[16%] right-[16%] h-[15%] rounded-full bg-[#A8F238] shadow-[0_0_8px_rgba(168,242,56,0.6)]"
            aria-hidden="true"
          />
        </span>
        <span className="text-[#F4F0E8]">N</span>
        <span className="text-[#F4F0E8]">G</span>
        {/* Chữ X Champagne Gold phong cách 45 độ atelier */}
        <span className="text-[#C9AA72] ml-[1px] font-black drop-shadow-[0_0_10px_rgba(201,170,114,0.4)]">
          X
        </span>
      </span>

      {showTagline && (
        <span
          className={`mt-1 font-semibold uppercase text-[#AEBCC5] tracking-[0.28em] ${
            isLg ? "text-xs sm:text-sm" : isSm ? "text-[8px] tracking-[0.22em]" : "text-[9px] sm:text-[10px]"
          }`}
        >
          THE DIGITAL ATELIER
        </span>
      )}
    </span>
  );
}

/**
 * ZxLogoLockup: Khóa logo ngang chuẩn bao gồm Logo Mark + Wordmark
 */
export function ZxLogoLockup({
  size = "md",
  showTagline = true,
}: {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}) {
  const markSize = size === "lg" ? "w-14 h-14 sm:w-16 sm:h-16" : size === "sm" ? "w-6 h-6" : "w-8 h-8 sm:w-9 sm:h-9";

  return (
    <div className="inline-flex items-center gap-2.5 sm:gap-3">
      <ZxStar className={`${markSize} shrink-0 drop-shadow-[0_0_12px_rgba(201,170,114,0.35)]`} />
      <ZxWordmark size={size} showTagline={showTagline} />
    </div>
  );
}

/**
 * Biểu tượng App Icon tròn / squircle theo Brand Sheet (Avatar / Favicon / App Icon)
 */
export function ZxAppIcon({
  size = 48,
  variant = "dark",
}: {
  size?: number;
  variant?: "dark" | "light" | "minimal";
}) {
  const isDark = variant === "dark";
  const bg = isDark ? "bg-[#07111F]" : "bg-[#F4F0E8]";
  const border = isDark ? "border-[#C9AA72]/30" : "border-[#102A43]/20";

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center rounded-2xl border ${border} ${bg} shadow-xl overflow-hidden p-2`}
    >
      <ZxStar className="w-full h-full text-[#C9AA72]" />
    </div>
  );
}
