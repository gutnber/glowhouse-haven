import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Building2, Bed, Bath, MapPin, ArrowRight, ChevronDown, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
import StarryBackground from "@/components/background/StarryBackground"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { useLanguage } from "@/contexts/LanguageContext"
import { LanguageToggle } from "@/components/LanguageToggle"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const POSTS_PER_PAGE = 5;
const INITIAL_VISIBLE_POSTS = 1;

const Index = () => {
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([])
  const [newsPosts, setNewsPosts] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPosts, setTotalPosts] = useState(0)
  const { t } = useLanguage()

  useEffect(() => {
    const fetchData = async () => {
      // Fetch total count of news posts
      const { count } = await supabase
        .from('news_posts')
        .select('*', { count: 'exact', head: true })
      
      if (count !== null) {
        setTotalPosts(count)
      }

      // Fetch news posts
      const { data: newsData } = await supabase
        .from('news_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(POSTS_PER_PAGE * 2)

      if (newsData) {
        setNewsPosts(newsData)
      }

      // Fetch featured properties
      const { data: propertiesData } = await supabase
        .from('properties')
        .select('*')
        .not('feature_image_url', 'is', null)
        .order('created_at', { ascending: false })
        .limit(3)

      if (propertiesData) {
        setFeaturedProperties(propertiesData)
      }
    }

    fetchData()
  }, [])

  const loadMorePosts = async () => {
    const nextPage = currentPage + 1
    const { data: newsData } = await supabase
      .from('news_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(nextPage * POSTS_PER_PAGE, (nextPage + 1) * POSTS_PER_PAGE - 1)

    if (newsData && newsData.length > 0) {
      setNewsPosts(prev => [...prev, ...newsData])
      setCurrentPage(nextPage)
    }
  }

  const isNewProperty = (createdAt: string) => {
    const propertyDate = new Date(createdAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - propertyDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7
  }

  const renderNewsPost = (post: any) => (
    <Link key={post.id} to={`/news/${post.id}`} className="block transition-all duration-300 hover:translate-y-[-2px]">
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

  const hasMorePosts = newsPosts.length < totalPosts

  return (
    <>
      <StarryBackground />
      <div className="space-y-12 relative z-10 px-4 pb-12">
        <div className="flex justify-end mb-4">
          <LanguageToggle />
        </div>
        
        {/* Welcome Section */}
        <div className="text-center space-y-6 py-16 px-8 rounded-2xl bg-gradient-to-r from-white/10 to-transparent backdrop-blur-sm border border-white/10 max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/70">
            {t('welcome')}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            {t('subscribe')}
          </p>
        </div>
        
        {/* News Section */}
        {newsPosts.length > 0 && (
          <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-semibold text-white">Latest News</h2>
              <RainbowButton asChild>
                <Link to="/news" className="flex items-center gap-2">
                  View All News
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </RainbowButton>
            </div>
            <div className="space-y-4">
              {/* First post is always visible */}
              <div className="space-y-4">
                {newsPosts.slice(0, INITIAL_VISIBLE_POSTS).map(renderNewsPost)}
              </div>
              
              {/* Remaining posts in accordion */}
              {newsPosts.length > INITIAL_VISIBLE_POSTS && (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="more-news" className="border-none">
                    <AccordionTrigger className="text-white hover:text-white/80 py-4 px-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/10 data-[state=open]:bg-white/10">
                      <div className="flex items-center gap-2">
                        <ChevronDown className="h-5 w-5 transform transition-transform duration-300" />
                        <span>Show More News</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                      <div className="space-y-4">
                        {newsPosts.slice(INITIAL_VISIBLE_POSTS, INITIAL_VISIBLE_POSTS + POSTS_PER_PAGE).map(renderNewsPost)}
                      </div>
                      <div className="space-y-4">
                        {hasMorePosts && (
                          <Button
                            variant="ghost"
                            onClick={loadMorePosts}
                            className="text-white hover:text-white/80 hover:bg-white/10 transition-all duration-300"
                          >
                            <ChevronRight className="h-5 w-4 mr-2" />
                            Load More
                          </Button>
                        )}
                        <div className="flex justify-center pt-4">
                          <Button
                            asChild
                            variant="outline"
                            className="text-white hover:text-white/80 border-white/20"
                          >
                            <Link to="/news" className="flex items-center gap-2">
                              View All News
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>
          </div>
        )}
        
        {/* Featured Properties Section */}
        {featuredProperties.length > 0 && (
          <div className="space-y-6 max-w-6xl mx-auto">
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