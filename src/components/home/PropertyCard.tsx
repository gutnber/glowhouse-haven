import { Link } from "react-router-dom";
import { Building2, Bed, Bath, MapPin, Home, Ruler } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  property: {
    id: string;
    name: string;
    address: string;
    bedrooms: number;
    bathrooms: number;
    build_year: number;
    price: number;
    currency?: string;
    price_per_sqm?: number;
    arv?: number;
    area?: number;
    width?: number;
    height?: number;
    heated_area?: number;
    reference_number?: string;
    feature_image_url?: string;
    property_type?: string;
    features?: string[];
    created_at: string;
  };
}

export const PropertyCard = ({
  property
}: PropertyCardProps) => {
  const isNewProperty = (createdAt: string) => {
    const propertyDate = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - propertyDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };
  
  const showLivingSpaceIcons = property.property_type !== 'vacantLand';
  const currencySymbol = property.currency === "MXN" ? "MX$" : "$";
  
  // Format dimensions if available
  const dimensions = property.width && property.height 
    ? `${property.width}×${property.height}m` 
    : null;
  
  return <Link key={property.id} to={`/properties/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white/5 backdrop-blur-md border-white/10 group w-[320px]">
        <div className="relative">
          <AspectRatio ratio={4 / 3}>
            {property.feature_image_url ? <img src={property.feature_image_url} alt={property.name} className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110" /> : <div className="w-full h-full bg-orange-500/10 flex items-center justify-center">
                <Building2 className="h-12 w-12 text-orange-500/50" />
              </div>}
          </AspectRatio>
          <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1">
            {property.price_per_sqm && property.area && (
              <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                {currencySymbol}{property.price_per_sqm.toLocaleString()}/m²
              </div>
            )}
            <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg transform transition-transform duration-300 group-hover:scale-110">
              {currencySymbol}{property.price.toLocaleString()} 
              <span className="ml-1 text-xs font-normal">{property.currency || "USD"}</span>
            </div>
          </div>
          {isNewProperty(property.created_at) && <Badge className="absolute top-4 left-4 bg-white/90 text-orange-500 shadow-lg">
              NEW
            </Badge>}
          {property.reference_number && <Badge variant="secondary" className="absolute top-4 right-4 shadow-lg">
              Ref: {property.reference_number}
            </Badge>}
        </div>
        <CardHeader className="p-6">
          <h3 className="text-xl font-bold text-white group-hover:text-orange-500 transition-colors duration-300 line-clamp-1">
            {property.name}
          </h3>
          <div className="flex items-start gap-2 text-white/70">
            <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
            <span className="text-sm line-clamp-2">{property.address}</span>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="grid grid-cols-4 gap-2 text-sm">
            {showLivingSpaceIcons ? <>
                <div className="flex flex-col items-center gap-2 p-2 rounded-lg bg-white/5">
                  <Bed className="h-5 w-5 text-orange-500" />
                  <span className="text-white/70">{property.bedrooms}</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-2 rounded-lg bg-white/5">
                  <Bath className="h-5 w-5 text-orange-500" />
                  <span className="text-white/70">{property.bathrooms}</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-2 rounded-lg bg-white/5">
                  <Home className="h-5 w-5 text-orange-500" />
                  <span className="text-white/70">{property.build_year}</span>
                </div>
              </> :
          // Show land features for vacant land with orange-grey gradient backgrounds
          property.features?.slice(0, 3).map((feature, index) => <div key={index} className="flex items-center justify-center p-2 rounded-lg text-xs font-medium text-white" style={{
            background: `linear-gradient(135deg, #F97316 0%, #8E9196 100%)`,
            minHeight: '52px'
          }}>
                  <span className="text-center line-clamp-1 font-thin text-xs">{feature}</span>
                </div>)}
            {dimensions ? (
              <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/5 min-w-[70px]">
                <Ruler className="h-5 w-5 text-orange-500" />
                <span className="text-white/70 text-xs whitespace-nowrap">{dimensions}</span>
              </div>
            ) : property.area && (
              <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/5 min-w-[70px]">
                <Ruler className="h-5 w-5 text-orange-500" />
                <span className="text-white/70 text-xs whitespace-nowrap">{property.area}m²</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>;
};
