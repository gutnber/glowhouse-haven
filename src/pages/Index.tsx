import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Building2, Bed, Bath, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import StarryBackground from "@/components/background/StarryBackground"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"
import { LanguageToggle } from "@/components/LanguageToggle"

const Index = () => {
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([])
  const { t } = useLanguage()

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .not('feature_image_url', 'is', null)
        .order('created_at', { ascending: false })
        .limit(3)

      if (!error && data) {
        setFeaturedProperties(data)
      }
    }

    fetchFeaturedProperties()
  }, [])

  const isNewProperty = (createdAt: string) => {
    const propertyDate = new Date(createdAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - propertyDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7
  }

  return (
    <>
      <StarryBackground />
      <div className="space-y-8 relative z-10">
        <div className="flex justify-end mb-4">
          <LanguageToggle />
        </div>
        <div className="text-center space-y-4 py-12 rounded-lg bg-gradient-to-r from-white/10 to-transparent backdrop-blur-sm border border-white/10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/70">
            {t('welcome')}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {t('subscribe')}
          </p>
        </div>
        
        {featuredProperties.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-center text-white">{t('featuredProperties')}</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredProperties.map((property) => (
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
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          <span>{property.bedrooms} {t('beds')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4" />
                          <span>{property.bathrooms} {t('baths')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          <span>{property.build_year}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="text-center">
              <Button asChild size="lg" className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                <Link to="/properties">{t('viewAllProperties')}</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Index