import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { PwaRegister } from "@/components/pwa-register";
import { AdventureProvider } from "@/features/adventures/application/adventure-provider";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: { default: "PeakBook", template: "%s · PeakBook" },
  description: "Tu atlas personal de cimas, ascensiones y recuerdos de montaña.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "PeakBook" },
};
export const viewport: Viewport = { themeColor: "#f3f1e9", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={manrope.variable}><PwaRegister/><AdventureProvider>{children}</AdventureProvider></body></html>;
}
