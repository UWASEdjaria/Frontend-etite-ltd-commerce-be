import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jaja Construction Tools Shop",
  description: "Buy quality construction tools, equipment, and building supplies online.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen overflow-hidden font-sans bg-slate-50">
        <Navbar />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}