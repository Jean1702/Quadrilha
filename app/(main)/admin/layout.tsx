import { ThemeProvider } from "@/context/Theme";
import { ProductProvider } from "@/context/ProductContext";
import { CartProvider } from "@/context/CartContext";
import AdminFooterPage from "@/components/AdminFooterPage";

export const metadata = {
  title: "IF FOOD - Admin",
  description: "Painel Administrativo - IF FOOD",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider storageKey="theme-default">
      <ProductProvider>
        <CartProvider>
          <div className="pb-28">
            {children}
            <AdminFooterPage />
          </div>
        </CartProvider>
      </ProductProvider>
    </ThemeProvider>
  );
}