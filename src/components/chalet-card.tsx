"use client";

import Link from "next/link";
import { useApp } from "@/lib/app-context";
import type { Chalet } from "@/lib/data";
import { IconGuests, IconHeart, IconLocation } from "./icons";
import { SceneArt } from "./scene-art";
import { Rating } from "./ui";

/** كرت الشاليه — الشكل الأساسي بكل الشبكات. السعر هو العنصر المهيمن بصريًا. */
export function ChaletCard({ chalet }: { chalet: Chalet }) {
  const { t, rtl, isFavorite, toggleFavorite } = useApp();
  const fav = isFavorite(chalet.id);
  const name = rtl ? chalet.nameAr : chalet.nameEn;
  const photo = chalet.media?.find((m) => m.type === "image");

  return (
    <article className="group relative overflow-hidden rounded-card border border-line bg-white transition-shadow hover:shadow-[0_6px_24px_rgba(31,41,55,0.08)]">
      <button
        type="button"
        onClick={() => toggleFavorite(chalet.id)}
        aria-label={fav ? t("saved") : t("save")}
        aria-pressed={fav}
        className="absolute top-3 z-10 grid size-9 place-items-center rounded-full bg-white/95 shadow-sm transition-transform hover:scale-105 end-3"
      >
        <IconHeart filled={fav} className={fav ? "text-danger" : "text-ink-faint"} />
      </button>

      <Link href={`/chalet/${chalet.id}`} className="block">
        <div className="relative">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo.url} alt={name} className="h-48 w-full object-cover" />
          ) : (
            <SceneArt seed={chalet.id} typeKey={chalet.typeKey} className="h-48 w-full" label={name} />
          )}
          <span className="absolute top-3 start-3 rounded-chip bg-white/92 px-2.5 py-1 text-badge font-semibold text-teal shadow-sm backdrop-blur-sm">
            {t(`type_${chalet.typeKey}`)}
          </span>
        </div>

        <div className="flex flex-col gap-2.5 p-4">
          <h3 className="text-body-lg font-bold leading-snug text-ink">{name}</h3>
          <Rating value={chalet.rating} />

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-ink-muted">
            <span className="inline-flex items-center gap-1.5">
              <IconLocation width={15} height={15} className="text-ink-faint" />
              {rtl ? chalet.areaAr : chalet.areaEn}، {t(`city_${chalet.cityKey}`)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <IconGuests width={15} height={15} className="text-ink-faint" />
              {chalet.capacity} {t("guest_unit")}
            </span>
          </div>

          <div className="mt-0.5 flex items-baseline gap-1.5 border-t border-line pt-2.5">
            <span className="text-section font-extrabold text-teal tabular-nums">{chalet.priceWeekday}</span>
            <span className="text-caption font-semibold text-teal">{t("jd")}</span>
            <span className="text-caption text-ink-muted">/ {t("per_night")}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

/** صف أفقي مضغوط — للمفضلة وقوائم النتائج الضيقة */
export function ChaletRow({ chalet }: { chalet: Chalet }) {
  const { t, rtl } = useApp();
  const name = rtl ? chalet.nameAr : chalet.nameEn;
  const photo = chalet.media?.find((m) => m.type === "image");

  return (
    <Link
      href={`/chalet/${chalet.id}`}
      className="flex gap-4 rounded-card border border-line bg-white p-3 transition-colors hover:border-teal/40"
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo.url} alt={name} className="size-24 shrink-0 rounded-btn object-cover" />
      ) : (
        <SceneArt seed={chalet.id} typeKey={chalet.typeKey} className="size-24 shrink-0 rounded-btn" label={name} />
      )}
      <div className="flex min-w-0 flex-col gap-1">
        <h3 className="truncate text-body-lg font-bold text-ink">{name}</h3>
        <span className="truncate text-caption text-ink-muted">
          {rtl ? chalet.areaAr : chalet.areaEn}، {t(`city_${chalet.cityKey}`)}
        </span>
        <span className="text-caption text-ink-muted">
          {chalet.capacity} {t("guest_unit")}
        </span>
        <span className="mt-auto flex items-baseline gap-1 text-body-lg font-extrabold text-teal tabular-nums">
          {chalet.priceWeekday}
          <span className="text-caption font-semibold">{t("jd")}</span>
        </span>
      </div>
    </Link>
  );
}
