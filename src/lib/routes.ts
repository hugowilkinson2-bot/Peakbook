export type MountainRoute = {
  id: string;
  name: string;
  place: string;
  distance: string;
  elevation: string;
  duration: string;
  difficulty: "Moderada" | "Difícil" | "Experta";
  progress?: number;
  tone: string;
};

export const routes: MountainRoute[] = [
  { id: "aneto", name: "Ascenso al Aneto", place: "Benasque · Pirineos", distance: "13,8 km", elevation: "+1.487 m", duration: "7 h 42 min", difficulty: "Experta", progress: 82, tone: "from-[#264837] via-[#708372] to-[#d6caaa]" },
  { id: "pedraforca", name: "Circular Pedraforca", place: "Berguedà · Catalunya", distance: "9,6 km", elevation: "+1.103 m", duration: "5 h 18 min", difficulty: "Difícil", progress: 100, tone: "from-[#355043] via-[#9d9b79] to-[#e1d9c5]" },
  { id: "ordesa", name: "Faja de Pelay", place: "Ordesa · Huesca", distance: "17,2 km", elevation: "+812 m", duration: "6 h 05 min", difficulty: "Moderada", progress: 100, tone: "from-[#213e34] via-[#708c6e] to-[#d9bb8d]" },
];
