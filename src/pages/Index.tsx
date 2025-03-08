import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import StarryBackground from "@/components/background/StarryBackground";
import { WelcomeSection } from "@/components/home/WelcomeSection";
import { NewsSection } from "@/components/home/NewsSection";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
const POSTS_PER_PAGE = 5;
const INITIAL_VISIBLE_POSTS = 1;
const Index = () => {
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const [newsPosts, setNewsPosts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  useEffect(() => {
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

        // Fetch featured properties
        const {
          data: propertiesData
        } = await supabase.from('properties').select('*').not('feature_image_url', 'is', null).order('created_at', {
          ascending: false
        }).limit(3);
        if (propertiesData) {
          setFeaturedProperties(propertiesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
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
  return <div className="min-h-screen relative pointer-events-auto">
      <StarryBackground />
      <div className="relative z-10 pointer-events-auto">
        <div className="container mx-auto px-4 pb-12 space-y-12 my-[71px]">
          <WelcomeSection />
          <NewsSection newsPosts={newsPosts} hasMorePosts={hasMorePosts} loadMorePosts={loadMorePosts} INITIAL_VISIBLE_POSTS={INITIAL_VISIBLE_POSTS} POSTS_PER_PAGE={POSTS_PER_PAGE} />
          <FeaturedProperties properties={featuredProperties} />
        </div>
      </div>
    </div>;
};
export default Index;