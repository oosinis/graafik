import React from "react";
import { ShiftsProvider } from "@/lib/context/ShiftsContext";

export default function ShiftsLayout({ children }: { children: React.ReactNode }) {
  return <ShiftsProvider>{children}</ShiftsProvider>;
}
