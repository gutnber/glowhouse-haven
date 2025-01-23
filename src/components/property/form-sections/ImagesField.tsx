import { UseFormReturn } from "react-hook-form"
import { X } from "lucide-react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { PropertyImageUpload } from "../PropertyImageUpload"

interface ImagesFieldProps {
  form: UseFormReturn<any>
}

export const ImagesField = ({ form }: ImagesFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="images"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Property Images</FormLabel>
          <FormControl>
            <div className="space-y-4">
              <PropertyImageUpload
                onImageUploaded={(url) => {
                  console.log('Image uploaded, current images:', field.value)
                  const currentImages = field.value || []
                  field.onChange([...currentImages, url])
                }}
              />
              
              {field.value && field.value.length > 0 && (
                <div className="grid gap-4 md:grid-cols-3">
                  {field.value.map((imageUrl: string, index: number) => (
                    <div key={imageUrl} className="relative group">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src={imageUrl}
                          alt={`Property image ${index + 1}`}
                          className="object-cover w-full h-full rounded-lg"
                        />
                      </AspectRatio>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          const newImages = field.value.filter((url: string) => url !== imageUrl)
                          field.onChange(newImages)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
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