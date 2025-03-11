
import React from "react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-sm transition-opacity duration-300 ease-in-out">
      <div className="relative flex flex-col items-center">
        <svg 
          className="w-32 h-32" 
          viewBox="0 0 123.35 119.06" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle 
            cx="101.3" cy="108.27" r="5.51" 
            className="animate-[circle-fill_2.4s_ease-in-out_infinite] fill-current text-gray-400"
            style={{ animationDelay: '0s' }}
          />
          <circle 
            cx="106.2" cy="90.34" r="7.9" 
            className="animate-[circle-fill_2.4s_ease-in-out_infinite] fill-current text-gray-400"
            style={{ animationDelay: '0.4s' }}
          />
          <circle 
            cx="103.53" cy="67.78" r="8.68" 
            className="animate-[circle-fill_2.4s_ease-in-out_infinite] fill-current text-gray-400"
            style={{ animationDelay: '0.8s' }}
          />
          <circle 
            cx="94.9" cy="44.15" r="11.33" 
            className="animate-[circle-fill_2.4s_ease-in-out_infinite] fill-current text-gray-400"
            style={{ animationDelay: '1.2s' }}
          />
          <circle 
            cx="67.36" cy="28.19" r="13.66" 
            className="animate-[circle-fill_2.4s_ease-in-out_infinite] fill-current text-gray-400"
            style={{ animationDelay: '1.6s' }}
          />
          <circle 
            cx="27.85" cy="24.55" r="17.65" 
            className="animate-[circle-fill_2.4s_ease-in-out_infinite] fill-current text-gray-400"
            style={{ animationDelay: '2.0s' }}
          />
        </svg>
        <div className="mt-4 text-xl font-semibold text-foreground">Cargando...</div>
      </div>
    </div>
  );
}
