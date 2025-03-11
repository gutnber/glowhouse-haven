import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'

interface NewsPost {
  id: string
  title: string
  content: string
  feature_image_url?: string | null
  created_at: string
}

interface NewsSlideshowProps {
  newsPosts: NewsPost[]
}

export const NewsSlideshow = ({ newsPosts }: NewsSlideshowProps) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const { t } = useLanguage()
  
  // Only show the slideshow if we have at least one post
  const slidePosts = newsPosts.slice(0, 3)
  
  // Auto-advance slides
  useEffect(() => {
    if (slidePosts.length <= 1) return
    
    const interval = setInterval(() => {
      nextSlide()
    }, 6000)
    
    return () => clearInterval(interval)
  }, [currentSlide, slidePosts.length])
  
  const nextSlide = () => {
    if (isAnimating || slidePosts.length <= 1) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev === slidePosts.length - 1 ? 0 : prev + 1))
    setTimeout(() => setIsAnimating(false), 500) // Match transition duration
  }
  
  const prevSlide = () => {
    if (isAnimating || slidePosts.length <= 1) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev === 0 ? slidePosts.length - 1 : prev - 1))
    setTimeout(() => setIsAnimating(false), 500) // Match transition duration
  }
  
  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return
    setIsAnimating(true)
    setCurrentSlide(index)
    setTimeout(() => setIsAnimating(false), 500) // Match transition duration
  }
  
  if (slidePosts.length === 0) return null
  
  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-3xl">
      {/* Slides */}
      {slidePosts.map((post, index) => (
        <div 
          key={post.id}
          className={`absolute inset-0 w-full h-full transition-all duration-500 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          {/* Background image with gradient overlay */}
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={post.feature_image_url || '/placeholder.svg'} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          </div>
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center">
                <span className="text-orange-400 text-sm font-medium bg-orange-400/10 px-3 py-1 rounded-full">
                  {new Date(post.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 line-clamp-2">
                {post.title}
              </h2>
              <p className="text-white/80 mb-6 line-clamp-2 md:line-clamp-3">
                {post.content}
              </p>
              <Button 
                asChild
                className="relative border border-white/20 bg-black text-white overflow-hidden [--duration:4s] before:absolute before:inset-0 before:-translate-x-full before:animate-[border-beam_var(--duration)_ease_infinite] before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] after:absolute after:inset-0 after:translate-x-full after:animate-[border-beam_var(--duration)_ease_infinite] after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)]"
              >
                <Link to={`/news/${post.id}`} className="flex items-center gap-2">
                  {t('readMore')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation arrows */}
      {slidePosts.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
      
      {/* Slide indicators */}
      {slidePosts.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {slidePosts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-orange-500 w-8' : 'bg-white/50 hover:bg-white/80'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* View all news link */}
      <div className="absolute top-6 right-6 z-20">
        <Button 
          asChild
          variant="outline"
          className="bg-black/50 hover:bg-black/70 text-white border-white/20 hover:border-white/40 transition-all duration-300"
        >
          <Link to="/news" className="flex items-center gap-2">
            {t('viewAllNews')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}