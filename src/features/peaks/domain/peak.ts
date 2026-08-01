import type { AdventureDifficulty } from "@/features/adventures/domain/adventure";

export type PeakStatus = "conquered" | "pending";
export type PeakDifficulty = AdventureDifficulty;

export type PeakCoordinates = {
  latitude: number;
  longitude: number;
};

export type GlobePosition = {
  id: string;
  x: number;
  y: number;
  z: number;
};

export type PeakAscent = {
  id: string;
  adventureId: string;
  title: string;
  date: string;
  distance: number;
  elevationGain: number;
  duration: number;
  difficulty: PeakDifficulty;
  cover: string;
  note: string | null;
};

export type PeakStats = {
  ascentCount: number;
  firstAscent: string | null;
  latestAscent: string | null;
  bestTime: number | null;
  averageTime: number | null;
  totalElevation: number;
  totalDistance: number;
};

export type PeakProfile = {
  id: string;
  globeId: string;
  name: string;
  altitude: number;
  province: string;
  country: string;
  coordinates: PeakCoordinates;
  difficulty: PeakDifficulty;
  heroImage: string;
  description: string;
  ascents: PeakAscent[];
  stats: PeakStats;
  status: PeakStatus;
  globePosition: GlobePosition;
};

export function calculatePeakStats(ascents: PeakAscent[]): PeakStats {
  const ordered = [...ascents].sort((a, b) => a.date.localeCompare(b.date));
  const durations = ascents.map(({ duration }) => duration);
  return {
    ascentCount: ascents.length,
    firstAscent: ordered[0]?.date ?? null,
    latestAscent: ordered[ordered.length - 1]?.date ?? null,
    bestTime: durations.length > 0 ? Math.min(...durations) : null,
    averageTime: durations.length > 0 ? Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length) : null,
    totalElevation: ascents.reduce((sum, ascent) => sum + ascent.elevationGain, 0),
    totalDistance: ascents.reduce((sum, ascent) => sum + ascent.distance, 0),
  };
}

export function toGlobePosition(id: string, coordinates: PeakCoordinates, altitude: number): GlobePosition {
  const latitude = coordinates.latitude * Math.PI / 180;
  const longitude = coordinates.longitude * Math.PI / 180;
  const radius = 1 + altitude / 6_371_000;
  return {
    id: `peak:${id}`,
    x: radius * Math.cos(latitude) * Math.cos(longitude),
    y: radius * Math.sin(latitude),
    z: radius * Math.cos(latitude) * Math.sin(longitude),
  };
}

