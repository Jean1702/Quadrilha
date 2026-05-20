'use client';
import { usePathname } from 'next/navigation';
import FooterPage from "@/components/FooterPage";
export default function ConditionalFooter() {
  const pathname = usePathname();
  const disabledRoutes = ['/payment'];
  const isPayment = disabledRoutes.includes(pathname);
  const isAdmin = pathname.startsWith('/admin');
  if (isPayment || isAdmin) {
    return null;
  }
  return <FooterPage />;
}