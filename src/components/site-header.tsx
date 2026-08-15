"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { IconGlobe, IconHeart, IconUser } from "./icons";
import { ButtonLink } from "./ui";

const NAV = [
  { href: "/", key: "nav_home" },
  { href: "/search", key: "nav_search" },
  { href: "/account?tab=bookings", key: "nav_bookings" },
];

export function SiteHeader() {
  const { t, locale, setLocale, user, rtl, favorites } = useApp();
  const path = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href.split("?")[0]));

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ground/90 backdrop-blur">
      <div className="shell flex h-[var(--header-h)] items-center gap-6">
        <Link href="/" className="text-title font-extrabold tracking-tight text-teal">
          {t("app_name")}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                "rounded-btn px-3 py-2 text-body font-semibold transition-colors " +
                (isActive(item.href) ? "text-teal" : "text-ink-muted hover:text-ink")
              }
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 ms-auto">
          <Link
            href="/account?tab=favorites"
            className="relative hidden size-10 place-items-center rounded-btn text-ink-muted transition-colors hover:bg-teal-light hover:text-teal sm:grid"
            aria-label={t("nav_favorites")}
          >
            <IconHeart />
            {favorites.length > 0 && (
              <span className="absolute top-1.5 grid size-4 place-items-center rounded-full bg-teal text-[10px] font-bold text-white end-1.5">
                {favorites.length}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
            className="inline-flex items-center gap-1.5 rounded-btn px-3 py-2 text-caption font-semibold text-ink-muted transition-colors hover:bg-teal-light hover:text-teal"
          >
            <IconGlobe width={17} height={17} />
            {locale === "ar" ? "EN" : "ع"}
          </button>

          {user ? (
            <Link
              href="/account"
              className="inline-flex items-center gap-2 rounded-btn bg-teal-light px-3 py-2 text-caption font-semibold text-teal"
            >
              <IconUser width={17} height={17} />
              <span className="hidden sm:inline">{rtl ? user.nameAr : user.nameEn}</span>
            </Link>
          ) : (
            <ButtonLink href="/login" className="px-4 py-2.5 text-body">
              {t("login")}
            </ButtonLink>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-btn text-ink md:hidden"
            aria-label={t("nav_search")}
            aria-expanded={open}
          >
            <span className="flex w-5 flex-col gap-1">
              <span className="h-0.5 w-full rounded bg-current" />
              <span className="h-0.5 w-full rounded bg-current" />
              <span className="h-0.5 w-full rounded bg-current" />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-white md:hidden">
          <div className="shell flex flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-btn px-2 py-3 text-body-lg font-semibold text-ink"
              >
                {t(item.key)}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
