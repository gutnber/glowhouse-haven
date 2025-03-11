
import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star, MapPin, Bed, Bath, Home, Ruler } from "lucide-react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { TopNavigation } from "@/components/layout/TopNavigation"
import { useAuthSession } from "@/hooks/useAuthSession"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { useLanguage } from "@/contexts/LanguageContext"

const NewsPost = () => {
  const { id } = useParams()
  const session = useAuthSession();
  console.log('Fetching news post with id:', id)

  const { data: post, isLoading: isLoadingPost } = useQuery({
    queryKey: ['news_post', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_posts')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error) throw error
      return data
    }
  })

  const { data: featuredProperties, isLoading: isLoadingProperties } = useQuery({
    queryKey: ['featured_properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .not('feature_image_url', 'is', null)
        .order('created_at', { ascending: false })
        .limit(3)

      if (error) throw error
      return data
    }
  })

  const { t } = useLanguage()
  
  if (isLoadingPost || isLoadingProperties) {
    return <div className="flex items-center justify-center min-h-[200px] bg-gradient-to-br from-gray-900 via-black to-orange-900">
      <p className="text-white">Cargando...</p>
    </div>
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 bg-gradient-to-br from-gray-900 via-black to-orange-900">
        <p className="text-xl text-white">Publicación no encontrada</p>
        <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white">
          <Link to="/">Volver al Inicio</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopNavigation session={session} />
      <main className="flex-1 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 pt-16">
        <div className="max-w-7xl mx-auto p-6">
          <Button variant="outline" asChild className="mb-6 text-orange-500 border-orange-500/30 hover:bg-orange-500/20 hover:text-white">
            <Link to="/news" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a Noticias
            </Link>
          </Button>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="overflow-hidden border border-orange-500/30 shadow-xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
                {post.feature_image_url && (
                  <div className="mb-6">
                    <AspectRatio ratio={16/9}>
                      <img
                        src={post.feature_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    </AspectRatio>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-3xl text-white">{post.title}</CardTitle>
                  <p className="text-sm text-orange-500/80">
                    {new Date(post.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none text-white/90">
                    {post.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar with Featured Properties */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
                <Star className="h-5 w-5 text-orange-500" />
                Propiedades Destacadas
              </h2>
              <div className="space-y-8"> {/* Added space-y-8 to increase spacing between cards */}
                {featuredProperties?.map((property) => (
                <Link key={property.id} to={`/properties/${property.id}`}>
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white/5 backdrop-blur-md border-white/10 group">
                    <div className="relative">
                      {property.feature_image_url && (
                        <AspectRatio ratio={16/9}>
                          <img
                            src={property.feature_image_url}
                            alt={property.name}
                            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                          />
                        </AspectRatio>
                      )}
                      <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1">
                        <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                          {formatCurrency(property.price, property.currency)}
                        </div>
                        {property.price_per_sqm && property.area && (
                          <div className="bg-orange-500/80 text-white px-2 py-0.5 rounded-full text-xs font-medium shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                            {formatCurrency(property.price_per_sqm, property.currency)}/m²
                          </div>
                        )}
                      </div>
                      {property.reference_number && (
                        <Badge variant="secondary" className="absolute top-4 right-4 shadow-lg">
                          Ref: {property.reference_number}
                        </Badge>
                      )}
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg text-white group-hover:text-orange-500 transition-colors duration-300">
                        {property.name}
                      </CardTitle>
                      <div className="flex items-start gap-2 text-white/70">
                        <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                        <span className="text-sm line-clamp-2">{property.address}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        {property.bedrooms > 0 && (
                          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-gray-800/50">
                            <Bed className="h-4 w-4 text-orange-500" />
                            <span className="text-white/80">{property.bedrooms}</span>
                          </div>
                        )}
                        {property.bathrooms > 0 && (
                          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-gray-800/50">
                            <Bath className="h-4 w-4 text-orange-500" />
                            <span className="text-white/80">{property.bathrooms}</span>
                          </div>
                        )}
                        {property.build_year >= 1900 && (
                          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-gray-800/50">
                            <Home className="h-4 w-4 text-orange-500" />
                            <span className="text-white/80">{property.build_year}</span>
                          </div>
                        )}
                        {property.area && (
                          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-gray-800/50">
                            <Ruler className="h-4 w-4 text-orange-500" />
                            <span className="text-white/80 text-xs">{property.area}m²</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Removed Footer component from here */}
    </div>
  )
}

export default NewsPost
