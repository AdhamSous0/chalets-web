import { notFound } from "next/navigation";
import { getChalet } from "@/lib/api";
import { BookingClient } from "./booking-client";

export const metadata = { title: "الحجز — شاليهاتي" };

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chalet = await getChalet(id);
  if (!chalet) notFound();

  return <BookingClient chalet={chalet} />;
}
