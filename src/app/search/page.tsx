import { Suspense } from "react";
import { SearchClient } from "./search-client";

export const metadata = {
  title: "تصفّح الشاليهات — شاليهاتي",
  description: "فلتر شاليهات فلسطين حسب المدينة والنوع والسعر والمرافق وعدد الأشخاص.",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="shell py-20 text-ink-muted">…</div>}>
      <SearchClient />
    </Suspense>
  );
}
