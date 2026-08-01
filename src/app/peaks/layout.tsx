import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cimas",
  description: "Tu atlas personal de montañas, ascensiones y recuerdos en PeakBook.",
};

export default function PeaksLayout({ children }: { children: React.ReactNode }) {
  return children;
}

