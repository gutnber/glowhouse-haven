import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import StarryBackground from "@/components/background/StarryBackground";
import { NewsSection } from "@/components/home/NewsSection";
import { NewsSlideshow } from "@/components/home/NewsSlideshow";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { InfoSections } from "@/components/home/InfoSections";
import { HeroSection } from "@/components/home/HeroSection";
import { useAuthSession } from "@/hooks/useAuthSession";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import { SEO } from "@/components/SEO";
const POSTS_PER_PAGE = 5;
const INITIAL_VISIBLE_POSTS = 1;
const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const [newsPosts, setNewsPosts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const session = useAuthSession();
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        // Fetch total count of news posts
        const {
          count
        } = await supabase.from('news_posts').select('*', {
          count: 'exact',
          head: true
        });
        if (count !== null) {
          setTotalPosts(count);
        }

        // Fetch news posts
        const {
          data: newsData
        } = await supabase.from('news_posts').select('*').order('created_at', {
          ascending: false
        }).limit(POSTS_PER_PAGE * 2);
        if (newsData) {
          setNewsPosts(newsData);
        }

        // Fetch featured properties with price_per_sqm and currency
        const {
          data: propertiesData
        } = await supabase.from('properties').select('*').not('feature_image_url', 'is', null).order('created_at', {
          ascending: false
        }).limit(3);
        if (propertiesData) {
          // Calculate price_per_sqm if not provided but area and price are available
          const processedProperties = propertiesData.map(property => {
            if (property.price && property.area && property.area > 0 && !property.price_per_sqm) {
              property.price_per_sqm = property.price / property.area;
            }
            return property;
          });
          console.log("Fetched properties:", processedProperties);
          setFeaturedProperties(processedProperties);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const loadMorePosts = async () => {
    try {
      const nextPage = currentPage + 1;
      const {
        data: newsData
      } = await supabase.from('news_posts').select('*').order('created_at', {
        ascending: false
      }).range(nextPage * POSTS_PER_PAGE, (nextPage + 1) * POSTS_PER_PAGE - 1);
      if (newsData && newsData.length > 0) {
        setNewsPosts(prev => [...prev, ...newsData]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    }
  };
  const hasMorePosts = newsPosts.length < totalPosts;
  if (isLoading) {
    return <LoadingAnimation />;
  }
  return <div className="min-h-screen flex flex-col relative">
      <SEO />
      <StarryBackground />
      <div className="relative z-10 flex-1">
        <div className="container mx-auto px-4 pb-12 space-y-16 py-[16px]">
          {/* New Hero Section */}
          <HeroSection />
          
          {/* News Slideshow */}
          <div className="pt-8">
            <NewsSlideshow newsPosts={newsPosts} />
          </div>
          
          {/* News Section */}
          <NewsSection newsPosts={newsPosts} hasMorePosts={hasMorePosts} loadMorePosts={loadMorePosts} INITIAL_VISIBLE_POSTS={INITIAL_VISIBLE_POSTS} POSTS_PER_PAGE={POSTS_PER_PAGE} />
          
          {/* Featured Properties */}
          <FeaturedProperties properties={featuredProperties} />
          
          {/* Info Sections (maintained for compatibility) */}
          <InfoSections />
        </div>
      </div>
      {/* Footer is already included in RootLayout */}
    </div>;
};
export default Index;