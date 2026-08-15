"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { useApp } from "@/lib/app-context";
import { ratingLabel } from "@/lib/strings";
import { IconStar } from "./icons";

/* ============================================================
   المكوّنات المشتركة — مكافئة لـ widgets/ بتطبيق الموبايل.
   كل الألوان والمقاسات من التوكنات، ولا قيمة مكتوبة هون.
   ============================================================ */

/* ---------- الأزرار ---------- */

type ButtonTone = "primary" | "secondary" | "outline" | "danger";

const toneClasses: Record<ButtonTone, string> = {
  primary: "bg-teal text-white hover:bg-teal/90 disabled:bg-teal/40",
  secondary: "bg-transparent text-teal hover:bg-teal-light",
  outline: "bg-transparent text-teal border border-teal hover:bg-teal-light",
  danger: "bg-transparent text-danger border border-danger/50 hover:bg-danger/8",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-btn px-5 py-3 " +
  "text-button font-semibold transition-colors disabled:cursor-not-allowed";

export function Button({
  tone = "primary",
  full,
  className = "",
  ...rest
}: ComponentProps<"button"> & { tone?: ButtonTone; full?: boolean }) {
  return (
    <button
      {...rest}
      className={`${base} ${toneClasses[tone]} ${full ? "w-full" : ""} ${className}`}
    />
  );
}

export function ButtonLink({
  tone = "primary",
  full,
  className = "",
  ...rest
}: ComponentProps<typeof Link> & { tone?: ButtonTone; full?: boolean }) {
  return (
    <Link
      {...rest}
      className={`${base} ${toneClasses[tone]} ${full ? "w-full" : ""} ${className}`}
    />
  );
}

/* ---------- حقل الإدخال ---------- */

export function Input({ className = "", ...rest }: ComponentProps<"input">) {
  return (
    <input
      {...rest}
      className={
        "w-full rounded-field border border-line bg-white px-4 py-3.5 text-body-lg " +
        "text-ink placeholder:text-ink-muted outline-none " +
        "focus:border-teal focus:ring-1 focus:ring-teal " +
        className
      }
    />
  );
}

/* ---------- الشرائح والشارات ---------- */

export function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={
        "rounded-chip px-4 py-2 text-small font-semibold whitespace-nowrap transition-colors " +
        (selected ? "bg-teal text-white" : "bg-teal-light text-teal hover:bg-teal/15")
      }
    >
      {label}
    </button>
  );
}

export function TypeBadge({ label }: { label: string }) {
  return (
    <span className="rounded-chip bg-teal-light px-2 py-0.5 text-badge font-semibold text-teal">
      {label}
    </span>
  );
}

/**
 * تقييم — نجمة + رقم + كلمة وصفية (ممتاز/جيد جدًا…)، ومعه عدد التقييمات اختياريًا.
 * بيرجع null كليًا لو ما في تقييمات بعد (value=null) — أصدق من رقم مصطنع، نفس سلوك Interhome.
 */
export function Rating({
  value,
  count,
  size = "sm",
}: {
  value: number | null;
  count?: number;
  size?: "sm" | "md";
}) {
  const { t, locale } = useApp();
  if (value == null) return null;

  const text = size === "md" ? "text-body font-bold" : "text-caption font-bold";
  return (
    <span className="inline-flex items-center gap-1 text-ink">
      <IconStar filled width={size === "md" ? 16 : 13} height={size === "md" ? 16 : 13} className="text-sand" />
      <span className={`${text} tabular-nums`}>{value.toFixed(1)}</span>
      <span className="text-caption text-ink-muted">· {ratingLabel(locale, value)}</span>
      {count !== undefined && (
        <span className="text-caption text-ink-muted">
          ({count} {t("review_unit")})
        </span>
      )}
    </span>
  );
}

const statusTone: Record<string, string> = {
  confirmed: "bg-ok/12 text-ok",
  cancelled: "bg-danger/12 text-danger",
  pending: "bg-sand/20 text-sand",
};

export function StatusBadge({ statusKey }: { statusKey: string }) {
  const { t } = useApp();
  return (
    <span
      className={`rounded-chip px-2.5 py-1 text-badge font-semibold ${
        statusTone[statusKey] ?? statusTone.pending
      }`}
    >
      {t(`status_${statusKey}`)}
    </span>
  );
}

/* ---------- الأسطح ---------- */

export function Card({
  children,
  className = "",
  tone = "white",
}: {
  children: ReactNode;
  className?: string;
  tone?: "white" | "tint" | "sand";
}) {
  const tones = {
    white: "bg-white border border-line",
    tint: "bg-teal-light",
    sand: "bg-type-card",
  };
  return <div className={`rounded-card ${tones[tone]} ${className}`}>{children}</div>;
}

export function SectionHead({
  title,
  sub,
  action,
}: {
  title: string;
  sub?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-title font-bold tracking-tight text-ink">{title}</h2>
        {sub && <p className="mt-1 text-body text-ink-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-line bg-white px-6 py-16 text-center">
      <div className="grid size-16 place-items-center rounded-full bg-type-card">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="var(--color-ink-faint)" strokeWidth="1.8" />
          <path d="m16.5 16.5 4 4" stroke="var(--color-ink-faint)" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-section font-bold text-ink">{title}</p>
      <p className="max-w-sm text-body text-ink-muted">{message}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function LabelValue({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-body text-ink-muted">{label}</span>
      <span
        className={
          emphasize
            ? "text-body-lg font-bold text-teal"
            : "text-body font-semibold text-ink"
        }
      >
        {value}
      </span>
    </div>
  );
}

/* ---------- عدّاد ---------- */

export function Counter({
  value,
  onChange,
  min = 1,
  max = 50,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label: string;
}) {
  const step = (delta: number) => onChange(Math.min(max, Math.max(min, value + delta)));
  const btn =
    "grid size-10 place-items-center rounded-btn bg-teal-light text-teal transition-colors " +
    "hover:bg-teal/15 disabled:text-ink-faint disabled:hover:bg-teal-light";

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-body-lg font-semibold text-ink">{label}</span>
      <div className="flex items-center gap-1">
        <button type="button" className={btn} onClick={() => step(-1)} disabled={value <= min} aria-label="-">
          −
        </button>
        <span className="w-10 text-center text-body-lg font-bold tabular-nums">{value}</span>
        <button type="button" className={btn} onClick={() => step(1)} disabled={value >= max} aria-label="+">
          +
        </button>
      </div>
    </div>
  );
}
