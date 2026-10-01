export function ZxStar({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g transform="rotate(45 50 50)">
        <path d="M50 0 C50 28, 72 50, 100 50 C72 50, 50 72, 50 100 C50 72, 28 50, 0 50 C28 50, 50 28, 50 0 Z" />
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
