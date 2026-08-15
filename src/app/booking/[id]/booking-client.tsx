"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconCard, IconCash, IconCheck, IconWarn } from "@/components/icons";
import { Button, ButtonLink, Card, Counter, LabelValue } from "@/components/ui";
import { useApp, usePrice } from "@/lib/app-context";
import { createBooking, ApiError } from "@/lib/api";
import { BOOKED_DAYS, SERVICE_FEE, type Chalet, type PaymentMethod } from "@/lib/data";
import { monthYear, nightsBetween, rangeLabel, sameDay, weekdays } from "@/lib/format";

type Result = null | "success" | "failed";

export function BookingClient({ chalet }: { chalet: Chalet }) {
  const { t, rtl, locale, token } = useApp();
  const { price, perNight } = usePrice();
  const router = useRouter();

  const today = new Date();
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);
  const [guests, setGuests] = useState(2);
  const [payment, setPayment] = useState<PaymentMethod>("cash");
  const [result, setResult] = useState<Result>(null);
  const [bookingNo, setBookingNo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const name = rtl ? chalet.nameAr : chalet.nameEn;
  const nights = from && to ? nightsBetween(from, to) : 0;
  const subtotal = nights * chalet.priceWeekday;
  const total = nights === 0 ? 0 : subtotal + SERVICE_FEE;

  const isBooked = (day: number) => BOOKED_DAYS.includes(day);

  const onDayClick = (date: Date) => {
    if (!from || to || date < from) {
      setFrom(date);
      setTo(null);
    } else if (sameDay(date, from)) {
      setFrom(null);
    } else {
      setTo(date);
    }
  };

  const inRange = (d: Date) => {
    if (!from) return false;
    if (!to) return sameDay(d, from);
    return d >= from && d <= to;
  };

  /** لو المدى المختار بيمرّ فوق يوم محجوز، الحجز بيفشل — نفس منطق التطبيق */
  const rangeHitsBooked = () => {
    if (!from || !to) return false;
    for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
      if (isBooked(d.getDate())) return true;
    }
    return false;
  };

  const confirm = async () => {
    if (!from || !to) return;

    if (!token) {
      router.push("/login");
      return;
    }

    if (rangeHitsBooked()) {
      setResult("failed");
      return;
    }

    setSubmitting(true);
    try {
      const booking = await createBooking(
        { chaletId: chalet.id, from: from.toISOString(), to: to.toISOString(), guests, paymentKey: payment },
        token,
      );
      setBookingNo(booking.id);
      setResult("success");
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        router.push("/login");
        return;
      }
      setResult("failed");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- شاشة النتيجة ---------- */
  if (result) {
    const failed = result === "failed";
    return (
      <div className="shell grid place-items-center py-24">
        <Card className="w-full max-w-lg p-8 text-center">
          <span
            className={`mx-auto grid size-20 place-items-center rounded-full text-white ${
              failed ? "bg-danger" : "bg-ok"
            }`}
          >
            {failed ? <IconWarn width={34} height={34} /> : <IconCheck width={34} height={34} />}
          </span>

          <h1 className="mt-6 text-title font-extrabold text-ink">
            {failed ? t("booking_failed_title") : t("booking_success_title")}
          </h1>

          {failed ? (
            <div className="mt-5 rounded-card border border-danger/35 bg-danger/8 p-4 text-body text-danger">
              {t("booking_failed_sub")}
            </div>
          ) : (
            <>
              <p className="mt-2 text-body text-ink-muted">{t("booking_success_sub")}</p>
              <div className="mt-6 rounded-card border border-line p-4 text-start">
                <LabelValue label={t("label_chalet")} value={name} />
                <LabelValue label={t("label_dates")} value={rangeLabel(from!, to!, locale)} />
                <LabelValue label={t("label_guests")} value={`${guests} ${t("guest_unit")}`} />
                <LabelValue label={t("label_booking_no")} value={bookingNo} />
                <hr className="my-2 border-line" />
                <LabelValue label={t("label_total")} value={price(total)} emphasize />
              </div>
            </>
          )}

          <div className="mt-7 flex flex-col gap-2">
            {failed ? (
              <Button full onClick={() => setResult(null)}>
                {t("pick_other_dates")}
              </Button>
            ) : (
              <ButtonLink href="/account?tab=bookings" full>
                {t("view_booking_details")}
              </ButtonLink>
            )}
            <Link href="/" className="py-2 text-body font-semibold text-teal hover:underline">
              {t("back_home")}
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  /* ---------- التقويم ---------- */
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const leading = new Date(month.getFullYear(), month.getMonth(), 1).getDay(); // الأحد = 0

  const calendar = (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          className="grid size-9 place-items-center rounded-btn text-teal hover:bg-teal-light"
          aria-label="−"
        >
          {rtl ? "›" : "‹"}
        </button>
        <p className="text-body-lg font-bold text-ink">{monthYear(month, locale)}</p>
        <button
          type="button"
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          className="grid size-9 place-items-center rounded-btn text-teal hover:bg-teal-light"
          aria-label="+"
        >
          {rtl ? "‹" : "›"}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-tiny text-ink-muted">
        {weekdays(locale).map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1">
        {Array.from({ length: leading }).map((_, i) => (
          <span key={`pad-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(month.getFullYear(), month.getMonth(), day);
          const booked = isBooked(day);
          const selected = inRange(date);

          return (
            <button
              key={day}
              type="button"
              disabled={booked}
              onClick={() => onDayClick(date)}
              className={
                "aspect-square rounded-btn text-body tabular-nums transition-colors " +
                (booked
                  ? "cursor-not-allowed bg-type-card text-ink-faint"
                  : selected
                    ? "bg-teal font-bold text-white"
                    : "border border-line bg-white text-ink hover:border-teal")
              }
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-tiny text-ink-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-sm border border-line bg-white" />
          {t("legend_available")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-type-card" />
          {t("legend_booked")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-teal" />
          {t("legend_selected")}
        </span>
      </div>
    </Card>
  );

  const payOption = (key: PaymentMethod, Icon: typeof IconCash, title: string, sub: string) => (
    <button
      type="button"
      onClick={() => setPayment(key)}
      className={
        "flex w-full items-center gap-3 rounded-card border p-4 text-start transition-colors " +
        (payment === key ? "border-teal bg-white" : "border-line bg-white hover:border-teal/40")
      }
    >
      <Icon width={22} height={22} className={payment === key ? "text-teal" : "text-ink-faint"} />
      <span className="flex-1">
        <span className="block text-body font-semibold text-ink">{title}</span>
        <span className="block text-tiny text-ink-muted">{sub}</span>
      </span>
      <span
        className={
          "grid size-5 place-items-center rounded-full border-2 " +
          (payment === key ? "border-teal" : "border-ink-faint")
        }
      >
        {payment === key && <span className="size-2.5 rounded-full bg-teal" />}
      </span>
    </button>
  );

  return (
    <div className="shell py-10">
      <h1 className="text-headline font-extrabold tracking-tight text-ink">
        {t("book_prefix")}
        {name}
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="mb-3 text-section font-bold text-ink">{t("select_dates")}</h2>
            {calendar}
          </section>

          <section>
            <Card className="p-5">
              <Counter
                label={t("guests")}
                value={guests}
                onChange={setGuests}
                min={1}
                max={chalet.capacity}
              />
            </Card>
          </section>

          <section>
            <h2 className="mb-3 text-section font-bold text-ink">{t("payment_method")}</h2>
            <div className="flex flex-col gap-3">
              {payOption("cash", IconCash, t("pay_cash"), t("pay_cash_sub"))}
              {payOption("card", IconCard, t("pay_card"), t("pay_card_sub"))}
            </div>
          </section>
        </div>

        {/* ---------- ملخص لاصق ---------- */}
        <aside>
          <Card tone="tint" className="p-6 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
            <h2 className="text-section font-bold text-ink">{t("price_summary")}</h2>

            <p className="mt-2 text-body text-ink-muted">
              {from && to ? rangeLabel(from, to, locale) : t("pick_dates_first")}
            </p>

            <div className="mt-4">
              <LabelValue
                label={`${perNight(chalet.priceWeekday)} × ${nights} ${
                  nights === 1 ? t("night_unit") : t("nights_unit")
                }`}
                value={price(subtotal)}
              />
              <LabelValue label={t("service_fee")} value={price(SERVICE_FEE)} />
              <hr className="my-2 border-line" />
              <LabelValue label={t("total")} value={price(total)} emphasize />
            </div>

            <Button full className="mt-6" disabled={nights === 0 || submitting} onClick={confirm}>
              {t("confirm_booking")}
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}
