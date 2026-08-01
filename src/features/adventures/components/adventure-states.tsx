import Link from "next/link";
import { AlertCircle, ArrowRight, Mountain, RefreshCw } from "lucide-react";

export function AdventureLoading({ cards = 3 }: { cards?: number }) {
  return <div aria-label="Cargando aventuras" className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: cards }).map((_,index)=><div key={index} className="animate-pulse overflow-hidden rounded-[1.75rem] bg-white shadow-card"><div className="h-44 bg-stone/70"/><div className="space-y-3 p-5"><div className="h-4 w-2/3 rounded bg-stone/70"/><div className="h-3 w-1/2 rounded bg-stone/50"/></div></div>)}</div>;
}

export function AdventureError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <div role="alert" className="rounded-[1.75rem] border border-[#b85143]/15 bg-white p-6 text-center shadow-card"><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#b85143]/10 text-[#b85143]"><AlertCircle size={21}/></span><h2 className="mt-4 font-semibold">Algo no ha ido bien</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink/48">{message}</p>{onRetry&&<button onClick={onRetry} className="tap-scale mx-auto mt-5 flex items-center gap-2 rounded-full bg-forest px-4 py-2.5 text-xs font-semibold text-white"><RefreshCw size={14}/>Reintentar</button>}</div>;
}

export function AdventureEmpty({ filtered = false }: { filtered?: boolean }) {
  return <div className="rounded-[1.75rem] border border-dashed border-forest/15 bg-white/65 px-6 py-12 text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-forest/[.07] text-forest"><Mountain size={23}/></span><h2 className="mt-5 text-lg font-semibold">{filtered ? "No hay coincidencias" : "Tu primera aventura te espera"}</h2><p className="mx-auto mt-2 max-w-sm text-sm text-ink/45">{filtered ? "Prueba con otra búsqueda o ajusta los filtros." : "Guarda la historia, los datos y las sensaciones de tu próxima salida."}</p>{!filtered&&<Link href="/adventures/new" className="tap-scale mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 text-xs font-semibold text-white">Crear aventura<ArrowRight size={15}/></Link>}</div>;
}
