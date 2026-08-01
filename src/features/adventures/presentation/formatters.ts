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

export function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours} h ${minutes.toString().padStart(2, "0")} min`;
}
