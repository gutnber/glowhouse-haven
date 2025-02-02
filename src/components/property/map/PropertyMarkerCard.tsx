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
    <div class="max-w-[280px] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-white/20">
      ${property.feature_image_url ? 
        `<div class="w-full h-32 relative overflow-hidden">
          <img 
            src="${property.feature_image_url}" 
            alt="${property.name}" 
            class="w-full h-full object-cover"
          />
        </div>` 
        : `<div class="w-full h-32 bg-gray-100 flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 21h18M3 7v14m18-14v14M6 11h.01M6 15h.01M6 19h.01M14 11h.01M14 15h.01M14 19h.01M10 11h.01M10 15h.01M10 19h.01M18 11h.01M18 15h.01M18 19h.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>`
      }
      <div class="p-4">
        <h3 class="text-base font-semibold text-gray-900 leading-tight mb-1">${property.name}</h3>
        <p class="text-sm text-gray-600 leading-tight mb-3">${property.address}</p>
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-500">${property.bedrooms}b ${property.bathrooms}ba</span>
          <span class="text-sm font-semibold text-yellow-500">$${property.price.toLocaleString()}</span>
        </div>
      </div>
    </div>
  `
}