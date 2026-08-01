import { BottomNav } from "@/components/bottom-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return <><main className="mx-auto min-h-screen w-full max-w-6xl px-5 pb-32 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-7 md:px-10 lg:px-12">{children}</main><BottomNav /></>;
}
