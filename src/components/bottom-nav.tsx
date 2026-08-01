"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUserRound, House, MapPinned, SquarePlus } from "lucide-react";

const items = [
  { href: "/", label: "Inicio", icon: House },
  { href: "/adventures", label: "Aventuras", icon: MapPinned },
  { href: "/adventures/new", label: "Nueva", icon: SquarePlus },
  { href: "/profile", label: "Perfil", icon: CircleUserRound },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Navegación principal" className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[38rem] px-3 pb-[max(.75rem,env(safe-area-inset-bottom))] sm:px-5">
      <div className="grid grid-cols-4 rounded-[1.65rem] border border-white/80 bg-white/88 px-2 py-2 shadow-[0_18px_55px_rgba(17,28,22,.18)] ring-1 ring-black/[.025] backdrop-blur-2xl supports-[backdrop-filter]:bg-white/75">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`tap-scale group flex min-w-0 flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[10px] font-semibold ${active ? "text-forest" : "text-ink/40"}`}>
              <span className={`grid h-8 w-11 place-items-center rounded-xl transition-all duration-300 ${active ? "bg-forest text-white shadow-sm" : "group-hover:bg-ink/5"}`}>
                <Icon size={19} strokeWidth={active ? 2.2 : 1.8} />
              </span>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
