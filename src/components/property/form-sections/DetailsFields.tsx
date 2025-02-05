import { UseFormReturn } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface DetailsFieldsProps {
  form: UseFormReturn<any>
}

export const DetailsFields = ({ form }: DetailsFieldsProps) => {
  const propertyType = form.watch('property_type')
  const isVacantLand = propertyType === 'vacantLand'

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {!isVacantLand && (
        <>
          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bedrooms</FormLabel>
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
                <FormLabel>Bathrooms</FormLabel>
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

      <FormField
        control={form.control}
        name="build_year"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isVacantLand && "text-muted-foreground")}>
              Build Year
            </FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                className={cn(isVacantLand && "bg-muted cursor-not-allowed")}
                disabled={isVacantLand}
              />
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
        name="arv"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ARV (Optional)</FormLabel>
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
            <FormLabel>Features</FormLabel>
            <FormControl>
              <Input placeholder="Garage, Pool, etc. (comma-separated)" {...field} />
            </FormControl>
            <FormDescription>Enter features separated by commas</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="google_maps_url"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Google Maps URL</FormLabel>
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