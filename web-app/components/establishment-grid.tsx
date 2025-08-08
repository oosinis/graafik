import React from "react";

type Establishment = {
  id: string;
  name: string;
};

type Props = {
  establishments: Establishment[];
  onEstablishmentClick: (id: string) => void;
};

export function EstablishmentGrid({ establishments, onEstablishmentClick }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {establishments.map((est) => (
        <button
          key={est.id}
          className="p-4 border rounded hover:bg-gray-100"
          onClick={() => onEstablishmentClick(est.id)}
        >
          {est.name}
        </button>
      ))}
    </div>
  );
}