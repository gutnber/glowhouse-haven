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
    <div class="w-[150px] bg-white rounded-lg shadow-lg overflow-hidden">
      ${property.feature_image_url ? 
        `<div class="w-full h-24 relative overflow-hidden">
          <img 
            src="${property.feature_image_url}" 
            alt="${property.name}" 
            class="w-full h-full object-cover"
          />
          <div class="absolute top-0 right-0 bg-[#F97316] text-white px-2 py-0.5 text-xs font-semibold">
            $${property.price.toLocaleString()}
          </div>
        </div>` 
        : `<div class="w-full h-24 bg-gray-100 flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 21h18M3 7v14m18-14v14M6 11h.01M6 15h.01M6 19h.01M14 11h.01M14 15h.01M14 19h.01M10 11h.01M10 15h.01M10 19h.01M18 11h.01M18 15h.01M18 19h.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>`
      }
      <div class="p-2">
        <h3 class="text-sm font-semibold text-[#1A1F2C] truncate">${property.name}</h3>
        <p class="text-xs text-[#8E9196] truncate">${property.address}</p>
        <div class="flex items-center justify-between mt-1">
          <span class="text-xs text-[#8E9196]">${property.bedrooms}b ${property.bathrooms}ba</span>
        </div>
      </div>
    </div>
  `
}