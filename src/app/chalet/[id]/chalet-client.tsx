"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  AmenityIcon,
  IconChat,
  IconExternalLink,
  IconGuests,
  IconHeart,
  IconLocation,
  IconMail,
  IconNav,
  IconPhone,
  IconVerified,
} from "@/components/icons";
import { SceneArt } from "@/components/scene-art";
import { ButtonLink, Card, Rating, TypeBadge } from "@/components/ui";
import { useApp, usePrice } from "@/lib/app-context";
import type { Chalet, ContactType } from "@/lib/data";

/** رابط فعلي حسب نوع وسيلة التواصل — tel/wa.me/mailto للأنواع البروتوكولية، رابط مباشر للباقي */
function contactHref(type: ContactType, value: string): string {
  switch (type) {
    case "phone":
      return `tel:${value.replace(/\s+/g, "")}`;
    case "whatsapp":
      return `https://wa.me/${value.replace(/[^\d]/g, "")}`;
    case "email":
      return `mailto:${value}`;
    default:
      return value;
  }
}

function ContactIcon({ type, ...p }: { type: ContactType } & React.SVGProps<SVGSVGElement>) {
  if (type === "phone") return <IconPhone {...p} />;
  if (type === "whatsapp") return <IconChat {...p} />;
  if (type === "email") return <IconMail {...p} />;
  return <IconExternalLink {...p} />;
}

// Leaflet بلمس window، فبتتحمّل بالمتصفح فقط
const ChaletMap = dynamic(() => import("@/components/chalet-map"), {
  ssr: false,
  loading: () => (
    <div className="h-80 animate-pulse rounded-card border border-line bg-type-card" />
  ),
});

