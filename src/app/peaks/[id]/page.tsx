import type { Metadata } from "next";
import { PeakDetailScreen } from "@/features/peaks/components/peak-detail-screen";
import { curatedPeakById, curatedPeakCatalog } from "@/features/peaks/data/curated-peak-catalog";

export function generateStaticParams() {
  return curatedPeakCatalog.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const peak = curatedPeakById(id);
  return peak ? { title: peak.name, description: peak.description } : { title: "Cima" };
}

export default async function PeakDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PeakDetailScreen id={id} />;
}

