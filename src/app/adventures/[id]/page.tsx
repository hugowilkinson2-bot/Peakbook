import { AdventureDetailScreen } from "@/features/adventures/components/adventure-detail-screen";

export default async function AdventureDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <AdventureDetailScreen id={(await params).id}/>;
}
