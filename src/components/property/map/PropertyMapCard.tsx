
import { Card } from "@/components/ui/card"
import { Loader as UILoader } from "@/components/ui/loader"

interface PropertyMapCardProps {
  isLoading: boolean
  error: string | null
  mapRef: React.RefObject<HTMLDivElement>
}

export const PropertyMapCard = ({ isLoading, error, mapRef }: PropertyMapCardProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Location</h2>
      <div className="relative w-full h-[250px] rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <UILoader />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <p className="text-destructive">{error}</p>
          </div>
        )}
        <div 
          ref={mapRef} 
          className="w-full h-full"
        />
      </div>
    </Card>
  )
}
