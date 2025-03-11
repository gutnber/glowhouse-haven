
import { UseFormReturn } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { useLocation } from "react-router-dom"
import { BasicInfoFields } from "./form-sections/BasicInfoFields"
import { DetailsFields } from "./form-sections/DetailsFields"
import { AdditionalDetailsFields } from "./form-sections/AdditionalDetailsFields"
import { DescriptionField } from "./form-sections/DescriptionField"
import { ImagesField } from "./form-sections/ImagesField"
import { YouTubeFields } from "./form-sections/YouTubeFields"
import { PropertyFormValues } from "@/schemas/propertyFormSchema"

interface PropertyFormProps {
  form: UseFormReturn<PropertyFormValues>
  onSubmit: (values: PropertyFormValues) => void
  isSubmitting: boolean
}

export const PropertyForm = ({ form, onSubmit, isSubmitting }: PropertyFormProps) => {
  const location = useLocation()
  const isAddProperty = location.pathname === "/properties/add"
  
  // Calculate price per square meter when price or area changes
  const price = form.watch('price')
  const area = form.watch('area')
  
  // Auto-calculate price per sqm if there's both price and area, but only if price_per_sqm hasn't been set manually
  if (price > 0 && area > 0 && !form.getValues('price_per_sqm')) {
    const calculatedPricePerSqm = Math.round(price / area)
    form.setValue('price_per_sqm', calculatedPricePerSqm)
  }

  console.log('Form values:', form.getValues())

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInfoFields form={form} />
        <DetailsFields form={form} />
        <AdditionalDetailsFields form={form} />
        <DescriptionField form={form} />
        <ImagesField form={form} />
        <YouTubeFields form={form} />

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="bg-orange-600 hover:bg-orange-700 text-white border border-orange-500/30"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isAddProperty ? "Add Property" : "Update Property"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
