"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChaletCard } from "@/components/chalet-card";
import { IconSearch, TypeIcon } from "@/components/icons";
import { Button, ButtonLink, Card, SectionHead } from "@/components/ui";
import { useApp } from "@/lib/app-context";
import { getFeaturedChalets } from "@/lib/api";
import { CITY_KEYS, TYPE_KEYS, type Chalet } from "@/lib/data";

export default function HomePage() {
  const { t } = useApp();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [featured, setFeatured] = useState<Chalet[]>([]);

  /** أعلى 4 شاليهات حجزًا هالموسم — رقم فعلي محسوب بالباكاند، مش شاليه سجّل مالكه نفسه */
  useEffect(() => {
    getFeaturedChalets()
      .then(setFeatured)
      .catch(() => setFeatured([]));
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search");
  };

  return (
    <>
      {/* ---------- الواجهة الأولى ---------- */}
      <section className="border-b border-line bg-type-card/50">
        <div className="shell grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <h1 className="text-balance text-[clamp(30px,5vw,46px)] font-extrabold leading-[1.15] tracking-tight text-ink">
              {t("hero_title")}
            </h1>
            <p className="mt-4 max-w-md text-[17px] text-ink-muted">{t("hero_sub")}</p>

            <form onSubmit={submit} className="mt-8 flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute inset-y-0 grid place-items-center text-ink-faint start-4">
                  <IconSearch />
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("search_hint")}
                  aria-label={t("search_hint")}
                  className="w-full rounded-field border border-line bg-white py-4 text-body-lg text-ink outline-none placeholder:text-ink-muted focus:border-teal focus:ring-1 focus:ring-teal ps-12 pe-4"
                />
              </div>
              <Button type="submit" className="py-4 sm:px-8">
                {t("search_cta")}
              </Button>
            </form>

            <div className="mt-5 flex flex-wrap gap-2">
              {CITY_KEYS.map((c) => (
                <Link
                  key={c}
                  href={`/search?city=${c}`}
                  className="rounded-chip bg-white px-3.5 py-1.5 text-caption font-semibold text-ink-muted transition-colors hover:text-teal"
                >
                  {t(`city_${c}`)}
                </Link>
              ))}
            </div>
          </div>

          {/* لوحة صور تعريفية */}
          <div className="hidden grid-cols-3 grid-rows-3 gap-3 md:grid md:h-[340px]">
            <div className="col-span-2 row-span-2 rounded-card bg-img" />
            <div className="rounded-card bg-teal" />
            <div className="rounded-card bg-sand" />
            <div className="col-span-2 rounded-card bg-img" />
            <div className="rounded-card bg-teal-light" />
          </div>
        </div>
      </section>

      {/* ---------- شاليهات مميزة ---------- */}
      <section className="shell py-16">
        <SectionHead
          title={t("featured")}
          sub={t("featured_sub")}
          action={
            <Link href="/search" className="text-body font-semibold text-teal hover:underline">
              {t("view_all")} ←
            </Link>
          }
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((c) => (
            <ChaletCard key={c.id} chalet={c} />
          ))}
        </div>
      </section>

      {/* ---------- تصفح حسب النوع ---------- */}
      <section className="shell pb-16">
        <SectionHead title={t("browse_by_type")} />
        <div className="grid gap-4 sm:grid-cols-3">
          {TYPE_KEYS.map((k) => (
            <Link key={k} href={`/search?type=${k}`} className="group">
              <Card tone="sand" className="flex h-full items-center gap-4 p-6 transition-colors group-hover:bg-teal-light">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-teal text-white">
                  <TypeIcon name={k} width={22} height={22} />
                </span>
                <span>
                  <span className="block text-section font-bold text-ink">{t(`type_${k}`)}</span>
                  <span className="block text-caption text-ink-muted">{t(`type_${k}_sub`)}</span>
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- كيف بتحجز ---------- */}
      <section className="border-y border-line bg-white">
        <div className="shell py-16">
          <SectionHead title={t("how_it_works")} />
          <ol className="grid gap-8 sm:grid-cols-3">
            {[
              ["step_search", "step_search_sub"],
              ["step_dates", "step_dates_sub"],
              ["step_book", "step_book_sub"],
            ].map(([title, sub], i) => (
              <li key={title} className="flex flex-col gap-2">
                <span className="grid size-9 place-items-center rounded-full bg-teal text-body font-bold text-white tabular-nums">
                  {i + 1}
                </span>
                <h3 className="text-section font-bold text-ink">{t(title)}</h3>
                <p className="text-body text-ink-muted">{t(sub)}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10">
            <ButtonLink href="/search">{t("browse_chalets")}</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
