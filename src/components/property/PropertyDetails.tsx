
import { Bed, Bath, CalendarClock, DollarSign, Ruler } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { PropertyMap } from "./PropertyMap"
import { PropertyYouTubePlayer } from "./PropertyYouTubePlayer"
import { BorderBeam } from "@/components/ui/border-beam"
import { PropertyContactForm } from "./PropertyContactForm"

interface PropertyDetailsProps {
  bedrooms: number
  bathrooms: number
  buildYear: number
  price: number
  arv?: number | null
  area?: number | null
  heatedArea?: number | null
  referenceNumber?: string | null
  description?: string | null
  features?: string[] | null
  googleMapsUrl?: string | null
  latitude?: number | null
  longitude?: number | null
  youtubeUrl?: string | null
  youtubeAutoplay?: boolean | null
  youtubeMuted?: boolean | null
  youtubeControls?: boolean | null
  enableBorderBeam?: boolean | null
  propertyType?: string | null
  propertyId: string
  propertyName: string
}

export const PropertyDetails = ({
  bedrooms,
  bathrooms,
  buildYear,
  price,
  arv,
  area,
  heatedArea,
  referenceNumber,
  description,
  features,
  googleMapsUrl,
  latitude,
  longitude,
  youtubeUrl,
  youtubeAutoplay = false,
  youtubeMuted = true,
  youtubeControls = true,
  enableBorderBeam = true,
  propertyType = 'singleFamily',
  propertyId,
  propertyName
}: PropertyDetailsProps) => {
  console.log('Property type:', propertyType)
  const showLivingSpaceDetails = propertyType !== 'vacantLand'

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <Card className="p-6 relative">
          {enableBorderBeam && <BorderBeam />}
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {showLivingSpaceDetails && (
              <>
                <div className="space-y-2">
                  <div className="text-muted-foreground">Bedrooms</div>
                  <div className="flex items-center gap-2 text-lg">
                    <Bed className="h-5 w-5" />
                    {bedrooms}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-muted-foreground">Bathrooms</div>
                  <div className="flex items-center gap-2 text-lg">
                    <Bath className="h-5 w-5" />
                    {bathrooms}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-muted-foreground">Year Built</div>
                  <div className="flex items-center gap-2 text-lg">
                    <CalendarClock className="h-5 w-5" />
                    {buildYear}
                  </div>
                </div>
              </>
            )}
            <div className="space-y-2">
              <div className="text-muted-foreground">Price</div>
              <div className="flex items-center gap-2 text-lg font-semibold">
                <DollarSign className="h-5 w-5" />
                {price.toLocaleString()}
              </div>
            </div>
            {area && (
              <div className="space-y-2">
                <div className="text-muted-foreground">Total Area</div>
                <div className="flex items-center gap-2 text-lg">
                  <Ruler className="h-5 w-5" />
                  {area} m²
                </div>
              </div>
            )}
            {heatedArea && showLivingSpaceDetails && (
              <div className="space-y-2">
                <div className="text-muted-foreground">Heated Area</div>
                <div className="flex items-center gap-2 text-lg">
                  <Ruler className="h-5 w-5" />
                  {heatedArea} m²
                </div>
              </div>
            )}
            {referenceNumber && (
              <div className="space-y-2">
                <div className="text-muted-foreground">Reference #</div>
                <div className="flex items-center gap-2 text-lg">
                  {referenceNumber}
                </div>
              </div>
            )}
          </div>
        </Card>

        {description && (
          <Card className="p-6 relative">
            {enableBorderBeam && <BorderBeam delay={2} />}
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{description}</p>
          </Card>
        )}

        {youtubeUrl && (
          <Card className="p-6 relative">
            {enableBorderBeam && <BorderBeam delay={4} />}
            <h2 className="text-2xl font-semibold mb-4">Property Video</h2>
            <div className="rounded-lg border overflow-hidden">
              <PropertyYouTubePlayer
                youtubeUrl={youtubeUrl}
                autoplay={youtubeAutoplay}
                muted={youtubeMuted}
                controls={youtubeControls}
              />
            </div>
          </Card>
        )}
      </div>

      <div className="md:col-span-1 space-y-6">
        {arv && (
          <Card className="p-6 relative">
            {enableBorderBeam && <BorderBeam delay={6} />}
            <h2 className="text-2xl font-semibold mb-4">Investment Details</h2>
            <div className="space-y-2">
              <div className="text-muted-foreground">After Repair Value (ARV)</div>
              <div className="flex items-center gap-2 text-lg font-semibold">
                <DollarSign className="h-5 w-5" />
                {arv.toLocaleString()}
              </div>
            </div>
          </Card>
        )}

        {features && features.length > 0 && (
          <Card className="p-6 relative">
            {enableBorderBeam && <BorderBeam delay={8} />}
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <div className="flex flex-wrap gap-2">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm",
                    "bg-primary/10 text-primary"
                  )}
                >
                  {feature}
                </div>
              ))}
            </div>
          </Card>
        )}

        <PropertyMap 
          googleMapsUrl={googleMapsUrl} 
          latitude={latitude} 
          longitude={longitude} 
        />

        <Card className="p-6 relative">
          {enableBorderBeam && <BorderBeam delay={10} />}
          <PropertyContactForm 
            propertyId={propertyId} 
            propertyName={propertyName}
          />
        </Card>
      </div>
    </div>
  )
}
