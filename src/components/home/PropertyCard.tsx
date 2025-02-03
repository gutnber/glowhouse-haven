import { Link } from "react-router-dom"
import { Building2, Bed, Bath, MapPin, Home } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"

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
      <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-white border-white/20 group w-[300px]">
        <div className="relative">
          <AspectRatio ratio={4/3}>
            {property.feature_image_url ? (
              <img
                src={property.feature_image_url}
                alt={property.name}
                className="object-cover w-full h-full rounded-t-lg"
              />
            ) : (
              <div className="w-full h-full bg-secondary flex items-center justify-center rounded-t-lg">
                <Building2 className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </AspectRatio>
          <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            ${property.price.toLocaleString()}
          </div>
          {isNewProperty(property.created_at) && (
            <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
              NEW
            </Badge>
          )}
        </div>
        <CardHeader className="p-4">
          <h3 className="text-lg font-bold text-card-foreground line-clamp-1">{property.name}</h3>
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
            <span className="text-sm line-clamp-2">{property.address}</span>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col items-center gap-1">
              <Bed className="h-5 w-5" strokeWidth={1.5} />
              <span className="text-muted-foreground">{property.bedrooms}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Bath className="h-5 w-5" strokeWidth={1.5} />
              <span className="text-muted-foreground">{property.bathrooms}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Home className="h-5 w-5" strokeWidth={1.5} />
              <span className="text-muted-foreground">{property.build_year}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}