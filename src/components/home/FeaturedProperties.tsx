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
    <div className="space-y-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-semibold text-center text-white">{t('featuredProperties')}</h2>
      <div className="flex gap-6 justify-center flex-wrap">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
      <div className="text-center">
        <Button asChild size="lg" className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
          <Link to="/properties">{t('viewAllProperties')}</Link>
        </Button>
      </div>
    </div>
  )
}