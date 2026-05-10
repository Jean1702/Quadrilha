import HeaderBar from "@/components/HeaderPage";
import FooterPage from "@/components/FooterPage";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderBar />
      {children}
      <FooterPage />
    </>
  );
}