import "./globals.css";
import type { ReactNode } from "react";
import NavBar from "@/components/navBar";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-[#1b1b1b] text-gray-100">
        <NavBar />
        <div className="mx-auto max-w-6xl px-4">{children}</div>
      </body>
    </html>
  );
}
