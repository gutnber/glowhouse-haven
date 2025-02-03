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
    <div class="w-[150px] [&_*]:!m-0 [&_*]:!p-0 overflow-hidden">
      ${property.feature_image_url ? 
        `<div class="relative">
          <img 
            src="${property.feature_image_url}" 
            alt="${property.name}" 
            class="w-full h-24 object-cover"
          />
          <div class="absolute top-2 right-2">
            <span class="bg-[#F97316] text-white text-xs px-2 py-1 rounded-sm">
              $${property.price.toLocaleString()}
            </span>
          </div>
        </div>` 
        : `<div class="w-full h-24 bg-gray-100 flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 21h18M3 7v14m18-14v14M6 11h.01M6 15h.01M6 19h.01M14 11h.01M14 15h.01M14 19h.01M10 11h.01M10 15h.01M10 19h.01M18 11h.01M18 15h.01M18 19h.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>`
      }
      <div class="bg-white text-sm p-2">
        <h3 class="font-medium text-gray-900 truncate">${property.name}</h3>
        <p class="text-gray-500 text-xs truncate mt-0.5">${property.address}</p>
      </div>
    </div>
  `
}