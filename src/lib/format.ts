import type { Locale } from "./strings";

/** تنسيق التواريخ بأسماء شهور عربية وإنجليزية — نفس utils/date_format.dart */

const MONTHS_AR = [
  "كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران",
  "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول",
];

const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const WEEKDAYS_AR = ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
export const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const weekdays = (locale: Locale) => (locale === "ar" ? WEEKDAYS_AR : WEEKDAYS_EN);

export const monthName = (month: number, locale: Locale) =>
  (locale === "ar" ? MONTHS_AR : MONTHS_EN)[month];

export const monthYear = (d: Date, locale: Locale) =>
  `${monthName(d.getMonth(), locale)} ${d.getFullYear()}`;

export const dayMonth = (d: Date, locale: Locale) =>
  `${d.getDate()} ${monthName(d.getMonth(), locale)}`;

export function rangeLabel(from: Date, to: Date, locale: Locale): string {
  if (from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear()) {
    return `${from.getDate()} – ${to.getDate()} ${monthName(to.getMonth(), locale)} ${to.getFullYear()}`;
  }
  return `${dayMonth(from, locale)} – ${dayMonth(to, locale)} ${to.getFullYear()}`;
}

export const nightsBetween = (from: Date, to: Date) =>
  Math.max(0, Math.round((to.getTime() - from.getTime()) / 86_400_000));

export const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
