"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUserRound, House, Images, MapPinned, SquarePlus } from "lucide-react";

const items = [
  { href: "/", label: "Inicio", icon: House },
  { href: "/adventures", label: "Aventuras", icon: MapPinned },
  { href: "/adventures/new", label: "Nueva", icon: SquarePlus },
  { href: "/memories", label: "Recuerdos", icon: Images },
  { href: "/profile", label: "Perfil", icon: CircleUserRound },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Navegación principal" className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[38rem] px-3 pb-[max(.75rem,env(safe-area-inset-bottom))] sm:px-5">
      <div className="grid grid-cols-5 rounded-[1.65rem] border border-white/80 bg-white/88 px-1.5 py-2 shadow-[0_18px_55px_rgba(17,28,22,.18)] ring-1 ring-black/[.025] backdrop-blur-2xl supports-[backdrop-filter]:bg-white/75">
        {items.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          const primaryAction = href === "/adventures/new";
          return (
            <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`tap-scale group flex min-w-0 flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[9px] font-semibold sm:text-[10px] ${active ? "text-forest" : "text-ink/40"}`}>
              <span className={`grid h-8 w-10 place-items-center rounded-xl transition-all duration-300 ${primaryAction ? "-mt-4 h-11 w-11 rounded-2xl bg-forest text-lime shadow-[0_10px_24px_rgba(21,60,44,.28)] ring-4 ring-white" : active ? "bg-forest text-white shadow-sm" : "group-hover:bg-ink/5"}`}>
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

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/adventures/new") return pathname === href;
  if (href === "/adventures") return pathname === href || (pathname.startsWith(`${href}/`) && pathname !== "/adventures/new");
  return pathname.startsWith(href);
}
