import { Camera } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import type { PeakProfile } from "../domain/peak";
import { PeakPhoto } from "./peak-photo";

export function PeakGallery({ peak }: { peak: PeakProfile }) {
  const images = uniqueImages(peak);
  return (
    <section>
      <div className="mb-7 flex items-end justify-between gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-moss">Archivo fotográfico</p><h2 className="mt-1.5 text-3xl font-semibold tracking-[-.055em] sm:text-4xl">La montaña, cada vez distinta.</h2></div><span className="hidden items-center gap-2 text-xs text-ink/35 sm:flex"><Camera size={14} /> {images.length} fotografías</span></div>
      <div className="grid auto-rows-[14rem] grid-cols-2 gap-3 sm:auto-rows-[18rem] sm:gap-4 md:grid-cols-4">
        {images.map((image, index) => (
          <ScrollReveal key={`${image.src}:${index}`} className={index === 0 ? "col-span-2 row-span-2" : index === 1 ? "col-span-2" : ""} delay={Math.min(index * 60, 180)}>
            <figure className="group relative h-full min-h-0 overflow-hidden rounded-[1.6rem] bg-ink shadow-card">
              <PeakPhoto src={image.src} alt={image.label} sizes={index === 0 ? "(max-width: 768px) 100vw, 520px" : "(max-width: 768px) 50vw, 260px"} className="object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.045]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-4 bottom-4 text-[10px] font-semibold text-white/78">{image.label}</figcaption>
            </figure>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

function uniqueImages(peak: PeakProfile) {
  const images = [{ src: peak.heroImage, label: `${peak.name} · Fotografía principal` }, ...peak.ascents.map((ascent) => ({ src: ascent.cover, label: ascent.title }))];
  return images.filter((image, index) => images.findIndex(({ src }) => src === image.src) === index);
}

