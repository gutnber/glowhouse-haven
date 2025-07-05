import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PropertyCard } from "@/components/home/PropertyCard";
import { Tables } from "@/integrations/supabase/types";
import { useAuthSession } from "@/hooks/useAuthSession";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { LoadingAnimation } from "@/components/ui/loading-animation";

const FrasaDevelopment = () => {
  const session = useAuthSession();

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['frasa-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_desarrollo', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching Frasa properties:', error);
        throw error;
      }

      return data as Tables<'properties'>[];
    }
  });

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopNavigation session={session} />
      <main className="flex-1">
        <div className="relative space-y-8 mx-px my-[19px]">
          {/* Hero Section for Frasa Development */}
          <div className="relative bg-gradient-to-r from-[hsl(84,80%,30%)]/20 to-[hsl(84,60%,40%)]/20 rounded-3xl p-8 mx-4">
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(84,80%,30%)]/10 to-[hsl(84,60%,40%)]/10 rounded-3xl backdrop-blur-xl border border-[hsl(84,80%,30%)]/20" />
            <div className="relative text-center">
              <h1 className="text-5xl font-bold text-white mb-4">Desarrollo Frasa</h1>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Descubre nuestras propiedades exclusivas del desarrollo Frasa, 
                diseñadas con los más altos estándares de calidad y ubicadas en las mejores zonas.
              </p>
            </div>
          </div>

          <div className="px-4">
            {properties.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Próximamente
                </h2>
                <p className="text-white/60">
                  Las propiedades del desarrollo Frasa estarán disponibles pronto.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-white mb-6 text-center">
                  Propiedades Disponibles ({properties.length})
                </h2>
                <div className="flex gap-6 flex-wrap justify-center">
                  {properties.map(property => (
                    <div key={property.id} className="relative">
                      <div className="relative">
                        <PropertyCard property={property} />
                        {/* Frasa Development Badge */}
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-[hsl(84,80%,30%)] to-[hsl(84,60%,40%)] text-white px-3 py-1 rounded-full text-xs font-semibold">
                          FRASA
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FrasaDevelopment;