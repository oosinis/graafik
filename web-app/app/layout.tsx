// web-app/app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import React from "react"
import { ConditionalSidebar } from "@/components/ConditionalSidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Töögraafiku Planeerija",
  description: "Planeeri ja halda töögraafikuid efektiivselt",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="et">
      <body className={inter.className}>
        <div className="flex h-screen">
          <ConditionalSidebar />
          <main className="flex-1 p-8 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  )
}
