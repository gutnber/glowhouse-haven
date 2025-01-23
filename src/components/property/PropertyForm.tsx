import { UseFormReturn } from "react-hook-form"
import { Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PropertyImageUpload } from "./PropertyImageUpload"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { useLocation } from "react-router-dom"

interface PropertyFormProps {
  form: UseFormReturn<any>
  onSubmit: (values: any) => void
  isSubmitting: boolean
}

export const PropertyForm = ({ form, onSubmit, isSubmitting }: PropertyFormProps) => {
  const location = useLocation()
  const isAddProperty = location.pathname === "/properties/add"

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter property name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter property address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bedrooms</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bathrooms</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="build_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Build Year</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="arv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ARV (Optional)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>After Repair Value</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Features</FormLabel>
                <FormControl>
                  <Input placeholder="Garage, Pool, etc. (comma-separated)" {...field} />
                </FormControl>
                <FormDescription>Enter features separated by commas</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter property description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  
                  {/* Display uploaded images */}
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

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isAddProperty ? "Add Property" : "Update Property"}
        </Button>
      </form>
    </Form>
  )
}