import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"
import { LanguageToggle } from "@/components/LanguageToggle"
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination"
import { useQuery } from "@tanstack/react-query"

const POSTS_PER_PAGE = 5

const Index = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { t } = useLanguage()

  // Fetch news posts with pagination
  const { data: newsData } = useQuery({
    queryKey: ['news-posts', currentPage],
    queryFn: async () => {
      console.log('Fetching news posts for page:', currentPage)
      
      // First get total count
      const { count } = await supabase
        .from('news_posts')
        .select('*', { count: 'exact', head: true })
      
      // Then get paginated data
      const { data: posts, error } = await supabase
        .from('news_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * POSTS_PER_PAGE, (currentPage * POSTS_PER_PAGE) - 1)

      if (error) {
        console.error('Error fetching news posts:', error)
        throw error
      }

      return {
        posts: posts || [],
        totalCount: count || 0
      }
    }
  })

  // Fetch featured properties
  const { data: featuredProperties } = useQuery({
    queryKey: ['featured-properties'],
    queryFn: async () => {
      console.log('Fetching featured properties')
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3)

      if (error) {
        console.error('Error fetching properties:', error)
        throw error
      }

      return data || []
    }
  })

  const isNewProperty = (createdAt: string) => {
    const propertyDate = new Date(createdAt)
    const currentDate = new Date()
    const differenceInDays = Math.floor(
      (currentDate.getTime() - propertyDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    return differenceInDays <= 7
  }

  const totalPages = Math.ceil((newsData?.totalCount || 0) / POSTS_PER_PAGE)

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">{t("welcome")}</h1>
        <LanguageToggle />
      </div>

      {featuredProperties && featuredProperties.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">{t("featured_properties")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <Link key={property.id} to={`/properties/${property.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    {property.feature_image_url ? (
                      <img
                        src={property.feature_image_url}
                        alt={property.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        No image
                      </div>
                    )}
                    {isNewProperty(property.created_at) && (
                      <Badge className="absolute top-2 right-2">New</Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{property.name}</h3>
                    <p className="text-muted-foreground">{property.address}</p>
                    <p className="font-semibold mt-2">${property.price.toLocaleString()}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {newsData?.posts && newsData.posts.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">{t("latest_news")}</h2>
          <div className="grid grid-cols-1 gap-6">
            {newsData.posts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <Link to={`/news/${post.id}`} className="grid md:grid-cols-3 gap-6">
                  <div className="aspect-video relative">
                    {post.feature_image_url ? (
                      <img
                        src={post.feature_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-4 md:col-span-2">
                    <h3 className="font-semibold text-xl mb-2">{post.title}</h3>
                    <p className="text-muted-foreground mb-4">{post.content}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(post.created_at), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  )
}

export default Index