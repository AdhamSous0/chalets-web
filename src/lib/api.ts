import type { AdminUser, AmenityKey, Chalet, ContactType, CityKey, PaymentMethod, TypeKey } from "./data";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { ...init?.headers },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.error ?? `طلب فشل (${res.status})`, res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

/** روابط الميديا راجعة نسبية (/uploads/..) من الباكاند — لازم أصل كامل عشان تنعرض من أوريجن الموقع */
function withAbsoluteMedia(chalet: Chalet): Chalet {
  if (!chalet.media?.length) return chalet;
  return {
    ...chalet,
    media: chalet.media.map((m) => ({ ...m, url: m.url.startsWith("/") ? `${API_URL}${m.url}` : m.url })),
  };
}

/* ---------- الشاليهات ---------- */

export interface ChaletFilters {
  city?: string;
  type?: string;
  maxPrice?: number;
  guests?: number;
  q?: string;
}

export async function getChalets(filters: ChaletFilters = {}): Promise<Chalet[]> {
  const params = new URLSearchParams();
  if (filters.city && filters.city !== "all") params.set("city", filters.city);
  if (filters.type) params.set("type", filters.type);
  if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
  if (filters.guests) params.set("guests", String(filters.guests));
  if (filters.q) params.set("q", filters.q);
  const qs = params.toString();
  const chalets = await request<Chalet[]>(`/chalets${qs ? `?${qs}` : ""}`);
  return chalets.map(withAbsoluteMedia);
}

export async function getFeaturedChalets(): Promise<Chalet[]> {
  const chalets = await request<Chalet[]>("/chalets/featured");
  return chalets.map(withAbsoluteMedia);
}

export async function getChalet(id: string): Promise<Chalet | null> {
  try {
    const chalet = await request<Chalet>(`/chalets/${id}`);
    return withAbsoluteMedia(chalet);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export interface NewChaletPayload {
  nameAr: string;
  nameEn: string;
  cityKey: CityKey;
  areaAr: string;
  areaEn: string;
  typeKey: TypeKey;
  capacity: number;
  priceWeekday: number;
  priceWeekend: number;
  lat: number;
  lng: number;
  amenities: AmenityKey[];
  descriptionAr: string;
  descriptionEn: string;
  ownerNameAr: string;
  ownerNameEn: string;
  contacts: { type: ContactType; value: string }[];
  acceptedPaymentMethods: PaymentMethod[];
  images: File[];
  video: File | null;
}

export async function createChalet(payload: NewChaletPayload, adminToken: string): Promise<Chalet> {
  const fd = new FormData();
  fd.set("nameAr", payload.nameAr);
  fd.set("nameEn", payload.nameEn);
  fd.set("cityKey", payload.cityKey);
  fd.set("areaAr", payload.areaAr);
  fd.set("areaEn", payload.areaEn);
  fd.set("typeKey", payload.typeKey);
  fd.set("capacity", String(payload.capacity));
  fd.set("priceWeekday", String(payload.priceWeekday));
  fd.set("priceWeekend", String(payload.priceWeekend));
  fd.set("lat", String(payload.lat));
  fd.set("lng", String(payload.lng));
  fd.set("amenities", JSON.stringify(payload.amenities));
  fd.set("descriptionAr", payload.descriptionAr);
  fd.set("descriptionEn", payload.descriptionEn);
  fd.set("ownerNameAr", payload.ownerNameAr);
  fd.set("ownerNameEn", payload.ownerNameEn);
  fd.set("contacts", JSON.stringify(payload.contacts));
  fd.set("acceptedPaymentMethods", JSON.stringify(payload.acceptedPaymentMethods));
  for (const img of payload.images) fd.append("media", img);
  if (payload.video) fd.append("media", payload.video);

  const chalet = await request<Chalet>("/chalets", {
    method: "POST",
    headers: authHeader(adminToken),
    body: fd,
  });
  return withAbsoluteMedia(chalet);
}

/* ---------- المستخدمون (أدمن) ---------- */

export function getUsers(adminToken: string): Promise<AdminUser[]> {
  return request<AdminUser[]>("/users", { headers: authHeader(adminToken) });
}

/* ---------- تسجيل الدخول ---------- */

export interface AuthResult {
  token: string;
  user: { id: string; nameAr: string; nameEn: string; phone?: string; email?: string };
}

export function adminLogin(email: string, password: string): Promise<AuthResult> {
  return request<AuthResult>("/auth/admin-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export function customerLogin(phone: string, nameAr?: string, nameEn?: string): Promise<AuthResult> {
  return request<AuthResult>("/auth/customer-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, nameAr, nameEn }),
  });
}

/* ---------- الحجوزات ---------- */

export interface ApiBooking {
  id: string;
  chaletId: string;
  chalet: Chalet;
  from: string;
  to: string;
  guests: number;
  statusKey: "pending" | "confirmed" | "cancelled";
  paymentKey: "cash" | "card";
  total: number;
  createdAt: string;
}

export async function getBookings(token: string): Promise<ApiBooking[]> {
  const bookings = await request<ApiBooking[]>("/bookings", { headers: authHeader(token) });
  return bookings.map((b) => ({ ...b, chalet: withAbsoluteMedia(b.chalet) }));
}

export interface NewBookingPayload {
  chaletId: string;
  from: string;
  to: string;
  guests: number;
  paymentKey: "cash" | "card";
}

export async function createBooking(payload: NewBookingPayload, token: string): Promise<ApiBooking> {
  const booking = await request<ApiBooking>("/bookings", {
    method: "POST",
    headers: { ...authHeader(token), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return { ...booking, chalet: withAbsoluteMedia(booking.chalet) };
}
