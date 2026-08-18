"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Card, Input } from "@/components/ui";
import { useApp } from "@/lib/app-context";

/**
 * تسجيل الدخول برقم الجوال بس — بدون رمز تحقق (OTP) حاليًا، لحد ما يصير عندنا
 * اتفاق مع مزوّد SMS حقيقي. الباك إند أصلاً ما بيتحقق من أي رمز (auth.ts customer-login).
 */
export default function LoginPage() {
  const { t, signIn } = useApp();
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fullPhone = `${t("country_code")} ${phone}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(false);
    try {
      await signIn(fullPhone);
      router.push("/account");
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="shell grid place-items-center py-20">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-display font-extrabold tracking-tight text-ink">{t("welcome_title")}</h1>
        <p className="mt-2 text-body-lg text-ink-muted">{t("welcome_sub")}</p>

        <form className="mt-8 flex flex-col gap-4" onSubmit={submit}>
          <div className="flex gap-3">
            <span
              className="grid shrink-0 place-items-center rounded-field border border-line bg-white px-4 text-body-lg font-semibold"
              dir="ltr"
            >
              {t("country_code")}
            </span>
            <Input
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 9));
                setError(false);
              }}
              placeholder={t("phone_hint")}
              inputMode="numeric"
              aria-label={t("welcome_sub")}
            />
          </div>

          {error && <p className="text-small text-danger">{t("otp_error")}</p>}

          <Button type="submit" full disabled={phone.length < 9 || submitting}>
            {t("login")}
          </Button>
          <p className="text-center text-tiny text-ink-faint">{t("terms_note")}</p>
        </form>
      </Card>
    </div>
  );
}
