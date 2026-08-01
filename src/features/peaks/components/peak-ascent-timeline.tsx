import { CalendarDays, Clock3, Mountain, Route } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { formatDate, formatDistance, formatDuration, formatElevation } from "@/features/adventures/presentation/formatters";
import type { PeakProfile } from "../domain/peak";
import { PeakPhoto } from "./peak-photo";

export function PeakAscentTimeline({ peak }: { peak: PeakProfile }) {
  return (
    <section id="ascensiones">
      <div className="mb-7"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-moss">Aventuras relacionadas</p><h2 className="mt-1.5 text-3xl font-semibold tracking-[-.055em] sm:text-4xl">Todas tus ascensiones.</h2></div>
      {peak.ascents.length > 0 ? (
        <div className="peak-ascent-timeline relative space-y-5">
          {peak.ascents.map((ascent, index) => (
            <ScrollReveal key={ascent.id} className="relative pl-8 sm:pl-12" delay={Math.min(index * 70, 160)}>
              <span className="absolute left-[.15rem] top-8 z-10 h-4 w-4 rounded-full border-4 border-canvas bg-forest shadow-[0_0_0_1px_rgba(21,60,44,.18)] sm:left-[.4rem]" />
              <article className="peak-ascent-card grid overflow-hidden rounded-[1.65rem] border border-black/[.04] bg-white shadow-card sm:grid-cols-[13rem_1fr]">
                <div className="relative min-h-52 overflow-hidden sm:min-h-full"><PeakPhoto src={ascent.cover} alt={ascent.title} sizes="(max-width: 640px) 100vw, 208px" className="object-cover transition-transform duration-700 hover:scale-[1.035]" /><div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent sm:bg-gradient-to-r" /></div>
                <div className="p-5 sm:p-6">
                  <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.14em] text-moss"><CalendarDays size={13} /> {formatDate(ascent.date)}</p>
                  <h3 className="mt-2 text-2xl font-semibold leading-tight tracking-[-.045em]">{ascent.title}</h3>
                  {ascent.note && <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-ink/47">{ascent.note}</p>}
                  <div className="mt-5 grid grid-cols-3 divide-x divide-black/[.07] border-t border-black/[.06] pt-4">
                    <TimelineMetric icon={Route} value={formatDistance(ascent.distance)} />
                    <TimelineMetric icon={Mountain} value={formatElevation(ascent.elevationGain)} />
                    <TimelineMetric icon={Clock3} value={formatDuration(ascent.duration)} />
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-forest/15 bg-white/55 p-8 text-center sm:p-12"><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-forest/[.07] text-forest"><Mountain size={20} /></span><h3 className="mt-4 text-xl font-semibold">La primera ascensión todavía está por escribir.</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink/45">Cuando alcances esta cima, su historia aparecerá aquí como una nueva página del álbum.</p></div>
      )}
    </section>
  );
}

function TimelineMetric({ icon: Icon, value }: { icon: typeof Route; value: string }) {
  return <div className="flex min-w-0 items-center justify-center gap-1.5 px-1 text-[9px] font-semibold text-ink/58 sm:text-[10px]"><Icon size={13} className="shrink-0 text-forest" /><span className="truncate">{value}</span></div>;
}

