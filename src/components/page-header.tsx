import { Logo } from "@/components/logo";
import { Bell } from "lucide-react";

export function PageHeader() {
  return <header className="mb-7 flex items-center justify-between"><Logo/><button aria-label="Notificaciones" className="tap-scale relative grid h-10 w-10 place-items-center rounded-full border border-black/[.045] bg-white/90 text-ink shadow-sm backdrop-blur"><Bell size={18} strokeWidth={1.8}/><span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[#e76548] ring-2 ring-white"/></button></header>;
}
