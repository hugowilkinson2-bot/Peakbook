import { Logo } from "@/components/logo";
import { Bell } from "lucide-react";

export function PageHeader() {
  return <header className="mb-8 flex items-center justify-between"><Logo/><button aria-label="Notificaciones" className="relative grid h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-sm"><Bell size={19}/><span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#ef6a4c] ring-2 ring-white"/></button></header>;
}
