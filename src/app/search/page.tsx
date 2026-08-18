import { SearchClient } from "./search-client";

export const metadata = {
  title: "تصفّح الشاليهات — شاليهاتي",
  description: "فلتر شاليهات فلسطين حسب المدينة والنوع والسعر والمرافق وعدد الأشخاص.",
};

export default function SearchPage() {
  return <SearchClient />;
}
