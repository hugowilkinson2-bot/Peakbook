import { AdventureEditScreen } from "@/features/adventures/components/adventure-edit-screen";

export default async function AdventureEditPage({ params }: { params: Promise<{ id: string }> }) {
  return <AdventureEditScreen id={(await params).id}/>;
}
