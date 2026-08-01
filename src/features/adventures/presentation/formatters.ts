import type { AdventureDifficulty } from "../domain/adventure";

const difficultyLabels: Record<AdventureDifficulty, string> = {
  facil: "Fácil",
  moderada: "Moderada",
  dificil: "Difícil",
  experta: "Experta",
};

export const formatDifficulty = (difficulty: AdventureDifficulty) => difficultyLabels[difficulty];
export const formatDistance = (kilometers: number) => `${kilometers.toLocaleString("es-ES", { maximumFractionDigits: 1 })} km`;
export const formatElevation = (meters: number) => `+${meters.toLocaleString("es-ES")} m`;
export const formatDate = (date: string, options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) => new Intl.DateTimeFormat("es-ES", options).format(new Date(`${date}T12:00:00`));

export function formatWeather(weather: unknown) {
  if (weather && typeof weather === "object" && !Array.isArray(weather) && "condicion" in weather && typeof weather.condicion === "string") {
    return weather.condicion.charAt(0).toUpperCase() + weather.condicion.slice(1);
  }
  return "Sin datos";
}

export function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours} h ${minutes.toString().padStart(2, "0")} min`;
}
