import { Link } from "react-router-dom"
import { ArrowRight, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NewsCard } from "./NewsCard"
import { useLanguage } from "@/contexts/LanguageContext"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface NewsSectionProps {
  newsPosts: any[]
  hasMorePosts: boolean
  loadMorePosts: () => Promise<void>
  INITIAL_VISIBLE_POSTS: number
  POSTS_PER_PAGE: number
}

export const NewsSection = ({ 
  newsPosts, 
  hasMorePosts, 
  loadMorePosts,
  INITIAL_VISIBLE_POSTS,
  POSTS_PER_PAGE
}: NewsSectionProps) => {
  const { t } = useLanguage()
  
  if (newsPosts.length === 0) return null

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-white">{t('latestNews')}</h2>
        <Button 
          asChild
          className="relative border border-white/20 bg-black text-white overflow-hidden [--duration:4s] before:absolute before:inset-0 before:-translate-x-full before:animate-[border-beam_var(--duration)_ease_infinite] before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] after:absolute after:inset-0 after:translate-x-full after:animate-[border-beam_var(--duration)_ease_infinite] after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)]"
        >
          <Link to="/news" className="flex items-center gap-2">
            {t('viewAllNews')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-4">
          {newsPosts.slice(0, INITIAL_VISIBLE_POSTS).map(post => (
            <NewsCard key={post.id} post={post} />
          ))}
        </div>
        
        {newsPosts.length > INITIAL_VISIBLE_POSTS && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="more-news" className="border-none">
              <AccordionTrigger className="text-white hover:text-white/80 py-4 px-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/10 data-[state=open]:bg-white/10">
                <div className="flex items-center gap-2">
                  <ChevronDown className="h-5 w-5 transform transition-transform duration-300" />
                  <span>{t('showMoreNews')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <div className="space-y-4">
                  {newsPosts.slice(INITIAL_VISIBLE_POSTS, INITIAL_VISIBLE_POSTS + POSTS_PER_PAGE).map(post => (
                    <NewsCard key={post.id} post={post} />
                  ))}
                </div>
                <div className="space-y-4">
                  {hasMorePosts && (
                    <Button
                      variant="ghost"
                      onClick={loadMorePosts}
                      className="text-white hover:text-white/80 hover:bg-white/10 transition-all duration-300"
                    >
                      <ChevronRight className="h-5 w-4 mr-2" />
                      {t('loadMore')}
                    </Button>
                  )}
                  <div className="flex justify-center pt-4">
                    <Button 
                      asChild
                      className="relative border border-white/20 bg-black text-white overflow-hidden [--duration:4s] before:absolute before:inset-0 before:-translate-x-full before:animate-[border-beam_var(--duration)_ease_infinite] before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] after:absolute after:inset-0 after:translate-x-full after:animate-[border-beam_var(--duration)_ease_infinite] after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)]"
                    >
                      <Link to="/news" className="flex items-center gap-2">
                        {t('viewAllNews')}
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
  )
}