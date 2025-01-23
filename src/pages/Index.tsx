import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Building2, Bed, Bath, DollarSign } from "lucide-react"
import { Link } from "react-router-dom"

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
    <div className="space-y-8">
      <div className="text-center space-y-4 py-12 bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-lg">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Welcome to our investors nest in florida
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Please subscribe to get the latest news and hottest deals
        </p>
      </div>
      
      {featuredProperties.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-center">Featured Properties</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProperties.map((property) => (
              <Link key={property.id} to={`/properties/${property.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
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
                    <CardTitle>{property.name}</CardTitle>
                    <CardDescription>{property.address}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-primary">
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
            <Button asChild size="lg">
              <Link to="/properties">View All Properties</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Index