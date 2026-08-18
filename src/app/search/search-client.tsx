"use client";

import { useEffect, useMemo, useState } from "react";
import { ChaletCard } from "@/components/chalet-card";
import { AmenityIcon, IconSearch } from "@/components/icons";
import { Button, Chip, Counter, EmptyState } from "@/components/ui";
import { useApp, usePrice } from "@/lib/app-context";
import { getChalets } from "@/lib/api";
import {
  ALL_AMENITIES,
  CITY_KEYS,
  PRICE_CEIL,
  PRICE_FLOOR,
  TYPE_KEYS,
  type AmenityKey,
  type Chalet,
} from "@/lib/data";

type Sort = "recommended" | "price_asc" | "price_desc" | "capacity";

export function SearchClient() {
  const { t, rtl } = useApp();
  const { price } = usePrice();

  const [chalets, setChalets] = useState<Chalet[]>([]);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [type, setType] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState(PRICE_CEIL);
  const [guests, setGuests] = useState(1);
  const [amenities, setAmenities] = useState<AmenityKey[]>([]);
  const [sort, setSort] = useState<Sort>("recommended");
  const [openFilters, setOpenFilters] = useState(false);

  /** بنقرأ فلاتر الرابط (?city=..&type=..) بعد التركيب — تفادي useSearchParams اللي بيحتاج Suspense */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const c = params.get("city");
    const ty = params.get("type");
    if (q) setQuery(q);
    if (c) setCity(c);
    if (ty) setType(ty);
  }, []);

  useEffect(() => {
    getChalets()
      .then(setChalets)
      .catch(() => setChalets([]));
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = chalets.filter((c) => {
      const matchesQuery =
        !q ||
        c.nameAr.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.cityKey.includes(q);
      const matchesCity = city === "all" || c.cityKey === city;
      const matchesType = !type || c.typeKey === type;
      const matchesPrice = c.priceWeekday <= maxPrice;
      const matchesGuests = c.capacity >= guests;
      const matchesAmenities = amenities.every((a) => c.amenities.includes(a));
      return matchesQuery && matchesCity && matchesType && matchesPrice && matchesGuests && matchesAmenities;
    });

    switch (sort) {
      case "price_asc":
        return [...list].sort((a, b) => a.priceWeekday - b.priceWeekday);
      case "price_desc":
        return [...list].sort((a, b) => b.priceWeekday - a.priceWeekday);
      case "capacity":
        return [...list].sort((a, b) => b.capacity - a.capacity);
      default:
        return list;
    }
  }, [chalets, query, city, type, maxPrice, guests, amenities, sort]);

  const reset = () => {
    setCity("all");
    setType(null);
    setMaxPrice(PRICE_CEIL);
    setGuests(1);
    setAmenities([]);
  };

  const toggleAmenity = (key: AmenityKey) =>
    setAmenities((prev) => (prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]));

  /* ---------- لوحة الفلاتر ---------- */
  const filters = (
    <div className="flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h2 className="text-section font-bold text-ink">{t("filters")}</h2>
        <button type="button" onClick={reset} className="text-body font-semibold text-teal hover:underline">
          {t("reset_filters")}
        </button>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-body-lg font-bold text-ink">{t("filter_city")}</legend>
        <div className="flex flex-wrap gap-2">
          <Chip label={t("city_all")} selected={city === "all"} onClick={() => setCity("all")} />
          {CITY_KEYS.map((c) => (
            <Chip key={c} label={t(`city_${c}`)} selected={city === c} onClick={() => setCity(c)} />
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-body-lg font-bold text-ink">{t("filter_type")}</legend>
        <div className="flex flex-wrap gap-2">
          {TYPE_KEYS.map((k) => (
            <Chip
              key={k}
              label={t(`type_${k}`)}
              selected={type === k}
              onClick={() => setType(type === k ? null : k)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-body-lg font-bold text-ink">{t("filter_price")}</legend>
        <p className="text-small text-ink-muted">
          {price(PRICE_FLOOR)} — {price(maxPrice)}
        </p>
        <input
          type="range"
          min={PRICE_FLOOR}
          max={PRICE_CEIL}
          step={50}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="accent-teal"
          aria-label={t("filter_price")}
        />
      </fieldset>

      <fieldset>
        <Counter label={t("filter_guests")} value={guests} onChange={setGuests} min={1} max={30} />
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-body-lg font-bold text-ink">{t("filter_amenities")}</legend>
        {ALL_AMENITIES.map((a) => (
          <label key={a} className="flex cursor-pointer items-center gap-3 py-1 text-body text-ink">
            <input
              type="checkbox"
              checked={amenities.includes(a)}
              onChange={() => toggleAmenity(a)}
              className="size-4 accent-teal"
            />
            <AmenityIcon name={a} width={17} height={17} className="text-ink-faint" />
            {t(`amenity_${a}`)}
          </label>
        ))}
      </fieldset>
    </div>
  );

  return (
    <div className="shell py-10">
      <h1 className="text-headline font-extrabold tracking-tight text-ink">{t("search_title")}</h1>

      {/* شريط البحث والترتيب */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute inset-y-0 grid place-items-center text-ink-faint start-4">
            <IconSearch />
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search_hint")}
            aria-label={t("search_hint")}
            className="w-full rounded-field border border-line bg-white py-3.5 text-body-lg text-ink outline-none placeholder:text-ink-muted focus:border-teal focus:ring-1 focus:ring-teal ps-12 pe-4"
          />
        </div>

        <label className="flex items-center gap-2 text-body text-ink-muted">
          {t("sort_by")}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-field border border-line bg-white px-3 py-3 text-body text-ink outline-none focus:border-teal"
          >
            <option value="recommended">{t("sort_recommended")}</option>
            <option value="price_asc">{t("sort_price_asc")}</option>
            <option value="price_desc">{t("sort_price_desc")}</option>
            <option value="capacity">{t("sort_capacity")}</option>
          </select>
        </label>

        <Button tone="outline" className="lg:hidden" onClick={() => setOpenFilters((v) => !v)}>
          {t("filters")}
        </Button>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[260px_1fr]">
        {/* قائمة جانبية ثابتة على الشاشات الكبيرة */}
        <aside className={`${openFilters ? "block" : "hidden"} lg:block`}>
          <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)]">{filters}</div>
        </aside>

        <div>
          <p className="mb-5 text-body text-ink-muted tabular-nums">
            {results.length}
            {t("results_count")}
          </p>

          {results.length === 0 ? (
            <EmptyState
              title={t("empty_search_title")}
              message={t("empty_search_sub")}
              action={<Button onClick={reset}>{t("reset_filters")}</Button>}
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((c) => (
                <ChaletCard key={c.id} chalet={c} />
              ))}
            </div>
          )}
        </div>
      </div>

      <span className="sr-only">{rtl ? "" : ""}</span>
    </div>
  );
}
