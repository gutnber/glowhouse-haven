import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { ProfileFormValues } from "../ProfileForm"

interface CompanyFieldProps {
  form: UseFormReturn<ProfileFormValues>
}

export function CompanyField({ form }: CompanyFieldProps) {
  return (
    <FormField
      control={form.control}
      name="company"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Company (Optional)</FormLabel>
          <FormControl>
            <Input placeholder="Enter your company name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}