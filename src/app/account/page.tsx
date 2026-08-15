import { Suspense } from "react";
import { AccountClient } from "./account-client";

export const metadata = { title: "حسابي — شاليهاتي" };

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="shell py-20 text-ink-muted">…</div>}>
      <AccountClient />
    </Suspense>
  );
}
