'use client';
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
 const isAdmin = pathname.startsWith("/admin");
 const isAuthPage =
  pathname === "/login" ||
  pathname === "/set-password" ||
  pathname === "/signup" ||
  pathname.startsWith("/verify");
 const isDashboard = pathname.startsWith("/user-dashboard");
  return (
    <>
      {!isAdmin && !isAuthPage && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isAuthPage && <Footer />}
    </>
  );
}