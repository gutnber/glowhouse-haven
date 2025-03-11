
import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingAnimation() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-300 animate-fade-in">
      <div className="relative flex flex-col items-center">
        <img
          src="https://inma.mx/assets/LOGOINMA-02.svg"
          alt="INMA Logo"
          className="w-32 h-32 animate-pulse transition-all duration-700"
        />
        <div className="mt-4 text-xl font-semibold text-primary animate-pulse transition-all duration-500">
          Cargando...
        </div>
      </div>
    </div>
  );
}
