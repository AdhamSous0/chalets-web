import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getChalet } from "@/lib/api";
import { ChaletClient } from "./chalet-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const chalet = await getChalet(id);
  if (!chalet) return { title: "شاليهاتي" };

  return {
    title: `${chalet.nameAr} — شاليهاتي`,
    description: chalet.descriptionAr,
    openGraph: { title: chalet.nameAr, description: chalet.descriptionAr },
  };
}

export default async function ChaletPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chalet = await getChalet(id);
  if (!chalet) notFound();

  return <ChaletClient chalet={chalet} />;
}
