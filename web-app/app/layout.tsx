// web-app/app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import React from "react"
import { ConditionalSidebar } from "@/components/ConditionalSidebar"
import { Auth0Provider } from "@auth0/nextjs-auth0"
import { ShiftsContext } from "@/lib/context/ShiftsContext"


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
        <Auth0Provider>
          <ShiftsContext>
            <div className="flex h-screen">
              <ConditionalSidebar />
              <main className="flex-1 p-8 overflow-auto">{children}</main>
            </div>
          </ShiftsContext>
        </Auth0Provider>
      </body>
    </html>
  )
}
