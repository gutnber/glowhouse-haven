
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { PropertyCard } from "./PropertyCard"
import { useLanguage } from "@/contexts/LanguageContext"
import { ArrowRight } from "lucide-react"

interface FeaturedPropertiesProps {
  properties: any[]
}

export const FeaturedProperties = ({ properties }: FeaturedPropertiesProps) => {
  const { t, language } = useLanguage()
  
  if (properties.length === 0) return null

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4">
      {/* Section heading */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white inline-block border-b-4 border-orange-500 pb-2">
          {t('featuredProperties')}
        </h2>
        <p className="mt-4 text-white/70 max-w-2xl mx-auto">
          {language === 'es' 
            ? 'Descubre nuestras propiedades destacadas seleccionadas por su ubicación premium y características excepcionales.'
            : 'Discover our featured properties selected for their premium location and exceptional features.'}
        </p>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
      
      {/* CTA Button */}
      <div className="text-center pt-4">
        <Button 
          asChild 
          size="lg" 
          className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-8 group"
        >
          <Link to="/properties" className="flex items-center gap-2">
            {t('viewAllProperties')}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
