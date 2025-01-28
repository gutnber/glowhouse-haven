import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

const POSTS_PER_PAGE = 12

export default function News() {
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
    return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">News & Updates</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {newsPosts?.map((post) => (
          <Link key={post.id} to={`/news/${post.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
              {post.feature_image_url && (
                <AspectRatio ratio={16/9}>
                  <img
                    src={post.feature_image_url}
                    alt={post.title}
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
              )}
              <CardHeader>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription>
                  {new Date(post.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">{post.content}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}