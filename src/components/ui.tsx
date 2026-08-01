import type { LucideIcon } from "lucide-react";

export function ScreenHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <header className="mb-7 md:mb-9"><p className="text-[11px] font-bold uppercase tracking-[.2em] text-moss">{eyebrow}</p><h1 className="mt-2 text-[2.6rem] font-semibold leading-none tracking-[-.06em] md:text-5xl">{title}</h1>{description && <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink/48">{description}</p>}</header>;
}

export function IconButton({ icon: Icon, label, dark = false }: { icon: LucideIcon; label: string; dark?: boolean }) {
  return <button aria-label={label} className={`tap-scale grid h-11 w-11 shrink-0 place-items-center rounded-full border shadow-sm ${dark ? "border-forest bg-forest text-white" : "border-black/[.05] bg-white/90 text-ink"}`}><Icon size={18} strokeWidth={1.9}/></button>;
}

export function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return <div className="mb-4 flex items-end justify-between gap-4"><div>{eyebrow && <p className="text-[10px] font-bold uppercase tracking-[.2em] text-moss">{eyebrow}</p>}<h2 className="mt-1 text-2xl font-semibold tracking-[-.04em]">{title}</h2></div>{action}</div>;
}
