import { ZxStar } from "./ZxStar";

export function ZxCta({ title, body }: { title: string; body: string }) {
  return (
    <section className="mt-20 rounded-3xl border border-[var(--zx-accent)]/30 bg-[var(--zx-surface)] px-6 py-10 text-center sm:px-12 sm:py-14">
      <ZxStar className="mx-auto h-8 w-8 text-[var(--zx-accent)]" />
      <h2 className="zx-serif mx-auto mt-4 max-w-2xl text-2xl font-bold sm:text-3xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-[var(--zx-muted)]">{body}</p>
      <button
        type="button"
        disabled
        aria-disabled="true"
        className="mt-7 cursor-not-allowed rounded-full border border-[var(--zx-accent)]/50 px-8 py-3 text-sm font-bold tracking-wide text-[var(--zx-accent)] opacity-90"
      >
        Liên hệ sắp mở
      </button>
    </section>
  );
}

export function ZxPageTitle({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <header className="pt-12 sm:pt-20">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--zx-accent)]">{eyebrow}</p>
      <h1 className="zx-serif mt-4 max-w-3xl text-4xl font-bold leading-[1.15] sm:text-6xl">{title}</h1>
      <span className="mt-6 block h-1 w-12 rounded-full bg-[var(--zx-lime)]" aria-hidden="true" />
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--zx-muted)] sm:text-lg">{intro}</p>
    </header>
  );
}
