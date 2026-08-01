"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUserRound, House, Map, MapPinned, Plus } from "lucide-react";

const items = [
  { href: "/", label: "Inicio", icon: House },
  { href: "/routes", label: "Mis rutas", icon: MapPinned },
  { href: "/routes/new", label: "Nueva", icon: Plus, primary: true },
  { href: "/map", label: "Mapa", icon: Map },
  { href: "/profile", label: "Perfil", icon: CircleUserRound },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Navegación principal" className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg px-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:max-w-2xl">
      <div className="flex items-end justify-around rounded-[1.7rem] border border-white/70 bg-[#fffef9]/95 px-2 py-2 shadow-[0_14px_50px_rgba(23,34,28,.18)] backdrop-blur-xl">
        {items.map(({ href, label, icon: Icon, primary }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`group flex min-w-14 flex-col items-center gap-1 text-[10px] font-medium ${active ? "text-forest" : "text-ink/45"}`}>
              <span className={primary ? "-mt-7 grid h-14 w-14 place-items-center rounded-full border-[5px] border-canvas bg-forest text-lime shadow-lg transition-transform group-active:scale-95" : `grid h-8 w-10 place-items-center rounded-xl ${active ? "bg-lime/60" : ""}`}>
                <Icon size={primary ? 24 : 20} strokeWidth={primary ? 2.4 : 2} />
              </span>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
