"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { customerLogin } from "./api";
import { tr, type Locale } from "./strings";

/**
 * حالة التطبيق — مكافئ الـ Cubits بتطبيق الموبايل:
 * اللغة (LocaleCubit) · المستخدم (AuthCubit) · المفضلة (FavoritesCubit)
 */

interface User {
  id: string;
  nameAr: string;
  nameEn: string;
  phone: string;
}

interface AppState {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
  rtl: boolean;
  t: (key: string) => string;

  user: User | null;
  /** توكن الزبون — لازم لأي طلب محمي (حجز، حجوزاتي) */
  token: string | null;
  signIn: (phone: string, nameAr?: string, nameEn?: string) => Promise<void>;
  signOut: () => void;

  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
}

const Ctx = createContext<AppState | null>(null);

const STORAGE = "chalets:" as const;

export function AppProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ar");
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(["ch-01", "ch-04"]);

  // استرجاع الحالة المحفوظة بعد أول رسم (تفاديًا لاختلاف السيرفر عن المتصفح)
  useEffect(() => {
    const savedLocale = localStorage.getItem(STORAGE + "locale");
    if (savedLocale === "ar" || savedLocale === "en") setLocaleState(savedLocale);

    const savedFav = localStorage.getItem(STORAGE + "favorites");
    if (savedFav) {
      try {
        const parsed = JSON.parse(savedFav);
        if (Array.isArray(parsed)) setFavorites(parsed);
      } catch {
        /* تجاهل قيمة تالفة */
      }
    }

    const savedToken = localStorage.getItem(STORAGE + "token");
    const savedUser = localStorage.getItem(STORAGE + "user");
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        /* تجاهل قيمة تالفة */
      }
    }
  }, []);

  // اللغة بتقلب اتجاه الصفحة وخطها — زي التطبيق بالضبط
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE + "locale", l);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(STORAGE + "favorites", JSON.stringify(next));
      return next;
    });
  }, []);

  const signIn = useCallback(async (phone: string, nameAr?: string, nameEn?: string) => {
    const { token: t, user: u } = await customerLogin(phone, nameAr, nameEn);
    const nextUser: User = { id: u.id, nameAr: u.nameAr, nameEn: u.nameEn, phone: u.phone ?? phone };
    setToken(t);
    setUser(nextUser);
    localStorage.setItem(STORAGE + "token", t);
    localStorage.setItem(STORAGE + "user", JSON.stringify(nextUser));
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE + "token");
    localStorage.removeItem(STORAGE + "user");
  }, []);

  const value = useMemo<AppState>(
    () => ({
      locale,
      setLocale,
      toggleLocale: () => setLocale(locale === "ar" ? "en" : "ar"),
      rtl: locale === "ar",
      t: (key: string) => tr(locale, key),
      user,
      token,
      signIn,
      signOut,
      favorites,
      isFavorite: (id) => favorites.includes(id),
      toggleFavorite,
    }),
    [locale, setLocale, user, token, signIn, signOut, favorites, toggleFavorite],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

/** اختصار للنصوص والسعر */
export function usePrice() {
  const { t } = useApp();
  return {
    price: (v: number) => `${v} ${t("jd")}`,
    perNight: (v: number) => `${v} ${t("jd")} / ${t("per_night")}`,
  };
}
