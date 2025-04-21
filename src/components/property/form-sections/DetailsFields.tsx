
import { UseFormReturn } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/LanguageContext"
import { PropertyFeaturesList } from "@/components/home/featured-property/PropertyFeaturesList"
import { useEffect } from "react"

interface DetailsFieldsProps {
  form: UseFormReturn<any>
}

export const DetailsFields = ({ form }: DetailsFieldsProps) => {
  const propertyType = form.watch('property_type')
  const isVacantLand = propertyType === 'vacantLand'
  const { t } = useLanguage()
  const features = form.watch('features')

  // Handle features string conversion
  useEffect(() => {
    if (features && typeof features === 'string') {
      const featuresArray = features.split(',').map(f => f.trim()).filter(f => f.length > 0)
      form.setValue('features', featuresArray)
    }
  }, [features, form])

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value) {
      const featuresArray = value.split(',').map(f => f.trim()).filter(f => f.length > 0)
      form.setValue('features', featuresArray)
    } else {
      form.setValue('features', [])
    }
  }

  // Convert features array to comma-separated string for display in input
  const getFeaturesInputValue = () => {
    if (!features) return ''
    if (Array.isArray(features)) {
      return features.join(', ')
    }
    return features
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {!isVacantLand && (
        <>
          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-orange-500">{t('property.bedrooms')}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
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
                <FormLabel className="text-orange-500">{t('property.bathrooms')}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
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
                <FormLabel className="text-orange-500">{t('property.yearBuilt')}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}

      <div className="grid grid-cols-2 gap-2">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="text-orange-500">{t('property.price')}</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="text-orange-500">{t('currency')}</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="MXN">MXN</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="price_per_sqm"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-orange-500">{t('property.pricePerSqm')}</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field}
                onChange={(e) => {
                  const value = e.target.value ? Number(e.target.value) : null;
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormDescription>Price per square meter</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="arv"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-orange-500">{t('property.arvLabel')}</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field}
                onChange={(e) => {
                  const value = e.target.value ? Number(e.target.value) : null;
                  field.onChange(value);
                }}
              />
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
            <FormLabel className="text-orange-500">{t('property.features')}</FormLabel>
            <FormControl>
              <Input 
                placeholder="Garage, Pool, etc. (comma-separated)" 
                value={getFeaturesInputValue()}
                onChange={handleFeaturesChange}
              />
            </FormControl>
            <FormDescription>Enter features separated by commas</FormDescription>
            {Array.isArray(features) && features.length > 0 && (
              <div className="mt-2">
                <PropertyFeaturesList features={features} />
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="google_maps_url"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel className="text-orange-500">{t('googleMapsUrl')}</FormLabel>
            <FormControl>
              <Input 
                type="url"
                placeholder="Paste Google Maps URL (e.g., https://maps.app.goo.gl/...)"
                {...field}
              />
            </FormControl>
            <FormDescription>Paste a Google Maps URL to set the property location</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
