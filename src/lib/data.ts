/**
 * الأنواع والثوابت المشتركة — مطابقة لتطبيق الموبايل (lib/data/models.dart).
 * البيانات الفعلية صارت تجي من الباكاند (src/lib/api.ts)، هاد الملف بس تعريفات وقوائم ثابتة.
 */

export type CityKey =
  | "jericho"
  | "ramallah"
  | "nablus"
  | "bethlehem"
  | "tulkarm"
  | "jenin"
  | "hebron"
  | "qalqilya";

export type TypeKey = "family" | "youth" | "events";
export type BookingStatus = "pending" | "confirmed" | "cancelled";
export type PaymentMethod = "cash" | "card";

export type AmenityKey =
  | "private_pool"
  | "shared_pool"
  | "jacuzzi"
  | "ac"
  | "wifi"
  | "bbq"
  | "playground"
  | "games_room"
  | "parking"
  | "security";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface MediaItem {
  id: string;
  type: "image" | "video";
  /** مسار نسبي (/uploads/..) أو رابط كامل — بيترسم زي ما هو */
  url: string;
}

export interface Chalet {
  id: string;
  nameAr: string;
  nameEn: string;
  cityKey: CityKey;
  /** الحي أو المنطقة داخل المدينة — للهرمية الجغرافية الكاملة (منطقة، مدينة، فلسطين) */
  areaAr: string;
  areaEn: string;
  typeKey: TypeKey;
  capacity: number;
  /** بالشيكل */
  priceWeekday: number;
  priceWeekend: number;
  amenities: AmenityKey[];
  descriptionAr: string;
  descriptionEn: string;
  /** إحداثيات الموقع على الخريطة */
  coords: LatLng;
  /** عدد الحجوزات هذا الموسم — رقم محسوب فعليًا بالباكاند من جدول الحجوزات */
  bookingsThisSeason: number;

  /** إشارات الثقة — المالك والتقييم */
  ownerNameAr: string;
  ownerNameEn: string;
  /** سنة بدء الاستضافة */
  hostSince: number;
  /** تقييم من 5 — null لو ما في تقييمات بعد */
  rating: number | null;
  reviewCount: number;
  verifiedOwner: boolean;

  /** صور وفيديو الشاليه — فاضية لو ما في، بترسم مشهد فني بديل */
  media?: MediaItem[];
}

export interface AdminUser {
  id: string;
  nameAr: string;
  nameEn: string;
  phone: string;
  cityKey: CityKey | null;
  joinedAt: string; // ISO
}

export const CITY_KEYS: CityKey[] = [
  "jericho",
  "ramallah",
  "nablus",
  "bethlehem",
  "tulkarm",
  "jenin",
  "hebron",
  "qalqilya",
];

/** مراكز المدن — تُستخدم لتوسيط الخريطة عند الفلترة ولتعبئة إحداثيات شاليه جديد بالأدمن */
export const CITY_COORDS: Record<CityKey, LatLng> = {
  jericho: { lat: 31.8667, lng: 35.45 },
  ramallah: { lat: 31.9038, lng: 35.2034 },
  nablus: { lat: 32.2211, lng: 35.2544 },
  bethlehem: { lat: 31.7054, lng: 35.2024 },
  tulkarm: { lat: 32.3104, lng: 35.0286 },
  jenin: { lat: 32.4597, lng: 35.2956 },
  hebron: { lat: 31.5326, lng: 35.0998 },
  qalqilya: { lat: 32.1896, lng: 34.9706 },
};

export const TYPE_KEYS: TypeKey[] = ["family", "youth", "events"];

export const ALL_AMENITIES: AmenityKey[] = [
  "private_pool",
  "shared_pool",
  "jacuzzi",
  "ac",
  "wifi",
  "bbq",
  "playground",
  "games_room",
  "parking",
  "security",
];

/** أيام محجوزة داخل الشهر المعروض — للعرض فقط بتقويم صفحة الحجز، لحد ما نربط توفّر حقيقي حسب التواريخ */
export const BOOKED_DAYS = [4, 5, 11, 12, 18, 19, 25, 26];

/** رسوم الخدمة بالشيكل */
export const SERVICE_FEE = 25;

/** حدود فلتر السعر بالشيكل */
export const PRICE_FLOOR = 300;
export const PRICE_CEIL = 2000;
