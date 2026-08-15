"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChaletRow } from "@/components/chalet-card";
import { IconUser } from "@/components/icons";
import { SceneArt } from "@/components/scene-art";
import { Button, ButtonLink, Card, EmptyState, LabelValue, StatusBadge } from "@/components/ui";
import { useApp, usePrice } from "@/lib/app-context";
import { getBookings, getChalets, type ApiBooking } from "@/lib/api";
import type { Chalet } from "@/lib/data";
import { nightsBetween, rangeLabel } from "@/lib/format";

type Tab = "bookings" | "favorites" | "profile";

export function AccountClient() {
  const { t, rtl, locale, user, token, signOut, favorites } = useApp();
  const { price } = usePrice();
  const params = useSearchParams();

  const [tab, setTab] = useState<Tab>((params.get("tab") as Tab) ?? "bookings");
  const [upcoming, setUpcoming] = useState(true);
  const [allBookings, setAllBookings] = useState<ApiBooking[]>([]);
  const [chalets, setChalets] = useState<Chalet[]>([]);

  useEffect(() => {
    if (token) getBookings(token).then(setAllBookings).catch(() => setAllBookings([]));
    getChalets().then(setChalets).catch(() => setChalets([]));
  }, [token]);

  const bookings = allBookings.filter((b) => new Date(b.to) > new Date() === upcoming);
  const savedChalets = chalets.filter((c) => favorites.includes(c.id));

  const tabs: { key: Tab; label: string }[] = [
    { key: "bookings", label: t("my_bookings") },
    { key: "favorites", label: t("favorites") },
    { key: "profile", label: t("account") },
  ];

  return (
    <div className="shell py-10">
      {/* ---------- بطاقة المستخدم ---------- */}
      <Card tone="tint" className="flex flex-wrap items-center gap-4 p-6">
        <span
          className={`grid size-14 place-items-center rounded-full text-white ${
            user ? "bg-teal" : "bg-ink-faint"
          }`}
        >
          <IconUser width={26} height={26} />
        </span>
        <div className="flex-1">
          <p className="text-section font-bold text-ink">
            {user ? (rtl ? user.nameAr : user.nameEn) : t("guest_name")}
          </p>
          <p className="text-body text-ink-muted" dir={user ? "ltr" : undefined}>
            {user ? user.phone : t("guest_prompt")}
          </p>
        </div>
        {user ? (
          <Button tone="danger" onClick={signOut}>
            {t("logout")}
          </Button>
        ) : (
          <ButtonLink href="/login">{t("login")}</ButtonLink>
        )}
      </Card>

      {/* ---------- التبويبات ---------- */}
      <div className="mt-8 flex gap-6 border-b border-line">
        {tabs.map((x) => (
          <button
            key={x.key}
            type="button"
            onClick={() => setTab(x.key)}
            className={
              "-mb-px border-b-2 px-1 pb-3 text-body-lg font-semibold transition-colors " +
              (tab === x.key ? "border-teal text-teal" : "border-transparent text-ink-muted hover:text-ink")
            }
          >
            {x.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {/* ---------- حجوزاتي ---------- */}
        {tab === "bookings" && (
          <>
            <div className="mb-5 flex gap-2">
              <Button tone={upcoming ? "primary" : "outline"} onClick={() => setUpcoming(true)} className="px-4 py-2">
                {t("tab_upcoming")}
              </Button>
              <Button tone={!upcoming ? "primary" : "outline"} onClick={() => setUpcoming(false)} className="px-4 py-2">
                {t("tab_past")}
              </Button>
            </div>

            {bookings.length === 0 ? (
              <EmptyState
                title={t("empty_bookings_title")}
                message={t("empty_bookings_sub")}
                action={<ButtonLink href="/search">{t("browse_chalets")}</ButtonLink>}
              />
            ) : (
              <div className="flex flex-col gap-4">
                {bookings.map((b) => {
                  const chalet = b.chalet;
                  const from = new Date(b.from);
                  const to = new Date(b.to);

                  return (
                    <Card key={b.id} className="flex flex-wrap gap-5 p-5">
                      <SceneArt
                        seed={chalet.id}
                        typeKey={chalet.typeKey}
                        className="size-24 shrink-0 rounded-btn"
                        label={rtl ? chalet.nameAr : chalet.nameEn}
                      />
                      <div className="min-w-[220px] flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-body-lg font-bold text-ink">
                            {rtl ? chalet.nameAr : chalet.nameEn}
                          </h3>
                          <StatusBadge statusKey={b.statusKey} />
                        </div>
                        <p className="mt-1 text-body text-ink-muted">{rangeLabel(from, to, locale)}</p>
                        <p className="text-caption text-ink-muted">
                          {nightsBetween(from, to)} {t("nights_unit")} · {b.guests} {t("guest_unit")} ·{" "}
                          {t(b.paymentKey === "cash" ? "pay_cash" : "pay_card")}
                        </p>
                      </div>
                      <div className="flex min-w-[160px] flex-col justify-between gap-3">
                        <LabelValue label={t("label_booking_no")} value={b.id} />
                        <LabelValue label={t("label_total")} value={price(b.total)} emphasize />
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ---------- المفضلة ---------- */}
        {tab === "favorites" &&
          (savedChalets.length === 0 ? (
            <EmptyState
              title={t("empty_fav_title")}
              message={t("empty_fav_sub")}
              action={<ButtonLink href="/search">{t("browse_chalets")}</ButtonLink>}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {savedChalets.map((c) => (
                <ChaletRow key={c.id} chalet={c} />
              ))}
            </div>
          ))}

        {/* ---------- بياناتي ---------- */}
        {tab === "profile" && (
          <Card className="max-w-lg p-6">
            {user ? (
              <>
                <LabelValue label={t("account")} value={rtl ? user.nameAr : user.nameEn} />
                <LabelValue label={t("country_code")} value={user.phone} />
                <LabelValue label={t("menu_language")} value={t(locale === "ar" ? "lang_ar" : "lang_en")} />
              </>
            ) : (
              <div className="flex flex-col items-start gap-4">
                <p className="text-body text-ink-muted">{t("guest_prompt")}</p>
                <ButtonLink href="/login">{t("login")}</ButtonLink>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
