import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Search, Building2, Users, DollarSign, MapPin, Home, Trees } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/contexts/LanguageContext"

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const { t } = useLanguage()
  
  const { data: properties } = useQuery({
    queryKey: ['featured-properties'],
    queryFn: async () => {
      const { data } = await supabase
        .from('properties')
        .select('*')
        .limit(6)
        .order('created_at', { ascending: false })
      return data || []
    }
  })

  const categories = [
    { icon: <Home className="w-6 h-6" />, label: "Single Family" },
    { icon: <Building2 className="w-6 h-6" />, label: "Apartments" },
    { icon: <Trees className="w-6 h-6" />, label: "Land" },
    { icon: <MapPin className="w-6 h-6" />, label: "Location" },
    { icon: <Users className="w-6 h-6" />, label: "Agents" },
    { icon: <DollarSign className="w-6 h-6" />, label: "Financing" },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(/lovable-uploads/99a018b1-9fb2-45aa-b03e-12bb70acd5a9.png)',
            filter: 'brightness(0.7)'
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h1 className="text-5xl font-bold mb-6">Search Luxury Homes</h1>
          <div className="flex gap-2 bg-white rounded-lg p-2">
            <Input
              type="text"
              placeholder="Enter an address, neighborhood, city, or ZIP code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button className="bg-[#F97316] hover:bg-[#F97316]/90">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8">Try Searching For</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Card 
                key={index}
                className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex flex-col items-center gap-2">
                  {category.icon}
                  <span>{category.label}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8">Today's Luxury Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties?.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-[4/3]">
                  {property.feature_image_url ? (
                    <img
                      src={property.feature_image_url}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-[#F97316] text-white px-3 py-1 rounded-full">
                    ${property.price.toLocaleString()}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{property.name}</h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{property.address}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Home className="w-4 h-4" />
                      <span>{property.bedrooms} beds</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Home className="w-4 h-4" />
                      <span>{property.bathrooms} baths</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Home className="w-4 h-4" />
                      <span>{property.build_year}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Index