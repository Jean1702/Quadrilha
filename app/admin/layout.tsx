import type { Metadata } from "next";
import { ThemeProvider } from "@/context/Theme";
import { ProductProvider } from "@/context/ProductContext";
import { CartProvider } from '@/context/CartContext';
import AdminHeaderPage from "@/components/AdminHeaderPage";
import AdminFooterPage from "@/components/AdminFooterPage";

export const metadata: Metadata = {
  title: "IF FOOD - Admin",
  description: "Painel Administrativo - IF FOOD",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <ProductProvider>
        <CartProvider>
          <AdminHeaderPage />
          {children}
          <AdminFooterPage />
        </CartProvider>
      </ProductProvider>
    </ThemeProvider>
  );
}