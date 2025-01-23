import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Building2, Bed, Bath, DollarSign } from "lucide-react"
import { Link } from "react-router-dom"
import StarryBackground from "@/components/background/StarryBackground"

const Index = () => {
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([])

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

  return (
    <>
      <StarryBackground />
      <div className="space-y-8 relative z-10">
        <div className="text-center space-y-4 py-12 rounded-lg bg-gradient-to-r from-white/10 to-transparent backdrop-blur-sm border border-white/10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/70">
            Welcome to our investors nest in florida
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Please subscribe to get the latest news and hottest deals
          </p>
        </div>
        
        {featuredProperties.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-center text-white">Featured Properties</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredProperties.map((property) => (
                <Link key={property.id} to={`/properties/${property.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow backdrop-blur-sm bg-white/10 border-white/20">
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
                    <CardHeader>
                      <CardTitle className="text-white">{property.name}</CardTitle>
                      <CardDescription className="text-white/70">{property.address}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-white/60">
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          <span>{property.bedrooms}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4" />
                          <span>{property.bathrooms}</span>
                        </div>
                        <div className="flex items-center gap-1 font-semibold text-white">
                          <DollarSign className="h-4 w-4" />
                          <span>{property.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="text-center">
              <Button asChild size="lg" className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                <Link to="/properties">View All Properties</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Index