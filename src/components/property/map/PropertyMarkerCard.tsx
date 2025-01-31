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
    <div class="max-w-[200px]">
      ${property.feature_image_url ? 
        `<img src="${property.feature_image_url}" alt="${property.name}" class="w-full h-20 object-cover">` 
        : `<div class="w-full h-20 bg-gray-800 flex items-center justify-center">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 21h18M3 7v14m18-14v14M6 11h.01M6 15h.01M6 19h.01M14 11h.01M14 15h.01M14 19h.01M10 11h.01M10 15h.01M10 19h.01M18 11h.01M18 15h.01M18 19h.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>`
      }
      <div class="p-1">
        <h3 class="text-xs font-medium text-white truncate">${property.name}</h3>
        <p class="text-[10px] text-gray-300 truncate">${property.address}</p>
        <div class="mt-0.5 flex items-center justify-between text-[10px] text-gray-300">
          <span>${property.bedrooms}b ${property.bathrooms}ba</span>
          <span class="font-medium text-yellow-500">$${property.price.toLocaleString()}</span>
        </div>
      </div>
    </div>
  `
}