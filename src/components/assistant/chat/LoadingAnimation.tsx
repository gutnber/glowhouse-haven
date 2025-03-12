
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const LoadingAnimation: React.FC = () => {
  const { language } = useLanguage();
  
  return (
    <div className="flex flex-col items-center justify-center p-3">
      <svg 
        className="w-16 h-16 mb-2" 
        viewBox="0 0 123.35 119.06" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle 
          cx="101.3" cy="108.27" r="5.51" 
          className="animate-[circle-fill_2.4s_ease-in-out_infinite] fill-current text-gray-300"
          style={{ animationDelay: '0s' }}
        />
        <circle 
          cx="106.2" cy="90.34" r="7.9" 
          className="animate-[circle-fill_2.4s_ease-in-out_infinite] fill-current text-gray-300"
          style={{ animationDelay: '0.4s' }}
        />
        <circle 
          cx="103.53" cy="67.78" r="8.68" 
          className="animate-[circle-fill_2.4s_ease-in-out_infinite] fill-current text-gray-300"
          style={{ animationDelay: '0.8s' }}
        />
        <circle 
          cx="94.9" cy="44.15" r="11.33" 
          className="animate-[circle-fill_2.4s_ease-in-out_infinite] fill-current text-gray-300"
          style={{ animationDelay: '1.2s' }}
        />
        <circle 
          cx="67.36" cy="28.19" r="13.66" 
          className="animate-[circle-fill_2.4s_ease-in-out_infinite] fill-current text-gray-300"
          style={{ animationDelay: '1.6s' }}
        />
        <circle 
          cx="27.85" cy="24.55" r="17.65" 
          className="animate-[circle-fill_2.4s_ease-in-out_infinite] fill-current text-gray-300"
          style={{ animationDelay: '2.0s' }}
        />
      </svg>
      <p className="text-sm text-white font-medium">{language === 'es' ? 'Por favor, espera...' : 'Please wait...'}</p>
    </div>
  );
};