export function ChaletClient({ chalet }: { chalet: Chalet }) {
  const { t, rtl, isFavorite, toggleFavorite } = useApp();
  const { price, perNight } = usePrice();
  const router = useRouter();

  const name = rtl ? chalet.nameAr : chalet.nameEn;
  const description = rtl ? chalet.descriptionAr : chalet.descriptionEn;
  const ownerName = rtl ? chalet.ownerNameAr : chalet.ownerNameEn;
  const area = rtl ? chalet.areaAr : chalet.areaEn;
  const city = t(`city_${chalet.cityKey}`);
  const fav = isFavorite(chalet.id);
  const media = chalet.media ?? [];

  return (
    <div className="shell py-8">
      {/* ---------- معرض الصور ---------- */}
      {media.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-4 md:grid-rows-2 md:h-[420px]">
          {media.slice(0, 5).map((m, i) => (
            <div
              key={m.id}
              className={
                "overflow-hidden rounded-card bg-type-card " +
                (i === 0 ? "h-64 md:col-span-2 md:row-span-2 md:h-full" : "hidden h-full md:block")
              }
            >
              {m.type === "video" ? (
                <video src={m.url} muted controls loop playsInline className="size-full object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.url} alt={`${name} ${i + 1}`} className="size-full object-cover" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-4 md:grid-rows-2 md:h-[420px]">
          <SceneArt
            seed={chalet.id}
            typeKey={chalet.typeKey}
            className="h-64 rounded-card md:col-span-2 md:row-span-2 md:h-full"
            label={name}
          />
          {[0, 1, 2, 3].map((i) => (
            <SceneArt
              key={i}
              seed={`${chalet.id}-${i + 2}`}
              typeKey={chalet.typeKey}
              className="hidden rounded-card md:block"
              label={`${name} ${i + 2}`}
            />
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_360px]">
        {/* ---------- التفاصيل ---------- */}
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <TypeBadge label={t(`type_${chalet.typeKey}`)} />
              </div>
              <h1 className="text-[clamp(24px,4vw,34px)] font-extrabold leading-tight tracking-tight text-ink">
                {name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-body text-ink-muted">
                <Rating value={chalet.rating} count={chalet.reviewCount} size="md" />
                <span className="inline-flex items-center gap-1.5">
                  <IconLocation width={17} height={17} className="text-ink-faint" />
                  {area}، {city}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <IconGuests width={17} height={17} className="text-ink-faint" />
                  {t("capacity_prefix")}
                  {chalet.capacity} {t("guest_unit")}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleFavorite(chalet.id)}
              aria-pressed={fav}
              className="inline-flex items-center gap-2 rounded-btn border border-line px-4 py-2.5 text-body font-semibold text-ink transition-colors hover:border-teal/50"
            >
              <IconHeart filled={fav} className={fav ? "text-danger" : "text-ink-faint"} />
              {fav ? t("saved") : t("save")}
            </button>
          </div>

          <hr className="my-8 border-line" />

          <section>
            <h2 className="text-section font-bold text-ink">{t("description")}</h2>
            <p className="mt-3 max-w-prose text-body-lg leading-relaxed text-ink-muted">{description}</p>
          </section>

          <section className="mt-10">
            <h2 className="text-section font-bold text-ink">{t("host")}</h2>
            <Card className="mt-4 flex flex-wrap items-center gap-4 p-5">
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-teal text-title font-bold text-white">
                {ownerName.trim().charAt(0)}
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="font-bold text-ink">{ownerName}</p>
                  {chalet.verifiedOwner && (
                    <span className="inline-flex items-center gap-1 text-caption font-semibold text-teal">
                      <IconVerified width={15} height={15} />
                      {t("verified_owner")}
                    </span>
                  )}
                </div>
                <p className="text-caption text-ink-muted">
                  {t("hosting_since")} {chalet.hostSince}
                </p>
              </div>
              {chalet.contacts.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {chalet.contacts.map((c) => (
                    <a
                      key={c.id}
                      href={contactHref(c.type, c.value)}
                      target={c.type === "phone" ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-btn border border-teal px-4 py-2.5 text-body font-semibold text-teal transition-colors hover:bg-teal-light"
                    >
                      <ContactIcon type={c.type} width={17} height={17} />
                      {t(`contact_type_${c.type}`)}
                    </a>
                  ))}
                </div>
              )}
            </Card>
          </section>

          <section className="mt-10">
            <h2 className="text-section font-bold text-ink">{t("amenities")}</h2>
            <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {chalet.amenities.map((a) => (
                <li key={a} className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-teal-light text-teal">
                    <AmenityIcon name={a} />
                  </span>
                  <span className="text-body text-ink">{t(`amenity_${a}`)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="text-section font-bold text-ink">{t("prices")}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Card tone="tint" className="p-5">
                <p className="text-caption font-semibold text-teal">{t("weekdays")}</p>
                <p className="mt-1 text-section font-bold text-teal">{perNight(chalet.priceWeekday)}</p>
              </Card>
              <Card tone="tint" className="p-5">
                <p className="text-caption font-semibold text-teal">{t("weekend")}</p>
                <p className="mt-1 text-section font-bold text-teal">{perNight(chalet.priceWeekend)}</p>
              </Card>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-section font-bold text-ink">{t("location")}</h2>
            <p className="mt-1 mb-4 text-body text-ink-muted">
              {area}، {city}، {t("country_name")}
            </p>

            <ChaletMap coords={chalet.coords} name={name} city={city} />

            <a
              href={`https://www.openstreetmap.org/directions?to=${chalet.coords.lat}%2C${chalet.coords.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-btn border border-teal px-5 py-3 text-button font-semibold text-teal transition-colors hover:bg-teal-light"
            >
              <IconNav width={18} height={18} />
              {t("start_directions")}
            </a>
          </section>
        </div>

        {/* ---------- بطاقة الحجز اللاصقة ---------- */}
        <aside>
          <Card className="p-6 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
            <div className="flex items-baseline gap-2">
              <span className="text-headline font-extrabold text-teal">{price(chalet.priceWeekday)}</span>
              <span className="text-body text-ink-muted">/ {t("per_night")}</span>
            </div>

            <p className="mt-2 text-body text-ink-muted">{t("pick_dates_first")}</p>

            <hr className="my-5 border-line" />

            <dl className="flex flex-col gap-1 text-body">
              <div className="flex justify-between">
                <dt className="text-ink-muted">{t("weekdays")}</dt>
                <dd className="font-semibold tabular-nums">{price(chalet.priceWeekday)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">{t("weekend")}</dt>
                <dd className="font-semibold tabular-nums">{price(chalet.priceWeekend)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">{t("filter_guests")}</dt>
                <dd className="font-semibold tabular-nums">
                  {t("capacity_prefix")}
                  {chalet.capacity}
                </dd>
              </div>
            </dl>

            <ButtonLink href={`/booking/${chalet.id}`} full className="mt-6">
              {t("book_now")}
            </ButtonLink>

            <button
              type="button"
              onClick={() => router.push("/search")}
              className="mt-3 w-full text-center text-body font-semibold text-teal hover:underline"
            >
              {t("browse_chalets")}
            </button>
          </Card>
        </aside>
      </div>
    </div>
  );
}
