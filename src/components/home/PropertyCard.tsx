import { Link } from "react-router-dom"
import { Building2, Bed, Bath, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/LanguageContext"

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
  const { t } = useLanguage()
  
  const isNewProperty = (createdAt: string) => {
    const propertyDate = new Date(createdAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - propertyDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7
  }

  return (
    <Link key={property.id} to={`/properties/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow backdrop-blur-sm bg-white/10 border-white/20 group">
        <div className="relative">
          <AspectRatio ratio={16/9}>
            {property.feature_image_url ? (
              <img
                src={property.feature_image_url}
                alt={property.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Building2 className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </AspectRatio>
          <div className="absolute top-4 -right-8 rotate-45 bg-destructive text-destructive-foreground px-10 py-1 text-sm font-semibold shadow-lg transform group-hover:scale-110 transition-transform">
            ${property.price.toLocaleString()}
          </div>
          {property.arv && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
              ARV: ${property.arv.toLocaleString()}
            </div>
          )}
          {isNewProperty(property.created_at) && (
            <Badge className="absolute top-4 left-4 bg-yellow-500 hover:bg-yellow-600 text-black">
              New
            </Badge>
          )}
        </div>
        <CardHeader>
          <CardTitle className="text-white">{property.name}</CardTitle>
          <CardDescription className="text-white/70">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
              <span className="line-clamp-2">{property.address}</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm text-white/60">
            <div className="flex flex-col items-center gap-2">
              <Bed className="h-5.5 w-5.5" strokeWidth={1.5} stroke="url(#yellow-orange-gradient)" />
              <span>{property.bedrooms} {t('beds')}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Bath className="h-5.5 w-5.5" strokeWidth={1.5} stroke="url(#yellow-orange-gradient)" />
              <span>{property.bathrooms} {t('baths')}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Building2 className="h-5.5 w-5.5" strokeWidth={1.5} stroke="url(#yellow-orange-gradient)" />
              <span>{property.build_year}</span>
            </div>
          </div>
          {/* Add SVG gradient definition */}
          <svg width="0" height="0">
            <defs>
              <linearGradient id="yellow-orange-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
          </svg>
        </CardContent>
      </Card>
    </Link>
  )
}