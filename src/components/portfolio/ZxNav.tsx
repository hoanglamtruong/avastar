"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PORTFOLIO_NAV } from "@/lib/portfolio-content";

export function ZxNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Điều hướng portfolio" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
      <ul className="flex items-center gap-1 whitespace-nowrap">
        {PORTFOLIO_NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-block rounded-full px-3 py-2 text-sm font-semibold transition-colors sm:px-4 ${
                  active
                    ? "bg-[var(--zx-accent)] text-[var(--zx-bg)]"
                    : "text-[var(--zx-muted)] hover:text-[var(--zx-text)]"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
