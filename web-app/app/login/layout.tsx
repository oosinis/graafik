// web-app/app/login/layout.tsx
"use client";

import React from "react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      {children}
    </div>
  );
}
