
import { UseFormReturn } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/LanguageContext"

interface AdditionalDetailsFieldsProps {
  form: UseFormReturn<any>
}

export const AdditionalDetailsFields = ({ form }: AdditionalDetailsFieldsProps) => {
  const propertyType = form.watch('property_type')
  const showHeatedArea = propertyType !== 'vacantLand'
  const { t } = useLanguage()

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="area"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-orange-500">{t('property.area')} (m²)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                value={field.value ?? ''}
              />
            </FormControl>
            <FormDescription>Total area in square meters</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {showHeatedArea && (
        <FormField
          control={form.control}
          name="heated_area"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-orange-500">{t('property.heatedArea')} (m²)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription>Heated/cooled living area in square meters</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="width"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-orange-500">{t('property.dimensions', 'Width')} (m)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                value={field.value ?? ''}
              />
            </FormControl>
            <FormDescription>Width of the property in meters</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="height"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-orange-500">{t('property.dimensions', 'Height/Depth')} (m)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                value={field.value ?? ''}
              />
            </FormControl>
            <FormDescription>Height/depth of the property in meters</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

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
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                value={field.value ?? ''}
              />
            </FormControl>
            <FormDescription>Price per square meter</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="reference_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-orange-500">{t('property.referenceNumber')}</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ''} />
            </FormControl>
            <FormDescription>Unique reference number for the property</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
