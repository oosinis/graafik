// web‑app/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import { ConditionalSidebar } from "@/components/ConditionalSidebar";
import { EmployeesProvider } from "@/lib/context/EmployeesContext";
import { Auth0Provider } from "@auth0/nextjs-auth0"


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Töögraafiku Planeerija",
  description: "Planeeri ja halda töögraafikuid efektiivselt",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="et">
      <body
        className={inter.className}
        suppressHydrationWarning
      >
        <Auth0Provider>

          <div className="flex h-screen">
            <ConditionalSidebar />
            <main className="flex-1 p-8 overflow-auto">
              <EmployeesProvider>
                {children}
              </EmployeesProvider>
            </main>
          </div>
        </Auth0Provider>

      </body>
    </html>
  );
}
