import { UseFormReturn } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface AdditionalDetailsFieldsProps {
  form: UseFormReturn<any>
}

export const AdditionalDetailsFields = ({ form }: AdditionalDetailsFieldsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="area"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total Area (sq ft)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormDescription>Total area of the property</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="heated_area"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Heated Area (sq ft)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormDescription>Heated/cooled living area</FormDescription>
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
              <Input {...field} />
            </FormControl>
            <FormDescription>Unique reference number for the property</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}