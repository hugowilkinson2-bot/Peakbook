"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Clock3, CloudSun, Gauge, HeartPulse, Mountain, NotebookPen, Route } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Adventure, AdventureDifficulty, AdventureInput } from "../domain/adventure";

type AdventureFormProps = {
  initialValue?: Adventure;
  submitLabel: string;
  onSubmit: (input: AdventureInput) => Promise<void>;
};

const today = () => new Date().toISOString().slice(0, 10);

export function AdventureForm({ initialValue, submitLabel, onSubmit }: AdventureFormProps) {
  const initialHours = Math.floor((initialValue?.tiempo ?? 0) / 3600);
  const initialMinutes = Math.floor(((initialValue?.tiempo ?? 0) % 3600) / 60);
  const initialWeather = readWeather(initialValue?.meteorologia);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState({
    titulo: initialValue?.titulo ?? "",
    fecha: initialValue?.fecha ?? today(),
    distancia: initialValue?.distancia.toString() ?? "",
    desnivelPositivo: initialValue?.desnivelPositivo.toString() ?? "",
    horas: initialHours.toString(),
    minutos: initialMinutes.toString(),
    dificultad: initialValue?.dificultad ?? "moderada" as AdventureDifficulty,
    sensaciones: initialValue?.sensaciones ?? "",
    meteorologia: initialWeather,
    notas: initialValue?.notas ?? "",
  });

  const isValid = useMemo(() => values.titulo.trim().length > 0 && values.fecha.length > 0 && Number(values.distancia) >= 0 && Number(values.desnivelPositivo) >= 0, [values]);
  const set = (key: keyof typeof values, value: string) => setValues(current => ({ ...current, [key]: value }));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!isValid) { setError("Revisa los campos obligatorios antes de continuar."); return; }
    const input: AdventureInput = {
      titulo: values.titulo.trim(),
      fecha: values.fecha,
      distancia: Number(values.distancia),
      desnivelPositivo: Number(values.desnivelPositivo),
      desnivelNegativo: initialValue?.desnivelNegativo ?? 0,
      tiempo: Math.max(0, Number(values.horas) * 3600 + Number(values.minutos) * 60),
      dificultad: values.dificultad,
      sensaciones: values.sensaciones.trim() || null,
      meteorologia: { condicion: values.meteorologia },
      notas: values.notas.trim() || null,
    };
    setIsSaving(true);
    try { await onSubmit(input); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No hemos podido guardar los cambios."); }
    finally { setIsSaving(false); }
  }

  return <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-5" noValidate>
    <section className="rounded-[1.8rem] border border-black/[.035] bg-white p-5 shadow-card sm:p-7">
      <div className="mb-6"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-moss">Información esencial</p><h2 className="mt-1 text-xl font-semibold tracking-[-.035em]">La aventura</h2></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field icon={Mountain} label="Título" className="sm:col-span-2"><input required autoFocus value={values.titulo} onChange={event=>set("titulo",event.target.value)} placeholder="Ascenso al Aneto" className="field-input"/></Field>
        <Field icon={CalendarDays} label="Fecha"><input required type="date" value={values.fecha} onChange={event=>set("fecha",event.target.value)} className="field-input"/></Field>
        <Field icon={Gauge} label="Dificultad"><select value={values.dificultad} onChange={event=>set("dificultad",event.target.value)} className="field-input"><option value="facil">Fácil</option><option value="moderada">Moderada</option><option value="dificil">Difícil</option><option value="experta">Experta</option></select></Field>
        <Field icon={Route} label="Distancia (km)"><input required min="0" step="0.1" inputMode="decimal" type="number" value={values.distancia} onChange={event=>set("distancia",event.target.value)} placeholder="13,8" className="field-input"/></Field>
        <Field icon={Mountain} label="Desnivel + (m)"><input required min="0" step="1" inputMode="numeric" type="number" value={values.desnivelPositivo} onChange={event=>set("desnivelPositivo",event.target.value)} placeholder="1487" className="field-input"/></Field>
      </div>
    </section>

    <section className="rounded-[1.8rem] border border-black/[.035] bg-white p-5 shadow-card sm:p-7">
      <div className="mb-6"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-moss">Cómo fue</p><h2 className="mt-1 text-xl font-semibold tracking-[-.035em]">Experiencia</h2></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field icon={Clock3} label="Tiempo"><div className="grid grid-cols-2 gap-2"><input min="0" inputMode="numeric" type="number" value={values.horas} onChange={event=>set("horas",event.target.value)} aria-label="Horas" placeholder="7 h" className="field-input"/><input min="0" max="59" inputMode="numeric" type="number" value={values.minutos} onChange={event=>set("minutos",event.target.value)} aria-label="Minutos" placeholder="42 min" className="field-input"/></div></Field>
        <Field icon={CloudSun} label="Meteorología"><select value={values.meteorologia} onChange={event=>set("meteorologia",event.target.value)} className="field-input"><option value="despejado">Despejado</option><option value="nublado">Nublado</option><option value="lluvia">Lluvia</option><option value="nieve">Nieve</option><option value="viento">Viento</option><option value="variable">Variable</option></select></Field>
        <Field icon={HeartPulse} label="Sensaciones" className="sm:col-span-2"><input value={values.sensaciones} onChange={event=>set("sensaciones",event.target.value)} placeholder="Fuerte, tranquilo, exigente…" className="field-input"/></Field>
        <Field icon={NotebookPen} label="Notas" className="sm:col-span-2"><textarea rows={5} value={values.notas} onChange={event=>set("notas",event.target.value)} placeholder="Momentos, condiciones y detalles que quieres recordar…" className="field-input resize-none leading-relaxed"/></Field>
      </div>
    </section>

    {error && <div role="alert" className="rounded-2xl border border-[#b85143]/15 bg-[#b85143]/[.07] px-4 py-3 text-sm text-[#913e34]">{error}</div>}
    <button disabled={isSaving || !isValid} type="submit" className="tap-scale flex h-14 w-full items-center justify-center gap-2 rounded-[1.15rem] bg-forest font-semibold text-white shadow-float disabled:cursor-not-allowed disabled:opacity-50">{isSaving ? "Guardando…" : submitLabel}{!isSaving && <ArrowRight size={18} strokeWidth={1.9}/>}</button>
  </form>;
}

function Field({ icon: Icon, label, className = "", children }: { icon: LucideIcon; label: string; className?: string; children: React.ReactNode }) {
  return <label className={`block rounded-[1.25rem] border border-black/[.05] bg-canvas/55 p-4 transition-colors focus-within:border-forest/25 focus-within:bg-white ${className}`}><span className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.14em] text-moss"><Icon size={14} strokeWidth={1.8}/>{label}</span>{children}</label>;
}

function readWeather(value: Adventure["meteorologia"] | undefined) {
  if (value && typeof value === "object" && !Array.isArray(value) && typeof value.condicion === "string") return value.condicion;
  return "despejado";
}
