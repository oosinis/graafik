"use client"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"

interface Establishment {
  id: string
  name: string
}

interface EstablishmentGridProps {
  establishments: Establishment[]
  onEstablishmentClick: (id: string) => void
}

export function EstablishmentGrid({ establishments, onEstablishmentClick }: EstablishmentGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {establishments.map((establishment) => (
        <Card
          key={establishment.id}
          className="hover:bg-accent cursor-pointer transition-colors"
          onClick={() => onEstablishmentClick(establishment.id)}
        >
          <CardHeader>
            <CardTitle className="text-xl text-center">{establishment.name}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
