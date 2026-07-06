import "./globals.css";
import type { Metadata } from "next";
import ClientLayout from "@/components/layout/ClientLayout";
import { Toaster } from "sonner";


export const metadata: Metadata = {
  title: "Jaja Construction Tools Shop",
  description: "Buy quality construction tools, equipment, and building supplies online.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen font-sans bg-slate-50">
        <ClientLayout>{children}</ClientLayout>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}