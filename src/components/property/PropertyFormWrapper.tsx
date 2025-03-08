
import { UseFormReturn } from "react-hook-form"
import { PropertyFormValues } from "@/schemas/propertyFormSchema"
import { PropertyForm } from "./PropertyForm"

interface PropertyFormWrapperProps {
  form: UseFormReturn<PropertyFormValues>
  onSubmit: (values: PropertyFormValues) => void
  isSubmitting: boolean
}

export const PropertyFormWrapper = ({ form, onSubmit, isSubmitting }: PropertyFormWrapperProps) => {
  return (
    <PropertyForm
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    />
  )
}
