import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderPage from "@/components/HeaderPage"
import FooterPage from "@/components/FooterPage";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Uai Rango",
  description: "Quadrilha do Instituto Federal Goiano - Campus Trindade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HeaderPage></HeaderPage>
        <main className="min-h-screen">
          {children}
        </main>
        <FooterPage></FooterPage>
      </body>
    </html>
  );
}
