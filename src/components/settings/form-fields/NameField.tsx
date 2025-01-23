import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { ProfileFormValues } from "../ProfileForm"

interface NameFieldProps {
  form: UseFormReturn<ProfileFormValues>
}

export function NameField({ form }: NameFieldProps) {
  return (
    <FormField
      control={form.control}
      name="full_name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input placeholder="Enter your full name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}