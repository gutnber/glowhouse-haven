
import { UseFormReturn } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface AdditionalDetailsFieldsProps {
  form: UseFormReturn<any>
}

export const AdditionalDetailsFields = ({ form }: AdditionalDetailsFieldsProps) => {
  const propertyType = form.watch('property_type')
  const showHeatedArea = propertyType !== 'vacantLand'

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="area"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total Area (m²)</FormLabel>
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
              <FormLabel>Heated Area (m²)</FormLabel>
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
            <FormLabel>Width (m)</FormLabel>
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
            <FormLabel>Height/Depth (m)</FormLabel>
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
        name="reference_number"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Reference Number</FormLabel>
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
