import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ArrowRight } from "lucide-react"

interface NewsCardProps {
  post: {
    id: string
    title: string
    content: string
    feature_image_url?: string | null
    created_at: string
  }
}

export const NewsCard = ({ post }: NewsCardProps) => {
  return (
    <Link to={`/news/${post.id}`} className="block transition-all duration-300 hover:translate-y-[-2px]">
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-white/10 border-white/20 group">
        <div className="grid lg:grid-cols-3 gap-6">
          {post.feature_image_url && (
            <div className="lg:col-span-1">
              <AspectRatio ratio={16/9}>
                <img
                  src={post.feature_image_url}
                  alt={post.title}
                  className="object-cover w-full h-full rounded-lg transform transition-transform duration-300 group-hover:scale-105"
                />
              </AspectRatio>
            </div>
          )}
          <div className="lg:col-span-2 p-6">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-2xl group-hover:text-blue-400 transition-colors duration-300">
                  {post.title}
                </CardTitle>
                <ArrowRight className="h-5 w-5 text-white/70 transform transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-400" />
              </div>
              <CardDescription className="text-white/70 mt-2">
                {new Date(post.created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-white/80 line-clamp-3">{post.content}</p>
            </CardContent>
          </div>
        </div>
      </Card>
    </Link>
  )
}