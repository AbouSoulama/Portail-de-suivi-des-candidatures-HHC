import type { Metadata } from "next";
import { Outfit, Manrope } from "next/font/google";
import { NavigationLoader } from "@/components/NavigationLoader";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Espace candidat — Hamine Happy",
  description: "Suivi de votre dossier d’études à l’étranger",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${outfit.variable} ${manrope.variable}`}>
        <NavigationLoader />
        {children}
      </body>
    </html>
  );
}
