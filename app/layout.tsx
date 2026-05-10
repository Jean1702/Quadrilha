import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
<<<<<<< HEAD
import { ThemeProvider } from "@/context/Theme";
import { ProductProvider } from "@/context/ProductContext";
=======
import HeaderBar from "@/components/HeaderPage";
import ConditionalFooter from "@/components/ConditionalFooter"; 
import { ThemeProvider } from "@/context/Theme";
import { ProductProvider } from "@/context/ProductContext"
>>>>>>> b92166443466b58498e1ffd6bbf6152e73e857cf
import { CartProvider } from '@/context/CartContext';

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
<<<<<<< HEAD
    <html lang="pt-BR">
=======
    <html lang="pt-br" className="dark">
>>>>>>> b92166443466b58498e1ffd6bbf6152e73e857cf
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <ProductProvider>
            <CartProvider>
<<<<<<< HEAD
              {children}
=======
              <HeaderBar />
              <main className="min-h-screen">
                {children}
              </main>
              <ConditionalFooter /> 
>>>>>>> b92166443466b58498e1ffd6bbf6152e73e857cf
            </CartProvider>
          </ProductProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}