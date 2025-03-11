
import React from 'react';

export function LoadingAnimation() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative flex flex-col items-center">
        <img
          src="/inma-logo.svg"
          alt="INMA Logo"
          className="w-32 h-32 animate-pulse"
        />
        <div className="mt-4 text-xl font-semibold text-primary animate-pulse">Cargando...</div>
      </div>
    </div>
  );
}
