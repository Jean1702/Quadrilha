'use client';
import { usePathname } from 'next/navigation';
import FooterPage from "@/components/FooterPage";
export default function ConditionalFooter() {
  const pathname = usePathname();
  const disabledRoutes = ['/payment'];
  const isPayment = disabledRoutes.includes(pathname);
  const isProductDetail = pathname.startsWith('/product/');
  const isMethodPayment = pathname.startsWith("/method_payment");
  const isPaymentDetail = pathname.startsWith('/cart');
  const isAdmin = pathname.startsWith('/admin');
  if (isPayment || isProductDetail || isPaymentDetail || isAdmin || isMethodPayment) {
    return null;
  }
  return <FooterPage />;
}