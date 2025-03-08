
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { PropertyCard } from "./PropertyCard"
import { useLanguage } from "@/contexts/LanguageContext"
import { FeaturedPropertyCard } from "./FeaturedPropertyCard"

interface FeaturedPropertiesProps {
  properties: any[]
}

export const FeaturedProperties = ({ properties }: FeaturedPropertiesProps) => {
  const { t } = useLanguage()
  
  if (properties.length === 0) return null

  // Get the first property for hero display if available
  const featuredProperty = properties[0]
  const remainingProperties = properties.slice(1)

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4">
      <h2 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600">
        {t('featuredProperties')}
      </h2>
      
      {/* Display the first property with FeaturedPropertyCard */}
      {featuredProperty && (
        <FeaturedPropertyCard property={featuredProperty} />
      )}
      
      {/* Display remaining properties in a grid */}
      {remainingProperties.length > 0 && (
        <div className="flex gap-8 justify-center flex-wrap">
          {remainingProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
      
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
