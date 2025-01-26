import { UseFormReturn } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface DetailsFieldsProps {
  form: UseFormReturn<any>
}

export const DetailsFields = ({ form }: DetailsFieldsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
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

      <FormField
        control={form.control}
        name="build_year"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Build Year</FormLabel>
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
        name="latitude"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Latitude</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="any"
                placeholder="e.g. 40.7128"
                {...field}
                onChange={(e) => {
                  const value = e.target.value ? Number(e.target.value) : null;
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="longitude"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Longitude</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="any"
                placeholder="e.g. -74.0060"
                {...field}
                onChange={(e) => {
                  const value = e.target.value ? Number(e.target.value) : null;
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}