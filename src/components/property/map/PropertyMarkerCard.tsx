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
    <div class="w-[150px] [&_*]:!m-0 [&_*]:!p-0">
      ${property.feature_image_url ? 
        `<div class="relative">
          <img 
            src="${property.feature_image_url}" 
            alt="${property.name}" 
            class="w-full h-24 object-cover"
          />
          <div class="absolute top-0 right-0">
            <span class="bg-[#F97316] text-white text-[10px] leading-none px-1">
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
      <div class="bg-[#1A1F2C] text-[10px] leading-none">
        <h3 class="text-white truncate">${property.name}</h3>
        <p class="text-gray-400 truncate">${property.address}</p>
        <div class="text-gray-400">${property.bedrooms}b ${property.bathrooms}ba</div>
      </div>
    </div>
  `
}