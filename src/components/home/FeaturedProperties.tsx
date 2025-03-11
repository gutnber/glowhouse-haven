
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { PropertyCard } from "./PropertyCard"
import { useLanguage } from "@/contexts/LanguageContext"

interface FeaturedPropertiesProps {
  properties: any[]
}

export const FeaturedProperties = ({ properties }: FeaturedPropertiesProps) => {
  const { t } = useLanguage()
  
  if (properties.length === 0) return null

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4">
      <h2 className="text-4xl font-bold text-center text-white">
        <span className="border-b-4 border-orange-500 pb-1">{t('featuredProperties')}</span>
      </h2>
      <div className="flex gap-8 justify-center flex-wrap">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
      <div className="text-center">
        <Button 
          asChild 
          size="lg" 
          className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Link to="/properties">{t('viewAllProperties')}</Link>
        </Button>
      </div>
    </div>
  )
}
