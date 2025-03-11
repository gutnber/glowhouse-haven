import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ArrowLeft, Star, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { TopNavigation } from "@/components/layout/TopNavigation"
import { useAuthSession } from "@/hooks/useAuthSession"
import { useLanguage } from "@/contexts/LanguageContext"
import { LoadingAnimation } from "@/components/ui/loading-animation"

const POSTS_PER_PAGE = 12

export default function News() {
  const session = useAuthSession();
  const { t } = useLanguage();
  
  const { data: newsPosts, isLoading } = useQuery({
    queryKey: ['news_posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    }
  })

  if (isLoading) {
    return <LoadingAnimation />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopNavigation session={session} />
      <main className="flex-1 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 pt-16">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          <div className="flex items-center justify-between">
            <Button variant="outline" asChild className="text-orange-500 border-orange-500/30 hover:bg-orange-500/20 hover:text-white">
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver al Inicio
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Star className="h-6 w-6 text-orange-500" />
              Noticias y Actualizaciones
            </h1>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {newsPosts?.map((post) => (
              <Link key={post.id} to={`/news/${post.id}`} className="block transition-all duration-300 hover:translate-y-[-4px]">
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white/5 backdrop-blur-md border-white/10 group h-full">
                  {post.feature_image_url && (
                    <div className="relative">
                      <AspectRatio ratio={16/9}>
                        <img
                          src={post.feature_image_url}
                          alt={post.title}
                          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                        />
                      </AspectRatio>
                    </div>
                  )}
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl text-white group-hover:text-orange-500 transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </CardTitle>
                      <ArrowRight className="h-5 w-5 text-white/70 transform transition-all duration-300 group-hover:translate-x-2 group-hover:text-orange-500" />
                    </div>
                    <CardDescription className="text-orange-500/80 mt-2">
                      {new Date(post.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <p className="text-white/80 line-clamp-3">{post.content}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
