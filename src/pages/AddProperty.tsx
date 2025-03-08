
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { Building2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { PropertyForm } from "@/components/property/PropertyForm"
import { propertyFormSchema, PropertyFormValues } from "@/schemas/propertyFormSchema"

const AddProperty = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: "",
      address: "",
      bedrooms: 0,
      bathrooms: 0,
      build_year: new Date().getFullYear(),
      description: "",
      price: 0,
      price_per_sqm: null,
      currency: "USD",
      arv: undefined,
      area: undefined,
      width: undefined,
      height: undefined,
      heated_area: undefined,
      reference_number: "",
      features: [],
      images: [],
      property_type: "singleFamily",
      mode: "sale",
      status: "available"
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: PropertyFormValues) => {
      console.log('Submitting property:', values)
      const { data, error } = await supabase
        .from('properties')
        .insert({
          name: values.name,
          address: values.address,
          bedrooms: values.bedrooms,
          bathrooms: values.bathrooms,
          build_year: values.build_year,
          description: values.description,
          price: values.price,
          price_per_sqm: values.price_per_sqm,
          currency: values.currency,
          arv: values.arv,
          area: values.area,
          width: values.width,
          height: values.height,
          heated_area: values.heated_area,
          reference_number: values.reference_number,
          features: values.features,
          images: values.images,
          property_type: values.property_type,
          mode: values.mode,
          status: values.status
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Property has been added successfully",
      })
      navigate('/properties')
    },
    onError: (error) => {
      console.error('Error adding property:', error)
      toast({
        title: "Error",
        description: "Failed to add property. Please try again.",
        variant: "destructive",
      })
    },
  })

  const onSubmit = (values: PropertyFormValues) => {
    mutation.mutate(values)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Building2 className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Add New Property</h1>
      </div>
      <PropertyForm 
        form={form} 
        onSubmit={onSubmit} 
        isSubmitting={mutation.isPending} 
      />
    </div>
  )
}

export default AddProperty
