import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { MemoryReveal } from "./memory-reveal";

export function MemoriesEmpty() {
  return (
    <MemoryReveal className="mt-8">
      <section className="relative min-h-[42rem] overflow-hidden rounded-[2.2rem] bg-[#101813] shadow-[0_30px_100px_rgba(17,32,24,.2)] sm:min-h-[46rem]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_5%,rgba(217,242,123,.16),transparent_30%)]" />
        <div className="absolute -right-8 top-14 h-60 w-44 rotate-6 overflow-hidden rounded-[1.75rem] border border-white/10 shadow-2xl sm:right-8 sm:h-72 sm:w-52">
          <Image src="/memories-summit.png" alt="Cima entre montañas" fill priority sizes="208px" className="object-cover" />
        </div>
        <div className="absolute -left-10 top-28 h-64 w-48 -rotate-6 overflow-hidden rounded-[1.75rem] border border-white/10 shadow-2xl sm:left-10 sm:h-80 sm:w-60">
          <Image src="/memories-dawn.png" alt="Amanecer en la montaña" fill priority sizes="240px" className="object-cover" />
        </div>
        <div className="absolute left-1/2 top-48 h-56 w-52 -translate-x-1/2 rotate-2 overflow-hidden rounded-[1.75rem] border border-white/15 shadow-2xl sm:top-56 sm:h-64 sm:w-72">
          <Image src="/memories-lake.png" alt="Lago de alta montaña" fill priority sizes="288px" className="object-cover" />
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 bg-[linear-gradient(180deg,transparent,#101813_24%)] px-6 pb-8 pt-36 text-center text-white sm:px-10 sm:pb-11">
          <span className="mx-auto grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10 text-lime backdrop-blur"><Sparkles size={17} /></span>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[.2em] text-lime">Tu álbum está esperando</p>
          <h2 className="mx-auto mt-2 max-w-md text-[2.3rem] font-semibold leading-[.98] tracking-[-.06em] sm:text-5xl">Tu historia empieza con una cima.</h2>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-white/52">Cuando guardes tu primera aventura, PeakBook convertirá cada fecha, fotografía y cima en un recuerdo vivo.</p>
          <Link href="/adventures/new" className="tap-scale mx-auto mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3.5 text-xs font-semibold text-forest shadow-xl">Crear mi primer recuerdo <ArrowRight size={15} /></Link>
        </div>
      </section>
    </MemoryReveal>
  );
}

export function MemoriesSkeleton() {
  return (
    <div className="mt-8 space-y-7" aria-label="Cargando recuerdos">
      <div className="h-[28rem] animate-pulse rounded-[2rem] bg-forest/10" />
      <div className="ml-8 h-[24rem] animate-pulse rounded-[2rem] bg-white shadow-card md:ml-14 md:w-[82%]" />
    </div>
  );
}
