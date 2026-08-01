import type { AdventureSummary } from "../domain/adventure";

export const adventureSummaries: AdventureSummary[] = [
  { id: "aneto", titulo: "Ascenso al Aneto", fecha: "2026-07-26", lugar: "Benasque · Pirineos", distancia: 13.8, desnivelPositivo: 1487, tiempo: 27720, dificultad: "experta", imagen: "/peakbook-hero.png" },
  { id: "pedraforca", titulo: "Circular Pedraforca", fecha: "2026-07-12", lugar: "Berguedà · Catalunya", distancia: 9.6, desnivelPositivo: 1103, tiempo: 19080, dificultad: "dificil", imagen: "/peakbook-hero.png" },
  { id: "ordesa", titulo: "Faja de Pelay", fecha: "2026-06-28", lugar: "Ordesa · Huesca", distancia: 17.2, desnivelPositivo: 812, tiempo: 21900, dificultad: "moderada", imagen: "/peakbook-hero.png" },
];
