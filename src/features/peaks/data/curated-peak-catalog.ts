import { calculatePeakStats, toGlobePosition, type PeakAscent, type PeakProfile } from "../domain/peak";

type CatalogPeak = Omit<PeakProfile, "globeId" | "globePosition" | "stats" | "status">;

function createPeak(peak: CatalogPeak): PeakProfile {
  return {
    ...peak,
    globeId: `peak:${peak.id}`,
    globePosition: toGlobePosition(peak.id, peak.coordinates, peak.altitude),
    stats: calculatePeakStats(peak.ascents),
    status: peak.ascents.length > 0 ? "conquered" : "pending",
  };
}

const anetoAscents: PeakAscent[] = [
  {
    id: "ascent-aneto-2026",
    adventureId: "curated-aneto-2026",
    title: "Aneto por la Renclusa",
    date: "2026-07-18",
    distance: 15.1,
    elevationGain: 1490,
    duration: 28_620,
    difficulty: "experta",
    cover: "/peak-aneto.png",
    note: "La primera luz llegó justo antes del Paso de Mahoma.",
  },
  {
    id: "ascent-aneto-2025",
    adventureId: "curated-aneto-2025",
    title: "El día que volvimos al Aneto",
    date: "2025-08-09",
    distance: 14.8,
    elevationGain: 1450,
    duration: 27_840,
    difficulty: "experta",
    cover: "/memories-dawn.png",
    note: "Un amanecer limpio y el valle entero bajo las nubes.",
  },
  {
    id: "ascent-aneto-2024",
    adventureId: "curated-aneto-2024",
    title: "Mi primera cima de 3.000",
    date: "2024-07-22",
    distance: 15.4,
    elevationGain: 1510,
    duration: 31_260,
    difficulty: "experta",
    cover: "/memories-summit.png",
    note: "El día en que la montaña dejó de ser un lugar y se volvió memoria.",
  },
];

const mulhacenAscents: PeakAscent[] = [
  {
    id: "ascent-mulhacen-2026",
    adventureId: "curated-mulhacen-2026",
    title: "La arista sur del Mulhacén",
    date: "2026-05-24",
    distance: 22.6,
    elevationGain: 1320,
    duration: 25_560,
    difficulty: "dificil",
    cover: "/peak-mulhacen.png",
    note: "Luz seca, aire fino y África insinuándose en el horizonte.",
  },
  {
    id: "ascent-mulhacen-2024",
    adventureId: "curated-mulhacen-2024",
    title: "Mulhacén desde Capileira",
    date: "2024-09-15",
    distance: 24.2,
    elevationGain: 1460,
    duration: 29_400,
    difficulty: "dificil",
    cover: "/memories-lake.png",
    note: "Una jornada larga que terminó con la última luz sobre la Alpujarra.",
  },
];

export const curatedPeakCatalog: PeakProfile[] = [
  createPeak({
    id: "01000000-0000-4000-8000-000000000001",
    name: "Aneto",
    altitude: 3404,
    province: "Huesca",
    country: "España",
    coordinates: { latitude: 42.631111, longitude: 0.656667 },
    difficulty: "experta",
    heroImage: "/peak-aneto.png",
    description: "El techo de los Pirineos. Una presencia de granito, nieve y silencio que domina el macizo de la Maladeta.",
    ascents: anetoAscents,
  }),
  createPeak({
    id: "01000000-0000-4000-8000-000000000002",
    name: "Mulhacén",
    altitude: 3479,
    province: "Granada",
    country: "España",
    coordinates: { latitude: 37.053333, longitude: -3.311389 },
    difficulty: "dificil",
    heroImage: "/peak-mulhacen.png",
    description: "La gran atalaya de Sierra Nevada: mineral, abierta y luminosa, con el Mediterráneo respirando a lo lejos.",
    ascents: mulhacenAscents,
  }),
  createPeak({
    id: "01000000-0000-4000-8000-000000000003",
    name: "Teide",
    altitude: 3715,
    province: "Santa Cruz de Tenerife",
    country: "España",
    coordinates: { latitude: 28.272639, longitude: -16.643611 },
    difficulty: "moderada",
    heroImage: "/peak-teide.png",
    description: "Un volcán sobre el Atlántico. Lava, luz y una silueta que convierte la isla entera en una montaña.",
    ascents: [],
  }),
  createPeak({
    id: "01000000-0000-4000-8000-000000000004",
    name: "Pic du Midi d’Ossau",
    altitude: 2884,
    province: "Pyrénées-Atlantiques",
    country: "Francia",
    coordinates: { latitude: 42.843056, longitude: -0.438056 },
    difficulty: "experta",
    heroImage: "/peak-midi-ossau.png",
    description: "Una pirámide volcánica inconfundible sobre los lagos de Ossau. Oscura, elegante y siempre magnética.",
    ascents: [],
  }),
];

export const curatedPeakById = (id: string) => curatedPeakCatalog.find((peak) => peak.id === id) ?? null;

