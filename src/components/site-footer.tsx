"use client";

import Link from "next/link";
import { useApp } from "@/lib/app-context";
import { CITY_KEYS, TYPE_KEYS } from "@/lib/data";

export function SiteFooter() {
  const { t } = useApp();

  return (
    <footer className="mt-24 border-t border-line bg-white">
      <div className="shell grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-title font-extrabold text-teal">{t("app_name")}</p>
          <p className="mt-3 max-w-sm text-body text-ink-muted">{t("footer_about")}</p>
          <p className="mt-5 inline-block rounded-chip bg-sand/15 px-3 py-1.5 text-caption font-semibold text-sand">
            {t("demo_notice")}
          </p>
        </div>

        <nav className="flex flex-col gap-2">
          <p className="mb-1 text-caption font-bold uppercase tracking-wider text-ink-faint">
            {t("footer_explore")}
          </p>
          {CITY_KEYS.map((c) => (
            <Link
              key={c}
              href={`/search?city=${c}`}
              className="text-body text-ink-muted transition-colors hover:text-teal"
            >
              {t(`city_${c}`)}
            </Link>
          ))}
        </nav>

        <nav className="flex flex-col gap-2">
          <p className="mb-1 text-caption font-bold uppercase tracking-wider text-ink-faint">
            {t("footer_help")}
          </p>
          {TYPE_KEYS.map((k) => (
            <Link
              key={k}
              href={`/search?type=${k}`}
              className="text-body text-ink-muted transition-colors hover:text-teal"
            >
              {t(`type_${k}`)}
            </Link>
          ))}
          <span className="text-body text-ink-muted">{t("menu_contact")}</span>
          <span className="text-body text-ink-muted">{t("menu_terms")}</span>
          <Link href="/admin" className="text-body text-ink-muted transition-colors hover:text-teal">
            {t("admin_title")}
          </Link>
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="shell py-5 text-caption text-ink-faint">
          © {new Date().getFullYear()} {t("app_name")} — {t("footer_rights")}
        </div>
      </div>
    </footer>
  );
}
