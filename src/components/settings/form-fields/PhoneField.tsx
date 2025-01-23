import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { ProfileFormValues } from "../ProfileForm"

interface PhoneFieldProps {
  form: UseFormReturn<ProfileFormValues>
}

export function PhoneField({ form }: PhoneFieldProps) {
  return (
    <FormField
      control={form.control}
      name="phone"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Phone</FormLabel>
          <FormControl>
            <Input type="tel" placeholder="Enter your phone number" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}