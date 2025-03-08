
import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star } from "lucide-react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { TopNavigation } from "@/components/layout/TopNavigation"
import { useAuthSession } from "@/hooks/useAuthSession"

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

  if (isLoadingPost || isLoadingProperties) {
    return <div className="flex items-center justify-center min-h-[200px]">Loading...</div>
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-xl">Post not found</p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopNavigation session={session} />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto p-6">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              <Card>
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
                  <CardTitle className="text-3xl">{post.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {post.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar with Featured Properties */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Featured Properties
              </h2>
              {featuredProperties?.map((property) => (
                <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Link to={`/properties/${property.id}`}>
                    {property.feature_image_url && (
                      <AspectRatio ratio={16/9}>
                        <img
                          src={property.feature_image_url}
                          alt={property.name}
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg">{property.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">${property.price.toLocaleString()}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{property.address}</p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      {/* Removed Footer component from here */}
    </div>
  )
}

export default NewsPost
