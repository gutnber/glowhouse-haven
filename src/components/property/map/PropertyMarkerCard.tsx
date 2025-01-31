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
    <div class="max-w-[180px] bg-white rounded shadow-sm">
      ${property.feature_image_url ? 
        `<img src="${property.feature_image_url}" alt="${property.name}" class="w-full h-16 object-cover rounded-t">` 
        : `<div class="w-full h-16 bg-gray-100 flex items-center justify-center rounded-t">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 21h18M3 7v14m18-14v14M6 11h.01M6 15h.01M6 19h.01M14 11h.01M14 15h.01M14 19h.01M10 11h.01M10 15h.01M10 19h.01M18 11h.01M18 15h.01M18 19h.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>`
      }
      <div class="p-1">
        <h3 class="text-[11px] font-medium text-gray-900 truncate leading-tight">${property.name}</h3>
        <p class="text-[9px] text-gray-500 truncate leading-tight">${property.address}</p>
        <div class="mt-0.5 flex items-center justify-between">
          <span class="text-[9px] text-gray-500">${property.bedrooms}b ${property.bathrooms}ba</span>
          <span class="text-[10px] font-medium text-yellow-500">$${property.price.toLocaleString()}</span>
        </div>
      </div>
    </div>
  `
}