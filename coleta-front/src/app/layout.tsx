import type { Metadata } from "next";
import { Geist_Mono, Newsreader, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Glupta",
  description: "Glupta é uma plataforma de coleta de dados voltados a florestas plantadas, com o objetivo de fornecer gráficos e métricas sobre o crescimento das árvores, auxiliando na tomada de decisões para o manejo florestal.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-br"
      className={`${newsreader.variable} ${sourceSans3.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
