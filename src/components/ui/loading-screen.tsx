import React from "react";
import { cn } from "@/lib/utils";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <div className="relative flex flex-col items-center">
        <div className="h-24 w-24 animate-spin rounded-full border-b-2 border-primary"></div>
        <div className="mt-4 text-xl font-semibold text-foreground">Cargando...</div>
      </div>
    </div>
  );
}