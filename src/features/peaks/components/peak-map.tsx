import { Crosshair, Globe2, MapPin } from "lucide-react";
import type { PeakProfile } from "../domain/peak";
import { formatCoordinates } from "../presentation/formatters";

export function PeakMap({ peak }: { peak: PeakProfile }) {
  return (
    <section aria-label={`Mapa de ${peak.name}`} className="peak-map relative min-h-[28rem] overflow-hidden rounded-[2rem] bg-[#dfe5dc] shadow-[inset_0_0_0_1px_rgba(21,60,44,.08)] sm:min-h-[32rem]">
      <svg aria-hidden="true" viewBox="0 0 900 620" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full opacity-70">
        <rect width="900" height="620" fill="#e7ebe3" />
        <g fill="none" stroke="#153c2c" strokeOpacity=".16" strokeWidth="2">
          <path d="M-40 510 C70 410 85 560 195 455S342 390 410 470 545 542 620 433 760 360 940 450" />
          <path d="M-55 470 C63 368 102 505 192 408S335 334 423 419 552 486 650 382 796 310 950 396" />
          <path d="M-70 425 C42 328 112 452 207 354S355 285 444 365 578 430 672 329 815 258 965 340" />
          <path d="M-85 382 C35 276 124 402 224 304S379 233 466 312 602 376 696 277 846 205 980 292" />
          <path d="M-100 338 C15 232 138 350 242 256S400 184 488 259 628 322 724 225 868 157 995 244" />
          <path d="M-80 122 C70 40 168 105 248 56S420 18 510 74 674 118 805 42 935 15 995 70" />
        </g>
        <g fill="none" stroke="#153c2c" strokeOpacity=".09" strokeWidth="1">
          <path d="M72 650 C35 520 144 500 124 383S187 212 302 168 455 69 498 -40" />
          <path d="M725 675 C660 530 790 462 714 343S750 138 850 40" />
          <path d="M310 670 C274 563 365 519 330 417S393 262 507 222 622 83 612 -40" />
        </g>
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_44%,rgba(217,242,123,.22),transparent_24%),linear-gradient(180deg,rgba(255,255,255,.1),rgba(21,60,44,.06))]" />

      <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/70 bg-white/78 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.15em] text-forest shadow-sm backdrop-blur-xl sm:left-6 sm:top-6"><Crosshair size={14} /> Coordenadas exactas</div>
      <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-forest/10 bg-forest px-3.5 py-2 text-[10px] font-semibold text-lime shadow-lg sm:right-6 sm:top-6"><Globe2 size={14} /> Globo ready</div>

      <div className="absolute left-[55%] top-[44%] -translate-x-1/2 -translate-y-1/2">
        <span className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border border-forest/15" />
        <span className="relative grid h-14 w-14 place-items-center rounded-full border-[5px] border-white bg-forest text-lime shadow-[0_18px_45px_rgba(21,60,44,.35)]"><MapPin size={22} fill="currentColor" /></span>
      </div>

      <div className="absolute inset-x-5 bottom-5 rounded-[1.35rem] border border-white/65 bg-white/78 p-4 shadow-lg backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:flex sm:items-center sm:justify-between">
        <div><p className="text-[9px] font-bold uppercase tracking-[.16em] text-moss">{peak.name}</p><p className="mt-1 text-xs font-semibold text-ink sm:text-sm">{formatCoordinates(peak.coordinates.latitude, peak.coordinates.longitude)}</p></div>
        <p className="mt-3 font-mono text-[9px] text-forest/45 sm:mt-0">{peak.globeId}</p>
      </div>
    </section>
  );
}

