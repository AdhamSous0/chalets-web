import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AppProvider } from "@/lib/app-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "شاليهاتي — حجز شاليهات فلسطين",
  description:
    "تصفّح واحجز شاليهات في أريحا ورام الله ونابلس وبيت لحم والخليل وجنين وطولكرم وقلقيلية. أسعار واضحة، تأكيد فوري، وتواصل مباشر مع المالك.",
  openGraph: {
    title: "شاليهاتي — حجز شاليهات فلسطين",
    description: "تصفّح واحجز شاليهات في فلسطين بأسعار واضحة وتأكيد فوري.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // اللغة والاتجاه بيتحدثوا من AppProvider حسب اختيار المستخدم
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen">
        <AppProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </AppProvider>
      </body>
    </html>
  );
}
