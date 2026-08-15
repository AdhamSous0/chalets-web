"use client";

import { useEffect, useState } from "react";
import { adminLogin, ApiError } from "@/lib/api";
import { getAdminToken, setAdminToken } from "@/lib/admin-session";
import { Button, Input } from "@/components/ui";
import { useApp } from "@/lib/app-context";
import { AdminClient } from "./admin-client";

/** حسابنا الوحيد حاليًا — مزروع بسكربت التعبئة (prisma/seed.ts) */
const ADMIN_EMAIL = "admin@chalets.ps";

/**
 * بوابة دخول الأدمن — بتستدعي /auth/admin-login الحقيقي وتخزّن الـ JWT.
 * التوكن محفوظ بـ localStorage (صلاحيته أسبوع من طرف السيرفر).
 */
export function AdminGate() {
  const { t } = useApp();
  const [checked, setChecked] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setUnlocked(!!getAdminToken());
    setChecked(true);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(false);
    try {
      const { token } = await adminLogin(ADMIN_EMAIL, password);
      setAdminToken(token);
      setUnlocked(true);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) setError(true);
      else throw e;
    } finally {
      setSubmitting(false);
    }
  };

  if (!checked) return null;
  if (unlocked) return <AdminClient />;

  return (
    <div className="shell flex min-h-[60vh] items-center justify-center py-10">
      <form onSubmit={submit} className="w-full max-w-sm rounded-card border border-line bg-white p-6">
        <h1 className="text-section font-bold text-ink">{t("admin_title")}</h1>
        <p className="mt-1 text-body text-ink-muted">{t("admin_password_prompt")}</p>
        <Input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          placeholder={t("admin_password_placeholder")}
          className="mt-4"
          autoFocus
        />
        {error && <p className="mt-2 text-caption font-semibold text-danger">{t("admin_password_error")}</p>}
        <Button type="submit" full className="mt-4" disabled={submitting}>
          {t("admin_unlock")}
        </Button>
      </form>
    </div>
  );
}
