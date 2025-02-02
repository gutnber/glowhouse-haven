import { formatArea } from "@/lib/utils"

interface PropertyMarkerCardProps {
  property: {
    name: string;
    address: string;
    bedrooms: number;
    bathrooms: number;
    price: number;
    feature_image_url?: string;
  };
}

export const PropertyMarkerCard = ({ property }: PropertyMarkerCardProps) => {
  return `
    <div class="max-w-[280px] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
      ${property.feature_image_url ? 
        `<div class="relative">
          <img 
            src="${property.feature_image_url}" 
            alt="${property.name}" 
            class="w-full h-32 object-cover"
          />
          <div class="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 rounded-bl-lg font-semibold">
            New
          </div>
          <div class="absolute bottom-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
            $${property.price.toLocaleString()}
          </div>
        </div>` 
        : `<div class="w-full h-32 bg-gray-100 flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 21h18M3 7v14m18-14v14M6 11h.01M6 15h.01M6 19h.01M14 11h.01M14 15h.01M14 19h.01M10 11h.01M10 15h.01M10 19h.01M18 11h.01M18 15h.01M18 19h.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>`
      }
      <div class="p-4">
        <h3 class="text-base font-semibold text-orange-600 leading-tight mb-2">${property.name}</h3>
        <p class="text-sm text-gray-600 leading-tight mb-4">${property.address}</p>
        <div class="grid grid-cols-3 gap-2">
          <div class="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
            <svg class="w-5 h-5 text-orange-500 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M2 22h20M2 11h20M15 5V2M9 5V2M4 5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-xs font-medium">${property.bedrooms} Beds</span>
          </div>
          <div class="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
            <svg class="w-5 h-5 text-orange-500 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 4h6a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm9 11v-3a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v3m-3 0v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2M3 15h18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-xs font-medium">${property.bathrooms} Baths</span>
          </div>
          <div class="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
            <svg class="w-5 h-5 text-orange-500 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 21v-7M4 14l8-4m-8 4l8 4m-8-4V7l8-4l8 4v7M20 14l-8-4m8 4l-8 4m8-4V7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-xs font-medium">1,290m²</span>
          </div>
        </div>
      </div>
    </div>
  `
}