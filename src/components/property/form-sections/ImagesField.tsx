import { UseFormReturn } from "react-hook-form"
import { X, Upload, RefreshCw } from "lucide-react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { PropertyImageUpload } from "../PropertyImageUpload"
import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"

interface ImagesFieldProps {
  form: UseFormReturn<any>
}

export const ImagesField = ({ form }: ImagesFieldProps) => {
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null)
  const { t } = useLanguage()
  return (
    <FormField
      control={form.control}
      name="images"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-orange-500">{t('property.images', 'Property Images')}</FormLabel>
          <FormControl>
            <div className="space-y-4">
              {replacingIndex !== null ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{t('replaceImage', 'Replace Image')} #{replacingIndex + 1}</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setReplacingIndex(null)}
                    >
                      {t('cancel', 'Cancel')}
                    </Button>
                  </div>
                  <PropertyImageUpload
                    onImageUploaded={(urls) => {
                      console.log('Replacing image at index:', replacingIndex)
                      const currentImages = [...(field.value || [])]
                      // Get the first URL if multiple were uploaded
                      const newUrl = Array.isArray(urls) ? urls[0] : urls
                      
                      // Replace the image at the specified index
                      currentImages[replacingIndex] = newUrl
                      field.onChange(currentImages)
                      setReplacingIndex(null)
                    }}
                  />
                </div>
              ) : (
                <PropertyImageUpload
                  onImageUploaded={(urls) => {
                    console.log('Images uploaded, current images:', field.value)
                    const currentImages = field.value || []
                    // Handle both single URL and array of URLs
                    const newUrls = Array.isArray(urls) ? urls : [urls]
                    field.onChange([...currentImages, ...newUrls])
                  }}
                />
              )}
              
              {field.value && field.value.length > 0 && (
                <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {field.value.map((imageUrl: string, index: number) => (
                    <div key={imageUrl} className="relative group">
                      <AspectRatio ratio={4/3}>
                        <img
                          src={imageUrl}
                          alt={`Property image ${index + 1}`}
                          className="object-cover w-full h-full rounded-lg"
                        />
                      </AspectRatio>
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          className="bg-black/50 hover:bg-black/70"
                          onClick={() => setReplacingIndex(index)}
                          title="Replace this image"
                        >
                          <RefreshCw className="h-4 w-4 text-white" />
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            const newImages = field.value.filter((url: string) => url !== imageUrl)
                            field.onChange(newImages)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}