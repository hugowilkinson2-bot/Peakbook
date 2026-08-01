import { BottomNav } from "@/components/bottom-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return <><main className="mx-auto min-h-screen max-w-2xl px-5 pb-32 pt-[max(1.5rem,env(safe-area-inset-top))] md:px-8">{children}</main><BottomNav /></>;
}
