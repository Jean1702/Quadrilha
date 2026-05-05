import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import HeaderBar from "@/components/HeaderPage";
import FooterPage from "@/components/FooterPage";
import { ThemeProvider } from "@/context/Theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IF FOOD",
  description: "App de comida do Instituto Federal Goiano - Campus Trindade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <ThemeProvider>

        {children}

      </ThemeProvider>
    </div>
  );
}
