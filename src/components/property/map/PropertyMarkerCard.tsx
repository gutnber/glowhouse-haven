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
    <div class="max-w-[250px] bg-black/90 rounded-lg shadow-xl border border-white/20">
      <div class="relative w-full">
        ${property.feature_image_url ? 
          `<img src="${property.feature_image_url}" alt="${property.name}" class="w-full h-32 object-cover rounded-t-lg">` 
          : `<div class="w-full h-32 bg-gray-800 rounded-t-lg flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 21h18M3 7v14m18-14v14M6 11h.01M6 15h.01M6 19h.01M14 11h.01M14 15h.01M14 19h.01M10 11h.01M10 15h.01M10 19h.01M18 11h.01M18 15h.01M18 19h.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>`
        }
        <div class="absolute top-2 right-2 bg-destructive text-white px-2 py-0.5 rounded-full text-xs font-bold">
          $${property.price.toLocaleString()}
        </div>
      </div>
      <div class="p-3">
        <h3 class="text-sm font-semibold text-white mb-1 truncate">${property.name}</h3>
        <p class="text-gray-300 text-xs mb-2 truncate">${property.address}</p>
        <div class="grid grid-cols-2 gap-2 text-xs text-gray-300">
          <div class="flex items-center gap-1">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M2 22v-5l5-5V9a5 5 0 0110 0v3l5 5v5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            ${property.bedrooms} Beds
          </div>
          <div class="flex items-center gap-1">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 6h11M9 12h11M9 18h11M5 6v.01M5 12v.01M5 18v.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            ${property.bathrooms} Baths
          </div>
        </div>
      </div>
    </div>
  `
}