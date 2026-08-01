import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuerdos",
  description: "Tu álbum vivo de aventuras, fotografías y cimas en PeakBook.",
};

export default function MemoriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

