import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PropertyCard } from "@/components/home/PropertyCard";
import { PropertiesMap } from "@/components/property/PropertiesMap";
import { Button } from "@/components/ui/button";
import { Plus, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useLanguage } from "@/contexts/LanguageContext";
import { PropertyTypeSelect } from "@/components/property/PropertyTypeSelect";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { useAuthSession } from "@/hooks/useAuthSession";
import { LoadingAnimation } from "@/components/ui/loading-animation";
const Properties = () => {
  const {
    isAdmin
  } = useIsAdmin();
  const {
    t
  } = useLanguage();
  const [propertyType, setPropertyType] = useState("all");
  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();
  const session = useAuthSession();
  const {
    data: properties = [],
    isLoading
  } = useQuery({
    queryKey: ['properties', propertyType],
    queryFn: async () => {
      console.log('Fetching properties with type:', propertyType);
      let query = supabase.from('properties').select('*').order('created_at', {
        ascending: false
      });
      if (propertyType !== 'all') {
        query = query.eq('property_type', propertyType);
      }
      const {
        data,
        error
      } = await query;
      if (error) {
        console.error('Error fetching properties:', error);
        throw error;
      }

      // Process properties to ensure price_per_sqm is calculated if missing
      const processedData = (data || []).map(property => {
        let updatedProperty = {
          ...property
        };

        // Calculate price_per_sqm if missing but we have price and area
        if (!updatedProperty.price_per_sqm && updatedProperty.price && updatedProperty.area && updatedProperty.area > 0) {
          updatedProperty.price_per_sqm = updatedProperty.price / updatedProperty.area;

          // Update the database with the calculated value (don't wait for it)
          supabase.from('properties').update({
            price_per_sqm: updatedProperty.price_per_sqm
          }).eq('id', updatedProperty.id).then(({
            error
          }) => {
            if (error) console.error('Error updating price_per_sqm:', error);
          });
        }
        return updatedProperty;
      });
      console.log('Processed properties:', processedData);
      return processedData as Tables<'properties'>[];
    }
  });
  const toggleFeatured = useMutation({
    mutationFn: async ({
      propertyId,
      isFeatured
    }: {
      propertyId: string;
      isFeatured: boolean;
    }) => {
      // First, remove featured status from all properties
      if (isFeatured) {
        await supabase.from('properties').update({
          is_featured: false
        }).eq('is_featured', true);
      }

      // Then update the selected property
      const {
        error
      } = await supabase.from('properties').update({
        is_featured: isFeatured
      }).eq('id', propertyId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['properties']
      });
      queryClient.invalidateQueries({
        queryKey: ['featured-property']
      });
      toast({
        title: "Success",
        description: "Featured property updated successfully"
      });
    },
    onError: error => {
      console.error('Error updating featured property:', error);
      toast({
        title: "Error",
        description: "Failed to update featured property",
        variant: "destructive"
      });
    }
  });
  if (isLoading) {
    return <LoadingAnimation />;
  }
  return <div className="flex flex-col min-h-screen">
      <TopNavigation session={session} />
      <main className="flex-1">
        <div className="relative space-y-8 mx-px my-[19px]">
          <div className="flex justify-between items-center px-4">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold text-white">{t('properties')}</h1>
              <PropertyTypeSelect value={propertyType} onValueChange={setPropertyType} />
            </div>
            {isAdmin && <Button asChild>
                <Link to="/properties/add" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {t('addProperty')}
                </Link>
              </Button>}
          </div>

          <div className="bg-[#1A1F2C] w-full">
            <PropertiesMap properties={properties} />
          </div>

          <div className="flex gap-6 flex-wrap justify-center px-4">
            {properties?.map(property => <div key={property.id} className="relative">
                <PropertyCard property={property} />
                {isAdmin && <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-black/50 hover:bg-black/70" onClick={() => toggleFeatured.mutate({
              propertyId: property.id,
              isFeatured: !property.is_featured
            })}>
                    <Star className={`h-4 w-4 ${property.is_featured ? 'fill-yellow-500 text-yellow-500' : 'text-white'}`} />
                  </Button>}
              </div>)}
          </div>
        </div>
      </main>
      {/* Removed Footer component from here */}
    </div>;
};
export default Properties;