import type { PeakStatus } from "../domain/peak";

export const formatPeakAltitude = (altitude: number) => `${altitude.toLocaleString("es-ES")} m`;

export function formatCoordinates(latitude: number, longitude: number) {
  const lat = `${Math.abs(latitude).toFixed(6)}° ${latitude >= 0 ? "N" : "S"}`;
  const lng = `${Math.abs(longitude).toFixed(6)}° ${longitude >= 0 ? "E" : "O"}`;
  return `${lat} · ${lng}`;
}

export const peakStatusLabel: Record<PeakStatus, string> = {
  conquered: "Conseguida",
  pending: "Pendiente",
};

export function formatStatDate(date: string | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${date}T12:00:00`));
}

export function formatCompactDuration(seconds: number | null) {
  if (seconds === null) return "—";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return `${hours} h ${minutes.toString().padStart(2, "0")}`;
}

