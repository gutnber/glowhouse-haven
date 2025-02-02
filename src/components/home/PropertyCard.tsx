import { Link } from "react-router-dom"
import { Building2, Bed, Bath, MapPin, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { formatArea } from "@/lib/utils"

interface PropertyCardProps {
  property: {
    id: string
    name: string
    address: string
    bedrooms: number
    bathrooms: number
    build_year: number
    price: number
    arv?: number
    feature_image_url?: string
    created_at: string
  }
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const isNewProperty = (createdAt: string) => {
    const propertyDate = new Date(createdAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - propertyDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7
  }

  return (
    <Link key={property.id} to={`/properties/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white group">
        <div className="relative">
          <AspectRatio ratio={4/3}>
            {property.feature_image_url ? (
              <img
                src={property.feature_image_url}
                alt={property.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Building2 className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </AspectRatio>
          <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-1.5 rounded-full font-semibold shadow-lg transform -rotate-2">
            ${property.price.toLocaleString()}
          </div>
          {property.arv && (
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
              ARV: ${property.arv.toLocaleString()}
            </div>
          )}
          {isNewProperty(property.created_at) && (
            <Badge className="absolute top-4 left-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              New
            </Badge>
          )}
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-orange-600">{property.name}</CardTitle>
          <CardDescription className="text-gray-600">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
              <span className="line-clamp-2">{property.address}</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
              <Bed className="h-5 w-5 text-orange-500 mb-1" />
              <span className="text-sm font-medium text-gray-600">{property.bedrooms} Beds</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
              <Bath className="h-5 w-5 text-orange-500 mb-1" />
              <span className="text-sm font-medium text-gray-600">{property.bathrooms} Baths</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
              <Building2 className="h-5 w-5 text-orange-500 mb-1" />
              <span className="text-sm font-medium text-gray-600">{formatArea(1290)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}