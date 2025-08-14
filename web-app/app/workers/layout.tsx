import React from "react";
import { WorkersProvider } from "@/lib/context/WorkersContext";

export default function WorkersSectionLayout({ children }: { children: React.ReactNode }) {
  return <WorkersProvider>{children}</WorkersProvider>;
}
