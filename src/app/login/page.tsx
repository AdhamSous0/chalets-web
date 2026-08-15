"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button, Card, Input } from "@/components/ui";
import { useApp } from "@/lib/app-context";

const DIGITS = 4;
const RESEND_SECONDS = 59;

export default function LoginPage() {
  const { t, signIn } = useApp();
  const router = useRouter();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState<string[]>(Array(DIGITS).fill(""));
  const [error, setError] = useState(false);
  const [remaining, setRemaining] = useState(RESEND_SECONDS);
  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  const fullPhone = `${t("country_code")} ${phone}`;
  const codeReady = code.every((d) => d !== "");

  useEffect(() => {
    if (step !== "otp" || remaining <= 0) return;
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [step, remaining]);

  useEffect(() => {
    if (step === "otp") boxes.current[0]?.focus();
  }, [step]);

  const onDigit = (i: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setCode((prev) => {
      const next = [...prev];
      next[i] = digit;
      return next;
    });
    setError(false);
    if (digit && i < DIGITS - 1) boxes.current[i + 1]?.focus();
  };

  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[i] && i > 0) boxes.current[i - 1]?.focus();
  };

  const [submitting, setSubmitting] = useState(false);

  const verify = async () => {
    // التحقق من الرمز بصري فقط لحد ما يتوفر مزوّد SMS حقيقي — أي رمز غير 0000 بيمرّ
    if (code.join("") === "0000") {
      setError(true);
      return;
    }
    setSubmitting(true);
    try {
      await signIn(fullPhone);
      router.push("/account");
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const timer = `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;

  return (
    <div className="shell grid place-items-center py-20">
      <Card className="w-full max-w-md p-8">
        {step === "phone" ? (
          <>
            <h1 className="text-display font-extrabold tracking-tight text-ink">{t("welcome_title")}</h1>
            <p className="mt-2 text-body-lg text-ink-muted">{t("welcome_sub")}</p>

            <form
              className="mt-8 flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setStep("otp");
                setRemaining(RESEND_SECONDS);
              }}
            >
              <div className="flex gap-3">
                <span
                  className="grid shrink-0 place-items-center rounded-field border border-line bg-white px-4 text-body-lg font-semibold"
                  dir="ltr"
                >
                  {t("country_code")}
                </span>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
                  placeholder={t("phone_hint")}
                  inputMode="numeric"
                  aria-label={t("welcome_sub")}
                />
              </div>

              <Button type="submit" full disabled={phone.length < 9}>
                {t("send_otp")}
              </Button>
              <p className="text-center text-tiny text-ink-faint">{t("terms_note")}</p>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-headline font-extrabold tracking-tight text-ink">{t("otp_title")}</h1>
            <p className="mt-2 text-body-lg text-ink-muted">
              {t("otp_sub")}
              <span dir="ltr">{fullPhone}</span>
            </p>

            <div className="mt-8 flex justify-between gap-3" dir="ltr">
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    boxes.current[i] = el;
                  }}
                  value={digit}
                  onChange={(e) => onDigit(i, e.target.value)}
                  onKeyDown={(e) => onKey(i, e)}
                  inputMode="numeric"
                  maxLength={1}
                  aria-label={`${i + 1}`}
                  className={
                    "h-16 w-14 rounded-field border-2 bg-white text-center text-title font-bold text-ink outline-none " +
                    (error ? "border-danger" : "border-line focus:border-teal")
                  }
                />
              ))}
            </div>

            {error && <p className="mt-3 text-small text-danger">{t("otp_error")}</p>}

            <p className="mt-6 text-center text-small text-ink-muted">
              {remaining > 0 ? (
                <span dir="ltr">
                  {t("otp_resend_in")}
                  {timer}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setRemaining(RESEND_SECONDS)}
                  className="font-semibold text-teal hover:underline"
                >
                  {t("otp_resend")}
                </button>
              )}
            </p>

            <Button full className="mt-6" disabled={!codeReady || submitting} onClick={verify}>
              {t("confirm")}
            </Button>

            <button
              type="button"
              onClick={() => setStep("phone")}
              className="mt-3 w-full py-2 text-center text-body font-semibold text-teal hover:underline"
            >
              {t("back")}
            </button>
          </>
        )}
      </Card>
    </div>
  );
}
