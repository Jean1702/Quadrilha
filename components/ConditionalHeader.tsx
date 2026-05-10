"use client";

import { usePathname } from "next/navigation";
import HeaderBar from "@/components/HeaderPage";

export default function ConditionalHeader() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return null;

  return <HeaderBar />;
}